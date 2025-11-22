# Database Schema Documentation

## Entity Relationship Diagram

```
┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ id (PK)            │
│ username (UNIQUE)  │
│ email (UNIQUE)     │
│ password_hash      │
│ created_at         │
└─────────────────────┘
         │
         │ 1
         │
         ├──────────────┐
         │              │
         │ *            │ *
         ▼              ▼
┌─────────────────────┐    ┌─────────────────────┐
│       VOTES         │    │     BOOKMARKS       │
├─────────────────────┤    ├─────────────────────┤
│ id (PK)            │    │ id (PK)            │
│ user_id (FK)       │    │ user_id (FK)       │
│ article_id (FK)    │    │ article_id (FK)    │
│ is_biased          │    │ created_at         │
│ created_at         │    └─────────────────────┘
└─────────────────────┘              │
         │                            │
         │ *                          │ *
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────┐
│               ARTICLES                      │
├─────────────────────────────────────────────┤
│ id (PK)                                    │
│ headline                                   │
│ author                                     │
│ article_link                               │
│ featured_image                             │
│ source_logo                                │
│ source_name                                │
│ publish_date                               │
│ category                                   │
│ created_at                                 │
└─────────────────────────────────────────────┘
         │
         │ 1
         │
         │ *
         ▼
┌─────────────────────────────────────────────┐
│          RELATED_ARTICLES                   │
├─────────────────────────────────────────────┤
│ id (PK)                                    │
│ primary_article_id (FK)                    │
│ headline                                   │
│ author                                     │
│ article_link                               │
│ source_logo                                │
│ source_name                                │
│ publish_date                               │
└─────────────────────────────────────────────┘
```

## Table Descriptions

### USERS Table
Stores user account information.

**Columns:**
- `id` (INTEGER, PRIMARY KEY): Auto-incrementing user ID
- `username` (VARCHAR(80), UNIQUE, NOT NULL): Unique username
- `email` (VARCHAR(120), UNIQUE, NOT NULL): Unique email address
- `password_hash` (VARCHAR(255), NOT NULL): Bcrypt hashed password
- `created_at` (DATETIME): Account creation timestamp

**Relationships:**
- One user can have many votes (1:*)
- One user can have many bookmarks (1:*)

---

### ARTICLES Table
Stores primary news articles.

**Columns:**
- `id` (INTEGER, PRIMARY KEY): Auto-incrementing article ID
- `headline` (TEXT, NOT NULL): Article headline/title
- `author` (VARCHAR(255)): Article author name
- `article_link` (TEXT, NOT NULL): URL to original article
- `featured_image` (TEXT): URL or path to featured image
- `source_logo` (TEXT): URL to news source logo
- `source_name` (VARCHAR(255)): Name of news source
- `publish_date` (VARCHAR(50)): Publication date (format: DD-MM-YYYY)
- `category` (VARCHAR(50), NOT NULL): Article category (india, world, sports, etc.)
- `created_at` (DATETIME): Database insertion timestamp

**Relationships:**
- One article can have many votes (1:*)
- One article can have many bookmarks (1:*)
- One article can have many related articles (1:*)

**Categories:** india, world, local, sports, business, science, technology, entertainment, health

---

### RELATED_ARTICLES Table
Stores articles related to a primary article (similar coverage from different sources).

**Columns:**
- `id` (INTEGER, PRIMARY KEY): Auto-incrementing ID
- `primary_article_id` (INTEGER, FOREIGN KEY, NOT NULL): References articles(id)
- `headline` (TEXT): Related article headline
- `author` (VARCHAR(255)): Related article author
- `article_link` (TEXT): URL to related article
- `source_logo` (TEXT): URL to source logo
- `source_name` (VARCHAR(255)): Name of news source
- `publish_date` (VARCHAR(50)): Publication date

**Relationships:**
- Many related articles belong to one primary article (*:1)

**Foreign Keys:**
- `primary_article_id` → `articles.id` (CASCADE DELETE)

---

### VOTES Table
Stores user votes on article bias.

**Columns:**
- `id` (INTEGER, PRIMARY KEY): Auto-incrementing vote ID
- `user_id` (INTEGER, FOREIGN KEY, NOT NULL): References users(id)
- `article_id` (INTEGER, FOREIGN KEY, NOT NULL): References articles(id)
- `is_biased` (BOOLEAN, NOT NULL): True = article is biased, False = not biased
- `created_at` (DATETIME): Vote timestamp

**Relationships:**
- Many votes belong to one user (*:1)
- Many votes belong to one article (*:1)

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE DELETE)
- `article_id` → `articles.id` (CASCADE DELETE)

**Constraints:**
- UNIQUE(user_id, article_id): Each user can only vote once per article

---

### BOOKMARKS Table
Stores user bookmarks for saving articles.

**Columns:**
- `id` (INTEGER, PRIMARY KEY): Auto-incrementing bookmark ID
- `user_id` (INTEGER, FOREIGN KEY, NOT NULL): References users(id)
- `article_id` (INTEGER, FOREIGN KEY, NOT NULL): References articles(id)
- `created_at` (DATETIME): Bookmark timestamp

**Relationships:**
- Many bookmarks belong to one user (*:1)
- Many bookmarks belong to one article (*:1)

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE DELETE)
- `article_id` → `articles.id` (CASCADE DELETE)

**Constraints:**
- UNIQUE(user_id, article_id): Each user can only bookmark an article once

---

## Data Flow Examples

### User Registration Flow
1. User submits registration form
2. Backend validates unique username/email
3. Password is hashed using bcrypt
4. New record created in USERS table
5. JWT token generated and returned

### Article Voting Flow
1. Authenticated user clicks vote button
2. Backend checks for existing vote in VOTES table
3. If exists: Update vote, else: Create new vote
4. Vote statistics recalculated from VOTES table
5. Updated stats returned to frontend

### Article Retrieval with Stats
1. Request for article list/details
2. Backend queries ARTICLES table
3. Joins with VOTES to calculate statistics:
   - Total votes = COUNT(votes)
   - Biased votes = COUNT(votes WHERE is_biased=true)
   - Percentages calculated from counts
4. If user authenticated, joins to get user's vote and bookmark status
5. Article data with stats returned

### Bookmark Flow
1. User clicks bookmark button
2. Backend checks BOOKMARKS table for existing bookmark
3. If exists: Delete bookmark, else: Create new bookmark
4. Updated bookmark status returned

---

## Indexes (Recommended for Production)

```sql
-- Improve article listing queries
CREATE INDEX idx_article_category ON articles(category);
CREATE INDEX idx_article_created ON articles(created_at DESC);

-- Improve vote lookups
CREATE INDEX idx_vote_article ON votes(article_id);
CREATE INDEX idx_vote_user ON votes(user_id);
CREATE INDEX idx_vote_user_article ON votes(user_id, article_id);

-- Improve bookmark lookups
CREATE INDEX idx_bookmark_article ON bookmarks(article_id);
CREATE INDEX idx_bookmark_user ON bookmarks(user_id);
CREATE INDEX idx_bookmark_user_article ON bookmarks(user_id, article_id);

-- Improve related article lookups
CREATE INDEX idx_related_primary ON related_articles(primary_article_id);
```

---

## Sample Queries

### Get article with vote statistics
```sql
SELECT 
    a.*,
    COUNT(v.id) as total_votes,
    SUM(CASE WHEN v.is_biased = true THEN 1 ELSE 0 END) as biased_votes,
    SUM(CASE WHEN v.is_biased = false THEN 1 ELSE 0 END) as not_biased_votes
FROM articles a
LEFT JOIN votes v ON a.id = v.article_id
WHERE a.id = 1
GROUP BY a.id;
```

### Get user's voting activity
```sql
SELECT 
    a.id, a.headline, a.category, v.is_biased, v.created_at
FROM votes v
JOIN articles a ON v.article_id = a.id
WHERE v.user_id = 1
ORDER BY v.created_at DESC;
```

### Get most voted articles
```sql
SELECT 
    a.*, COUNT(v.id) as vote_count
FROM articles a
LEFT JOIN votes v ON a.id = v.article_id
GROUP BY a.id
ORDER BY vote_count DESC
LIMIT 10;
```

### Get articles by category with vote stats
```sql
SELECT 
    a.*,
    COUNT(v.id) as total_votes,
    ROUND(AVG(CASE WHEN v.is_biased THEN 1.0 ELSE 0.0 END) * 100, 1) as biased_percentage
FROM articles a
LEFT JOIN votes v ON a.id = v.article_id
WHERE a.category = 'india'
GROUP BY a.id
ORDER BY a.created_at DESC;
```

---

## Data Integrity Rules

1. **Cascade Deletes**: When a user or article is deleted, all associated votes and bookmarks are automatically deleted
2. **Unique Constraints**: Prevent duplicate votes and bookmarks per user per article
3. **NOT NULL Constraints**: Ensure critical fields always have values
4. **Foreign Key Constraints**: Maintain referential integrity between tables

---

## Storage Estimates

Based on 1000 articles with average engagement:

- **ARTICLES**: ~1000 rows × 2KB = 2MB
- **RELATED_ARTICLES**: ~3000 rows × 1KB = 3MB
- **USERS**: ~500 rows × 500 bytes = 250KB
- **VOTES**: ~5000 rows × 100 bytes = 500KB
- **BOOKMARKS**: ~2000 rows × 100 bytes = 200KB

**Total estimated**: ~6MB for core data

With indexes: ~10-15MB total database size
