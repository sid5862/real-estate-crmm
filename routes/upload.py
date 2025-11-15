from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime

upload_bp = Blueprint('upload', __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    try:
        current_user_id = int(get_jwt_identity())
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Allowed types: PNG, JPG, JPEG, GIF, WEBP, SVG'}), 400
        
        # Check file size (max 10MB)
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            return jsonify({'error': 'File too large. Maximum size is 10MB'}), 400
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'images')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Save file
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)
        
        # Generate URL
        image_url = f"/uploads/images/{unique_filename}"
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'url': image_url,
            'filename': unique_filename
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/multiple', methods=['POST'])
@jwt_required()
def upload_multiple_images():
    try:
        current_user_id = int(get_jwt_identity())
        
        # Check if files are present
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        
        if not files or files[0].filename == '':
            return jsonify({'error': 'No files selected'}), 400
        
        uploaded_urls = []
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'images')
        os.makedirs(upload_dir, exist_ok=True)
        
        for file in files:
            # Check if file is allowed
            if not allowed_file(file.filename):
                continue  # Skip invalid files
            
            # Check file size (max 10MB)
            file.seek(0, 2)  # Seek to end
            file_size = file.tell()
            file.seek(0)  # Reset to beginning
            
            if file_size > 10 * 1024 * 1024:  # 10MB
                continue  # Skip large files
            
            # Generate unique filename
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # Save file
            file_path = os.path.join(upload_dir, unique_filename)
            file.save(file_path)
            
            # Generate URL
            image_url = f"/uploads/images/{unique_filename}"
            uploaded_urls.append(image_url)
        
        return jsonify({
            'message': f'{len(uploaded_urls)} images uploaded successfully',
            'urls': uploaded_urls
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_image():
    try:
        current_user_id = int(get_jwt_identity())
        
        data = request.get_json()
        image_url = data.get('url')
        
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400
        
        # Extract filename from URL
        filename = image_url.split('/')[-1]
        
        # Security check - ensure it's in the uploads directory
        if not filename or '..' in filename:
            return jsonify({'error': 'Invalid filename'}), 400
        
        # Delete file
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'images')
        file_path = os.path.join(upload_dir, filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'message': 'Image deleted successfully'}), 200
        else:
            return jsonify({'error': 'File not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
