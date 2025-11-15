#!/usr/bin/env python3
"""
Script to fix blob URLs in the database
This will remove blob URLs and replace them with empty arrays
"""

import mysql.connector
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def fix_blob_images():
    try:
        # Connect to database
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='real_estate_crm'
        )
        cursor = conn.cursor()
        
        # Get all properties with images
        cursor.execute("SELECT id, images FROM properties WHERE images IS NOT NULL")
        properties = cursor.fetchall()
        
        print(f"Found {len(properties)} properties with images")
        
        updated_count = 0
        
        for property_id, images_json in properties:
            if not images_json:
                continue
                
            try:
                images = json.loads(images_json)
                if not isinstance(images, list):
                    continue
                    
                # Check if any images are blob URLs
                has_blob = any(isinstance(img, str) and img.startswith('blob:') for img in images)
                
                if has_blob:
                    # Remove blob URLs, keep only valid server URLs
                    valid_images = [img for img in images if isinstance(img, str) and not img.startswith('blob:')]
                    
                    # Update the database
                    cursor.execute(
                        "UPDATE properties SET images = %s WHERE id = %s",
                        (json.dumps(valid_images), property_id)
                    )
                    
                    print(f"Property {property_id}: Removed {len(images) - len(valid_images)} blob URLs, kept {len(valid_images)} valid images")
                    updated_count += 1
                    
            except json.JSONDecodeError:
                print(f"Property {property_id}: Invalid JSON in images field")
                continue
        
        # Commit changes
        conn.commit()
        print(f"\n✅ Updated {updated_count} properties")
        print("Blob URLs have been removed from the database")
        
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    print("🔧 Fixing blob URLs in property images...")
    fix_blob_images()
    print("✅ Done!")

