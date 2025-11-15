#!/usr/bin/env python3
"""
Real Estate CRM Setup Script
This script helps set up the Real Estate CRM system
"""

import os
import sys
import subprocess
import mysql.connector
from mysql.connector import Error

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_python_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Python dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies")
        sys.exit(1)

def check_mysql_connection():
    """Check MySQL connection and create database"""
    print("🔍 Checking MySQL connection...")
    
    try:
        # Try to connect to MySQL server
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=''  # Default XAMPP MySQL password
        )
        
        if connection.is_connected():
            print("✅ MySQL connection successful")
            
            # Create database if it doesn't exist
            cursor = connection.cursor()
            cursor.execute("CREATE DATABASE IF NOT EXISTS real_estate_crm")
            print("✅ Database 'real_estate_crm' created/verified")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"❌ MySQL connection failed: {e}")
        print("Please ensure:")
        print("1. XAMPP is running")
        print("2. MySQL service is started")
        print("3. MySQL root user has no password (default XAMPP setup)")
        sys.exit(1)

def create_env_file():
    """Create .env file from template"""
    if not os.path.exists('.env'):
        print("📝 Creating .env file...")
        with open('env.example', 'r') as template:
            content = template.read()
        
        with open('.env', 'w') as env_file:
            env_file.write(content)
        
        print("✅ .env file created")
        print("⚠️  Please review and update .env file with your settings")
    else:
        print("✅ .env file already exists")

def install_node_dependencies():
    """Install Node.js dependencies"""
    print("📦 Installing Node.js dependencies...")
    try:
        subprocess.check_call(["npm", "install"])
        print("✅ Node.js dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Node.js dependencies")
        print("Please ensure Node.js is installed and npm is available")
        sys.exit(1)

def main():
    """Main setup function"""
    print("🏠 Real Estate CRM Setup")
    print("=" * 40)
    
    # Check Python version
    check_python_version()
    
    # Install Python dependencies
    install_python_dependencies()
    
    # Check MySQL connection and create database
    check_mysql_connection()
    
    # Create .env file
    create_env_file()
    
    # Install Node.js dependencies
    install_node_dependencies()
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Review and update .env file if needed")
    print("2. Start the backend server: python app.py")
    print("3. Start the frontend server: npm start")
    print("4. Open http://localhost:3000 in your browser")
    print("\nDefault admin credentials:")
    print("Email: admin@realestate.com")
    print("Password: admin123")

if __name__ == "__main__":
    main()
