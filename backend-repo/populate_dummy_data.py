"""
populate_dummy_data.py
Populates the NETRA database with dummy users, votes, and bookmarks
for demonstration purposes.

Run with: python populate_dummy_data.py
"""

import random
from datetime import datetime, timedelta
from app import app, db, User, Article, Vote, Bookmark

# Configuration
NUM_DUMMY_USERS = 50
VOTES_PER_USER_RANGE = (10, 40)  # Each user will cast 10-40 votes
BOOKMARKS_PER_USER_RANGE = (3, 15)  # Each user will have 3-15 bookmarks

# Dummy user data
FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Ananya", "Diya", "Priya", "Aisha", "Saanvi", "Aadhya", "Kavya", "Riya", "Mira", "Zara",
    "Rahul", "Amit", "Vikram", "Rohan", "Karan", "Nikhil", "Sanjay", "Deepak", "Raj", "Vijay",
    "Neha", "Pooja", "Sneha", "Anjali", "Divya", "Meera", "Nisha", "Shreya", "Tanvi", "Pallavi",
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth", "Susan", "Jessica", "Sarah", "Karen"
]

LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Shah", "Mehta", "Joshi", "Reddy",
    "Nair", "Menon", "Iyer", "Rao", "Pillai", "Chatterjee", "Banerjee", "Das", "Bose", "Sen",
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White"
]


def generate_username(first_name, last_name, index):
    """Generate a unique username"""
    variations = [
        f"{first_name.lower()}{last_name.lower()}{random.randint(1, 99)}",
        f"{first_name.lower()}_{last_name.lower()}",
        f"{first_name.lower()}{random.randint(100, 999)}",
        f"{last_name.lower()}.{first_name.lower()}",
        f"{first_name.lower()[:3]}{last_name.lower()}{index}",
    ]
    return random.choice(variations)


def generate_email(username):
    """Generate an email from username"""
    domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "protonmail.com"]
    return f"{username}@{random.choice(domains)}"


def random_date_within_days(days=60):
    """Generate a random datetime within the last N days"""
    now = datetime.utcnow()
    random_days = random.randint(0, days)
    random_seconds = random.randint(0, 86400)
    return now - timedelta(days=random_days, seconds=random_seconds)


def create_dummy_users():
    """Create dummy users"""
    print("\n📝 Creating dummy users...")
    
    created_users = []
    existing_usernames = set(u.username for u in User.query.all())
    
    for i in range(NUM_DUMMY_USERS):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        
        # Generate unique username
        attempts = 0
        while attempts < 10:
            username = generate_username(first_name, last_name, i)
            if username not in existing_usernames:
                break
            attempts += 1
        
        if username in existing_usernames:
            continue
            
        email = generate_email(username)
        
        # Check if email exists
        if User.query.filter_by(email=email).first():
            email = f"{username}{random.randint(1, 999)}@{email.split('@')[1]}"
        
        user = User(
            username=username,
            email=email,
            created_at=random_date_within_days(90)
        )
        user.set_password("demo123")  # All dummy users have same password for testing      
        
        try:
            db.session.add(user)
            db.session.flush()
            created_users.append(user)
            existing_usernames.add(username)
            
            if (i + 1) % 10 == 0:
                print(f"  Created {i + 1} users...")
                db.session.commit()
        except Exception as e:
            print(f"  Error creating user {username}: {e}")
            db.session.rollback()
            continue
    
    db.session.commit()
    print(f"✅ Created {len(created_users)} dummy users")
    return created_users


def create_dummy_votes(users):
    """Create dummy votes from users on articles"""
    print("\n🗳️  Creating dummy votes...")
    
    articles = Article.query.all()
    if not articles:
        print("  ❌ No articles found! Please load articles first.")
        return 0
    
    total_votes = 0
    
    # Bias tendencies for different source patterns (to make data more realistic)
    # Some sources tend to be voted more biased, others less
    source_bias_tendency = {}
    for article in articles:
        if article.source_name not in source_bias_tendency:
            # Random tendency: 0.2 = mostly not biased, 0.8 = mostly biased
            source_bias_tendency[article.source_name] = random.uniform(0.25, 0.75)
    
    for user in users:
        # Determine how many votes this user will cast
        num_votes = random.randint(*VOTES_PER_USER_RANGE)
        
        # Select random articles for this user to vote on
        articles_to_vote = random.sample(articles, min(num_votes, len(articles)))
        
        for article in articles_to_vote:
            # Check if vote already exists
            existing_vote = Vote.query.filter_by(user_id=user.id, article_id=article.id).first()
            if existing_vote:
                continue
            
            # Determine vote based on source tendency (with some randomness)
            base_tendency = source_bias_tendency.get(article.source_name, 0.5)
            # Add user-specific variation
            user_variation = random.uniform(-0.2, 0.2)
            is_biased = random.random() < (base_tendency + user_variation)
            
            vote = Vote(
                user_id=user.id,
                article_id=article.id,
                is_biased=is_biased,
                created_at=random_date_within_days(45)
            )
            
            try:
                db.session.add(vote)
                total_votes += 1
            except Exception as e:
                db.session.rollback()
                continue
        
        # Commit every 500 votes
        if total_votes % 500 == 0:
            db.session.commit()
            print(f"  Created {total_votes} votes so far...")
    
    db.session.commit()
    print(f"✅ Created {total_votes} dummy votes")
    return total_votes


def create_dummy_bookmarks(users):
    """Create dummy bookmarks from users on articles"""
    print("\n🔖 Creating dummy bookmarks...")
    
    articles = Article.query.all()
    if not articles:
        print("  ❌ No articles found! Please load articles first.")
        return 0
    
    total_bookmarks = 0
    
    for user in users:
        # Determine how many bookmarks this user will have
        num_bookmarks = random.randint(*BOOKMARKS_PER_USER_RANGE)
        
        # Select random articles for this user to bookmark
        articles_to_bookmark = random.sample(articles, min(num_bookmarks, len(articles)))
        
        for article in articles_to_bookmark:
            # Check if bookmark already exists
            existing_bookmark = Bookmark.query.filter_by(user_id=user.id, article_id=article.id).first()
            if existing_bookmark:
                continue
            
            bookmark = Bookmark(
                user_id=user.id,
                article_id=article.id,
                created_at=random_date_within_days(45)
            )
            
            try:
                db.session.add(bookmark)
                total_bookmarks += 1
            except Exception as e:
                db.session.rollback()
                continue
        
        # Commit every 200 bookmarks
        if total_bookmarks % 200 == 0:
            db.session.commit()
            print(f"  Created {total_bookmarks} bookmarks so far...")
    
    db.session.commit()
    print(f"✅ Created {total_bookmarks} dummy bookmarks")
    return total_bookmarks


def add_votes_to_existing_users():
    """Add votes and bookmarks for existing users too"""
    print("\n📊 Adding activity for existing users...")
    
    existing_users = User.query.all()
    articles = Article.query.all()
    
    if not articles:
        return
    
    added_votes = 0
    added_bookmarks = 0
    
    for user in existing_users:
        # Check current vote count
        current_votes = Vote.query.filter_by(user_id=user.id).count()
        
        if current_votes < 5:  # Add more votes if user has few
            num_new_votes = random.randint(5, 20)
            articles_to_vote = random.sample(articles, min(num_new_votes, len(articles)))
            
            for article in articles_to_vote:
                if not Vote.query.filter_by(user_id=user.id, article_id=article.id).first():
                    vote = Vote(
                        user_id=user.id,
                        article_id=article.id,
                        is_biased=random.choice([True, False]),
                        created_at=random_date_within_days(30)
                    )
                    db.session.add(vote)
                    added_votes += 1
        
        # Check current bookmark count
        current_bookmarks = Bookmark.query.filter_by(user_id=user.id).count()
        
        if current_bookmarks < 3:  # Add more bookmarks if user has few
            num_new_bookmarks = random.randint(2, 8)
            articles_to_bookmark = random.sample(articles, min(num_new_bookmarks, len(articles)))
            
            for article in articles_to_bookmark:
                if not Bookmark.query.filter_by(user_id=user.id, article_id=article.id).first():
                    bookmark = Bookmark(
                        user_id=user.id,
                        article_id=article.id,
                        created_at=random_date_within_days(30)
                    )
                    db.session.add(bookmark)
                    added_bookmarks += 1
    
    db.session.commit()
    print(f"  Added {added_votes} votes and {added_bookmarks} bookmarks to existing users")


def print_summary():
    """Print database summary"""
    print("\n" + "=" * 60)
    print("📊 DATABASE SUMMARY")
    print("=" * 60)
    
    print(f"\n👥 Users: {User.query.count()}")
    print(f"📰 Articles: {Article.query.count()}")
    print(f"🗳️  Votes: {Vote.query.count()}")
    print(f"🔖 Bookmarks: {Bookmark.query.count()}")
    print(f"📎 Related Articles: {db.session.execute(db.text('SELECT COUNT(*) FROM related_articles')).scalar()}")
    
    # Vote breakdown
    biased_votes = Vote.query.filter_by(is_biased=True).count()
    total_votes = Vote.query.count()
    if total_votes > 0:
        print(f"\n📈 Vote Breakdown:")
        print(f"  Biased: {biased_votes} ({round(biased_votes/total_votes*100, 1)}%)")
        print(f"  Not Biased: {total_votes - biased_votes} ({round((total_votes-biased_votes)/total_votes*100, 1)}%)")
    
    # Top voted articles
    print("\n🏆 Top 5 Most Voted Articles:")
    from sqlalchemy import func
    top_articles = db.session.query(
        Article.headline,
        func.count(Vote.id).label('vote_count')
    ).join(Vote).group_by(Article.id).order_by(func.count(Vote.id).desc()).limit(5).all()
    
    for i, (headline, count) in enumerate(top_articles, 1):
        print(f"  {i}. {headline[:50]}... ({count} votes)")
    
    # Most active users
    print("\n🌟 Top 5 Most Active Users:")
    top_users = db.session.query(
        User.username,
        func.count(Vote.id).label('vote_count')
    ).join(Vote).group_by(User.id).order_by(func.count(Vote.id).desc()).limit(5).all()
    
    for i, (username, count) in enumerate(top_users, 1):
        print(f"  {i}. {username} ({count} votes)")
    
    print("\n" + "=" * 60)
    print("✅ Database is ready for demo!")
    print("=" * 60 + "\n")


def main():
    """Main function to populate dummy data"""
    print("\n" + "=" * 60)
    print("🚀 NETRA Dummy Data Population Script")
    print("=" * 60)
    
    # Check if articles exist
    article_count = Article.query.count()
    if article_count == 0:
        print("\n❌ No articles found in database!")
        print("Please run 'python load_data_updated.py' first to load articles.")
        return
    
    print(f"\n✅ Found {article_count} articles in database")
    
    # Create dummy users
    new_users = create_dummy_users()
    
    # Get all users (including any existing ones)
    all_users = User.query.all()
    
    # Create votes and bookmarks for new users
    if new_users:
        create_dummy_votes(new_users)
        create_dummy_bookmarks(new_users)
    
    # Add activity for existing users who might have few votes/bookmarks
    add_votes_to_existing_users()
    
    # Print summary
    print_summary()


if __name__ == '__main__':
    with app.app_context():
        main()