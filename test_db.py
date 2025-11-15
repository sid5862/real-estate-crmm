#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from database import db
from models import User

def test_database():
    try:
        with app.app_context():
            # Test database connection
            print("Testing database connection...")
            
            # Try to query users
            users = User.query.all()
            print(f"Found {len(users)} users in database")
            
            for user in users:
                print(f"User: {user.email} - {user.first_name} {user.last_name} - Role: {user.role}")
            
            # Check if admin user exists
            admin_user = User.query.filter_by(email='admin@realestate.com').first()
            if admin_user:
                print(f"Admin user found: {admin_user.email}")
                print(f"Admin user active: {admin_user.is_active}")
            else:
                print("No admin user found")
                
    except Exception as e:
        print(f"Database test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_database()
