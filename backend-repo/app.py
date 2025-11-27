from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_, or_, extract, case
from collections import defaultdict
import json
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://netra_user:12345@localhost:5432/netra_news')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'netranews')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db = SQLAlchemy(app)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

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
            'total_votes': len(self.votes),
            'user_vote': None,
            'is_bookmarked': False
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

def get_date_range_filter(days=30):
    """Returns a datetime object for filtering recent data"""
    return datetime.utcnow() - timedelta(days=days)


@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    try:
        user_id = None
        try:
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
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            user_id = int(get_jwt_identity()) if get_jwt_identity() else None
        except:
            pass
        
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
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = query.order_by(desc(Article.created_at)).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'articles': [a.to_dict(user_id=user_id) for a in pagination.items],
            'pagination': {'total_pages': pagination.pages, 'total_items': pagination.total}
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/articles/<int:article_id>/vote', methods=['POST'])
@jwt_required()
def vote_article(article_id):
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'error': 'Not found'}), 404
        
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

@app.route('/api/articles/<int:article_id>/bookmark', methods=['POST'])
@jwt_required()
def add_bookmark(article_id):
    """Add a bookmark for an article"""
    try:
        user_id = int(get_jwt_identity())
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        existing = Bookmark.query.filter_by(user_id=user_id, article_id=article_id).first()
        if existing:
            return jsonify({'message': 'Already bookmarked', 'is_bookmarked': True}), 200
        
        bookmark = Bookmark(user_id=user_id, article_id=article_id)
        db.session.add(bookmark)
        db.session.commit()
        
        return jsonify({'message': 'Bookmark added', 'is_bookmarked': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/articles/<int:article_id>/bookmark', methods=['DELETE'])
@jwt_required()
def remove_bookmark(article_id):
    """Remove a bookmark from an article"""
    try:
        user_id = int(get_jwt_identity())
        
        bookmark = Bookmark.query.filter_by(user_id=user_id, article_id=article_id).first()
        if not bookmark:
            return jsonify({'message': 'Bookmark not found', 'is_bookmarked': False}), 200
        
        db.session.delete(bookmark)
        db.session.commit()
        
        return jsonify({'message': 'Bookmark removed', 'is_bookmarked': False}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/bookmarks', methods=['GET'])
@jwt_required()
def get_user_bookmarks():
    """Get all bookmarks for the current user"""
    try:
        user_id = int(get_jwt_identity())
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        bookmarks = Bookmark.query.filter_by(user_id=user_id).order_by(
            desc(Bookmark.created_at)
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        articles = []
        for bookmark in bookmarks.items:
            article_data = bookmark.article.to_dict(user_id=user_id)
            article_data['bookmarked_at'] = bookmark.created_at.isoformat()
            articles.append(article_data)
        
        return jsonify({
            'bookmarks': articles,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total_pages': bookmarks.pages,
                'total_items': bookmarks.total
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.check_password(data.get('password')):
            return jsonify({'access_token': create_access_token(identity=str(user.id)), 'user': user.to_dict()}), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'User exists'}), 400
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'access_token': create_access_token(identity=str(user.id)), 'user': user.to_dict()}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    return jsonify({'user': User.query.get(int(get_jwt_identity())).to_dict()}), 200

@app.route('/api/categories', methods=['GET'])
def get_categories():
    data = db.session.query(Article.category, func.count(Article.id)).group_by(Article.category).all()
    return jsonify({'categories': [{'name': c, 'count': n} for c, n in data]}), 200


@app.route('/api/stats/overview', methods=['GET'])
def get_stats_overview():
    """Main overview statistics for the platform"""
    try:
        total_articles = Article.query.count()
        total_votes = Vote.query.count()
        total_users = User.query.count()
        total_bookmarks = Bookmark.query.count()

        # Category breakdown with article counts
        category_stats = db.session.query(
            Article.category,
            func.count(Article.id).label('article_count')
        ).group_by(Article.category).order_by(desc('article_count')).all()

        # Calculate overall bias percentage
        biased_votes = Vote.query.filter_by(is_biased=True).count()
        bias_percentage = round((biased_votes / total_votes * 100), 1) if total_votes > 0 else 0

        # Recent activity (last 10 actions)
        recent_votes = db.session.query(
            Vote.created_at,
            Vote.is_biased,
            Article.headline
        ).join(Article).order_by(desc(Vote.created_at)).limit(5).all()

        recent_activity = []
        for vote in recent_votes:
            action = "Article voted as biased" if vote.is_biased else "Article voted as not biased"
            time_diff = datetime.utcnow() - vote.created_at
            if time_diff.days > 0:
                time_str = f"{time_diff.days} days ago"
            elif time_diff.seconds // 3600 > 0:
                time_str = f"{time_diff.seconds // 3600} hours ago"
            else:
                time_str = f"{time_diff.seconds // 60} minutes ago"
            recent_activity.append({'action': action, 'time': time_str, 'headline': vote.headline[:50] + '...'})

        return jsonify({
            'total_articles': total_articles,
            'total_votes': total_votes,
            'total_users': total_users,
            'total_bookmarks': total_bookmarks,
            'bias_percentage': bias_percentage,
            'category_stats': [
                {'category': c, 'article_count': n} for c, n in category_stats
            ],
            'recent_activity': recent_activity
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/voting', methods=['GET'])
def get_voting_stats():
    """Voting patterns statistics"""
    try:
        # Votes by news source
        votes_by_source = db.session.query(
            Article.source_name,
            func.sum(case((Vote.is_biased == True, 1), else_=0)).label('biased'),
            func.sum(case((Vote.is_biased == False, 1), else_=0)).label('not_biased'),
            func.count(Vote.id).label('total')
        ).join(Vote).group_by(Article.source_name).order_by(desc('total')).limit(10).all()

        # Votes by category
        votes_by_category = db.session.query(
            Article.category,
            func.sum(case((Vote.is_biased == True, 1), else_=0)).label('biased'),
            func.sum(case((Vote.is_biased == False, 1), else_=0)).label('not_biased'),
            func.count(Vote.id).label('total')
        ).join(Vote).group_by(Article.category).order_by(desc('total')).all()

        # Voting over time (last 30 days, grouped by day)
        thirty_days_ago = get_date_range_filter(30)
        votes_over_time = db.session.query(
            func.date(Vote.created_at).label('date'),
            func.sum(case((Vote.is_biased == True, 1), else_=0)).label('biased'),
            func.sum(case((Vote.is_biased == False, 1), else_=0)).label('not_biased')
        ).filter(Vote.created_at >= thirty_days_ago).group_by(func.date(Vote.created_at)).order_by('date').all()

        return jsonify({
            'votes_by_source': [
                {
                    'source': s or 'Unknown',
                    'biased': int(b or 0),
                    'not_biased': int(nb or 0),
                    'total': int(t or 0),
                    'bias_ratio': round((int(b or 0) / int(t)) * 100, 1) if t else 0
                }
                for s, b, nb, t in votes_by_source
            ],
            'votes_by_category': [
                {
                    'category': c,
                    'biased': int(b or 0),
                    'not_biased': int(nb or 0),
                    'total': int(t or 0),
                    'bias_ratio': round((int(b or 0) / int(t)) * 100, 1) if t else 0
                }
                for c, b, nb, t in votes_by_category
            ],
            'votes_over_time': [
                {
                    'date': str(d),
                    'biased': int(b or 0),
                    'not_biased': int(nb or 0)
                }
                for d, b, nb in votes_over_time
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/bookmarks', methods=['GET'])
def get_bookmark_stats():
    """Bookmark patterns statistics"""
    try:
        # Bookmarks by news source
        bookmarks_by_source = db.session.query(
            Article.source_name,
            func.count(Bookmark.id).label('count')
        ).join(Bookmark).group_by(Article.source_name).order_by(desc('count')).limit(10).all()

        # Bookmarks by category
        bookmarks_by_category = db.session.query(
            Article.category,
            func.count(Bookmark.id).label('count')
        ).join(Bookmark).group_by(Article.category).order_by(desc('count')).all()

        # Bookmarks over time (last 30 days)
        thirty_days_ago = get_date_range_filter(30)
        bookmarks_over_time = db.session.query(
            func.date(Bookmark.created_at).label('date'),
            func.count(Bookmark.id).label('count')
        ).filter(Bookmark.created_at >= thirty_days_ago).group_by(func.date(Bookmark.created_at)).order_by('date').all()

        # Bias distribution in bookmarked articles
        bookmarked_bias = db.session.query(
            func.sum(case((Vote.is_biased == True, 1), else_=0)).label('biased'),
            func.sum(case((Vote.is_biased == False, 1), else_=0)).label('not_biased')
        ).join(Bookmark, Vote.article_id == Bookmark.article_id).first()

        return jsonify({
            'bookmarks_by_source': [
                {'source': s or 'Unknown', 'count': int(c)}
                for s, c in bookmarks_by_source
            ],
            'bookmarks_by_category': [
                {'category': c, 'count': int(ct)}
                for c, ct in bookmarks_by_category
            ],
            'bookmarks_over_time': [
                {'date': str(d), 'count': int(c)}
                for d, c in bookmarks_over_time
            ],
            'bookmarked_bias_distribution': {
                'biased': int(bookmarked_bias.biased or 0) if bookmarked_bias else 0,
                'not_biased': int(bookmarked_bias.not_biased or 0) if bookmarked_bias else 0
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/sources', methods=['GET'])
def get_source_stats():
    """News agency/source statistics"""
    try:
        # Articles per source
        articles_by_source = db.session.query(
            Article.source_name,
            func.count(Article.id).label('article_count')
        ).group_by(Article.source_name).order_by(desc('article_count')).limit(15).all()

        # Bias ratio per source
        bias_by_source = db.session.query(
            Article.source_name,
            func.count(Vote.id).label('total_votes'),
            func.sum(case((Vote.is_biased == True, 1), else_=0)).label('biased_votes')
        ).join(Vote).group_by(Article.source_name).having(func.count(Vote.id) >= 5).order_by(desc('total_votes')).limit(15).all()

        # Most loved sources (by not biased votes)
        most_loved = db.session.query(
            Article.source_name,
            func.sum(case((Vote.is_biased == False, 1), else_=0)).label('not_biased_count')
        ).join(Vote).group_by(Article.source_name).order_by(desc('not_biased_count')).limit(10).all()

        # Least trusted sources (highest bias ratio)
        least_trusted = [
            {
                'source': s or 'Unknown',
                'total_votes': int(t),
                'biased_votes': int(b or 0),
                'bias_ratio': round((int(b or 0) / int(t)) * 100, 1) if t else 0
            }
            for s, t, b in bias_by_source
        ]
        least_trusted.sort(key=lambda x: x['bias_ratio'], reverse=True)

        # Most bookmarked sources
        most_bookmarked = db.session.query(
            Article.source_name,
            func.count(Bookmark.id).label('bookmark_count')
        ).join(Bookmark).group_by(Article.source_name).order_by(desc('bookmark_count')).limit(10).all()

        return jsonify({
            'articles_by_source': [
                {'source': s or 'Unknown', 'count': int(c)}
                for s, c in articles_by_source
            ],
            'bias_by_source': [
                {
                    'source': s or 'Unknown',
                    'total_votes': int(t),
                    'biased_votes': int(b or 0),
                    'bias_ratio': round((int(b or 0) / int(t)) * 100, 1) if t else 0
                }
                for s, t, b in bias_by_source
            ],
            'most_loved_sources': [
                {'source': s or 'Unknown', 'not_biased_votes': int(c or 0)}
                for s, c in most_loved
            ],
            'least_trusted_sources': least_trusted[:10],
            'most_bookmarked_sources': [
                {'source': s or 'Unknown', 'bookmarks': int(c)}
                for s, c in most_bookmarked
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/categories', methods=['GET'])
def get_category_stats():
    """Category-specific statistics"""
    try:
        # Articles per category with votes
        category_overview = db.session.query(
            Article.category,
            func.count(func.distinct(Article.id)).label('article_count'),
            func.count(Vote.id).label('vote_count'),
            func.count(Bookmark.id).label('bookmark_count')
        ).outerjoin(Vote).outerjoin(Bookmark).group_by(Article.category).all()

        # Bias ratio per category
        bias_by_category = db.session.query(
            Article.category,
            func.count(Vote.id).label('total_votes'),
            func.sum(case((Vote.is_biased == True, 1), else_=0)).label('biased_votes')
        ).join(Vote).group_by(Article.category).all()

        # Category engagement over time (last 30 days)
        thirty_days_ago = get_date_range_filter(30)
        category_trends = db.session.query(
            Article.category,
            func.date(Vote.created_at).label('date'),
            func.count(Vote.id).label('votes')
        ).join(Vote).filter(Vote.created_at >= thirty_days_ago).group_by(
            Article.category, func.date(Vote.created_at)
        ).order_by('date').all()

        # Group trends by category
        trends_by_category = defaultdict(list)
        for cat, date, votes in category_trends:
            trends_by_category[cat].append({'date': str(date), 'votes': int(votes)})

        return jsonify({
            'category_overview': [
                {
                    'category': c,
                    'articles': int(a),
                    'votes': int(v or 0),
                    'bookmarks': int(b or 0)
                }
                for c, a, v, b in category_overview
            ],
            'bias_by_category': [
                {
                    'category': c,
                    'total_votes': int(t),
                    'biased_votes': int(b or 0),
                    'bias_ratio': round((int(b or 0) / int(t)) * 100, 1) if t else 0
                }
                for c, t, b in bias_by_category
            ],
            'category_trends': dict(trends_by_category)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/authors', methods=['GET'])
def get_author_stats():
    """Author-specific statistics"""
    try:
        # Top authors by article count
        top_authors = db.session.query(
            Article.author,
            func.count(Article.id).label('article_count'),
            func.count(func.distinct(Article.source_name)).label('sources_count')
        ).filter(Article.author.isnot(None), Article.author != '').group_by(
            Article.author
        ).order_by(desc('article_count')).limit(20).all()

        # Author bias statistics
        author_bias = db.session.query(
            Article.author,
            func.count(Vote.id).label('total_votes'),
            func.sum(case((Vote.is_biased == True, 1), else_=0)).label('biased_votes')
        ).join(Vote).filter(Article.author.isnot(None), Article.author != '').group_by(
            Article.author
        ).having(func.count(Vote.id) >= 3).order_by(desc('total_votes')).limit(20).all()

        # Authors and their agencies
        author_agencies = db.session.query(
            Article.author,
            Article.source_name,
            func.count(Article.id).label('count')
        ).filter(Article.author.isnot(None), Article.author != '').group_by(
            Article.author, Article.source_name
        ).order_by(desc('count')).limit(50).all()

        # Group agencies by author
        agencies_by_author = defaultdict(list)
        for author, source, count in author_agencies:
            agencies_by_author[author].append({'source': source or 'Unknown', 'articles': int(count)})

        return jsonify({
            'top_authors': [
                {
                    'author': a or 'Unknown',
                    'articles': int(c),
                    'sources': int(s)
                }
                for a, c, s in top_authors
            ],
            'author_bias': [
                {
                    'author': a or 'Unknown',
                    'total_votes': int(t),
                    'biased_votes': int(b or 0),
                    'bias_ratio': round((int(b or 0) / int(t)) * 100, 1) if t else 0
                }
                for a, t, b in author_bias
            ],
            'author_agencies': dict(agencies_by_author)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/engagement', methods=['GET'])
def get_engagement_stats():
    """Platform engagement statistics"""
    try:
        # Daily engagement (votes + bookmarks) over last 30 days
        thirty_days_ago = get_date_range_filter(30)
        
        daily_votes = db.session.query(
            func.date(Vote.created_at).label('date'),
            func.count(Vote.id).label('count')
        ).filter(Vote.created_at >= thirty_days_ago).group_by(func.date(Vote.created_at)).all()

        daily_bookmarks = db.session.query(
            func.date(Bookmark.created_at).label('date'),
            func.count(Bookmark.id).label('count')
        ).filter(Bookmark.created_at >= thirty_days_ago).group_by(func.date(Bookmark.created_at)).all()

        # New user registrations over time
        daily_registrations = db.session.query(
            func.date(User.created_at).label('date'),
            func.count(User.id).label('count')
        ).filter(User.created_at >= thirty_days_ago).group_by(func.date(User.created_at)).all()

        # Most engaged users
        most_engaged = db.session.query(
            User.username,
            func.count(func.distinct(Vote.id)).label('votes'),
            func.count(func.distinct(Bookmark.id)).label('bookmarks')
        ).outerjoin(Vote).outerjoin(Bookmark).group_by(User.id, User.username).order_by(
            desc(func.count(func.distinct(Vote.id)) + func.count(func.distinct(Bookmark.id)))
        ).limit(10).all()

        # Engagement by category
        engagement_by_category = db.session.query(
            Article.category,
            func.count(func.distinct(Vote.id)).label('votes'),
            func.count(func.distinct(Bookmark.id)).label('bookmarks')
        ).outerjoin(Vote).outerjoin(Bookmark).group_by(Article.category).all()

        return jsonify({
            'daily_votes': [{'date': str(d), 'count': int(c)} for d, c in daily_votes],
            'daily_bookmarks': [{'date': str(d), 'count': int(c)} for d, c in daily_bookmarks],
            'daily_registrations': [{'date': str(d), 'count': int(c)} for d, c in daily_registrations],
            'most_engaged_users': [
                {'username': u, 'votes': int(v or 0), 'bookmarks': int(b or 0)}
                for u, v, b in most_engaged
            ],
            'engagement_by_category': [
                {'category': c, 'votes': int(v or 0), 'bookmarks': int(b or 0)}
                for c, v, b in engagement_by_category
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)