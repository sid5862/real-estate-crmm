from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import User, Property, Lead, PostSale, Payment, SupportTicket
from datetime import datetime, timedelta
from sqlalchemy import func, extract
import calendar

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
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
        
        # Total leads
        total_leads = leads_query.count()
        
        # Active listings (available properties)
        active_listings = properties_query.filter(Property.status == 'available').count()
        
        # Inventory sold vs available
        total_properties = Property.query.count()
        sold_properties = Property.query.filter(Property.status == 'sold').count()
        available_properties = Property.query.filter(Property.status == 'available').count()
        
        # Revenue this month
        current_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        revenue_this_month = db.session.query(func.sum(PostSale.sale_price)).filter(
            PostSale.sale_date >= current_month_start
        ).scalar() or 0
        
        # Pending post-sales tasks
        pending_payments = Payment.query.filter(Payment.status == 'pending').count()
        open_support_tickets = SupportTicket.query.filter(SupportTicket.status == 'open').count()
        pending_tasks = pending_payments + open_support_tickets
        
        # Lead conversion rate
        total_closed_leads = leads_query.filter(Lead.stage.in_(['closed_won', 'closed_lost'])).count()
        won_leads = leads_query.filter(Lead.stage == 'closed_won').count()
        conversion_rate = (won_leads / total_closed_leads * 100) if total_closed_leads > 0 else 0
        
        return jsonify({
            'stats': {
                'total_leads': total_leads,
                'active_listings': active_listings,
                'inventory_sold': sold_properties,
                'inventory_available': available_properties,
                'revenue_this_month': float(revenue_this_month),
                'pending_tasks': pending_tasks,
                'conversion_rate': round(conversion_rate, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/sales-performance', methods=['GET'])
@jwt_required()
def get_sales_performance():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Get date range (default to last 12 months)
        months = request.args.get('months', 12, type=int)
        
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
            extract('year', PostSale.sale_date).label('year'),
            extract('month', PostSale.sale_date).label('month'),
            func.count(PostSale.id).label('count'),
            func.sum(PostSale.sale_price).label('total')
        ).filter(PostSale.sale_date >= start_date).group_by(
            extract('year', PostSale.sale_date),
            extract('month', PostSale.sale_date)
        ).order_by('year', 'month').all()
        
        # Format data for charts
        sales_data = []
        for sale in monthly_sales:
            month_name = calendar.month_name[int(sale.month)]
            sales_data.append({
                'month': f"{month_name} {int(sale.year)}",
                'count': int(sale.count),
                'total': float(sale.total)
            })
        
        return jsonify({
            'sales_performance': sales_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/lead-sources', methods=['GET'])
@jwt_required()
def get_lead_sources():
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
            func.count(Lead.id).label('count'),
            func.count(func.case([(Lead.stage == 'closed_won', 1)])).label('converted')
        ).group_by(Lead.source).all()
        
        # Format data for charts
        lead_sources = []
        for source in source_data:
            conversion_rate = (source.converted / source.count * 100) if source.count > 0 else 0
            lead_sources.append({
                'source': source.source,
                'count': int(source.count),
                'converted': int(source.converted),
                'conversion_rate': round(conversion_rate, 2)
            })
        
        return jsonify({
            'lead_sources': lead_sources
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/employee-productivity', methods=['GET'])
@jwt_required()
def get_employee_productivity():
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
        
        productivity_data = []
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
            
            # Calculate conversion rate
            conversion_rate = (conversions / leads_handled * 100) if leads_handled > 0 else 0
            
            productivity_data.append({
                'employee_id': employee.id,
                'employee_name': f"{employee.first_name} {employee.last_name}",
                'leads_handled': leads_handled,
                'conversions': conversions,
                'conversion_rate': round(conversion_rate, 2),
                'sales_value': float(sales_value)
            })
        
        return jsonify({
            'employee_productivity': productivity_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/inventory', methods=['GET'])
@jwt_required()
def get_inventory_report():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Build base query
        query = Property.query
        
        # Filter by assigned agent if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Property.assigned_agent_id == current_user_id)
        
        # Group by status
        status_data = db.session.query(
            Property.status,
            func.count(Property.id).label('count'),
            func.sum(Property.price).label('total_value')
        ).group_by(Property.status).all()
        
        # Group by property type
        type_data = db.session.query(
            Property.property_type,
            func.count(Property.id).label('count'),
            func.sum(Property.price).label('total_value')
        ).group_by(Property.property_type).all()
        
        # Group by location
        location_data = db.session.query(
            Property.location,
            func.count(Property.id).label('count'),
            func.sum(Property.price).label('total_value')
        ).group_by(Property.location).all()
        
        return jsonify({
            'inventory_by_status': [
                {
                    'status': item.status,
                    'count': int(item.count),
                    'total_value': float(item.total_value)
                } for item in status_data
            ],
            'inventory_by_type': [
                {
                    'type': item.property_type,
                    'count': int(item.count),
                    'total_value': float(item.total_value)
                } for item in type_data
            ],
            'inventory_by_location': [
                {
                    'location': item.location,
                    'count': int(item.count),
                    'total_value': float(item.total_value)
                } for item in location_data
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/leads', methods=['GET'])
@jwt_required()
def get_leads_report():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Build base query
        query = Lead.query
        
        # Filter by assigned employee if not admin/manager
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Lead.assigned_employee_id == current_user_id)
        
        # Group by stage
        stage_data = db.session.query(
            Lead.stage,
            func.count(Lead.id).label('count')
        ).group_by(Lead.stage).all()
        
        # Group by lead score
        score_data = db.session.query(
            Lead.lead_score,
            func.count(Lead.id).label('count')
        ).group_by(Lead.lead_score).all()
        
        # Monthly lead trends (last 12 months)
        start_date = datetime.utcnow() - timedelta(days=365)
        monthly_leads = db.session.query(
            extract('year', Lead.created_at).label('year'),
            extract('month', Lead.created_at).label('month'),
            func.count(Lead.id).label('count')
        ).filter(Lead.created_at >= start_date).group_by(
            extract('year', Lead.created_at),
            extract('month', Lead.created_at)
        ).order_by('year', 'month').all()
        
        # Format monthly data
        monthly_data = []
        for lead in monthly_leads:
            month_name = calendar.month_name[int(lead.month)]
            monthly_data.append({
                'month': f"{month_name} {int(lead.year)}",
                'count': int(lead.count)
            })
        
        return jsonify({
            'leads_by_stage': [
                {
                    'stage': item.stage,
                    'count': int(item.count)
                } for item in stage_data
            ],
            'leads_by_score': [
                {
                    'score': item.lead_score,
                    'count': int(item.count)
                } for item in score_data
            ],
            'monthly_trends': monthly_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/custom', methods=['POST'])
@jwt_required()
def generate_custom_report():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admin and manager can generate custom reports
        if current_user.role not in ['admin', 'manager']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        report_type = data.get('report_type')
        parameters = data.get('parameters', {})
        
        if not report_type:
            return jsonify({'error': 'Report type is required'}), 400
        
        # This is a placeholder for custom report generation
        # In a real implementation, you would build dynamic queries based on parameters
        
        return jsonify({
            'message': 'Custom report generated successfully',
            'report_type': report_type,
            'parameters': parameters,
            'data': []  # Placeholder for actual report data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
