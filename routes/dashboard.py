from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import User, Property, Lead, PostSale, Payment, SupportTicket, Activity
from datetime import datetime, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_dashboard_overview():
    try:
        current_user_id = int(get_jwt_identity())
        print(f"Dashboard overview - User ID: {current_user_id}")  # Debug log
        current_user = User.query.get(int(current_user_id))
        
        if not current_user:
            print(f"User not found for ID: {current_user_id}")  # Debug log
            return jsonify({'error': 'User not found'}), 404
        
        # Get date range (default to current month)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date:
            start_date = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            start_date = datetime.fromisoformat(start_date)
        
        if not end_date:
            end_date = datetime.utcnow()
        else:
            end_date = datetime.fromisoformat(end_date)
        
        # Build base queries
        leads_query = Lead.query
        properties_query = Property.query
        post_sales_query = PostSale.query
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            leads_query = leads_query.filter(Lead.assigned_employee_id == current_user_id)
            properties_query = properties_query.filter(Property.assigned_agent_id == current_user_id)
            # Filter post sales by user's leads
            user_leads = db.session.query(Lead.id).filter_by(assigned_employee_id=current_user_id).subquery()
            post_sales_query = post_sales_query.filter(PostSale.lead_id.in_(user_leads))
        
        # KPIs
        total_leads = leads_query.count()
        active_listings = properties_query.filter(Property.status == 'available').count()
        
        # Inventory stats
        total_properties = Property.query.count()
        sold_properties = Property.query.filter(Property.status == 'sold').count()
        available_properties = Property.query.filter(Property.status == 'available').count()
        
        # Revenue this month
        current_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        revenue_this_month = db.session.query(func.sum(PostSale.sale_price)).filter(
            PostSale.sale_date >= current_month_start
        ).scalar() or 0
        
        # Pending tasks
        pending_payments = Payment.query.filter(Payment.status == 'pending').count()
        open_support_tickets = SupportTicket.query.filter(SupportTicket.status == 'open').count()
        pending_tasks = pending_payments + open_support_tickets
        
        # Lead conversion rate
        total_closed_leads = leads_query.filter(Lead.stage.in_(['closed_won', 'closed_lost'])).count()
        won_leads = leads_query.filter(Lead.stage == 'closed_won').count()
        conversion_rate = (won_leads / total_closed_leads * 100) if total_closed_leads > 0 else 0
        
        # Recent activity - get from Activity table
        recent_activities = Activity.query.filter(
            Activity.created_at >= start_date
        ).order_by(Activity.created_at.desc()).limit(10).all()
        
        # Also get recent leads and properties for backward compatibility
        recent_leads = leads_query.filter(
            Lead.created_at >= start_date
        ).order_by(Lead.created_at.desc()).limit(5).all()
        
        recent_properties = properties_query.filter(
            Property.created_at >= start_date
        ).order_by(Property.created_at.desc()).limit(5).all()
        
        # Upcoming follow-ups
        upcoming_follow_ups = leads_query.filter(
            Lead.next_follow_up.isnot(None),
            Lead.next_follow_up >= datetime.utcnow(),
            Lead.next_follow_up <= datetime.utcnow() + timedelta(days=7)
        ).order_by(Lead.next_follow_up.asc()).limit(5).all()
        
        return jsonify({
            'kpis': {
                'total_leads': total_leads,
                'active_listings': active_listings,
                'inventory_sold': sold_properties,
                'inventory_available': available_properties,
                'revenue_this_month': float(revenue_this_month),
                'pending_tasks': pending_tasks,
                'conversion_rate': round(conversion_rate, 2)
            },
            'recent_activity': {
                'activities': [activity.to_dict() for activity in recent_activities],
                'leads': [lead.to_dict() for lead in recent_leads],
                'properties': [property.to_dict() for property in recent_properties]
            },
            'upcoming_follow_ups': [lead.to_dict() for lead in upcoming_follow_ups]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        notifications = []
        
        # Overdue follow-ups
        overdue_follow_ups = Lead.query.filter(
            Lead.assigned_employee_id == current_user_id,
            Lead.next_follow_up.isnot(None),
            Lead.next_follow_up < datetime.utcnow(),
            Lead.stage.notin_(['closed_won', 'closed_lost'])
        ).count()
        
        if overdue_follow_ups > 0:
            notifications.append({
                'type': 'warning',
                'title': 'Overdue Follow-ups',
                'message': f'You have {overdue_follow_ups} overdue follow-ups',
                'count': overdue_follow_ups
            })
        
        # Pending payments
        if current_user.role in ['admin', 'manager']:
            pending_payments = Payment.query.filter(Payment.status == 'pending').count()
            if pending_payments > 0:
                notifications.append({
                    'type': 'info',
                    'title': 'Pending Payments',
                    'message': f'There are {pending_payments} pending payments',
                    'count': pending_payments
                })
        
        # Open support tickets
        if current_user.role in ['admin', 'manager']:
            open_tickets = SupportTicket.query.filter(SupportTicket.status == 'open').count()
            if open_tickets > 0:
                notifications.append({
                    'type': 'error',
                    'title': 'Open Support Tickets',
                    'message': f'There are {open_tickets} open support tickets',
                    'count': open_tickets
                })
        
        # New leads today
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        new_leads_today = Lead.query.filter(
            Lead.assigned_employee_id == current_user_id,
            Lead.created_at >= today_start
        ).count()
        
        if new_leads_today > 0:
            notifications.append({
                'type': 'success',
                'title': 'New Leads Today',
                'message': f'You have {new_leads_today} new leads today',
                'count': new_leads_today
            })
        
        return jsonify({
            'notifications': notifications
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/charts/sales-performance', methods=['GET'])
@jwt_required()
def get_sales_performance_chart():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Get months parameter (default to 6)
        months = request.args.get('months', 6, type=int)
        
        # Calculate start date
        start_date = datetime.utcnow() - timedelta(days=months * 30)
        
        # Build base query
        query = PostSale.query.filter(PostSale.sale_date >= start_date)
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            user_leads = db.session.query(Lead.id).filter_by(assigned_employee_id=current_user_id).subquery()
            query = query.filter(PostSale.lead_id.in_(user_leads))
        
        # Group by month
        monthly_sales = db.session.query(
            func.date_format(PostSale.sale_date, '%Y-%m').label('month'),
            func.count(PostSale.id).label('count'),
            func.sum(PostSale.sale_price).label('total')
        ).filter(PostSale.sale_date >= start_date).group_by(
            func.date_format(PostSale.sale_date, '%Y-%m')
        ).order_by('month').all()
        
        # Format data for charts
        chart_data = []
        for sale in monthly_sales:
            chart_data.append({
                'month': sale.month,
                'sales_count': int(sale.count),
                'revenue': float(sale.total)
            })
        
        return jsonify({
            'chart_data': chart_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/charts/lead-sources', methods=['GET'])
@jwt_required()
def get_lead_sources_chart():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Build base query
        query = Lead.query
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Lead.assigned_employee_id == current_user_id)
        
        # Group by source
        source_data = db.session.query(
            Lead.source,
            func.count(Lead.id).label('count')
        ).group_by(Lead.source).all()
        
        # Format data for pie chart
        chart_data = []
        for source in source_data:
            chart_data.append({
                'source': source.source,
                'count': int(source.count)
            })
        
        return jsonify({
            'chart_data': chart_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/charts/employee-productivity', methods=['GET'])
@jwt_required()
def get_employee_productivity_chart():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin and manager can view employee productivity
        if current_user.role not in ['admin', 'manager']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get date range (default to current month)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date:
            start_date = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            start_date = datetime.fromisoformat(start_date)
        
        if not end_date:
            end_date = datetime.utcnow()
        else:
            end_date = datetime.fromisoformat(end_date)
        
        # Get employee productivity data
        employees = User.query.filter(User.role.in_(['sales_agent', 'manager'])).all()
        
        chart_data = []
        for employee in employees:
            # Get leads handled
            leads_handled = Lead.query.filter(
                Lead.assigned_employee_id == employee.id,
                Lead.created_at >= start_date,
                Lead.created_at <= end_date
            ).count()
            
            # Get conversions
            conversions = Lead.query.filter(
                Lead.assigned_employee_id == employee.id,
                Lead.stage == 'closed_won',
                Lead.updated_at >= start_date,
                Lead.updated_at <= end_date
            ).count()
            
            # Get sales value
            sales_value = db.session.query(func.sum(PostSale.sale_price)).filter(
                PostSale.lead_id.in_(
                    db.session.query(Lead.id).filter_by(assigned_employee_id=employee.id)
                ),
                PostSale.sale_date >= start_date,
                PostSale.sale_date <= end_date
            ).scalar() or 0
            
            chart_data.append({
                'employee_name': f"{employee.first_name} {employee.last_name}",
                'leads_handled': leads_handled,
                'conversions': conversions,
                'sales_value': float(sales_value)
            })
        
        return jsonify({
            'chart_data': chart_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/quick-actions', methods=['GET'])
@jwt_required()
def get_quick_actions():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        actions = []
        
        # Add property
        if current_user.role in ['admin', 'manager', 'sales_agent']:
            actions.append({
                'id': 'add_property',
                'title': 'Add Property',
                'description': 'Add a new property listing',
                'icon': 'home',
                'route': '/properties/new'
            })
        
        # Add lead
        if current_user.role in ['admin', 'manager', 'sales_agent']:
            actions.append({
                'id': 'add_lead',
                'title': 'Add Lead',
                'description': 'Add a new lead',
                'icon': 'user-plus',
                'route': '/leads/new'
            })
        
        # View reports
        if current_user.role in ['admin', 'manager']:
            actions.append({
                'id': 'view_reports',
                'title': 'View Reports',
                'description': 'View analytics and reports',
                'icon': 'chart-bar',
                'route': '/reports'
            })
        
        # Manage employees
        if current_user.role == 'admin':
            actions.append({
                'id': 'manage_employees',
                'title': 'Manage Employees',
                'description': 'Add or manage employees',
                'icon': 'users',
                'route': '/employees'
            })
        
        return jsonify({
            'quick_actions': actions
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
