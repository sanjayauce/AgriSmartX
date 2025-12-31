from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class ResourceProvider(db.Model):
    """Model for agricultural resource providers"""
    __tablename__ = 'resource_providers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # One of the 10 categories
    subcategory = db.Column(db.String(50))  # Specific type within category
    description = db.Column(db.Text)
    website = db.Column(db.String(200))
    logo_url = db.Column(db.String(200))
    contact_email = db.Column(db.String(100))
    contact_phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    state = db.Column(db.String(50))
    district = db.Column(db.String(50))
    services = db.Column(db.Text)  # JSON string of services offered
    certifications = db.Column(db.Text)  # JSON string of certifications
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    products = db.relationship('Product', backref='provider', lazy=True)
    reviews = db.relationship('Review', backref='provider', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'subcategory': self.subcategory,
            'description': self.description,
            'website': self.website,
            'logo_url': self.logo_url,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'address': self.address,
            'state': self.state,
            'district': self.district,
            'services': self.services,
            'certifications': self.certifications,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Product(db.Model):
    """Model for products offered by resource providers"""
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('resource_providers.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float)
    unit = db.Column(db.String(20))  # e.g., kg, liter, piece
    specifications = db.Column(db.Text)  # JSON string of product specifications
    availability = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'provider_id': self.provider_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price': self.price,
            'unit': self.unit,
            'specifications': self.specifications,
            'availability': self.availability,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Review(db.Model):
    """Model for reviews of resource providers"""
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('resource_providers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'provider_id': self.provider_id,
            'user_id': self.user_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class User(db.Model):
    """Model for users who can review resource providers"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # farmer, resource_provider, admin, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reviews = db.relationship('Review', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Message(db.Model):
    """Model for messages sent by admin to roles"""
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    recipient_roles = db.Column(db.Text, nullable=False)  # JSON string of roles
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'content': self.content,
            'recipient_roles': json.loads(self.recipient_roles),
            'sent_at': self.sent_at.isoformat() if self.sent_at else None
        } 