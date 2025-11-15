#!/usr/bin/env python3
"""
Server Health Check Script
Checks if the Flask server and database are running properly
"""

import requests
import mysql.connector
import sys
import time

def check_database():
    """Check if MySQL database is accessible"""
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='real_estate_crm'
        )
        conn.close()
        print("✅ Database connection: OK")
        return True
    except Exception as e:
        print(f"❌ Database connection: FAILED - {e}")
        return False

def check_flask_server():
    """Check if Flask server is running"""
    try:
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        if response.status_code == 200:
            print("✅ Flask server: OK")
            return True
        else:
            print(f"❌ Flask server: FAILED - Status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Flask server: NOT RUNNING")
        return False
    except Exception as e:
        print(f"❌ Flask server: ERROR - {e}")
        return False

def main():
    print("🔍 Real Estate CRM Health Check")
    print("=" * 40)
    
    db_ok = check_database()
    server_ok = check_flask_server()
    
    print("=" * 40)
    
    if db_ok and server_ok:
        print("🎉 All systems are running properly!")
        print("You can now access the application at: http://localhost:3000")
        sys.exit(0)
    else:
        print("⚠️  Some issues detected:")
        if not db_ok:
            print("   - Start MySQL service")
        if not server_ok:
            print("   - Run: python app.py")
        sys.exit(1)

if __name__ == "__main__":
    main()
