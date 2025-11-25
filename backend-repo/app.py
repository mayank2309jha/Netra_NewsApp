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
# NOTE: Ensure this matches your PostgreSQL setup
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://netra_user:12345@localhost:5432/netra_news')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'netranews')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db = SQLAlchemy(app)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# ========================
# MODELS
# ========================

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    votes = db.relationship('Vote', back_populates='user', cascade='all, delete-orphan')
    bookmarks = db.relationship('Bookmark', back_populates='user', cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {'id': self.id, 'username': self.username, 'email': self.email, 'created_at': self.created_at.isoformat()}

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
            try:
                user_vote = Vote.query.filter_by(article_id=self.id, user_id=user_id).first()
                data['user_vote'] = user_vote.is_biased if user_vote else None
                bookmark = Bookmark.query.filter_by(article_id=self.id, user_id=user_id).first()
                data['is_bookmarked'] = bookmark is not None
            except:
                data['user_vote'] = None
                data['is_bookmarked'] = False
                
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
    is_biased = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', back_populates='votes')
    article = db.relationship('Article', back_populates='votes')
    __table_args__ = (db.UniqueConstraint('user_id', 'article_id', name='unique_user_article_vote'),)

class Bookmark(db.Model):
    __tablename__ = 'bookmarks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', back_populates='bookmarks')
    article = db.relationship('Article', back_populates='bookmarks')
    __table_args__ = (db.UniqueConstraint('user_id', 'article_id', name='unique_user_article_bookmark'),)

# ========================
# ROUTES
# ========================

@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    try:
        user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            verify_jwt_in_request(optional=True)
            user_id = int(get_jwt_identity()) if get_jwt_identity() else None
        except:
            pass
            
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'error': 'Article not found'}), 404
            
        return jsonify({'article': article.to_dict(include_related=True, user_id=user_id)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/articles', methods=['GET'])
def get_articles():
    try:
        # Simple extraction
        category = request.args.get('category')
        search = request.args.get('search')
        sources = request.args.get('sources')
        date_range = request.args.get('dateRange')
        
        query = Article.query
        
        if category and category != 'all':
            query = query.filter(Article.category == category)
            
        if sources:
            source_list = sources.split(',')
            filters = [Article.source_name.ilike(f"%{s.strip()}%") for s in source_list]
            query = query.filter(or_(*filters))
            
        if date_range == 'today':
            today_str = datetime.now().strftime('%d-%m-%Y')
            query = query.filter(Article.publish_date.like(f"{today_str}%"))
            
        if search:
            s = f"%{search}%"
            query = query.filter(or_(Article.headline.ilike(s), Article.source_name.ilike(s)))
        
        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = query.order_by(desc(Article.created_at)).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'articles': [a.to_dict() for a in pagination.items],
            'pagination': {'total_pages': pagination.pages, 'total_items': pagination.total}
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/articles/<int:article_id>/vote', methods=['POST'])
@jwt_required()
def vote_article(article_id):
    try:
        user_id = int(get_jwt_identity())
        #user_id = 1
        data = request.get_json()
        article = Article.query.get(article_id)
        if not article: return jsonify({'error': 'Not found'}), 404
        
        vote = Vote.query.filter_by(user_id=user_id, article_id=article_id).first()
        if vote:
            vote.is_biased = data['is_biased']
        else:
            db.session.add(Vote(user_id=user_id, article_id=article_id, is_biased=data['is_biased']))
            
        db.session.commit()
        return jsonify({'vote_stats': article.get_vote_stats()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.check_password(data.get('password')):
            return jsonify({'access_token': create_access_token(identity=str(user.id)), 'user': user.to_dict()}), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first(): return jsonify({'error': 'User exists'}), 400
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'access_token': create_access_token(identity=str(user.id)), 'user': user.to_dict()}), 201
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    return jsonify({'user': User.query.get(int(get_jwt_identity())).to_dict()}), 200

@app.route('/api/categories', methods=['GET'])
def get_categories():
    data = db.session.query(Article.category, func.count(Article.id)).group_by(Article.category).all()
    return jsonify({'categories': [{'name': c, 'count': n} for c, n in data]}), 200

@app.route('/api/health', methods=['GET'])
def health(): return jsonify({'status': 'healthy'}), 200

@app.route('/api/stats/overview', methods=['GET'])
def get_stats_overview():
    try:
        total_articles = Article.query.count()
        total_votes = Vote.query.count()
        total_users = User.query.count()

        # Get category breakdown
        category_stats = db.session.query(
            Article.category,
            func.count(Article.id).label('article_count')
        ).group_by(Article.category).all()

        return jsonify({
            'total_articles': total_articles,
            'total_votes': total_votes,
            'total_users': total_users,
            'category_stats': [
                {'category': c, 'article_count': n} for c, n in category_stats
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)