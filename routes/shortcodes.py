from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, PropertyShortcode, Property, User
from utils.activity_logger import log_activity
import random
import string
from datetime import datetime

shortcodes_bp = Blueprint('shortcodes', __name__)

def generate_shortcode():
    """Generate a unique shortcode"""
    while True:
        # Generate 8-character alphanumeric code
        shortcode = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not PropertyShortcode.query.filter_by(shortcode=shortcode).first():
            return shortcode

@shortcodes_bp.route('/shortcodes', methods=['GET'])
@jwt_required()
def get_shortcodes():
    """Get all shortcodes created by the current user"""
    try:
        current_user_id = get_jwt_identity()
        shortcodes = PropertyShortcode.query.filter_by(created_by=current_user_id).order_by(PropertyShortcode.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'shortcodes': [shortcode.to_dict() for shortcode in shortcodes]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@shortcodes_bp.route('/shortcodes', methods=['POST'])
@jwt_required()
def create_shortcode():
    """Create a new property shortcode"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'success': False, 'error': 'Name is required'}), 400
        
        # Generate unique shortcode
        shortcode = generate_shortcode()
        
        # Create shortcode
        new_shortcode = PropertyShortcode(
            shortcode=shortcode,
            name=data['name'],
            description=data.get('description', ''),
            created_by=current_user_id,
            filters=data.get('filters', {}),
            display_options=data.get('display_options', {}),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(new_shortcode)
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            activity_type='shortcode_created',
            description=f'Created property shortcode: {data["name"]}',
            entity_type='shortcode',
            entity_id=new_shortcode.id
        )
        
        return jsonify({
            'success': True,
            'shortcode': new_shortcode.to_dict(),
            'message': 'Shortcode created successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@shortcodes_bp.route('/shortcodes/<int:shortcode_id>', methods=['PUT'])
@jwt_required()
def update_shortcode(shortcode_id):
    """Update an existing shortcode"""
    try:
        current_user_id = get_jwt_identity()
        shortcode = PropertyShortcode.query.filter_by(id=shortcode_id, created_by=current_user_id).first()
        
        if not shortcode:
            return jsonify({'success': False, 'error': 'Shortcode not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            shortcode.name = data['name']
        if 'description' in data:
            shortcode.description = data['description']
        if 'filters' in data:
            shortcode.filters = data['filters']
        if 'display_options' in data:
            shortcode.display_options = data['display_options']
        if 'is_active' in data:
            shortcode.is_active = data['is_active']
        
        shortcode.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            activity_type='shortcode_updated',
            description=f'Updated property shortcode: {shortcode.name}',
            entity_type='shortcode',
            entity_id=shortcode.id
        )
        
        return jsonify({
            'success': True,
            'shortcode': shortcode.to_dict(),
            'message': 'Shortcode updated successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@shortcodes_bp.route('/shortcodes/<int:shortcode_id>', methods=['DELETE'])
@jwt_required()
def delete_shortcode(shortcode_id):
    """Delete a shortcode"""
    try:
        current_user_id = get_jwt_identity()
        shortcode = PropertyShortcode.query.filter_by(id=shortcode_id, created_by=current_user_id).first()
        
        if not shortcode:
            return jsonify({'success': False, 'error': 'Shortcode not found'}), 404
        
        shortcode_name = shortcode.name
        db.session.delete(shortcode)
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            activity_type='shortcode_deleted',
            description=f'Deleted property shortcode: {shortcode_name}',
            entity_type='shortcode',
            entity_id=shortcode_id
        )
        
        return jsonify({
            'success': True,
            'message': 'Shortcode deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@shortcodes_bp.route('/embed/<shortcode>', methods=['GET'])
def get_embed_data(shortcode):
    """Public endpoint to get property data for embedding (no auth required)"""
    try:
        shortcode_obj = PropertyShortcode.query.filter_by(shortcode=shortcode, is_active=True).first()
        
        if not shortcode_obj:
            return jsonify({'success': False, 'error': 'Invalid or inactive shortcode'}), 404
        
        # Get filters
        filters = shortcode_obj.filters or {}
        
        # Build query
        query = Property.query
        
        # Apply filters
        if filters.get('status'):
            if filters['status'] == 'active':
                query = query.filter(Property.status == 'active')
            elif filters['status'] == 'inactive':
                query = query.filter(Property.status == 'inactive')
        
        if filters.get('property_type'):
            query = query.filter(Property.property_type == filters['property_type'])
        
        if filters.get('min_price'):
            query = query.filter(Property.price >= filters['min_price'])
        
        if filters.get('max_price'):
            query = query.filter(Property.price <= filters['max_price'])
        
        if filters.get('location'):
            query = query.filter(Property.location.ilike(f"%{filters['location']}%"))
        
        if filters.get('bedrooms'):
            query = query.filter(Property.bedrooms >= filters['bedrooms'])
        
        if filters.get('bathrooms'):
            query = query.filter(Property.bathrooms >= filters['bathrooms'])
        
        # Apply limit
        limit = filters.get('limit', 10)
        query = query.limit(limit)
        
        # Get properties
        properties = query.all()
        
        # Get display options
        display_options = shortcode_obj.display_options or {}
        
        return jsonify({
            'success': True,
            'shortcode': shortcode_obj.shortcode,
            'name': shortcode_obj.name,
            'properties': [property.to_dict() for property in properties],
            'display_options': display_options,
            'total_count': len(properties)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@shortcodes_bp.route('/embed/<shortcode>/lead', methods=['POST'])
def track_embed_lead(shortcode):
    """Track lead from embed widget contact actions"""
    try:
        shortcode_obj = PropertyShortcode.query.filter_by(shortcode=shortcode, is_active=True).first()
        
        if not shortcode_obj:
            return jsonify({'success': False, 'error': 'Invalid or inactive shortcode'}), 404
        
        data = request.get_json()
        
        # Get property details
        property_id = data.get('property_id')
        contact_type = data.get('contact_type')  # 'call', 'whatsapp', 'form'
        user_info = data.get('user_info', {})
        
        if not property_id:
            return jsonify({'success': False, 'error': 'Property ID is required'}), 400
        
        # Get property details
        property_obj = Property.query.get(property_id)
        if not property_obj:
            return jsonify({'success': False, 'error': 'Property not found'}), 404
        
        # Create lead record
        from models import Lead
        from datetime import datetime
        
        # Parse name into first and last name
        full_name = user_info.get('name', f'Lead from {property_obj.title}')
        name_parts = full_name.strip().split(' ', 1)
        first_name = name_parts[0] if name_parts else 'Lead'
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        lead_email = user_info.get('email', '')
        lead_phone = user_info.get('phone', '')
        lead_city = user_info.get('city', '')
        alternate_phone = user_info.get('alternate_phone', '')
        message = user_info.get('message', '')
        
        # Create comprehensive notes
        notes_parts = [
            f'Lead generated from embed widget via {contact_type}',
            f'Property: {property_obj.title}',
            f'Property Price: ₹{property_obj.price:,.0f}',
            f'Property Location: {property_obj.location}'
        ]
        
        if lead_city:
            notes_parts.append(f'Customer City: {lead_city}')
        if alternate_phone:
            notes_parts.append(f'Alternate Phone: {alternate_phone}')
        if message:
            notes_parts.append(f'Message: {message}')
        
        notes = ' | '.join(notes_parts)
        
        # Create lead
        new_lead = Lead(
            first_name=first_name,
            last_name=last_name,
            email=lead_email,
            phone=lead_phone,
            source='Website Embed',
            stage='new',
            lead_score='warm',  # Changed to string as per model
            notes=notes,
            property_id=property_id,
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_lead)
        db.session.commit()
        
        # Create notifications for embed widget leads
        from models import Notification, User
        admins_and_managers = User.query.filter(
            User.role.in_(['admin', 'manager'])
        ).all()
        
        for admin_manager in admins_and_managers:
            notification = Notification(
                user_id=admin_manager.id,
                title='New Website Lead',
                message=f'New lead from website embed: {first_name} {last_name} ({lead_email})',
                type='lead',
                entity_type='lead',
                entity_id=new_lead.id
            )
            db.session.add(notification)
        
        # Commit notifications
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=shortcode_obj.created_by,
            activity_type='lead_created',
            description=f'New lead created from embed widget: {first_name} {last_name}',
            entity_type='lead',
            entity_id=new_lead.id
        )
        
        return jsonify({
            'success': True,
            'lead_id': new_lead.id,
            'message': 'Lead tracked successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@shortcodes_bp.route('/embed/<shortcode>/widget', methods=['GET'])
def get_embed_widget(shortcode):
    """Serve the embeddable widget HTML"""
    try:
        shortcode_obj = PropertyShortcode.query.filter_by(shortcode=shortcode, is_active=True).first()
        
        if not shortcode_obj:
            return "<!-- Invalid or inactive shortcode -->", 404
        
        # Create widget HTML
        widget_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Property Listings</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/heroicons@2.0.18/24/outline/index.js" type="module"></script>
            <style>
                .property-card {{
                    transition: all 0.2s ease-in-out;
                }}
                .property-card:hover {{
                    transform: scale(1.02);
                    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }}
            </style>
        </head>
        <body class="bg-gray-50">
            <div id="property-widget" class="max-w-7xl mx-auto p-4">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Property Listings</h2>
                <div id="properties-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="col-span-full text-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p class="text-gray-600">Loading properties...</p>
                    </div>
                </div>
            </div>
            
            <script>
                // Format price function
                function formatPrice(price) {{
                    if (price >= 10000000) {{
                        return '₹' + (price / 10000000).toFixed(1) + ' Cr';
                    }} else if (price >= 100000) {{
                        return '₹' + (price / 100000).toFixed(1) + ' L';
                    }} else {{
                        return '₹' + price.toLocaleString();
                    }}
                }}
                
                // Get status badge HTML
                function getStatusBadge(status) {{
                    const statusColors = {{
                        'active': 'bg-green-100 text-green-800',
                        'inactive': 'bg-gray-100 text-gray-800',
                        'sold': 'bg-blue-100 text-blue-800',
                        'rented': 'bg-purple-100 text-purple-800'
                    }};
                    
                    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${{colorClass}}">${{status.charAt(0).toUpperCase() + status.slice(1)}}</span>`;
                }}
                
                // Load properties
                fetch('http://localhost:5000/api/embed/{shortcode}')
                    .then(response => response.json())
                    .then(data => {{
                        if (data.success) {{
                            const container = document.getElementById('properties-container');
                            container.innerHTML = '';
                            
                            if (data.properties.length === 0) {{
                                container.innerHTML = `
                                    <div class="col-span-full text-center py-12">
                                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <h3 class="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
                                        <p class="mt-1 text-sm text-gray-500">No properties match the current filters.</p>
                                    </div>
                                `;
                                return;
                            }}
                            
                            data.properties.forEach(property => {{
                                const propertyCard = createPropertyCard(property);
                                container.appendChild(propertyCard);
                            }});
                        }} else {{
                            document.getElementById('properties-container').innerHTML = 
                                '<div class="col-span-full text-center py-8"><p class="text-red-500">No properties found</p></div>';
                        }}
                    }})
                    .catch(error => {{
                        console.error('Error loading properties:', error);
                        document.getElementById('properties-container').innerHTML = 
                            '<div class="col-span-full text-center py-8"><p class="text-red-500">Error loading properties</p></div>';
                    }});
                
                function createPropertyCard(property) {{
                    const card = document.createElement('div');
                    card.className = 'property-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden';
                    
                    // Handle image with fallback
                    const imageHtml = property.images && property.images.length > 0 
                        ? `<img src="${{property.images[0].startsWith('http') ? property.images[0] : 'http://localhost:5000' + property.images[0]}}" 
                                 alt="${{property.title}}" 
                                 class="h-full w-full object-cover"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                           <svg class="h-16 w-16 text-gray-400" style="display:none;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                           </svg>`
                        : `<svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                           </svg>`;
                    
                    card.innerHTML = `
                        <!-- Property Image -->
                        <div class="h-48 bg-gray-200 flex items-center justify-center">
                            ${{imageHtml}}
                        </div>
                        
                        <!-- Property Details -->
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-lg font-semibold text-gray-900 truncate">
                                    ${{property.title}}
                                </h3>
                                ${{getStatusBadge(property.status)}}
                            </div>
                            
                            <div class="space-y-2 text-sm text-gray-600">
                                <div class="flex items-center">
                                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span class="truncate">${{property.location}}</span>
                                </div>
                                
                                <div class="flex items-center">
                                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span class="capitalize">${{property.property_type}}</span>
                                    ${{property.bedrooms ? `<span class="ml-2">• ${{property.bedrooms}} BHK</span>` : ''}}
                                </div>
                                
                                <div class="flex items-center">
                                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    <span class="font-semibold text-gray-900">
                                        ${{formatPrice(property.price)}}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div class="mt-4 flex justify-between items-center">
                                <button onclick="showPropertyDetails(${{property.id}})" 
                                        class="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200">
                                    Know More
                                </button>
                                
                                <div class="flex space-x-2">
                                    <button onclick="contactProperty(${{property.id}}, 'call')" 
                                            class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
                                            title="Call">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </button>
                                    <button onclick="contactProperty(${{property.id}}, 'whatsapp')" 
                                            class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
                                            title="WhatsApp">
                                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                    </button>
                                    <button onclick="showLeadForm(${{property.id}})" 
                                            class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                                            title="Get Details">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    return card;
                }}
                
                // Action button functions
                function showPropertyDetails(propertyId) {{
                    // Create a modal or redirect to property details
                    // For now, we'll show an alert with property info
                    fetch('http://localhost:5000/api/embed/{shortcode}')
                        .then(response => response.json())
                        .then(data => {{
                            if (data.success) {{
                                const property = data.properties.find(p => p.id === propertyId);
                                if (property) {{
                                    showPropertyModal(property);
                                }}
                            }}
                        }})
                        .catch(error => {{
                            console.error('Error fetching property details:', error);
                            alert('Unable to load property details. Please try again.');
                        }});
                }}
                
                function contactProperty(propertyId, contactType) {{
                    // Get property details for contact info
                    fetch('http://localhost:5000/api/embed/{shortcode}')
                        .then(response => response.json())
                        .then(data => {{
                            if (data.success) {{
                                const property = data.properties.find(p => p.id === propertyId);
                                if (property) {{
                                    handleContact(property, contactType);
                                }}
                            }}
                        }})
                        .catch(error => {{
                            console.error('Error fetching property details:', error);
                            alert('Unable to load contact information. Please try again.');
                        }});
                }}
                
                function showPropertyModal(property) {{
                    // Create a simple modal for property details
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                    modal.innerHTML = `
                        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-bold text-gray-900">${{property.title}}</h3>
                                    <button onclick="this.closest('.fixed').remove()" 
                                            class="text-gray-400 hover:text-gray-600">
                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="text-sm font-medium text-gray-500">Price</label>
                                            <p class="text-lg font-semibold text-green-600">${{formatPrice(property.price)}}</p>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500">Type</label>
                                            <p class="text-gray-900 capitalize">${{property.property_type}}</p>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500">Location</label>
                                            <p class="text-gray-900">${{property.location}}</p>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium text-gray-500">Status</label>
                                            <p class="text-gray-900">${{getStatusBadge(property.status)}}</p>
                                        </div>
                                        ${{property.bedrooms ? `
                                        <div>
                                            <label class="text-sm font-medium text-gray-500">Bedrooms</label>
                                            <p class="text-gray-900">${{property.bedrooms}}</p>
                                        </div>
                                        ` : ''}}
                                        ${{property.bathrooms ? `
                                        <div>
                                            <label class="text-sm font-medium text-gray-500">Bathrooms</label>
                                            <p class="text-gray-900">${{property.bathrooms}}</p>
                                        </div>
                                        ` : ''}}
                                        ${{property.area ? `
                                        <div>
                                            <label class="text-sm font-medium text-gray-500">Area</label>
                                            <p class="text-gray-900">${{property.area}} sq ft</p>
                                        </div>
                                        ` : ''}}
                                    </div>
                                    
                                    ${{property.description ? `
                                    <div>
                                        <label class="text-sm font-medium text-gray-500">Description</label>
                                        <p class="text-gray-900 mt-1">${{property.description}}</p>
                                    </div>
                                    ` : ''}}
                                    
                                    <div class="flex justify-end space-x-3 pt-4 border-t">
                                        <button onclick="this.closest('.fixed').remove()" 
                                                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                                            Close
                                        </button>
                                        <button onclick="contactProperty(${{property.id}}, 'call'); this.closest('.fixed').remove();" 
                                                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                            Contact Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                }}
                
                function handleContact(property, contactType) {{
                    // Contact information
                    const contactInfo = {{
                        phone: '+91-8587039868', // Your contact number
                        whatsapp: '+91-8587039868' // Your WhatsApp number
                    }};
                    
                    // Track lead before opening contact
                    trackLead(property.id, contactType);
                    
                    switch(contactType) {{
                        case 'call':
                            window.open(`tel:${{contactInfo.phone}}`, '_self');
                            break;
                        case 'whatsapp':
                            const message = `Hi! I'm interested in the property: ${{property.title}} - ${{formatPrice(property.price)}}`;
                            const whatsappUrl = `https://wa.me/${{contactInfo.whatsapp.replace(/[^0-9]/g, '')}}?text=${{encodeURIComponent(message)}}`;
                            window.open(whatsappUrl, '_blank');
                            break;
                        default:
                            alert('Contact method not available');
                    }}
                }}
                
                function showLeadForm(propertyId) {{
                    // Get property details
                    fetch('http://localhost:5000/api/embed/{shortcode}')
                        .then(response => response.json())
                        .then(data => {{
                            if (data.success) {{
                                const property = data.properties.find(p => p.id === propertyId);
                                if (property) {{
                                    showLeadFormModal(property);
                                }}
                            }}
                        }})
                        .catch(error => {{
                            console.error('Error fetching property details:', error);
                            alert('Unable to load property details. Please try again.');
                        }});
                }}
                
                function showLeadFormModal(property) {{
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                    modal.innerHTML = `
                        <div class="bg-white rounded-lg max-w-md w-full">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-bold text-gray-900">Get Property Details</h3>
                                    <button onclick="this.closest('.fixed').remove()" 
                                            class="text-gray-400 hover:text-gray-600">
                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <h4 class="font-semibold text-gray-900">${{property.title}}</h4>
                                    <p class="text-sm text-gray-600">${{property.location}}</p>
                                    <p class="text-lg font-bold text-green-600">${{formatPrice(property.price)}}</p>
                                </div>
                                
                                <form id="leadForm" onsubmit="submitLeadForm(event, ${{property.id}})">
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                            <input type="text" name="name" required 
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                   placeholder="Enter your full name">
                                        </div>
                                        
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                                <input type="tel" name="phone" required 
                                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       placeholder="Primary number">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                                                <input type="tel" name="alternate_phone" 
                                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                       placeholder="Alternate number">
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" name="email" 
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                   placeholder="your.email@example.com">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input type="text" name="city" 
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                   placeholder="Your current city">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Requirements & Message</label>
                                            <textarea name="message" rows="3" 
                                                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                      placeholder="Tell us about your requirements, budget, timeline, or any specific questions..."></textarea>
                                        </div>
                                        
                                        <div class="bg-blue-50 p-3 rounded-lg">
                                            <p class="text-sm text-blue-800">
                                                <svg class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                We'll contact you within 24 hours with detailed property information and schedule a site visit.
                                            </p>
                                        </div>
                                        
                                        <div class="flex justify-end space-x-3 pt-2">
                                            <button type="button" onclick="this.closest('.fixed').remove()" 
                                                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                                Cancel
                                            </button>
                                            <button type="submit" 
                                                    class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                                                Get Details
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                }}
                
                function submitLeadForm(event, propertyId) {{
                    event.preventDefault();
                    
                    const formData = new FormData(event.target);
                    const userInfo = {{
                        name: formData.get('name'),
                        phone: formData.get('phone'),
                        email: formData.get('email'),
                        city: formData.get('city'),
                        alternate_phone: formData.get('alternate_phone'),
                        message: formData.get('message')
                    }};
                    
                    // Show loading state
                    const submitBtn = event.target.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Submitting...';
                    submitBtn.disabled = true;
                    
                    // Track lead with form data
                    trackLead(propertyId, 'form', userInfo)
                        .then(() => {{
                            // Close modal
                            event.target.closest('.fixed').remove();
                            
                            // Show success message
                            alert('Thank you! We will contact you within 24 hours with detailed property information.');
                        }})
                        .catch((error) => {{
                            console.error('Error submitting form:', error);
                            alert('There was an error submitting your request. Please try again or call us directly.');
                            
                            // Reset button
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }});
                }}
                
                function trackLead(propertyId, contactType, userInfo = {{}}) {{
                    // Track lead in your CRM
                    return fetch('http://localhost:5000/api/embed/{shortcode}/lead', {{
                        method: 'POST',
                        headers: {{
                            'Content-Type': 'application/json',
                        }},
                        body: JSON.stringify({{
                            property_id: propertyId,
                            contact_type: contactType,
                            user_info: userInfo
                        }})
                    }})
                    .then(response => response.json())
                    .then(data => {{
                        if (data.success) {{
                            console.log('Lead tracked successfully:', data.lead_id);
                            return data;
                        }} else {{
                            console.error('Failed to track lead:', data.error);
                            throw new Error(data.error || 'Failed to track lead');
                        }}
                    }})
                    .catch(error => {{
                        console.error('Error tracking lead:', error);
                        throw error;
                    }});
                }}
            </script>
        </body>
        </html>
        """
        
        return widget_html, 200, {'Content-Type': 'text/html'}
    except Exception as e:
        return f"<!-- Error: {str(e)} -->", 500
