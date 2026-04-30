import psycopg2
import os

# Fetch variables
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not set in environment variables")
    
    # Connect to the database
    connection = psycopg2.connect(DATABASE_URL)
    return connection