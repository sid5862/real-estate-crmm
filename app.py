from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost/real_estate_crm')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Email configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() in ['true', '1', 'yes']
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@realestatecrm.com')

# Initialize database
from database import db
db.init_app(app)

# Initialize extensions
migrate = Migrate(app, db)
jwt = JWTManager(app)
mail = Mail(app)
# Get allowed origins from environment or use defaults
allowed_origins_env = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000')
allowed_origins_list = allowed_origins_env.split(',') if allowed_origins_env else ['http://localhost:3000']
# Ensure localhost is included
if 'http://localhost:3000' not in allowed_origins_list:
    allowed_origins_list.append('http://localhost:3000')

# Function to check if origin is allowed (supports Vercel domains)
def is_origin_allowed(origin):
    if not origin:
        return False
    # Check exact match
    if origin in allowed_origins_list:
        return True
    # Check if it's a Vercel domain
    if origin.endswith('.vercel.app'):
        return True
    return False

# CORS configuration - uses function to allow Vercel domains dynamically
CORS(app, 
     supports_credentials=True,
     origins=is_origin_allowed,
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])

# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"Token expired: {jwt_payload}")  # Debug log
    return jsonify({'error': 'Token has expired'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f"Invalid token: {error}")  # Debug log
    return jsonify({'error': 'Invalid token'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print(f"Missing token: {error}")  # Debug log
    return jsonify({'error': 'Authorization token is required'}), 401

# Import models
from models import User, Property, Lead, PostSale, Report, Communication, Payment, SupportTicket, Notification

# Import routes
from routes.auth import auth_bp
from routes.properties import properties_bp
from routes.leads import leads_bp
from routes.employees import employees_bp
from routes.post_sales import post_sales_bp
from routes.reports import reports_bp
from routes.dashboard import dashboard_bp
from routes.activities import activities_bp
from routes.upload import upload_bp
from routes.favorites import favorites_bp
from routes.shortcodes import shortcodes_bp
from routes.notifications import notifications_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(properties_bp, url_prefix='/api/properties')
app.register_blueprint(leads_bp, url_prefix='/api/leads')
app.register_blueprint(employees_bp, url_prefix='/api/employees')
app.register_blueprint(post_sales_bp, url_prefix='/api/post-sales')
app.register_blueprint(reports_bp, url_prefix='/api/reports')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(activities_bp, url_prefix='/api')
app.register_blueprint(upload_bp, url_prefix='/api/upload')
app.register_blueprint(favorites_bp, url_prefix='/api')
app.register_blueprint(shortcodes_bp, url_prefix='/api')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')

@app.before_request
def handle_request():
    # Handle CORS preflight requests (Flask-CORS handles this, but we add explicit handling for Vercel)
    if request.method == "OPTIONS":
        response = make_response()
        origin = request.headers.get('Origin', '')
        if is_origin_allowed(origin):
            response.headers.add("Access-Control-Allow-Origin", origin)
        else:
            response.headers.add("Access-Control-Allow-Origin", allowed_origins_list[0])
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    # Log request info for debugging
    print(f"Request: {request.method} {request.url}")
    print(f"Headers: {dict(request.headers)}")
    if request.headers.get('Authorization'):
        print(f"Auth token: {request.headers.get('Authorization')[:20]}...")

@app.route('/')
def index():
    return jsonify({
        'message': 'Real Estate CRM API',
        'version': '1.0.0',
        'status': 'running'
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    })

# Serve uploaded images
@app.route('/uploads/images/<filename>')
def uploaded_file(filename):
    from flask import send_from_directory
    upload_dir = os.path.join(app.root_path, 'uploads', 'images')
    return send_from_directory(upload_dir, filename)

if __name__ == '__main__':
    try:
        with app.app_context():
            # Create tablesimage.png
            db.create_all()
            
            # Create default admin user if not exists
            admin_user = User.query.filter_by(email='admin@realestate.com').first()
            if not admin_user:
                admin_user = User(
                    email='admin@realestate.com',
                    password_hash=generate_password_hash('admin123'),
                    first_name='Admin',
                    last_name='User',
                    role='admin',
                    is_active=True
                )
                db.session.add(admin_user)
                db.session.commit()
                print("Default admin user created: admin@realestate.com / admin123")
    except Exception as e:
        print(f"Database initialization failed: {e}")
        print("Starting server without database initialization...")
    
    # Use PORT from environment (Railway/Render) or default to 5000
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
