from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Notification, User, Lead
from datetime import datetime, timedelta
from sqlalchemy import and_, or_

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        current_user_id = int(get_jwt_identity())
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        # Build query
        query = Notification.query.filter(Notification.user_id == current_user_id)
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        # Order by created_at descending (newest first)
        query = query.order_by(Notification.created_at.desc())
        
        # Paginate results
        notifications = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Count unread notifications
        unread_count = Notification.query.filter(
            and_(
                Notification.user_id == current_user_id,
                Notification.is_read == False
            )
        ).count()
        
        return jsonify({
            'notifications': [notification.to_dict() for notification in notifications.items],
            'total': notifications.total,
            'pages': notifications.pages,
            'current_page': page,
            'per_page': per_page,
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    try:
        current_user_id = int(get_jwt_identity())
        
        notification = Notification.query.filter(
            and_(
                Notification.id == notification_id,
                Notification.user_id == current_user_id
            )
        ).first()
        
        if not notification:
            return jsonify({'error': 'Notification not found'}), 404
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({
            'message': 'Notification marked as read',
            'notification': notification.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    try:
        current_user_id = int(get_jwt_identity())
        
        # Mark all unread notifications as read
        Notification.query.filter(
            and_(
                Notification.user_id == current_user_id,
                Notification.is_read == False
            )
        ).update({'is_read': True})
        
        db.session.commit()
        
        return jsonify({'message': 'All notifications marked as read'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    try:
        current_user_id = int(get_jwt_identity())
        
        notification = Notification.query.filter(
            and_(
                Notification.id == notification_id,
                Notification.user_id == current_user_id
            )
        ).first()
        
        if not notification:
            return jsonify({'error': 'Notification not found'}), 404
        
        db.session.delete(notification)
        db.session.commit()
        
        return jsonify({'message': 'Notification deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/follow-up-reminders', methods=['GET'])
@jwt_required()
def get_follow_up_reminders():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Get leads with follow-up dates in the next 24 hours
        tomorrow = datetime.utcnow() + timedelta(days=1)
        now = datetime.utcnow()
        
        # Build query based on user role
        if current_user.role in ['admin', 'manager']:
            # Admins and managers can see all follow-ups
            leads_query = Lead.query
        else:
            # Employees can only see their assigned leads
            leads_query = Lead.query.filter(Lead.assigned_employee_id == current_user_id)
        
        upcoming_follow_ups = leads_query.filter(
            and_(
                Lead.next_follow_up.isnot(None),
                Lead.next_follow_up <= tomorrow,
                Lead.next_follow_up >= now,
                Lead.stage.notin_(['closed_won', 'closed_lost'])
            )
        ).all()
        
        reminders = []
        for lead in upcoming_follow_ups:
            time_until = lead.next_follow_up - now
            hours_until = int(time_until.total_seconds() / 3600)
            
            if hours_until <= 24:  # Only show reminders for next 24 hours
                reminder = {
                    'lead_id': lead.id,
                    'lead_name': f"{lead.first_name} {lead.last_name}",
                    'follow_up_time': lead.next_follow_up.isoformat(),
                    'hours_until': hours_until,
                    'phone': lead.phone,
                    'stage': lead.stage
                }
                reminders.append(reminder)
        
        return jsonify({
            'reminders': reminders,
            'count': len(reminders)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/check-follow-ups', methods=['POST'])
@jwt_required()
def trigger_follow_up_check():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        # Only admins can trigger this manually
        if current_user.role != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        notifications_created = check_follow_up_reminders()
        
        return jsonify({
            'message': f'Follow-up check completed. Created {notifications_created} notifications.',
            'notifications_created': notifications_created
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Helper function to create notifications
def create_notification(user_id, title, message, notification_type, entity_type=None, entity_id=None):
    """Helper function to create a notification"""
    try:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            entity_type=entity_type,
            entity_id=entity_id
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create notification: {e}")
        return None

# Helper function to create notifications for multiple users
def create_notification_for_users(user_ids, title, message, notification_type, entity_type=None, entity_id=None):
    """Helper function to create notifications for multiple users"""
    notifications = []
    for user_id in user_ids:
        notification = create_notification(
            user_id, title, message, notification_type, entity_type, entity_id
        )
        if notification:
            notifications.append(notification)
    return notifications

# Scheduled task to check for upcoming follow-ups
def check_follow_up_reminders():
    """Check for leads with follow-ups due in the next 24 hours and create notifications"""
    try:
        from datetime import datetime, timedelta
        
        # Get leads with follow-ups in the next 24 hours
        now = datetime.utcnow()
        tomorrow = now + timedelta(hours=24)
        
        upcoming_follow_ups = Lead.query.filter(
            and_(
                Lead.next_follow_up.isnot(None),
                Lead.next_follow_up <= tomorrow,
                Lead.next_follow_up >= now,
                Lead.stage.notin_(['closed_won', 'closed_lost'])
            )
        ).all()
        
        notifications_created = 0
        for lead in upcoming_follow_ups:
            # Check if notification already exists for this follow-up
            existing_notification = Notification.query.filter(
                and_(
                    Notification.user_id == lead.assigned_employee_id,
                    Notification.entity_type == 'lead',
                    Notification.entity_id == lead.id,
                    Notification.type == 'follow_up',
                    Notification.created_at >= now - timedelta(hours=1)  # Within last hour
                )
            ).first()
            
            if not existing_notification:
                time_until = lead.next_follow_up - now
                hours_until = int(time_until.total_seconds() / 3600)
                
                if hours_until <= 24:  # Only create notifications for next 24 hours
                    notification = create_notification(
                        user_id=lead.assigned_employee_id,
                        title='Follow-up Due Soon',
                        message=f'Follow-up with {lead.first_name} {lead.last_name} is due in {hours_until} hours',
                        notification_type='follow_up',
                        entity_type='lead',
                        entity_id=lead.id
                    )
                    if notification:
                        notifications_created += 1
        
        print(f"Created {notifications_created} follow-up reminder notifications")
        return notifications_created
        
    except Exception as e:
        print(f"Error checking follow-up reminders: {e}")
        return 0
