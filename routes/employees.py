from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import User, Lead, Property, PostSale
from datetime import datetime
from sqlalchemy import func
from utils.activity_logger import log_activity
from utils.email_service import send_employee_welcome_email

employees_bp = Blueprint('employees', __name__)

@employees_bp.route('/', methods=['GET'])
@jwt_required()
def get_employees():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin and manager can view all employees
        if current_user.role not in ['admin', 'manager']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        role = request.args.get('role')
        is_active = request.args.get('is_active')
        
        # Build query
        query = User.query
        
        if role:
            query = query.filter(User.role == role)
        if is_active is not None and is_active != '':
            query = query.filter(User.is_active == (is_active.lower() == 'true'))
        
        # Paginate results
        employees = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'employees': [employee.to_dict() for employee in employees.items],
            'total': employees.total,
            'pages': employees.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/<int:employee_id>', methods=['GET'])
@jwt_required()
def get_employee(employee_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and current_user_id != employee_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        employee = User.query.get(employee_id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        return jsonify({
            'employee': employee.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/', methods=['POST'])
@jwt_required()
def create_employee():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin can create employees
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new employee
        employee = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            role=data['role'],
            permissions=data.get('permissions', []),
            is_active=data.get('is_active', True)
        )
        employee.set_password(data['password'])
        
        db.session.add(employee)
        db.session.commit()
        
        # Log the employee creation activity
        log_activity(
            user_id=current_user_id,
            activity_type='employee_added',
            description=f'Added new employee: {employee.first_name} {employee.last_name} ({employee.role})',
            entity_type='user',
            entity_id=employee.id,
            metadata={
                'employee_name': f'{employee.first_name} {employee.last_name}',
                'employee_email': employee.email,
                'employee_role': employee.role
            }
        )
        
        # Send welcome email to the new employee
        try:
            employee_name = f"{employee.first_name} {employee.last_name}"
            admin_name = f"{current_user.first_name} {current_user.last_name}"
            email_sent = send_employee_welcome_email(
                employee_email=employee.email,
                employee_name=employee_name,
                username=employee.email,
                password=data['password'],  # Send the plain password for first login
                admin_name=admin_name
            )
            
            if email_sent:
                print(f"Welcome email sent successfully to {employee.email}")
            else:
                print(f"Failed to send welcome email to {employee.email}")
                
        except Exception as email_error:
            print(f"Error sending welcome email: {str(email_error)}")
            # Don't fail the employee creation if email fails
        
        return jsonify({
            'message': 'Employee created successfully',
            'employee': employee.to_dict(),
            'email_sent': email_sent if 'email_sent' in locals() else False
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/<int:employee_id>', methods=['PUT'])
@jwt_required()
def update_employee(employee_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin can update employees
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        employee = User.query.get(employee_id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'first_name' in data:
            employee.first_name = data['first_name']
        if 'last_name' in data:
            employee.last_name = data['last_name']
        if 'phone' in data:
            employee.phone = data['phone']
        if 'role' in data:
            employee.role = data['role']
        if 'permissions' in data:
            employee.permissions = data['permissions']
        if 'is_active' in data:
            employee.is_active = data['is_active']
        
        employee.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Employee updated successfully',
            'employee': employee.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/<int:employee_id>', methods=['DELETE'])
@jwt_required()
def delete_employee(employee_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin can delete employees
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Cannot delete self
        if current_user_id == employee_id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        employee = User.query.get(employee_id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        # Store employee info before deletion for activity logging
        employee_name = f"{employee.first_name} {employee.last_name}"
        employee_email = employee.email
        employee_role = employee.role
        
        db.session.delete(employee)
        db.session.commit()
        
        # Log employee deletion activity
        log_activity(
            user_id=current_user_id,
            activity_type='employee_deleted',
            description=f'Deleted employee {employee_name} ({employee_role})',
            entity_type='employee',
            entity_id=employee_id,
            metadata={
                'employee_name': employee_name,
                'employee_email': employee_email,
                'employee_role': employee_role,
                'deleted_by': f"{current_user.first_name} {current_user.last_name}"
            }
        )
        
        return jsonify({
            'message': 'Employee deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/<int:employee_id>/performance', methods=['GET'])
@jwt_required()
def get_employee_performance(employee_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and current_user_id != employee_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        employee = User.query.get(employee_id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        # Get performance metrics
        total_leads = Lead.query.filter_by(assigned_employee_id=employee_id).count()
        closed_won_leads = Lead.query.filter_by(assigned_employee_id=employee_id, stage='closed_won').count()
        closed_lost_leads = Lead.query.filter_by(assigned_employee_id=employee_id, stage='closed_lost').count()
        
        # Calculate conversion rate
        total_closed = closed_won_leads + closed_lost_leads
        conversion_rate = (closed_won_leads / total_closed * 100) if total_closed > 0 else 0
        
        # Get total sales value
        total_sales_value = db.session.query(func.sum(PostSale.sale_price)).filter(
            PostSale.lead_id.in_(
                db.session.query(Lead.id).filter_by(assigned_employee_id=employee_id, stage='closed_won')
            )
        ).scalar() or 0
        
        # Get properties assigned
        assigned_properties = Property.query.filter_by(assigned_agent_id=employee_id).count()
        
        # Get recent activity (last 30 days)
        from datetime import timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        recent_leads = Lead.query.filter(
            Lead.assigned_employee_id == employee_id,
            Lead.created_at >= thirty_days_ago
        ).count()
        
        return jsonify({
            'employee': employee.to_dict(),
            'performance': {
                'total_leads': total_leads,
                'closed_won_leads': closed_won_leads,
                'closed_lost_leads': closed_lost_leads,
                'conversion_rate': round(conversion_rate, 2),
                'total_sales_value': float(total_sales_value),
                'assigned_properties': assigned_properties,
                'recent_leads_30_days': recent_leads
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/roles', methods=['GET'])
@jwt_required()
def get_employee_roles():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin and manager can view roles
        if current_user.role not in ['admin', 'manager']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        roles = [
            {'value': 'admin', 'label': 'Admin'},
            {'value': 'manager', 'label': 'Manager'},
            {'value': 'sales_agent', 'label': 'Sales Agent'},
            {'value': 'employee', 'label': 'Employee'}
        ]
        
        return jsonify({
            'roles': roles
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employees_bp.route('/<int:employee_id>/leads', methods=['GET'])
@jwt_required()
def get_employee_leads(employee_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and current_user_id != employee_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        employee = User.query.get(employee_id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        stage = request.args.get('stage')
        
        # Build query
        query = Lead.query.filter_by(assigned_employee_id=employee_id)
        
        if stage:
            query = query.filter(Lead.stage == stage)
        
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

@employees_bp.route('/<int:employee_id>/properties', methods=['GET'])
@jwt_required()
def get_employee_properties(employee_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Check permissions
        if current_user.role not in ['admin', 'manager'] and current_user_id != employee_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        employee = User.query.get(employee_id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        # Build query
        query = Property.query.filter_by(assigned_agent_id=employee_id)
        
        if status:
            query = query.filter(Property.status == status)
        
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
