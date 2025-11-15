from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import PostSale, Payment, SupportTicket, Lead, Property, User, Notification
from datetime import datetime
from decimal import Decimal
from utils.activity_logger import log_activity

post_sales_bp = Blueprint('post_sales', __name__)

@post_sales_bp.route('/', methods=['GET'])
@jwt_required()
def get_post_sales():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        payment_status = request.args.get('payment_status')
        
        # Build query
        query = PostSale.query
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            # Get leads assigned to current user
            user_leads = db.session.query(Lead.id).filter_by(assigned_employee_id=current_user_id).subquery()
            query = query.filter(PostSale.lead_id.in_(user_leads))
        
        if payment_status:
            query = query.filter(PostSale.payment_status == payment_status)
        
        # Paginate results
        post_sales = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'post_sales': [post_sale.to_dict() for post_sale in post_sales.items],
            'total': post_sales.total,
            'pages': post_sales.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/<int:post_sale_id>', methods=['GET'])
@jwt_required()
def get_post_sale(post_sale_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        post_sale = PostSale.query.get(post_sale_id)
        
        if not post_sale:
            return jsonify({'error': 'Post-sale record not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager']:
            lead = Lead.query.get(post_sale.lead_id)
            if lead.assigned_employee_id != current_user_id:
                return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get payments and support tickets
        payments = Payment.query.filter_by(post_sale_id=post_sale_id).all()
        support_tickets = SupportTicket.query.filter_by(post_sale_id=post_sale_id).all()
        
        return jsonify({
            'post_sale': post_sale.to_dict(),
            'payments': [payment.to_dict() for payment in payments],
            'support_tickets': [ticket.to_dict() for ticket in support_tickets]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/', methods=['POST'])
@jwt_required()
def create_post_sale():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin, manager, and sales_agent can create post-sales
        if current_user.role not in ['admin', 'manager', 'sales_agent']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['lead_id', 'property_id', 'sale_price', 'sale_date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if lead exists and is closed won
        lead = Lead.query.get(data['lead_id'])
        if not lead:
            return jsonify({'error': 'Lead not found'}), 404
        
        if lead.stage != 'closed_won':
            return jsonify({'error': 'Lead must be closed won to create post-sale record'}), 400
        
        # Check if post-sale already exists for this lead
        existing_post_sale = PostSale.query.filter_by(lead_id=data['lead_id']).first()
        if existing_post_sale:
            return jsonify({'error': 'Post-sale record already exists for this lead'}), 400
        
        # Create new post-sale
        post_sale = PostSale(
            lead_id=data['lead_id'],
            property_id=data['property_id'],
            sale_price=Decimal(str(data['sale_price'])),
            sale_date=datetime.fromisoformat(data['sale_date']),
            payment_status=data.get('payment_status', 'pending'),
            documents=data.get('documents', []),
            handover_date=datetime.fromisoformat(data['handover_date']) if data.get('handover_date') else None,
            possession_date=datetime.fromisoformat(data['possession_date']) if data.get('possession_date') else None,
            warranty_start_date=datetime.fromisoformat(data['warranty_start_date']) if data.get('warranty_start_date') else None,
            warranty_end_date=datetime.fromisoformat(data['warranty_end_date']) if data.get('warranty_end_date') else None,
            notes=data.get('notes')
        )
        
        db.session.add(post_sale)
        
        # Update property status to sold
        property = Property.query.get(data['property_id'])
        if property:
            property.status = 'sold'
            property.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log the sale completion activity
        property = Property.query.get(data['property_id'])
        property_title = property.title if property else f"Property ID {data['property_id']}"
        
        log_activity(
            user_id=current_user_id,
            activity_type='sale_completed',
            description=f'Completed sale of property: {property_title} for ₹{post_sale.sale_price:,.2f}',
            entity_type='post_sale',
            entity_id=post_sale.id,
            metadata={
                'property_title': property_title,
                'sale_price': float(post_sale.sale_price),
                'lead_name': f'{lead.first_name} {lead.last_name}',
                'sale_date': post_sale.sale_date.isoformat()
            }
        )
        
        # Create notifications for sale completion
        # Get all admins and managers
        admins_and_managers = User.query.filter(
            User.role.in_(['admin', 'manager'])
        ).all()
        
        for admin_manager in admins_and_managers:
            notification = Notification(
                user_id=admin_manager.id,
                title='Sale Completed',
                message=f'Property "{property_title}" sold for ₹{post_sale.sale_price:,.0f} to {lead.first_name} {lead.last_name}',
                type='payment',
                entity_type='post_sale',
                entity_id=post_sale.id
            )
            db.session.add(notification)
        
        # Commit notifications
        db.session.commit()
        
        return jsonify({
            'message': 'Post-sale record created successfully',
            'post_sale': post_sale.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/<int:post_sale_id>', methods=['PUT'])
@jwt_required()
def update_post_sale(post_sale_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        post_sale = PostSale.query.get(post_sale_id)
        
        if not post_sale:
            return jsonify({'error': 'Post-sale record not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager']:
            lead = Lead.query.get(post_sale.lead_id)
            if lead.assigned_employee_id != current_user_id:
                return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'sale_price' in data:
            post_sale.sale_price = Decimal(str(data['sale_price']))
        if 'sale_date' in data:
            post_sale.sale_date = datetime.fromisoformat(data['sale_date'])
        if 'payment_status' in data:
            post_sale.payment_status = data['payment_status']
        if 'documents' in data:
            post_sale.documents = data['documents']
        if 'handover_date' in data:
            post_sale.handover_date = datetime.fromisoformat(data['handover_date']) if data['handover_date'] else None
        if 'possession_date' in data:
            post_sale.possession_date = datetime.fromisoformat(data['possession_date']) if data['possession_date'] else None
        if 'warranty_start_date' in data:
            post_sale.warranty_start_date = datetime.fromisoformat(data['warranty_start_date']) if data['warranty_start_date'] else None
        if 'warranty_end_date' in data:
            post_sale.warranty_end_date = datetime.fromisoformat(data['warranty_end_date']) if data['warranty_end_date'] else None
        if 'notes' in data:
            post_sale.notes = data['notes']
        
        post_sale.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Post-sale record updated successfully',
            'post_sale': post_sale.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/<int:post_sale_id>/payments', methods=['POST'])
@jwt_required()
def add_payment(post_sale_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        post_sale = PostSale.query.get(post_sale_id)
        
        if not post_sale:
            return jsonify({'error': 'Post-sale record not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager']:
            lead = Lead.query.get(post_sale.lead_id)
            if lead.assigned_employee_id != current_user_id:
                return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['payment_type', 'amount']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create payment
        payment = Payment(
            post_sale_id=post_sale_id,
            payment_type=data['payment_type'],
            amount=Decimal(str(data['amount'])),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
            paid_date=datetime.fromisoformat(data['paid_date']) if data.get('paid_date') else None,
            payment_method=data.get('payment_method'),
            reference_number=data.get('reference_number'),
            status=data.get('status', 'pending'),
            notes=data.get('notes')
        )
        
        db.session.add(payment)
        db.session.commit()
        
        # Log the payment activity
        lead = Lead.query.get(post_sale.lead_id)
        property = Property.query.get(post_sale.property_id)
        property_title = property.title if property else f"Property ID {post_sale.property_id}"
        
        log_activity(
            user_id=current_user_id,
            activity_type='payment_added',
            description=f'Added {payment.payment_type} payment of ₹{payment.amount:,.2f} for {property_title}',
            entity_type='payment',
            entity_id=payment.id,
            metadata={
                'property_title': property_title,
                'payment_type': payment.payment_type,
                'amount': float(payment.amount),
                'payment_method': payment.payment_method,
                'status': payment.status,
                'lead_name': f'{lead.first_name} {lead.last_name}' if lead else 'Unknown'
            }
        )
        
        # Create notifications for payment
        # Get all admins and managers
        admins_and_managers = User.query.filter(
            User.role.in_(['admin', 'manager'])
        ).all()
        
        for admin_manager in admins_and_managers:
            notification = Notification(
                user_id=admin_manager.id,
                title='Payment Added',
                message=f'{payment.payment_type} payment of ₹{payment.amount:,.0f} added for {property_title}',
                type='payment',
                entity_type='payment',
                entity_id=payment.id
            )
            db.session.add(notification)
        
        # Commit notifications
        db.session.commit()
        
        return jsonify({
            'message': 'Payment added successfully',
            'payment': payment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/<int:post_sale_id>/payments/<int:payment_id>', methods=['PUT'])
@jwt_required()
def update_payment(post_sale_id, payment_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        payment = Payment.query.filter_by(id=payment_id, post_sale_id=post_sale_id).first()
        
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager']:
            post_sale = PostSale.query.get(post_sale_id)
            lead = Lead.query.get(post_sale.lead_id)
            if lead.assigned_employee_id != current_user_id:
                return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Track payment status change for notifications
        old_status = payment.status
        
        # Update fields
        if 'payment_type' in data:
            payment.payment_type = data['payment_type']
        if 'amount' in data:
            payment.amount = Decimal(str(data['amount']))
        if 'due_date' in data:
            payment.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
        if 'paid_date' in data:
            payment.paid_date = datetime.fromisoformat(data['paid_date']) if data['paid_date'] else None
        if 'payment_method' in data:
            payment.payment_method = data['payment_method']
        if 'reference_number' in data:
            payment.reference_number = data['reference_number']
        if 'status' in data:
            payment.status = data['status']
        if 'notes' in data:
            payment.notes = data['notes']
        
        payment.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Create notification for payment status change (especially when marked as paid)
        if old_status != payment.status and payment.status == 'paid':
            # Get all admins and managers
            admins_and_managers = User.query.filter(
                User.role.in_(['admin', 'manager'])
            ).all()
            
            # Get property and lead info for notification
            post_sale = PostSale.query.get(post_sale_id)
            property = Property.query.get(post_sale.property_id) if post_sale else None
            lead = Lead.query.get(post_sale.lead_id) if post_sale else None
            property_title = property.title if property else f"Property ID {post_sale.property_id}"
            
            for admin_manager in admins_and_managers:
                notification = Notification(
                    user_id=admin_manager.id,
                    title='Payment Received',
                    message=f'Payment of ₹{payment.amount:,.0f} received for {property_title} from {lead.first_name} {lead.last_name}' if lead else f'Payment of ₹{payment.amount:,.0f} received for {property_title}',
                    type='payment',
                    entity_type='payment',
                    entity_id=payment.id
                )
                db.session.add(notification)
            
            # Commit notifications
            db.session.commit()
        
        return jsonify({
            'message': 'Payment updated successfully',
            'payment': payment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/<int:post_sale_id>/support-tickets', methods=['POST'])
@jwt_required()
def create_support_ticket(post_sale_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        post_sale = PostSale.query.get(post_sale_id)
        
        if not post_sale:
            return jsonify({'error': 'Post-sale record not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager']:
            lead = Lead.query.get(post_sale.lead_id)
            if lead.assigned_employee_id != current_user_id:
                return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create support ticket
        support_ticket = SupportTicket(
            post_sale_id=post_sale_id,
            title=data['title'],
            description=data['description'],
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'open'),
            assigned_to=data.get('assigned_to')
        )
        
        db.session.add(support_ticket)
        db.session.commit()
        
        # Log the support ticket creation activity
        lead = Lead.query.get(post_sale.lead_id)
        property = Property.query.get(post_sale.property_id)
        property_title = property.title if property else f"Property ID {post_sale.property_id}"
        
        log_activity(
            user_id=current_user_id,
            activity_type='support_ticket_created',
            description=f'Created support ticket: {support_ticket.title} for {property_title}',
            entity_type='support_ticket',
            entity_id=support_ticket.id,
            metadata={
                'property_title': property_title,
                'ticket_title': support_ticket.title,
                'priority': support_ticket.priority,
                'status': support_ticket.status,
                'lead_name': f'{lead.first_name} {lead.last_name}' if lead else 'Unknown'
            }
        )
        
        return jsonify({
            'message': 'Support ticket created successfully',
            'support_ticket': support_ticket.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/<int:post_sale_id>/support-tickets/<int:ticket_id>', methods=['PUT'])
@jwt_required()
def update_support_ticket(post_sale_id, ticket_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        support_ticket = SupportTicket.query.filter_by(id=ticket_id, post_sale_id=post_sale_id).first()
        
        if not support_ticket:
            return jsonify({'error': 'Support ticket not found'}), 404
        
        # Check permissions
        if current_user.role not in ['admin', 'manager']:
            post_sale = PostSale.query.get(post_sale_id)
            lead = Lead.query.get(post_sale.lead_id)
            if lead.assigned_employee_id != current_user_id:
                return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            support_ticket.title = data['title']
        if 'description' in data:
            support_ticket.description = data['description']
        if 'priority' in data:
            support_ticket.priority = data['priority']
        if 'status' in data:
            support_ticket.status = data['status']
        if 'assigned_to' in data:
            support_ticket.assigned_to = data['assigned_to']
        if 'resolution' in data:
            support_ticket.resolution = data['resolution']
        
        support_ticket.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Support ticket updated successfully',
            'support_ticket': support_ticket.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@post_sales_bp.route('/payment-types', methods=['GET'])
@jwt_required()
def get_payment_types():
    try:
        payment_types = [
            {'value': 'token', 'label': 'Token Amount'},
            {'value': 'down_payment', 'label': 'Down Payment'},
            {'value': 'installment', 'label': 'Installment'},
            {'value': 'final_payment', 'label': 'Final Payment'}
        ]
        
        return jsonify({
            'payment_types': payment_types
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
