# NETRA News Platform - Backend Setup Guide

## 🎯 Project Overview

NETRA is a news aggregation platform that allows users to vote on whether news articles are biased or not. The backend is built with Flask and PostgreSQL, featuring JWT authentication, voting system, bookmarks, and comprehensive article management.

## 📋 Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## 🚀 Quick Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from: https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE netra_news;
CREATE USER netra_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE netra_news TO netra_user;
\q
```

### 3. Clone and Setup Project

```bash
# Navigate to your project directory
cd /path/to/your/project

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

Update the following in `.env`:
```
DATABASE_URL=postgresql://netra_user:your_password@localhost:5432/netra_news
JWT_SECRET_KEY=generate-a-strong-random-key-here
```

### 5. Initialize Database and Load Data

```bash
# Run the data loading script
python load_data.py
```

This will:
- Create all database tables
- Load articles from JSON files
- Display import statistics

### 6. Run the Application

```bash
# Development mode
python app.py

# Production mode (use gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

The API will be available at: `http://localhost:5000`

## 📊 Database Schema

### Tables Overview

1. **users**
   - id (Primary Key)
   - username (Unique)
   - email (Unique)
   - password_hash
   - created_at

2. **articles**
   - id (Primary Key)
   - headline
   - author
   - article_link
   - featured_image
   - source_logo
   - source_name
   - publish_date
   - category
   - created_at

3. **related_articles**
   - id (Primary Key)
   - primary_article_id (Foreign Key → articles)
   - headline
   - author
   - article_link
   - source_logo
   - source_name
   - publish_date

4. **votes**
   - id (Primary Key)
   - user_id (Foreign Key → users)
   - article_id (Foreign Key → articles)
   - is_biased (Boolean)
   - created_at
   - **Constraint**: Unique (user_id, article_id)

5. **bookmarks**
   - id (Primary Key)
   - user_id (Foreign Key → users)
   - article_id (Foreign Key → articles)
   - created_at
   - **Constraint**: Unique (user_id, article_id)

### Relationships

```
users ──┬─< votes >── articles
        └─< bookmarks >── articles
        
articles ──< related_articles
```

## 🔌 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}

Response: {
  "message": "User registered successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response: {
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access_token>

Response: {
  "user": {...}
}
```

### Articles

#### Get Articles (with filtering and pagination)
```
GET /api/articles?category=india&sort_by=recent&page=1&per_page=20&search=keyword
Authorization: Bearer <access_token> (Optional)

Query Parameters:
- category: all, india, world, local, sports, business, science, technology, entertainment, health
- sort_by: recent, popular, controversial
- page: page number (default: 1)
- per_page: items per page (default: 20)
- search: search keyword

Response: {
  "articles": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_items": 100,
    "has_next": true,
    "has_prev": false
  }
}
```

#### Get Single Article
```
GET /api/articles/<article_id>
Authorization: Bearer <access_token> (Optional)

Response: {
  "article": {
    "id": 1,
    "headline": "...",
    "author": "...",
    "article_link": "...",
    "vote_stats": {
      "biased": 765,
      "not_biased": 480,
      "biased_percentage": 61.4,
      "not_biased_percentage": 38.6
    },
    "user_vote": true,  // if authenticated
    "is_bookmarked": false,  // if authenticated
    "related_articles": [...],
    "total_related_articles": 3
  }
}
```

#### Get Categories
```
GET /api/categories

Response: {
  "categories": [
    {"name": "india", "count": 50},
    {"name": "world", "count": 45},
    ...
  ]
}
```

### Voting

#### Vote on Article
```
POST /api/articles/<article_id>/vote
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "is_biased": true  // true for biased, false for not biased
}

Response: {
  "message": "Vote recorded successfully",
  "vote_stats": {...}
}
```

#### Delete Vote
```
DELETE /api/articles/<article_id>/vote
Authorization: Bearer <access_token>

Response: {
  "message": "Vote removed successfully",
  "vote_stats": {...}
}
```

### Bookmarks

#### Get Bookmarks
```
GET /api/bookmarks?page=1&per_page=20
Authorization: Bearer <access_token>

Response: {
  "articles": [...],
  "pagination": {...}
}
```

#### Add Bookmark
```
POST /api/articles/<article_id>/bookmark
Authorization: Bearer <access_token>

Response: {
  "message": "Article bookmarked successfully"
}
```

#### Remove Bookmark
```
DELETE /api/articles/<article_id>/bookmark
Authorization: Bearer <access_token>

Response: {
  "message": "Bookmark removed successfully"
}
```

### User Activity

#### Get User Activity
```
GET /api/user/activity
Authorization: Bearer <access_token>

Response: {
  "total_votes": 150,
  "biased_votes": 90,
  "not_biased_votes": 60,
  "bookmark_count": 25,
  "recent_activity": [...]
}
```

### Statistics

#### Get Platform Statistics
```
GET /api/stats/overview

Response: {
  "total_articles": 500,
  "total_votes": 10000,
  "total_users": 250,
  "category_stats": [...]
}
```

## 🔒 Security Features

1. **Password Hashing**: Uses bcrypt for secure password storage
2. **JWT Authentication**: Token-based authentication with configurable expiry
3. **CORS Protection**: Cross-Origin Resource Sharing configured
4. **Unique Constraints**: Prevents duplicate votes and bookmarks
