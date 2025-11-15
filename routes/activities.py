from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Activity, User
from datetime import datetime, timedelta
from sqlalchemy import desc

activities_bp = Blueprint('activities', __name__)

@activities_bp.route('/activities', methods=['GET'])
@jwt_required()
def get_activities():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        activity_type = request.args.get('type', 'all')
        search = request.args.get('search', '')
        
        # Build query
        query = Activity.query
        
        # Filter by activity type if specified
        if activity_type != 'all':
            query = query.filter(Activity.activity_type == activity_type)
        
        # Filter by search term if provided
        if search:
            query = query.filter(
                Activity.description.contains(search) |
                Activity.user.has(User.first_name.contains(search)) |
                Activity.user.has(User.last_name.contains(search))
            )
        
        # Order by most recent first
        query = query.order_by(desc(Activity.created_at))
        
        # Paginate results
        paginated_activities = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        activities = []
        for activity in paginated_activities.items:
            activities.append(activity.to_dict())
        
        return jsonify({
            'activities': activities,
            'total': paginated_activities.total,
            'page': page,
            'per_page': per_page,
            'pages': paginated_activities.pages
        }), 200
        
    except Exception as e:
        print(f"Error fetching activities: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@activities_bp.route('/activities/stats', methods=['GET'])
@jwt_required()
def get_activity_stats():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get date range (default to last 30 days)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Get activity counts by type
        activity_counts = db.session.query(
            Activity.activity_type,
            db.func.count(Activity.id).label('count')
        ).filter(
            Activity.created_at >= start_date
        ).group_by(Activity.activity_type).all()
        
        # Get daily activity counts
        daily_counts = db.session.query(
            db.func.date(Activity.created_at).label('date'),
            db.func.count(Activity.id).label('count')
        ).filter(
            Activity.created_at >= start_date
        ).group_by(
            db.func.date(Activity.created_at)
        ).order_by('date').all()
        
        # Get most active users
        user_counts = db.session.query(
            User.first_name,
            User.last_name,
            db.func.count(Activity.id).label('count')
        ).join(Activity).filter(
            Activity.created_at >= start_date
        ).group_by(User.id, User.first_name, User.last_name).order_by(
            db.func.count(Activity.id).desc()
        ).limit(10).all()
        
        return jsonify({
            'activity_counts': [
                {'type': count.activity_type, 'count': count.count} 
                for count in activity_counts
            ],
            'daily_counts': [
                {'date': str(count.date), 'count': count.count} 
                for count in daily_counts
            ],
            'top_users': [
                {'name': f"{user.first_name} {user.last_name}", 'count': user.count} 
                for user in user_counts
            ]
        }), 200
        
    except Exception as e:
        print(f"Error fetching activity stats: {e}")
        return jsonify({'error': str(e)}), 500
