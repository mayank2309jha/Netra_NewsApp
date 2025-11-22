# 🚀 NETRA News Platform - Complete Backend Solution

## 📦 What You've Got

A fully functional Flask backend for your news aggregation platform with:

✅ **User Authentication System** (Register, Login, JWT tokens)  
✅ **Article Management** (Load from JSON, pagination, filtering, search)  
✅ **Voting System** (Vote biased/not biased, real-time statistics)  
✅ **Bookmark System** (Save articles for later)  
✅ **User Activity Tracking** (Track votes and interactions)  
✅ **Platform Statistics** (Overview of all data)  
✅ **RESTful API** (Complete with CORS support)  
✅ **PostgreSQL Integration** (Production-ready database)  
✅ **React Integration** (Ready-to-use API service and updated components)

---

## 📁 Files Provided

### Backend Core
- **`app.py`** - Main Flask application with all routes and models
- **`load_data.py`** - Script to populate database from your JSON files
- **`requirements.txt`** - Python dependencies

### Setup & Configuration
- **`setup.sh`** - Automated setup script (Linux/Mac)
- **`.env.example`** - Environment variables template

### Documentation
- **`README.md`** - Comprehensive setup and API documentation
- **`DATABASE_SCHEMA.md`** - Detailed database schema with diagrams

### Testing
- **`test_api.py`** - Automated API testing script

### Frontend Integration
- **`react-api-service.js`** - Ready-to-use React API service
- **`NewsDetails-Updated.jsx`** - Updated component with backend integration

---

## 🏃 Quick Start (5 Minutes!)

### Option 1: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x setup.sh

# Run automated setup
./setup.sh
```

The script will:
1. Create virtual environment
2. Install dependencies
3. Setup PostgreSQL database
4. Load all articles from JSON files
5. Start the server

### Option 2: Manual Setup

```bash
# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE netra_news;
CREATE USER netra_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE netra_news TO netra_user;
\q

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Load data
python load_data.py

# 6. Start server
python app.py
```

---

## 🎯 Database Structure Overview

```
USERS
  ├── Has many VOTES
  ├── Has many BOOKMARKS
  
ARTICLES
  ├── Has many RELATED_ARTICLES
  ├── Has many VOTES
  ├── Has many BOOKMARKS
  
VOTES (Tracks user bias votes)
BOOKMARKS (Saves articles for users)
RELATED_ARTICLES (Similar coverage from other sources)
```

**Key Features:**
- Unique constraints prevent duplicate votes/bookmarks
- Cascade deletes maintain referential integrity
- Real-time vote statistics calculation
- Category-based organization

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Articles
- `GET /api/articles` - List articles (with filters, search, pagination)
- `GET /api/articles/<id>` - Get single article with details
- `GET /api/categories` - Get all categories with counts

### Voting
- `POST /api/articles/<id>/vote` - Vote on article (requires auth)
- `DELETE /api/articles/<id>/vote` - Remove vote (requires auth)

### Bookmarks
- `GET /api/bookmarks` - Get user's bookmarks (requires auth)
- `POST /api/articles/<id>/bookmark` - Add bookmark (requires auth)
- `DELETE /api/articles/<id>/bookmark` - Remove bookmark (requires auth)

### User & Stats
- `GET /api/user/activity` - Get user's activity (requires auth)
- `GET /api/stats/overview` - Get platform statistics

---

## 🎨 Frontend Integration

### 1. Install axios in your React project:
```bash
npm install axios
```

### 2. Copy `react-api-service.js` to your React `src` folder as `api.js`

### 3. Use in your components:
```javascript
import { articlesAPI, authAPI } from './api';

// Get articles
const { articles } = await articlesAPI.getArticles({
  category: 'india',
  sort_by: 'recent',
  page: 1
});

// Login
await authAPI.login(username, password);

// Vote on article
await votingAPI.voteArticle(articleId, true);
```

### 4. Replace your NewsDetails.jsx with the updated version provided

---

## 🧪 Testing Your API

```bash
# Install colorama for pretty output
pip install colorama

# Run the test suite
python test_api.py
```

This will test all endpoints and show you a comprehensive report.

---

## 📊 Key Features Explained

### 1. **Smart Voting System**
- Users can vote once per article
- Vote can be changed (toggle between biased/not biased)
- Real-time statistics calculation
- Community verdict shows percentages

### 2. **Article Filtering**
- **By category**: india, world, local, sports, business, science, technology, entertainment, health
- **By popularity**: Most voted articles first
- **By recency**: Newest articles first
- **By search**: Search in headline, source, author

### 3. **User Personalization**
- Track which articles user voted on
- Save bookmarks for later reading
- View voting history and statistics
- JWT token stays valid for 7 days

### 4. **Data Loading**
Your JSON files are automatically processed:
- Duplicates are skipped (by article_link)
- Related articles are linked to primary articles
- Progress is shown during import
- Summary statistics displayed after import

---

## 🔒 Security Features

1. **Password Hashing**: Bcrypt with salt
2. **JWT Authentication**: Secure token-based auth
3. **CORS Protection**: Configurable origins
4. **SQL Injection Prevention**: SQLAlchemy ORM
5. **Unique Constraints**: Prevent data duplication

---

## 📈 Production Deployment Tips

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables (Important!)
```bash
# Generate a strong JWT secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Update .env with:
JWT_SECRET_KEY=your-generated-key-here
FLASK_ENV=production
```

### Database Optimization
```sql
-- Add these indexes in production
CREATE INDEX idx_article_category ON articles(category);
CREATE INDEX idx_article_created ON articles(created_at DESC);
CREATE INDEX idx_vote_article ON votes(article_id);
CREATE INDEX idx_vote_user ON votes(user_id);
```

---

## 🎓 For Your Project Presentation

**What to highlight:**

1. **Full-Stack Integration**: Backend API + Frontend React components
2. **Database Design**: Normalized schema with proper relationships
3. **User Engagement**: Voting and bookmark systems
4. **Real-time Statistics**: Vote percentages calculated dynamically
5. **Scalability**: Pagination, filtering, search capabilities
6. **Security**: JWT authentication, password hashing, SQL injection prevention

**Architecture Diagram:**
```
React Frontend (Your Components)
       ↓ (HTTP/REST API)
Flask Backend (app.py)
       ↓ (SQLAlchemy ORM)
PostgreSQL Database
       ↑ (Data loaded from)
JSON Files (Your web scraping results)
```

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL in .env file
- Test connection: `psql -U netra_user -d netra_news`

### "Module not found"
- Activate virtual environment: `source venv/bin/activate`
- Reinstall requirements: `pip install -r requirements.txt`

### "CORS errors in browser"
- CORS is enabled for all origins in development
- For production, update CORS configuration in app.py

### "No articles showing"
- Run `python load_data.py` to load articles
- Check JSON files are in correct location
- Verify database connection

---

## 📞 API Testing Examples

### Using curl:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'

# Get articles
curl http://localhost:5000/api/articles?category=india&per_page=5

# Vote (with token)
curl -X POST http://localhost:5000/api/articles/1/vote \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_biased":true}'
```

---

## 🎉 What Makes This Solution Complete

✅ **Production-Ready Code**: Error handling, validation, proper HTTP codes  
✅ **Comprehensive Documentation**: Every endpoint, every table, every feature  
✅ **Easy Setup**: Automated scripts for quick deployment  
✅ **Testing Suite**: Verify everything works before demo  
✅ **Frontend Ready**: React components and API service included  
✅ **Scalable Design**: Pagination, filtering, efficient queries  
✅ **Secure**: Industry-standard authentication and data protection  

---

## 🚀 Next Steps for Your Project

1. **Immediate** (Today):
   - Run `./setup.sh` to get everything running
   - Test with `python test_api.py`
   - Integrate API service in your React app

2. **Optional Enhancements**:
   - Add user profile pages
   - Implement email verification
   - Add article recommendations based on user votes
   - Create admin dashboard
   - Add social sharing features

3. **For Presentation**:
   - Demo the voting system live
   - Show real-time statistics updates
   - Explain the database schema
   - Discuss security measures

---

## 📚 File Reading Order

For understanding the codebase:
1. **DATABASE_SCHEMA.md** - Understand data structure
2. **README.md** - Setup and API documentation
3. **app.py** - Backend implementation
4. **react-api-service.js** - Frontend integration
5. **test_api.py** - See how everything works together

---

## ✨ Good Luck!

You now have a complete, production-ready backend for your news platform. 
Everything is documented, tested, and ready to demo.

**Remember**: If you get stuck, check the README.md for detailed explanations!

---

**Questions or Issues?**
- Check the comprehensive README.md
- Review DATABASE_SCHEMA.md for data questions
- Run test_api.py to verify everything works
- Examine app.py for implementation details

**Time to shine in your presentation! 🌟**
