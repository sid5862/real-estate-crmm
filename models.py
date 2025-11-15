from sqlalchemy import DECIMAL
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Import db from database.py
from database import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    avatar = db.Column(db.String(255))  # Profile picture URL
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    pincode = db.Column(db.String(10))
    role = db.Column(db.String(20), nullable=False, default='employee')  # admin, manager, sales_agent, employee
    permissions = db.Column(db.JSON)  # Store allowed tabs/sections as JSON array
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assigned_leads = db.relationship('Lead', backref='assigned_employee', lazy=True)
    assigned_properties = db.relationship('Property', backref='assigned_agent', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'avatar': self.avatar,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'role': self.role,
            'permissions': self.permissions,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Property(db.Model):
    __tablename__ = 'properties'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Information
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    property_type = db.Column(db.String(50), nullable=False)  # residential, commercial, plot, etc.
    sub_type = db.Column(db.String(50))  # 1bhk, 2bhk, office, retail, etc.
    location = db.Column(db.String(200), nullable=False)
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    pincode = db.Column(db.String(10))
    landmark = db.Column(db.String(200))
    
    # Pricing & Financial
    price = db.Column(DECIMAL(15, 2), nullable=False)
    price_per_sqft = db.Column(DECIMAL(10, 2))
    maintenance_charges = db.Column(DECIMAL(10, 2))
    booking_amount = db.Column(DECIMAL(10, 2))
    registration_charges = db.Column(DECIMAL(10, 2))
    stamp_duty = db.Column(DECIMAL(10, 2))
    gst = db.Column(DECIMAL(10, 2))
    possession_date = db.Column(db.Date)
    
    # Property Specifications
    area = db.Column(DECIMAL(10, 2))  # in sq ft
    built_up_area = db.Column(DECIMAL(10, 2))
    carpet_area = db.Column(DECIMAL(10, 2))
    super_built_up_area = db.Column(DECIMAL(10, 2))
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Integer)
    balconies = db.Column(db.Integer)
    floors = db.Column(db.Integer)
    total_floors = db.Column(db.Integer)
    floor_number = db.Column(db.Integer)
    direction = db.Column(db.String(20))  # north, south, east, west
    age_of_property = db.Column(db.String(50))
    furnishing_status = db.Column(db.String(50))
    
    # Legal & Documentation
    ownership_type = db.Column(db.String(50))
    property_documents = db.Column(db.JSON)  # Store document URLs as JSON array
    legal_status = db.Column(db.String(50))
    rera_registration = db.Column(db.String(100))
    khata_certificate = db.Column(db.String(50))
    encumbrance_certificate = db.Column(db.String(50))
    
    # Amenities & Features
    amenities = db.Column(db.JSON)  # Store amenities as JSON array
    parking = db.Column(db.String(50))
    power_backup = db.Column(db.String(50))
    water_supply = db.Column(db.String(50))
    security = db.Column(db.String(50))
    internet_connectivity = db.Column(db.String(50))
    
    # Location & Connectivity
    nearby_schools = db.Column(db.String(500))
    nearby_hospitals = db.Column(db.String(500))
    nearby_malls = db.Column(db.String(500))
    nearby_metro = db.Column(db.String(200))
    nearby_bus_stop = db.Column(db.String(200))
    distance_to_airport = db.Column(db.String(100))
    distance_to_railway = db.Column(db.String(100))
    
    # Status & Visibility
    status = db.Column(db.String(20), default='available')  # available, sold, rented, leased, upcoming
    listing_type = db.Column(db.String(20), default='sale')  # sale, rent
    priority = db.Column(db.String(20), default='normal')  # normal, high, urgent
    featured = db.Column(db.Boolean, default=False)
    images = db.Column(db.JSON)  # Store image URLs as JSON array
    floor_plans = db.Column(db.JSON)  # Store floor plan URLs as JSON array
    virtual_tour = db.Column(db.String(500))
    assigned_agent_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    is_website_visible = db.Column(db.Boolean, default=True)
    
    # Additional Information
    highlights = db.Column(db.Text)
    additional_info = db.Column(db.Text)
    contact_person = db.Column(db.String(100))
    contact_phone = db.Column(db.String(20))
    contact_email = db.Column(db.String(120))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    leads = db.relationship('Lead', backref='property', lazy=True)
    post_sales = db.relationship('PostSale', backref='property', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            # Basic Information
            'title': self.title,
            'description': self.description,
            'property_type': self.property_type,
            'sub_type': self.sub_type,
            'location': self.location,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'landmark': self.landmark,
            
            # Pricing & Financial
            'price': float(self.price) if self.price else None,
            'price_per_sqft': float(self.price_per_sqft) if self.price_per_sqft else None,
            'maintenance_charges': float(self.maintenance_charges) if self.maintenance_charges else None,
            'booking_amount': float(self.booking_amount) if self.booking_amount else None,
            'registration_charges': float(self.registration_charges) if self.registration_charges else None,
            'stamp_duty': float(self.stamp_duty) if self.stamp_duty else None,
            'gst': float(self.gst) if self.gst else None,
            'possession_date': self.possession_date.isoformat() if self.possession_date else None,
            
            # Property Specifications
            'area': float(self.area) if self.area else None,
            'built_up_area': float(self.built_up_area) if self.built_up_area else None,
            'carpet_area': float(self.carpet_area) if self.carpet_area else None,
            'super_built_up_area': float(self.super_built_up_area) if self.super_built_up_area else None,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'balconies': self.balconies,
            'floors': self.floors,
            'total_floors': self.total_floors,
            'floor_number': self.floor_number,
            'direction': self.direction,
            'age_of_property': self.age_of_property,
            'furnishing_status': self.furnishing_status,
            
            # Legal & Documentation
            'ownership_type': self.ownership_type,
            'property_documents': self.property_documents or [],
            'legal_status': self.legal_status,
            'rera_registration': self.rera_registration,
            'khata_certificate': self.khata_certificate,
            'encumbrance_certificate': self.encumbrance_certificate,
            
            # Amenities & Features
            'amenities': self.amenities or [],
            'parking': self.parking,
            'power_backup': self.power_backup,
            'water_supply': self.water_supply,
            'security': self.security,
            'internet_connectivity': self.internet_connectivity,
            
            # Location & Connectivity
            'nearby_schools': self.nearby_schools,
            'nearby_hospitals': self.nearby_hospitals,
            'nearby_malls': self.nearby_malls,
            'nearby_metro': self.nearby_metro,
            'nearby_bus_stop': self.nearby_bus_stop,
            'distance_to_airport': self.distance_to_airport,
            'distance_to_railway': self.distance_to_railway,
            
            # Status & Visibility
            'status': self.status,
            'listing_type': self.listing_type,
            'priority': self.priority,
            'featured': self.featured,
            'images': self.images or [],
            'floor_plans': self.floor_plans or [],
            'virtual_tour': self.virtual_tour,
            'assigned_agent_id': self.assigned_agent_id,
            'is_website_visible': self.is_website_visible,
            
            # Additional Information
            'highlights': self.highlights,
            'additional_info': self.additional_info,
            'contact_person': self.contact_person,
            'contact_phone': self.contact_phone,
            'contact_email': self.contact_email,
            
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Lead(db.Model):
    __tablename__ = 'leads'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(20), nullable=False)
    source = db.Column(db.String(100), nullable=False)  # website, manual, referral, etc.
    status = db.Column(db.String(30), default='new')  # new, contacted, qualified, proposal, negotiation, closed_won, closed_lost
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    assigned_employee_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    budget = db.Column(DECIMAL(15, 2))
    notes = db.Column(db.Text)
    next_follow_up = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    communications = db.relationship('Communication', backref='lead', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'source': self.source,
            'status': self.status,
            'property_id': self.property_id,
            'assigned_employee_id': self.assigned_employee_id,
            'budget': float(self.budget) if self.budget else None,
            'notes': self.notes,
            'next_follow_up': self.next_follow_up.isoformat() if self.next_follow_up else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Communication(db.Model):
    __tablename__ = 'communications'
    
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # call, email, sms, meeting
    subject = db.Column(db.String(200))
    content = db.Column(db.Text)
    direction = db.Column(db.String(10), nullable=False)  # inbound, outbound
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'lead_id': self.lead_id,
            'type': self.type,
            'subject': self.subject,
            'content': self.content,
            'direction': self.direction,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PostSale(db.Model):
    __tablename__ = 'post_sales'
    
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    sale_price = db.Column(DECIMAL(15, 2), nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False)
    payment_status = db.Column(db.String(20), default='pending')  # pending, partial, completed
    documents = db.Column(db.JSON)  # Store document URLs as JSON array
    handover_date = db.Column(db.DateTime)
    possession_date = db.Column(db.DateTime)
    warranty_start_date = db.Column(db.DateTime)
    warranty_end_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    payments = db.relationship('Payment', backref='post_sale', lazy=True, cascade='all, delete-orphan')
    support_tickets = db.relationship('SupportTicket', backref='post_sale', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'lead_id': self.lead_id,
            'property_id': self.property_id,
            'sale_price': float(self.sale_price) if self.sale_price else None,
            'sale_date': self.sale_date.isoformat() if self.sale_date else None,
            'payment_status': self.payment_status,
            'documents': self.documents or [],
            'handover_date': self.handover_date.isoformat() if self.handover_date else None,
            'possession_date': self.possession_date.isoformat() if self.possession_date else None,
            'warranty_start_date': self.warranty_start_date.isoformat() if self.warranty_start_date else None,
            'warranty_end_date': self.warranty_end_date.isoformat() if self.warranty_end_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    post_sale_id = db.Column(db.Integer, db.ForeignKey('post_sales.id'), nullable=False)
    payment_type = db.Column(db.String(20), nullable=False)  # token, down_payment, installment, final_payment
    amount = db.Column(DECIMAL(15, 2), nullable=False)
    due_date = db.Column(db.DateTime)
    paid_date = db.Column(db.DateTime)
    payment_method = db.Column(db.String(20))  # cash, cheque, online, bank_transfer
    reference_number = db.Column(db.String(100))
    status = db.Column(db.String(20), default='pending')  # pending, paid, overdue
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'post_sale_id': self.post_sale_id,
            'payment_type': self.payment_type,
            'amount': float(self.amount) if self.amount else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'paid_date': self.paid_date.isoformat() if self.paid_date else None,
            'payment_method': self.payment_method,
            'reference_number': self.reference_number,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class SupportTicket(db.Model):
    __tablename__ = 'support_tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    post_sale_id = db.Column(db.Integer, db.ForeignKey('post_sales.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent
    status = db.Column(db.String(20), default='open')  # open, in_progress, resolved, closed
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    resolution = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'post_sale_id': self.post_sale_id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'status': self.status,
            'assigned_to': self.assigned_to,
            'resolution': self.resolution,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    report_type = db.Column(db.String(50), nullable=False)  # sales, inventory, leads, employee_performance
    parameters = db.Column(db.JSON)  # Store report parameters as JSON
    generated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'report_type': self.report_type,
            'parameters': self.parameters or {},
            'generated_by': self.generated_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Activity(db.Model):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)  # 'profile_update', 'property_added', 'lead_added', etc.
    description = db.Column(db.String(500), nullable=False)
    entity_type = db.Column(db.String(50))  # 'user', 'property', 'lead', etc.
    entity_id = db.Column(db.Integer)  # ID of the related entity
    activity_metadata = db.Column(db.JSON)  # Additional data about the activity
    created_at = db.Column(db.DateTime, default=lambda: datetime.now())

    # Relationships
    user = db.relationship('User', backref='activities')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'activity_type': self.activity_type,
            'description': self.description,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'metadata': self.activity_metadata,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_name': f"{self.user.first_name} {self.user.last_name}" if self.user else None
        }

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # Relationships
    user = db.relationship('User', backref='favorites', lazy=True)
    property = db.relationship('Property', backref='favorited_by', lazy=True)
    
    # Unique constraint to prevent duplicate favorites
    __table_args__ = (db.UniqueConstraint('user_id', 'property_id', name='unique_user_property_favorite'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'property_id': self.property_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'property': self.property.to_dict() if self.property else None
        }

class PropertyShortcode(db.Model):
    __tablename__ = 'property_shortcodes'
    
    id = db.Column(db.Integer, primary_key=True)
    shortcode = db.Column(db.String(20), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)  # User-friendly name
    description = db.Column(db.Text)  # Optional description
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Filter options (stored as JSON)
    filters = db.Column(db.JSON)  # Store filter criteria as JSON
    
    # Display options
    display_options = db.Column(db.JSON)  # Store display settings as JSON
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', backref='created_shortcodes')
    
    def to_dict(self):
        return {
            'id': self.id,
            'shortcode': self.shortcode,
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'filters': self.filters,
            'display_options': self.display_options,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # lead, follow_up, property, system, etc.
    entity_type = db.Column(db.String(50))  # lead, property, user, etc.
    entity_id = db.Column(db.Integer)  # ID of the related entity
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='notifications', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None
        }
