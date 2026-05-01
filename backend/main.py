# backend/main.py
from fastapi import Depends, FastAPI

from dotenv import load_dotenv
load_dotenv()

from app.services.db import get_db_connection
from app.routes.auth.auth_route import router as auth_router
from app.routes.project.project_route import router as project_router

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables from .env

def get_db():
    conn = get_db_connection()
    try:
        yield conn
        print("DB connection successful")
    finally:
        conn.close()

@app.get("/time")
def get_time(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT NOW()")
    time = cursor.fetchone()
    cursor.close()
    return {"time": time}


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(auth_router)
app.include_router(project_router)