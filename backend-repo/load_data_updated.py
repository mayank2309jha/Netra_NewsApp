import json
import os
from app import app, db, Article, RelatedArticle
from datetime import datetime

def load_articles_from_json(json_file_path, category):
    """Load articles from a JSON file and insert them into the database"""
    
    print(f"Loading articles from {json_file_path} for category: {category}")
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    articles_loaded = 0
    
    for item in data:
        try:
            primary = item.get('primary_article', {})
            
            # Skip if essential fields are missing
            if not primary.get('headline') or not primary.get('article_link'):
                continue
            
            # Check if article already exists (by article_link)
            existing = Article.query.filter_by(article_link=primary['article_link']).first()
            if existing:
                print(f"  Skipping duplicate: {primary['headline'][:50]}...")
                continue
            
            # Create new article
            article = Article(
                headline=primary.get('headline', 'N/A'),
                author=primary.get('author', 'N/A'),
                article_link=primary.get('article_link'),
                featured_image=primary.get('featured_image'),
                source_logo=primary.get('source_logo'),
                source_name=primary.get('source_name'),
                publish_date=primary.get('publish_date'),
                category=category
            )
            
            db.session.add(article)
            db.session.flush()  # Get the article.id
            
            # Add related articles
            related_articles = item.get('related_articles', [])
            for related in related_articles:
                if related.get('article_link'):
                    related_article = RelatedArticle(
                        primary_article_id=article.id,
                        headline=related.get('headline', 'N/A'),
                        author=related.get('author', 'N/A'),
                        article_link=related.get('article_link'),
                        source_logo=related.get('source_logo'),
                        source_name=related.get('source_name'),
                        publish_date=related.get('publish_date')
                    )
                    db.session.add(related_article)
            
            articles_loaded += 1
            
            if articles_loaded % 10 == 0:
                print(f"  Loaded {articles_loaded} articles so far...")
                db.session.commit()
        
        except Exception as e:
            print(f"  Error loading article: {str(e)}")
            db.session.rollback()
            continue
    
    db.session.commit()
    print(f"✓ Successfully loaded {articles_loaded} articles from {category} category\n")
    return articles_loaded


def load_all_categories():
    """Load all articles from all JSON files"""
    
    # Mapping of JSON files to categories
    json_files = {
        'india_news.json': 'india',
        'world_news.json': 'world',
        'local_news.json': 'local',
        'sports_news.json': 'sports',
        'business_news.json': 'business',
        'science_news.json': 'science',
        'technology_news.json': 'technology',
        'entertainment_news.json': 'entertainment',
        'health_news.json': 'health'
    }
    
    # Try multiple possible data locations
    possible_data_dirs = [
        './data',                           # data/ in backend-repo
        '../scraped_data/all_data',           # scraped_data from project root
        './scraped_data/all_data',            # if run from project root
        '/mnt/user-data/uploads',          # original location (for testing)
    ]
    
    # Find the data directory
    data_dir = None
    for dir_path in possible_data_dirs:
        if os.path.exists(dir_path):
            # Check if at least one JSON file exists
            test_file = os.path.join(dir_path, 'india_news.json')
            if os.path.exists(test_file):
                data_dir = dir_path
                print(f"Found data directory: {data_dir}\n")
                break
    
    if not data_dir:
        print("ERROR: Could not find data directory!")
        print("Please ensure JSON files are in one of these locations:")
        for dir_path in possible_data_dirs:
            print(f"  - {dir_path}")
        print("\nYou can:")
        print("  1. Create a 'data' directory and copy JSON files there")
        print("  2. Create a symlink: ln -s ../scraped_data/all_data data")
        return 0
    
    total_loaded = 0
    
    print("=" * 60)
    print("Starting data import process...")
    print("=" * 60 + "\n")
    
    for json_file, category in json_files.items():
        json_path = os.path.join(data_dir, json_file)
        
        if os.path.exists(json_path):
            count = load_articles_from_json(json_path, category)
            total_loaded += count
        else:
            print(f"Warning: {json_file} not found at {json_path}, skipping...\n")
    
    print("=" * 60)
    print(f"Data import completed!")
    print(f"Total articles loaded: {total_loaded}")
    print("=" * 60)
    
    return total_loaded


if __name__ == '__main__':
    with app.app_context():
        print("\n🔄 Creating database tables...")
        db.create_all()
        print("✓ Database tables created successfully!\n")
        
        print("🔄 Loading articles from JSON files...")
        total_loaded = load_all_categories()
        
        if total_loaded > 0:
            # Print summary statistics
            print("\n📊 Database Summary:")
            print(f"  Total articles: {Article.query.count()}")
            print(f"  Total related articles: {RelatedArticle.query.count()}")
            
            # Print category breakdown
            from sqlalchemy import func
            categories = db.session.query(
                Article.category,
                func.count(Article.id)
            ).group_by(Article.category).all()
            
            print("\n📂 Articles by category:")
            for category, count in categories:
                print(f"  {category.capitalize()}: {count}")
            
            print("\n✅ All done! Database is ready to use.\n")
        else:
            print("\n❌ No articles were loaded. Please check the error messages above.\n")
