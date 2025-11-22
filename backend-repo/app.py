from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_, or_
import json
import os

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://netra_user:12345@localhost:5432/netra_news')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'netranews')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# ========================
# DATABASE MODELS
# ========================

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    votes = db.relationship('Vote', back_populates='user', cascade='all, delete-orphan')
    bookmarks = db.relationship('Bookmark', back_populates='user', cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }


class Article(db.Model):
    __tablename__ = 'articles'
    
    id = db.Column(db.Integer, primary_key=True)
    headline = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(255))
    article_link = db.Column(db.Text, nullable=False)
    featured_image = db.Column(db.Text)
    source_logo = db.Column(db.Text)
    source_name = db.Column(db.String(255))
    publish_date = db.Column(db.String(50))
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    related_articles = db.relationship('RelatedArticle', back_populates='primary_article', cascade='all, delete-orphan')
    votes = db.relationship('Vote', back_populates='article', cascade='all, delete-orphan')
    bookmarks = db.relationship('Bookmark', back_populates='article', cascade='all, delete-orphan')
    
    def to_dict(self, include_related=False, user_id=None):
        data = {
            'id': self.id,
            'headline': self.headline,
            'author': self.author,
            'article_link': self.article_link,
            'featured_image': self.featured_image,
            'source_logo': self.source_logo,
            'source_name': self.source_name,
            'publish_date': self.publish_date,
            'category': self.category,
            'created_at': self.created_at.isoformat(),
            'vote_stats': self.get_vote_stats(),
            'total_votes': len(self.votes)
        }
        
        if user_id:
            user_vote = Vote.query.filter_by(article_id=self.id, user_id=user_id).first()
            data['user_vote'] = user_vote.is_biased if user_vote else None
            
            bookmark = Bookmark.query.filter_by(article_id=self.id, user_id=user_id).first()
            data['is_bookmarked'] = bookmark is not None
        
        if include_related:
            data['related_articles'] = [ra.to_dict() for ra in self.related_articles]
            data['total_related_articles'] = len(self.related_articles)
        
        return data
    
    def get_vote_stats(self):
        total_votes = len(self.votes)
        if total_votes == 0:
            return {'biased': 0, 'not_biased': 0, 'biased_percentage': 0, 'not_biased_percentage': 0}
        
        biased_votes = sum(1 for v in self.votes if v.is_biased)
        not_biased_votes = total_votes - biased_votes
        
        return {
            'biased': biased_votes,
            'not_biased': not_biased_votes,
            'biased_percentage': round((biased_votes / total_votes) * 100, 1),
            'not_biased_percentage': round((not_biased_votes / total_votes) * 100, 1)
        }


class RelatedArticle(db.Model):
    __tablename__ = 'related_articles'
    
    id = db.Column(db.Integer, primary_key=True)
    primary_article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    headline = db.Column(db.Text)
    author = db.Column(db.String(255))
    article_link = db.Column(db.Text)
    source_logo = db.Column(db.Text)
    source_name = db.Column(db.String(255))
    publish_date = db.Column(db.String(50))
    
    # Relationships
    primary_article = db.relationship('Article', back_populates='related_articles')
    
    def to_dict(self):
        return {
            'id': self.id,
            'headline': self.headline,
            'author': self.author,
            'article_link': self.article_link,
            'source_logo': self.source_logo,
            'source_name': self.source_name,
            'publish_date': self.publish_date
        }


class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    is_biased = db.Column(db.Boolean, nullable=False)  # True = Biased, False = Not Biased
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='votes')
    article = db.relationship('Article', back_populates='votes')
    
    # Unique constraint: one vote per user per article
    __table_args__ = (db.UniqueConstraint('user_id', 'article_id', name='unique_user_article_vote'),)


class Bookmark(db.Model):
    __tablename__ = 'bookmarks'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='bookmarks')
    article = db.relationship('Article', back_populates='bookmarks')
    
    # Unique constraint: one bookmark per user per article
    __table_args__ = (db.UniqueConstraint('user_id', 'article_id', name='unique_user_article_bookmark'),)


# ========================
# AUTHENTICATION ROUTES
# ========================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['username', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not all(k in data for k in ['username', 'password']):
            return jsonify({'error': 'Missing username or password'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ========================
# ARTICLE ROUTES
# ========================

@app.route('/api/articles', methods=['GET'])
def get_articles():
    """Get articles with filtering, sorting, and pagination"""
    try:
        # Get query parameters
        category = request.args.get('category', None)
        sort_by = request.args.get('sort_by', 'recent')  # recent, popular, controversial
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', None)
        
        # Get user_id if authenticated
        user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass
        
        # Base query
        query = Article.query
        
        # Filter by category
        if category and category != 'all':
            query = query.filter(Article.category == category)
        
        # Search functionality
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Article.headline.ilike(search_term),
                    Article.source_name.ilike(search_term),
                    Article.author.ilike(search_term)
                )
            )
        
        # Sorting
        if sort_by == 'recent':
            query = query.order_by(desc(Article.created_at))
        elif sort_by == 'popular':
            # Sort by number of votes
            query = query.outerjoin(Vote).group_by(Article.id).order_by(desc(func.count(Vote.id)))
        elif sort_by == 'controversial':
            # Sort by articles with votes closest to 50-50 split
            # This is a simplified version
            query = query.outerjoin(Vote).group_by(Article.id).having(func.count(Vote.id) > 5).order_by(desc(func.count(Vote.id)))
        
        # Pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        articles = [article.to_dict(user_id=user_id) for article in pagination.items]
        
        return jsonify({
            'articles': articles,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total_pages': pagination.pages,
                'total_items': pagination.total,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    """Get a single article with related articles"""
    try:
        # Get user_id if authenticated
        user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass
        
        article = Article.query.get(article_id)
        
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        return jsonify({'article': article.to_dict(include_related=True, user_id=user_id)}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all available categories with article counts"""
    try:
        categories = db.session.query(
            Article.category,
            func.count(Article.id).label('count')
        ).group_by(Article.category).all()
        
        return jsonify({
            'categories': [
                {'name': cat, 'count': count}
                for cat, count in categories
            ]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ========================
# VOTING ROUTES
# ========================

@app.route('/api/articles/<int:article_id>/vote', methods=['POST'])
@jwt_required()
def vote_article(article_id):
    """Vote on an article (biased or not biased)"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if 'is_biased' not in data:
            return jsonify({'error': 'Missing is_biased field'}), 400
        
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        # Check if user already voted
        existing_vote = Vote.query.filter_by(user_id=user_id, article_id=article_id).first()
        
        if existing_vote:
            # Update existing vote
            existing_vote.is_biased = data['is_biased']
            message = 'Vote updated successfully'
        else:
            # Create new vote
            vote = Vote(user_id=user_id, article_id=article_id, is_biased=data['is_biased'])
            db.session.add(vote)
            message = 'Vote recorded successfully'
        
        db.session.commit()
        
        return jsonify({
            'message': message,
            'vote_stats': article.get_vote_stats()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/articles/<int:article_id>/vote', methods=['DELETE'])
@jwt_required()
def delete_vote(article_id):
    """Remove user's vote on an article"""
    try:
        user_id = get_jwt_identity()
        
        vote = Vote.query.filter_by(user_id=user_id, article_id=article_id).first()
        
        if not vote:
            return jsonify({'error': 'Vote not found'}), 404
        
        db.session.delete(vote)
        db.session.commit()
        
        article = Article.query.get(article_id)
        
        return jsonify({
            'message': 'Vote removed successfully',
            'vote_stats': article.get_vote_stats()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ========================
# BOOKMARK ROUTES
# ========================

@app.route('/api/bookmarks', methods=['GET'])
@jwt_required()
def get_bookmarks():
    """Get user's bookmarked articles"""
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        bookmarks = Bookmark.query.filter_by(user_id=user_id).order_by(desc(Bookmark.created_at))
        pagination = bookmarks.paginate(page=page, per_page=per_page, error_out=False)
        
        articles = [bookmark.article.to_dict(user_id=user_id) for bookmark in pagination.items]
        
        return jsonify({
            'articles': articles,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total_pages': pagination.pages,
                'total_items': pagination.total,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/articles/<int:article_id>/bookmark', methods=['POST'])
@jwt_required()
def add_bookmark(article_id):
    """Bookmark an article"""
    try:
        user_id = get_jwt_identity()
        
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        existing_bookmark = Bookmark.query.filter_by(user_id=user_id, article_id=article_id).first()
        
        if existing_bookmark:
            return jsonify({'message': 'Article already bookmarked'}), 200
        
        bookmark = Bookmark(user_id=user_id, article_id=article_id)
        db.session.add(bookmark)
        db.session.commit()
        
        return jsonify({'message': 'Article bookmarked successfully'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/articles/<int:article_id>/bookmark', methods=['DELETE'])
@jwt_required()
def remove_bookmark(article_id):
    """Remove bookmark from an article"""
    try:
        user_id = get_jwt_identity()
        
        bookmark = Bookmark.query.filter_by(user_id=user_id, article_id=article_id).first()
        
        if not bookmark:
            return jsonify({'error': 'Bookmark not found'}), 404
        
        db.session.delete(bookmark)
        db.session.commit()
        
        return jsonify({'message': 'Bookmark removed successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ========================
# USER ACTIVITY ROUTES
# ========================

@app.route('/api/user/activity', methods=['GET'])
@jwt_required()
def get_user_activity():
    """Get user's voting and bookmark activity"""
    try:
        user_id = get_jwt_identity()
        
        # Get vote statistics
        total_votes = Vote.query.filter_by(user_id=user_id).count()
        biased_votes = Vote.query.filter_by(user_id=user_id, is_biased=True).count()
        not_biased_votes = total_votes - biased_votes
        
        # Get bookmark count
        bookmark_count = Bookmark.query.filter_by(user_id=user_id).count()
        
        # Get recent activity
        recent_votes = Vote.query.filter_by(user_id=user_id).order_by(desc(Vote.created_at)).limit(10).all()
        recent_votes_data = [{
            'article': Article.query.get(vote.article_id).to_dict(user_id=user_id),
            'is_biased': vote.is_biased,
            'created_at': vote.created_at.isoformat()
        } for vote in recent_votes]
        
        return jsonify({
            'total_votes': total_votes,
            'biased_votes': biased_votes,
            'not_biased_votes': not_biased_votes,
            'bookmark_count': bookmark_count,
            'recent_activity': recent_votes_data
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ========================
# STATISTICS ROUTES
# ========================

@app.route('/api/stats/overview', methods=['GET'])
def get_stats_overview():
    """Get platform statistics"""
    try:
        total_articles = Article.query.count()
        total_votes = Vote.query.count()
        total_users = User.query.count()
        
        # Category breakdown
        category_stats = db.session.query(
            Article.category,
            func.count(Article.id).label('article_count'),
            func.count(Vote.id).label('vote_count')
        ).outerjoin(Vote).group_by(Article.category).all()
        
        return jsonify({
            'total_articles': total_articles,
            'total_votes': total_votes,
            'total_users': total_users,
            'category_stats': [
                {
                    'category': cat,
                    'article_count': art_count,
                    'vote_count': vote_count
                }
                for cat, art_count, vote_count in category_stats
            ]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ========================
# HEALTH CHECK
# ========================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200


# ========================
# ERROR HANDLERS
# ========================

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
