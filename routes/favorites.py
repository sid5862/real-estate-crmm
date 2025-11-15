from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Favorite, Property, User, db
from utils.activity_logger import log_activity

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    """Get all favorites for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '', type=str)
        property_type = request.args.get('type', '', type=str)
        sort_by = request.args.get('sort_by', 'created_at', type=str)
        
        # Build query
        query = Favorite.query.filter_by(user_id=current_user_id)
        
        # Join with Property for filtering and searching
        query = query.join(Property)
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Property.title.ilike(search_term)) |
                (Property.location.ilike(search_term)) |
                (Property.description.ilike(search_term))
            )
        
        # Apply property type filter
        if property_type and property_type != 'all':
            query = query.filter(Property.property_type.ilike(f"%{property_type}%"))
        
        # Apply sorting
        if sort_by == 'price_asc':
            query = query.order_by(Property.price.asc())
        elif sort_by == 'price_desc':
            query = query.order_by(Property.price.desc())
        elif sort_by == 'area':
            query = query.order_by(Property.area.desc())
        elif sort_by == 'created_at':
            query = query.order_by(Favorite.created_at.desc())
        else:
            query = query.order_by(Favorite.created_at.desc())
        
        # Paginate results
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        favorites = []
        for favorite in pagination.items:
            favorite_data = favorite.to_dict()
            favorites.append(favorite_data)
        
        return jsonify({
            'favorites': favorites,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        print(f"Error fetching favorites: {str(e)}")
        return jsonify({'error': 'Failed to fetch favorites'}), 500

@favorites_bp.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    """Add a property to favorites"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'property_id' not in data:
            return jsonify({'error': 'Property ID is required'}), 400
        
        property_id = data['property_id']
        
        # Check if property exists
        property_obj = Property.query.get(property_id)
        if not property_obj:
            return jsonify({'error': 'Property not found'}), 404
        
        # Check if already favorited
        existing_favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            property_id=property_id
        ).first()
        
        if existing_favorite:
            return jsonify({'error': 'Property already in favorites'}), 400
        
        # Create new favorite
        favorite = Favorite(
            user_id=current_user_id,
            property_id=property_id
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            activity_type='property_favorited',
            description=f'Added property "{property_obj.title}" to favorites',
            entity_type='property',
            entity_id=property_id,
            metadata={'property_title': property_obj.title}
        )
        
        return jsonify({
            'message': 'Property added to favorites',
            'favorite': favorite.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error adding favorite: {str(e)}")
        return jsonify({'error': 'Failed to add favorite'}), 500

@favorites_bp.route('/favorites/<int:property_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(property_id):
    """Remove a property from favorites"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find the favorite
        favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            property_id=property_id
        ).first()
        
        if not favorite:
            return jsonify({'error': 'Favorite not found'}), 404
        
        # Get property info for logging
        property_obj = Property.query.get(property_id)
        property_title = property_obj.title if property_obj else f"Property {property_id}"
        
        # Delete the favorite
        db.session.delete(favorite)
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            activity_type='property_unfavorited',
            description=f'Removed property "{property_title}" from favorites',
            entity_type='property',
            entity_id=property_id,
            metadata={'property_title': property_title}
        )
        
        return jsonify({'message': 'Property removed from favorites'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error removing favorite: {str(e)}")
        return jsonify({'error': 'Failed to remove favorite'}), 500

@favorites_bp.route('/favorites/check/<int:property_id>', methods=['GET'])
@jwt_required()
def check_favorite(property_id):
    """Check if a property is favorited by the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            property_id=property_id
        ).first()
        
        return jsonify({
            'is_favorited': favorite is not None,
            'favorite_id': favorite.id if favorite else None
        }), 200
        
    except Exception as e:
        print(f"Error checking favorite: {str(e)}")
        return jsonify({'error': 'Failed to check favorite status'}), 500

@favorites_bp.route('/favorites/toggle/<int:property_id>', methods=['POST'])
@jwt_required()
def toggle_favorite(property_id):
    """Toggle favorite status for a property"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if property exists
        property_obj = Property.query.get(property_id)
        if not property_obj:
            return jsonify({'error': 'Property not found'}), 404
        
        # Check if already favorited
        favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            property_id=property_id
        ).first()
        
        if favorite:
            # Remove from favorites
            db.session.delete(favorite)
            db.session.commit()
            
            # Log activity
            log_activity(
                user_id=current_user_id,
                activity_type='property_unfavorited',
                description=f'Removed property "{property_obj.title}" from favorites',
                entity_type='property',
                entity_id=property_id,
                metadata={'property_title': property_obj.title}
            )
            
            return jsonify({
                'message': 'Property removed from favorites',
                'is_favorited': False
            }), 200
        else:
            # Add to favorites
            favorite = Favorite(
                user_id=current_user_id,
                property_id=property_id
            )
            
            db.session.add(favorite)
            db.session.commit()
            
            # Log activity
            log_activity(
                user_id=current_user_id,
                activity_type='property_favorited',
                description=f'Added property "{property_obj.title}" to favorites',
                entity_type='property',
                entity_id=property_id,
                metadata={'property_title': property_obj.title}
            )
            
            return jsonify({
                'message': 'Property added to favorites',
                'is_favorited': True,
                'favorite': favorite.to_dict()
            }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error toggling favorite: {str(e)}")
        return jsonify({'error': 'Failed to toggle favorite'}), 500
