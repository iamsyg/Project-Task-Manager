# backend/app/utils/auth.py

from dotenv import load_dotenv

load_dotenv()  

from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import os
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7


def hash_password(password: str):
    password = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    password = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.verify(password, hashed)


# 🔐 Access Token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# 🔐 Refresh Token
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)