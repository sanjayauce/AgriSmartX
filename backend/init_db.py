from flask_migrate import Migrate, init, migrate, upgrade
from app import app, db
from seed_data import seed_resource_providers

def init_database():
    """Initialize the database with migrations and seed data"""
    migrate = Migrate(app, db)
    
    with app.app_context():
        # Initialize migrations
        try:
            init()
            print("Initialized migrations")
        except Exception as e:
            print(f"Migrations already initialized: {str(e)}")
        
        # Create migration
        try:
            migrate()
            print("Created migration")
        except Exception as e:
            print(f"Error creating migration: {str(e)}")
        
        # Apply migration
        try:
            upgrade()
            print("Applied migration")
        except Exception as e:
            print(f"Error applying migration: {str(e)}")
        
        # Seed data
        try:
            seed_resource_providers()
            print("Database initialization completed successfully")
        except Exception as e:
            print(f"Error seeding data: {str(e)}")

if __name__ == "__main__":
    init_database() 