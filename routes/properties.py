from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Property, User, Notification
from datetime import datetime
from decimal import Decimal
import json
from utils.activity_logger import log_activity

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('/', methods=['GET'])
@jwt_required()
def get_properties():
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search')
        property_type = request.args.get('type')
        location = request.args.get('location')
        status = request.args.get('status')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        price_range = request.args.get('price_range')
        date_range = request.args.get('date_range')
        bedrooms = request.args.get('bedrooms')
        
        # Build query
        query = Property.query
        
        # Search filter
        if search:
            query = query.filter(
                (Property.title.ilike(f'%{search}%')) |
                (Property.location.ilike(f'%{search}%')) |
                (Property.description.ilike(f'%{search}%'))
            )
        
        # Property type filter
        if property_type:
            query = query.filter(Property.property_type == property_type)
        
        # Location filter
        if location:
            query = query.filter(Property.location.ilike(f'%{location}%'))
        
        # Status filter
        if status:
            query = query.filter(Property.status == status)
        
        # Price range filter
        if price_range:
            if price_range == '0-500000':
                query = query.filter(Property.price >= 0, Property.price <= 500000)
            elif price_range == '500000-1000000':
                query = query.filter(Property.price >= 500000, Property.price <= 1000000)
            elif price_range == '1000000-2500000':
                query = query.filter(Property.price >= 1000000, Property.price <= 2500000)
            elif price_range == '2500000-5000000':
                query = query.filter(Property.price >= 2500000, Property.price <= 5000000)
            elif price_range == '5000000+':
                query = query.filter(Property.price >= 5000000)
        
        # Min/Max price filters (for custom ranges)
        if min_price:
            query = query.filter(Property.price >= min_price)
        if max_price:
            query = query.filter(Property.price <= max_price)
        
        # Bedrooms filter
        if bedrooms:
            query = query.filter(Property.bedrooms == bedrooms)
        
        # Date range filter
        if date_range:
            from datetime import datetime, timedelta
            now = datetime.utcnow()
            
            if date_range == 'today':
                start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Property.created_at >= start_date)
            elif date_range == 'yesterday':
                yesterday = now - timedelta(days=1)
                start_date = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
                end_date = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)
                query = query.filter(Property.created_at >= start_date, Property.created_at <= end_date)
            elif date_range == 'this_week':
                start_date = now - timedelta(days=now.weekday())
                start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Property.created_at >= start_date)
            elif date_range == 'last_week':
                end_date = now - timedelta(days=now.weekday())
                start_date = end_date - timedelta(days=7)
                query = query.filter(Property.created_at >= start_date, Property.created_at < end_date)
            elif date_range == 'this_month':
                start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Property.created_at >= start_date)
            elif date_range == 'last_month':
                if now.month == 1:
                    start_date = now.replace(year=now.year-1, month=12, day=1, hour=0, minute=0, second=0, microsecond=0)
                else:
                    start_date = now.replace(month=now.month-1, day=1, hour=0, minute=0, second=0, microsecond=0)
                end_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Property.created_at >= start_date, Property.created_at < end_date)
            elif date_range == 'this_year':
                start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Property.created_at >= start_date)
        
        # Paginate results
        properties = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'properties': [property.to_dict() for property in properties.items],
            'total': properties.total,
            'pages': properties.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property(property_id):
    try:
        property = Property.query.get(property_id)
        
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        
        return jsonify({
            'property': property.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/', methods=['POST'])
@jwt_required()
def create_property():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin, manager, and sales_agent can create properties
        if current_user.role not in ['admin', 'manager', 'sales_agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'property_type', 'location', 'price']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new property
        property = Property(
            title=data['title'],
            description=data.get('description'),
            property_type=data['property_type'],
            location=data['location'],
            address=data.get('address'),
            price=Decimal(str(data['price'])),
            area=Decimal(str(data['area'])) if data.get('area') else None,
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            floors=data.get('floors'),
            direction=data.get('direction'),
            status=data.get('status', 'available'),
            images=data.get('images', []),
            floor_plans=data.get('floor_plans', []),
            amenities=data.get('amenities', []),
            assigned_agent_id=data.get('assigned_agent_id'),
            is_website_visible=data.get('is_website_visible', True)
        )
        
        db.session.add(property)
        db.session.commit()
        
        # Log the property creation activity
        log_activity(
            user_id=current_user_id,
            activity_type='property_added',
            description=f'Added new property: {property.title} in {property.location}',
            entity_type='property',
            entity_id=property.id,
            metadata={
                'property_title': property.title,
                'property_type': property.property_type,
                'location': property.location,
                'price': float(property.price)
            }
        )
        
        # Create notifications for new property
        # Get all admins and managers to notify them about new property
        admins_and_managers = User.query.filter(
            User.role.in_(['admin', 'manager'])
        ).all()
        
        for admin_manager in admins_and_managers:
            notification = Notification(
                user_id=admin_manager.id,
                title='New Property Added',
                message=f'New property listed: {property.title} in {property.location} (₹{property.price:,.0f})',
                type='property',
                entity_type='property',
                entity_id=property.id
            )
            db.session.add(notification)
        
        # Commit notifications
        db.session.commit()
        
        return jsonify({
            'message': 'Property created successfully',
            'property': property.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/<int:property_id>', methods=['PUT'])
@jwt_required()
def update_property(property_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin, manager, and sales_agent can update properties
        if current_user.role not in ['admin', 'manager', 'sales_agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        property = Property.query.get(property_id)
        
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        
        data = request.get_json()
        
        # Track changes for notifications
        old_status = property.status
        old_price = property.price
        changes_made = []
        
        # Update fields
        if 'title' in data:
            property.title = data['title']
        if 'description' in data:
            property.description = data['description']
        if 'property_type' in data:
            property.property_type = data['property_type']
        if 'location' in data:
            property.location = data['location']
        if 'address' in data:
            property.address = data['address']
        if 'price' in data:
            property.price = Decimal(str(data['price']))
        if 'area' in data:
            property.area = Decimal(str(data['area'])) if data['area'] else None
        if 'bedrooms' in data:
            property.bedrooms = data['bedrooms']
        if 'bathrooms' in data:
            property.bathrooms = data['bathrooms']
        if 'floors' in data:
            property.floors = data['floors']
        if 'direction' in data:
            property.direction = data['direction']
        if 'status' in data:
            property.status = data['status']
        if 'images' in data:
            property.images = data['images']
        if 'floor_plans' in data:
            property.floor_plans = data['floor_plans']
        if 'amenities' in data:
            property.amenities = data['amenities']
        if 'assigned_agent_id' in data:
            property.assigned_agent_id = data['assigned_agent_id']
        if 'is_website_visible' in data:
            property.is_website_visible = data['is_website_visible']
        
        property.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Create notifications for important property changes
        # Get all admins and managers
        admins_and_managers = User.query.filter(
            User.role.in_(['admin', 'manager'])
        ).all()
        
        # Check for status change
        if old_status != property.status:
            for admin_manager in admins_and_managers:
                notification = Notification(
                    user_id=admin_manager.id,
                    title='Property Status Changed',
                    message=f'Property "{property.title}" status changed from {old_status} to {property.status}',
                    type='property',
                    entity_type='property',
                    entity_id=property.id
                )
                db.session.add(notification)
        
        # Check for price change
        if old_price != property.price:
            for admin_manager in admins_and_managers:
                notification = Notification(
                    user_id=admin_manager.id,
                    title='Property Price Updated',
                    message=f'Property "{property.title}" price updated from ₹{old_price:,.0f} to ₹{property.price:,.0f}',
                    type='property',
                    entity_type='property',
                    entity_id=property.id
                )
                db.session.add(notification)
        
        # Check for other important changes (title, location, etc.)
        important_fields = ['title', 'location', 'property_type']
        for field in important_fields:
            if field in data:
                changes_made.append(field)
        
        if changes_made:
            for admin_manager in admins_and_managers:
                notification = Notification(
                    user_id=admin_manager.id,
                    title='Property Details Updated',
                    message=f'Property "{property.title}" details updated by {current_user.first_name} {current_user.last_name}',
                    type='property',
                    entity_type='property',
                    entity_id=property.id
                )
                db.session.add(notification)
        
        # Commit notifications
        db.session.commit()
        
        return jsonify({
            'message': 'Property updated successfully',
            'property': property.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/<int:property_id>', methods=['DELETE'])
@jwt_required()
def delete_property(property_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin can delete properties
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        property = Property.query.get(property_id)
        
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        
        # Store property info before deletion for activity logging
        property_title = property.title
        property_type = property.property_type
        property_location = property.location
        property_price = property.price
        
        db.session.delete(property)
        db.session.commit()
        
        # Log property deletion activity
        log_activity(
            user_id=current_user_id,
            activity_type='property_deleted',
            description=f'Deleted property {property_title} ({property_type})',
            entity_type='property',
            entity_id=property_id,
            metadata={
                'property_title': property_title,
                'property_type': property_type,
                'property_location': property_location,
                'property_price': str(property_price) if property_price else None,
                'deleted_by': f"{current_user.first_name} {current_user.last_name}"
            }
        )
        
        return jsonify({
            'message': 'Property deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/types', methods=['GET'])
@jwt_required()
def get_property_types():
    try:
        # Get distinct property types
        types = db.session.query(Property.property_type).distinct().all()
        
        return jsonify({
            'property_types': [type[0] for type in types if type[0]]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/locations', methods=['GET'])
@jwt_required()
def get_locations():
    try:
        # Get distinct locations
        locations = db.session.query(Property.location).distinct().all()
        
        return jsonify({
            'locations': [location[0] for location in locations if location[0]]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/website-visible', methods=['GET'])
def get_website_visible_properties():
    try:
        # This endpoint doesn't require authentication as it's for website integration
        properties = Property.query.filter_by(is_website_visible=True, status='available').all()
        
        return jsonify({
            'properties': [property.to_dict() for property in properties]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/bulk-upload', methods=['POST'])
@jwt_required()
def bulk_upload_properties():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin and manager can bulk upload
        if current_user.role not in ['admin', 'manager']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        if not data.get('properties'):
            return jsonify({'error': 'Properties data is required'}), 400
        
        created_properties = []
        errors = []
        
        for i, property_data in enumerate(data['properties']):
            try:
                # Validate required fields
                required_fields = ['title', 'property_type', 'location', 'price']
                for field in required_fields:
                    if not property_data.get(field):
                        errors.append(f'Row {i+1}: {field} is required')
                        continue
                
                # Create property
                property = Property(
                    title=property_data['title'],
                    description=property_data.get('description'),
                    property_type=property_data['property_type'],
                    location=property_data['location'],
                    address=property_data.get('address'),
                    price=Decimal(str(property_data['price'])),
                    area=Decimal(str(property_data['area'])) if property_data.get('area') else None,
                    bedrooms=property_data.get('bedrooms'),
                    bathrooms=property_data.get('bathrooms'),
                    floors=property_data.get('floors'),
                    direction=property_data.get('direction'),
                    status=property_data.get('status', 'available'),
                    assigned_agent_id=property_data.get('assigned_agent_id'),
                    is_website_visible=property_data.get('is_website_visible', True)
                )
                
                db.session.add(property)
                created_properties.append(property)
                
            except Exception as e:
                errors.append(f'Row {i+1}: {str(e)}')
        
        if errors:
            db.session.rollback()
            return jsonify({
                'error': 'Bulk upload failed',
                'errors': errors
            }), 400
        
        db.session.commit()
        
        return jsonify({
            'message': f'{len(created_properties)} properties created successfully',
            'properties': [property.to_dict() for property in created_properties]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
