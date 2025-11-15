from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Lead, Communication, User, Property, Notification
from datetime import datetime
from decimal import Decimal
from utils.activity_logger import log_activity

leads_bp = Blueprint('leads', __name__)

@leads_bp.route('/', methods=['GET'])
@jwt_required()
def get_leads():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search')
        stage = request.args.get('stage')
        source = request.args.get('source')
        lead_score = request.args.get('lead_score')
        assigned_employee_id = request.args.get('assigned_employee_id', type=int)
        property_id = request.args.get('property_id', type=int)
        date_range = request.args.get('date_range')
        budget_min = request.args.get('budget_min', type=float)
        budget_max = request.args.get('budget_max', type=float)
        location = request.args.get('location')
        
        # Build query
        query = Lead.query
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Lead.assigned_employee_id == current_user_id)
        
        # Search filter
        if search:
            query = query.filter(
                (Lead.name.ilike(f'%{search}%')) |
                (Lead.email.ilike(f'%{search}%')) |
                (Lead.phone.ilike(f'%{search}%')) |
                (Lead.notes.ilike(f'%{search}%'))
            )
        
        if stage:
            query = query.filter(Lead.status == stage)
        if source:
            query = query.filter(Lead.source == source)
        if assigned_employee_id:
            query = query.filter(Lead.assigned_employee_id == assigned_employee_id)
        if property_id:
            query = query.filter(Lead.property_id == property_id)
        if location:
            query = query.filter(Lead.notes.ilike(f'%{location}%'))
        if budget_min:
            query = query.filter(Lead.budget >= budget_min)
        if budget_max:
            query = query.filter(Lead.budget <= budget_max)
        
        # Date range filter
        if date_range:
            from datetime import datetime, timedelta
            now = datetime.utcnow()
            
            if date_range == 'today':
                start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Lead.created_at >= start_date)
            elif date_range == 'yesterday':
                yesterday = now - timedelta(days=1)
                start_date = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
                end_date = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)
                query = query.filter(Lead.created_at >= start_date, Lead.created_at <= end_date)
            elif date_range == 'this_week':
                start_date = now - timedelta(days=now.weekday())
                start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Lead.created_at >= start_date)
            elif date_range == 'last_week':
                end_date = now - timedelta(days=now.weekday())
                start_date = end_date - timedelta(days=7)
                query = query.filter(Lead.created_at >= start_date, Lead.created_at < end_date)
            elif date_range == 'this_month':
                start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Lead.created_at >= start_date)
            elif date_range == 'last_month':
                if now.month == 1:
                    start_date = now.replace(year=now.year-1, month=12, day=1, hour=0, minute=0, second=0, microsecond=0)
                else:
                    start_date = now.replace(month=now.month-1, day=1, hour=0, minute=0, second=0, microsecond=0)
                end_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Lead.created_at >= start_date, Lead.created_at < end_date)
            elif date_range == 'this_year':
                start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
                query = query.filter(Lead.created_at >= start_date)
        
        # Paginate results
        leads = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'leads': [lead.to_dict() for lead in leads.items],
            'total': leads.total,
            'pages': leads.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/<int:lead_id>', methods=['GET'])
@jwt_required()
def get_lead(lead_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        lead = Lead.query.get(lead_id)
        
        if not lead:
            return jsonify({'error': 'Lead not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and lead.assigned_employee_id != current_user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get communications
        communications = Communication.query.filter_by(lead_id=lead_id).order_by(Communication.created_at.desc()).all()
        
        return jsonify({
            'lead': lead.to_dict(),
            'communications': [comm.to_dict() for comm in communications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/', methods=['POST'])
@jwt_required()
def create_lead():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin, manager, and sales_agent can create leads
        if current_user.role not in ['admin', 'manager', 'sales_agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'phone', 'source']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new lead
        lead = Lead(
            name=data['name'],
            email=data.get('email'),
            phone=data['phone'],
            source=data['source'],
            status=data.get('status', 'new'),
            property_id=data.get('property_id'),
            assigned_employee_id=data.get('assigned_employee_id', current_user_id),
            budget=Decimal(str(data['budget'])) if data.get('budget') else None,
            notes=data.get('notes')
        )
        
        db.session.add(lead)
        db.session.commit()
        
        # Log the lead creation activity
        log_activity(
            user_id=current_user_id,
            activity_type='lead_added',
            description=f'Added new lead: {lead.first_name} {lead.last_name} from {lead.source}',
            entity_type='lead',
            entity_id=lead.id,
            metadata={
                'lead_name': f'{lead.first_name} {lead.last_name}',
                'lead_email': lead.email,
                'lead_phone': lead.phone,
                'source': lead.source,
                'stage': lead.stage
            }
        )
        
        # Create notification for assigned employee (if different from creator)
        if lead.assigned_employee_id != current_user_id:
            assigned_employee = User.query.get(lead.assigned_employee_id)
            if assigned_employee:
                notification = Notification(
                    user_id=lead.assigned_employee_id,
                    title='New Lead Assigned',
                    message=f'You have been assigned a new lead: {lead.first_name} {lead.last_name} from {lead.source}',
                    type='lead',
                    entity_type='lead',
                    entity_id=lead.id
                )
                db.session.add(notification)
        
        # Create notification for admins and managers about new lead
        admins_and_managers = User.query.filter(
            User.role.in_(['admin', 'manager']),
            User.id != current_user_id
        ).all()
        
        for admin_manager in admins_and_managers:
            notification = Notification(
                user_id=admin_manager.id,
                title='New Lead Created',
                message=f'New lead created: {lead.first_name} {lead.last_name} from {lead.source}',
                type='lead',
                entity_type='lead',
                entity_id=lead.id
            )
            db.session.add(notification)
        
        # Commit all notifications
        db.session.commit()
        
        return jsonify({
            'message': 'Lead created successfully',
            'lead': lead.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/<int:lead_id>', methods=['PUT'])
@jwt_required()
def update_lead(lead_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        lead = Lead.query.get(lead_id)
        
        if not lead:
            return jsonify({'error': 'Lead not found'}), 404
        
        # Check permissions - allow access if lead is unassigned or user is assigned to it
        if current_user.role not in ['admin', 'manager'] and lead.assigned_employee_id is not None and lead.assigned_employee_id != current_user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Track stage change for activity logging
        old_stage = lead.stage
        stage_changed = False
        
        # Update fields
        if 'first_name' in data:
            lead.first_name = data['first_name']
        if 'last_name' in data:
            lead.last_name = data['last_name']
        if 'email' in data:
            lead.email = data['email']
        if 'phone' in data:
            lead.phone = data['phone']
        if 'source' in data:
            lead.source = data['source']
        if 'stage' in data:
            if lead.stage != data['stage']:
                stage_changed = True
            lead.stage = data['stage']
        if 'property_id' in data:
            lead.property_id = data['property_id']
        if 'assigned_employee_id' in data and current_user.role in ['admin', 'manager']:
            lead.assigned_employee_id = data['assigned_employee_id']
        if 'budget_min' in data:
            lead.budget_min = Decimal(str(data['budget_min'])) if data['budget_min'] else None
        if 'budget_max' in data:
            lead.budget_max = Decimal(str(data['budget_max'])) if data['budget_max'] else None
        if 'preferred_location' in data:
            lead.preferred_location = data['preferred_location']
        if 'notes' in data:
            lead.notes = data['notes']
        if 'lead_score' in data:
            lead.lead_score = data['lead_score']
        if 'last_contact_date' in data:
            lead.last_contact_date = datetime.fromisoformat(data['last_contact_date']) if data['last_contact_date'] else None
        if 'next_follow_up' in data:
            old_follow_up = lead.next_follow_up
            if data['next_follow_up']:
                try:
                    # Handle both ISO format and datetime-local format
                    if 'T' in data['next_follow_up']:
                        # ISO format from JavaScript
                        lead.next_follow_up = datetime.fromisoformat(data['next_follow_up'].replace('Z', '+00:00'))
                    else:
                        # datetime-local format
                        lead.next_follow_up = datetime.fromisoformat(data['next_follow_up'])
                except ValueError as e:
                    print(f"Error parsing next_follow_up date: {e}")
                    return jsonify({'error': 'Invalid date format for next_follow_up'}), 400
            else:
                lead.next_follow_up = None
            
            # Create follow-up reminder notification and communication record if follow-up date is set
            if lead.next_follow_up and lead.next_follow_up != old_follow_up:
                # Create communication record for activity timeline
                follow_up_comm = Communication(
                    lead_id=lead.id,
                    type='follow_up',
                    subject='Follow-up Scheduled',
                    content=f'Follow-up scheduled for {lead.next_follow_up.strftime("%B %d, %Y at %I:%M %p")}',
                    direction='outbound',
                    created_by=current_user_id
                )
                db.session.add(follow_up_comm)
                
                # Create notification if lead has assigned employee
                if lead.assigned_employee_id:
                    notification = Notification(
                        user_id=lead.assigned_employee_id,
                        title='Follow-up Reminder Set',
                        message=f'Follow-up reminder set for {lead.first_name} {lead.last_name} on {lead.next_follow_up.strftime("%B %d, %Y at %I:%M %p")}',
                        type='follow_up',
                        entity_type='lead',
                        entity_id=lead.id
                    )
                    db.session.add(notification)
        
        lead.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log stage change activity if stage was changed
        if stage_changed:
            log_activity(
                user_id=current_user_id,
                activity_type='lead_stage_changed',
                description=f'Changed lead stage from {old_stage} to {lead.stage} for {lead.first_name} {lead.last_name}',
                entity_type='lead',
                entity_id=lead.id,
                metadata={
                    'lead_name': f'{lead.first_name} {lead.last_name}',
                    'old_stage': old_stage,
                    'new_stage': lead.stage,
                    'lead_email': lead.email
                }
            )
        
        return jsonify({
            'message': 'Lead updated successfully',
            'lead': lead.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/<int:lead_id>', methods=['DELETE'])
@jwt_required()
def delete_lead(lead_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin can delete leads
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        lead = Lead.query.get(lead_id)
        
        if not lead:
            return jsonify({'error': 'Lead not found'}), 404
        
        # Store lead info before deletion for activity logging
        lead_name = f"{lead.first_name} {lead.last_name}"
        lead_email = lead.email
        lead_stage = lead.stage
        lead_source = lead.source
        
        db.session.delete(lead)
        db.session.commit()
        
        # Log lead deletion activity
        log_activity(
            user_id=current_user_id,
            activity_type='lead_deleted',
            description=f'Deleted lead {lead_name} (Stage: {lead_stage})',
            entity_type='lead',
            entity_id=lead_id,
            metadata={
                'lead_name': lead_name,
                'lead_email': lead_email,
                'lead_stage': lead_stage,
                'lead_source': lead_source,
                'deleted_by': f"{current_user.first_name} {current_user.last_name}"
            }
        )
        
        return jsonify({
            'message': 'Lead deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/<int:lead_id>/communications', methods=['POST'])
@jwt_required()
def add_communication(lead_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        lead = Lead.query.get(lead_id)
        
        if not lead:
            return jsonify({'error': 'Lead not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and lead.assigned_employee_id != current_user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['type', 'content', 'direction']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create communication
        communication = Communication(
            lead_id=lead_id,
            type=data['type'],
            subject=data.get('subject'),
            content=data['content'],
            direction=data['direction'],
            created_by=current_user_id
        )
        
        db.session.add(communication)
        
        # Update lead's last contact date
        lead.last_contact_date = datetime.utcnow()
        lead.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log the communication activity
        communication_type = data['type'].replace('_', ' ').title()
        direction = data['direction']
        
        log_activity(
            user_id=current_user_id,
            activity_type='communication_added',
            description=f'Added {direction} {communication_type} with {lead.first_name} {lead.last_name}',
            entity_type='communication',
            entity_id=communication.id,
            metadata={
                'lead_name': f'{lead.first_name} {lead.last_name}',
                'communication_type': data['type'],
                'direction': direction,
                'subject': data.get('subject', 'No subject')
            }
        )
        
        return jsonify({
            'message': 'Communication added successfully',
            'communication': communication.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/stages', methods=['GET'])
@jwt_required()
def get_lead_stages():
    try:
        stages = ['new', 'contacted', 'site_visit_scheduled', 'negotiation', 'closed_won', 'closed_lost']
        
        return jsonify({
            'stages': stages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/sources', methods=['GET'])
@jwt_required()
def get_lead_sources():
    try:
        # Get distinct sources
        sources = db.session.query(Lead.source).distinct().all()
        
        return jsonify({
            'sources': [source[0] for source in sources if source[0]]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/pipeline', methods=['GET'])
@jwt_required()
def get_lead_pipeline():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Build query
        query = Lead.query
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Lead.assigned_employee_id == current_user_id)
        
        # Get leads grouped by stage
        pipeline = {}
        stages = ['new', 'contacted', 'site_visit_scheduled', 'negotiation', 'closed_won', 'closed_lost']
        
        for stage in stages:
            stage_leads = query.filter(Lead.stage == stage).all()
            pipeline[stage] = [lead.to_dict() for lead in stage_leads]
        
        return jsonify({
            'pipeline': pipeline
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/website-form', methods=['POST'])
def create_lead_from_website():
    try:
        # This endpoint doesn't require authentication as it's for website integration
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'phone', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new lead from website
        lead = Lead(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data['phone'],
            source='website',
            stage='new',
            property_id=data.get('property_id'),
            preferred_location=data.get('preferred_location'),
            notes=data.get('message'),
            lead_score='warm'  # Website leads are typically warm
        )
        
        db.session.add(lead)
        db.session.commit()
        
        # Create notifications for website form submissions
        # Get all admins and managers to notify them about new website leads
        admins_and_managers = User.query.filter(
            User.role.in_(['admin', 'manager'])
        ).all()
        
        for admin_manager in admins_and_managers:
            notification = Notification(
                user_id=admin_manager.id,
                title='New Website Lead',
                message=f'New lead from website: {lead.first_name} {lead.last_name} ({lead.email})',
                type='lead',
                entity_type='lead',
                entity_id=lead.id
            )
            db.session.add(notification)
        
        # Commit notifications
        db.session.commit()
        
        return jsonify({
            'message': 'Lead created successfully from website',
            'lead_id': lead.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@leads_bp.route('/property/<int:property_id>', methods=['GET'])
@jwt_required()
def get_leads_for_property(property_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        stage = request.args.get('stage')
        
        # Build query for leads interested in this property
        query = Lead.query.filter(Lead.property_id == property_id)
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Lead.assigned_employee_id == current_user_id)
        
        if stage:
            query = query.filter(Lead.stage == stage)
        
        # Order by creation date (newest first)
        query = query.order_by(Lead.created_at.desc())
        
        # Paginate results
        leads = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'leads': [lead.to_dict() for lead in leads.items],
            'total': leads.total,
            'pages': leads.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
