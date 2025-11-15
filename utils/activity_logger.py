from database import db
from models import Activity
from datetime import datetime

def log_activity(user_id, activity_type, description, entity_type=None, entity_id=None, metadata=None):
    """
    Log an activity for a user
    
    Args:
        user_id (int): ID of the user performing the activity
        activity_type (str): Type of activity (e.g., 'profile_update', 'property_added')
        description (str): Human-readable description of the activity
        entity_type (str, optional): Type of entity affected (e.g., 'user', 'property')
        entity_id (int, optional): ID of the entity affected
        metadata (dict, optional): Additional data about the activity
    """
    try:
        activity = Activity(
            user_id=user_id,
            activity_type=activity_type,
            description=description,
            entity_type=entity_type,
            entity_id=entity_id,
            activity_metadata=metadata or {}
        )
        db.session.add(activity)
        db.session.commit()
        return activity
    except Exception as e:
        print(f"Error logging activity: {e}")
        db.session.rollback()
        return None

def log_profile_update(user_id, field_name, old_value, new_value):
    """Log a profile update activity"""
    description = f"Updated {field_name.replace('_', ' ').title()}"
    if old_value and new_value:
        description += f" from '{old_value}' to '{new_value}'"
    elif new_value:
        description += f" to '{new_value}'"
    
    return log_activity(
        user_id=user_id,
        activity_type='profile_update',
        description=description,
        entity_type='user',
        entity_id=user_id,
        metadata={
            'field_name': field_name,
            'old_value': old_value,
            'new_value': new_value
        }
    )

def log_property_added(user_id, property_id, property_title):
    """Log a property addition activity"""
    return log_activity(
        user_id=user_id,
        activity_type='property_added',
        description=f"Added new property: {property_title}",
        entity_type='property',
        entity_id=property_id,
        metadata={'property_title': property_title}
    )

def log_lead_added(user_id, lead_id, lead_name):
    """Log a lead addition activity"""
    return log_activity(
        user_id=user_id,
        activity_type='lead_added',
        description=f"Added new lead: {lead_name}",
        entity_type='lead',
        entity_id=lead_id,
        metadata={'lead_name': lead_name}
    )
