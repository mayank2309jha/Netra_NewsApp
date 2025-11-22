#!/usr/bin/env python3
"""
API Testing Script for NETRA News Platform
This script tests all API endpoints to ensure they're working correctly.
"""

import requests
import json
from colorama import init, Fore, Style

# Initialize colorama
init()

# Configuration
BASE_URL = "http://localhost:5000/api"
TEST_USER = {
    "username": "test_user_" + str(hash("test") % 10000),
    "email": f"test{hash('test') % 10000}@example.com",
    "password": "TestPassword123!"
}

class APITester:
    def __init__(self):
        self.access_token = None
        self.test_article_id = None
        self.passed = 0
        self.failed = 0
    
    def print_success(self, message):
        print(f"{Fore.GREEN}✓ {message}{Style.RESET_ALL}")
        self.passed += 1
    
    def print_error(self, message):
        print(f"{Fore.RED}✗ {message}{Style.RESET_ALL}")
        self.failed += 1
    
    def print_info(self, message):
        print(f"{Fore.CYAN}ℹ {message}{Style.RESET_ALL}")
    
    def print_section(self, title):
        print(f"\n{Fore.YELLOW}{'='*60}")
        print(f"{title}")
        print(f"{'='*60}{Style.RESET_ALL}\n")
    
    def test_health_check(self):
        """Test health check endpoint"""
        self.print_section("Testing Health Check")
        try:
            response = requests.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                self.print_success("Health check passed")
                return True
            else:
                self.print_error(f"Health check failed: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Health check error: {str(e)}")
            return False
    
    def test_registration(self):
        """Test user registration"""
        self.print_section("Testing User Registration")
        try:
            response = requests.post(
                f"{BASE_URL}/auth/register",
                json=TEST_USER
            )
            
            if response.status_code == 201:
                data = response.json()
                self.access_token = data.get('access_token')
                self.print_success(f"User registered: {TEST_USER['username']}")
                self.print_info(f"Token obtained: {self.access_token[:20]}...")
                return True
            else:
                self.print_error(f"Registration failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Registration error: {str(e)}")
            return False
    
    def test_login(self):
        """Test user login"""
        self.print_section("Testing User Login")
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json={
                    "username": TEST_USER['username'],
                    "password": TEST_USER['password']
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                self.access_token = data.get('access_token')
                self.print_success("Login successful")
                return True
            else:
                self.print_error(f"Login failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Login error: {str(e)}")
            return False
    
    def test_get_current_user(self):
        """Test getting current user"""
        self.print_section("Testing Get Current User")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                user = response.json()['user']
                self.print_success(f"Retrieved user: {user['username']}")
                return True
            else:
                self.print_error(f"Get user failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Get user error: {str(e)}")
            return False
    
    def test_get_articles(self):
        """Test getting articles list"""
        self.print_section("Testing Get Articles")
        try:
            response = requests.get(
                f"{BASE_URL}/articles",
                params={"page": 1, "per_page": 5}
            )
            
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                pagination = data.get('pagination', {})
                
                self.print_success(f"Retrieved {len(articles)} articles")
                self.print_info(f"Total articles: {pagination.get('total_items', 0)}")
                
                if articles:
                    self.test_article_id = articles[0]['id']
                    self.print_info(f"Test article ID: {self.test_article_id}")
                
                return True
            else:
                self.print_error(f"Get articles failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Get articles error: {str(e)}")
            return False
    
    def test_get_article_details(self):
        """Test getting single article"""
        self.print_section("Testing Get Article Details")
        
        if not self.test_article_id:
            self.print_error("No test article ID available")
            return False
        
        try:
            response = requests.get(f"{BASE_URL}/articles/{self.test_article_id}")
            
            if response.status_code == 200:
                article = response.json()['article']
                self.print_success(f"Retrieved article: {article['headline'][:50]}...")
                self.print_info(f"Vote stats: {article['vote_stats']}")
                return True
            else:
                self.print_error(f"Get article failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Get article error: {str(e)}")
            return False
    
    def test_get_categories(self):
        """Test getting categories"""
        self.print_section("Testing Get Categories")
        try:
            response = requests.get(f"{BASE_URL}/categories")
            
            if response.status_code == 200:
                categories = response.json()['categories']
                self.print_success(f"Retrieved {len(categories)} categories")
                for cat in categories:
                    self.print_info(f"  {cat['name']}: {cat['count']} articles")
                return True
            else:
                self.print_error(f"Get categories failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Get categories error: {str(e)}")
            return False
    
    def test_vote_article(self):
        """Test voting on an article"""
        self.print_section("Testing Article Voting")
        
        if not self.test_article_id:
            self.print_error("No test article ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Vote as biased
            response = requests.post(
                f"{BASE_URL}/articles/{self.test_article_id}/vote",
                headers=headers,
                json={"is_biased": True}
            )
            
            if response.status_code == 200:
                self.print_success("Voted article as biased")
                self.print_info(f"Vote stats: {response.json()['vote_stats']}")
                
                # Change vote to not biased
                response = requests.post(
                    f"{BASE_URL}/articles/{self.test_article_id}/vote",
                    headers=headers,
                    json={"is_biased": False}
                )
                
                if response.status_code == 200:
                    self.print_success("Changed vote to not biased")
                    return True
            
            self.print_error(f"Voting failed: {response.json()}")
            return False
        except Exception as e:
            self.print_error(f"Voting error: {str(e)}")
            return False
    
    def test_bookmarks(self):
        """Test bookmark functionality"""
        self.print_section("Testing Bookmarks")
        
        if not self.test_article_id:
            self.print_error("No test article ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Add bookmark
            response = requests.post(
                f"{BASE_URL}/articles/{self.test_article_id}/bookmark",
                headers=headers
            )
            
            if response.status_code in [200, 201]:
                self.print_success("Article bookmarked")
                
                # Get bookmarks
                response = requests.get(f"{BASE_URL}/bookmarks", headers=headers)
                if response.status_code == 200:
                    bookmarks = response.json()['articles']
                    self.print_success(f"Retrieved {len(bookmarks)} bookmarks")
                    
                    # Remove bookmark
                    response = requests.delete(
                        f"{BASE_URL}/articles/{self.test_article_id}/bookmark",
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        self.print_success("Bookmark removed")
                        return True
            
            self.print_error(f"Bookmark test failed: {response.json()}")
            return False
        except Exception as e:
            self.print_error(f"Bookmark error: {str(e)}")
            return False
    
    def test_user_activity(self):
        """Test user activity endpoint"""
        self.print_section("Testing User Activity")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(f"{BASE_URL}/user/activity", headers=headers)
            
            if response.status_code == 200:
                activity = response.json()
                self.print_success("Retrieved user activity")
                self.print_info(f"Total votes: {activity['total_votes']}")
                self.print_info(f"Bookmarks: {activity['bookmark_count']}")
                return True
            else:
                self.print_error(f"Get activity failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Get activity error: {str(e)}")
            return False
    
    def test_statistics(self):
        """Test platform statistics"""
        self.print_section("Testing Platform Statistics")
        try:
            response = requests.get(f"{BASE_URL}/stats/overview")
            
            if response.status_code == 200:
                stats = response.json()
                self.print_success("Retrieved platform statistics")
                self.print_info(f"Total articles: {stats['total_articles']}")
                self.print_info(f"Total votes: {stats['total_votes']}")
                self.print_info(f"Total users: {stats['total_users']}")
                return True
            else:
                self.print_error(f"Get stats failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Get stats error: {str(e)}")
            return False
    
    def test_search(self):
        """Test article search"""
        self.print_section("Testing Article Search")
        try:
            response = requests.get(
                f"{BASE_URL}/articles",
                params={"search": "india", "per_page": 3}
            )
            
            if response.status_code == 200:
                articles = response.json()['articles']
                self.print_success(f"Search returned {len(articles)} results")
                return True
            else:
                self.print_error(f"Search failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Search error: {str(e)}")
            return False
    
    def test_filtering(self):
        """Test article filtering by category"""
        self.print_section("Testing Article Filtering")
        try:
            response = requests.get(
                f"{BASE_URL}/articles",
                params={"category": "india", "per_page": 3}
            )
            
            if response.status_code == 200:
                articles = response.json()['articles']
                self.print_success(f"Filter returned {len(articles)} articles")
                
                # Verify all articles are from correct category
                all_correct = all(a['category'] == 'india' for a in articles)
                if all_correct:
                    self.print_success("All articles match category filter")
                    return True
                else:
                    self.print_error("Some articles don't match filter")
                    return False
            else:
                self.print_error(f"Filter failed: {response.json()}")
                return False
        except Exception as e:
            self.print_error(f"Filter error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests"""
        print(f"{Fore.MAGENTA}")
        print("╔═══════════════════════════════════════════════════════════╗")
        print("║         NETRA News Platform - API Test Suite             ║")
        print("╚═══════════════════════════════════════════════════════════╝")
        print(Style.RESET_ALL)
        
        # Run tests
        tests = [
            self.test_health_check,
            self.test_get_categories,
            self.test_get_articles,
            self.test_registration,
            self.test_login,
            self.test_get_current_user,
            self.test_get_article_details,
            self.test_vote_article,
            self.test_bookmarks,
            self.test_user_activity,
            self.test_statistics,
            self.test_search,
            self.test_filtering,
        ]
        
        for test in tests:
            test()
        
        # Summary
        self.print_section("Test Summary")
        total = self.passed + self.failed
        pass_rate = (self.passed / total * 100) if total > 0 else 0
        
        print(f"Total tests: {total}")
        print(f"{Fore.GREEN}Passed: {self.passed}{Style.RESET_ALL}")
        print(f"{Fore.RED}Failed: {self.failed}{Style.RESET_ALL}")
        print(f"Pass rate: {pass_rate:.1f}%")
        
        if self.failed == 0:
            print(f"\n{Fore.GREEN}{'='*60}")
            print("All tests passed! ✓")
            print(f"{'='*60}{Style.RESET_ALL}")
        else:
            print(f"\n{Fore.RED}{'='*60}")
            print(f"Some tests failed. Please check the output above.")
            print(f"{'='*60}{Style.RESET_ALL}")

if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests()
