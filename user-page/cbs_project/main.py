from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from passlib.context import CryptContext
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
# CORS ayarları
orig_origins = [
    "http://127.0.0.1:5501",  # Frontend'in çalıştığı adres
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=orig_origins,  # İzin verilen kökenler
    allow_credentials=True,
    allow_methods=["*"],  # İzin verilen HTTP metodları
    allow_headers=["*"],  # İzin verilen HTTP başlıkları
)

# Veritabanı bağlantısı ve modelleri
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:12345@localhost:3307/cbs_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True)
    password = Column(String(100))

Base.metadata.create_all(bind=engine)

# Şifreleme yapılandırması
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

    
class UserLogin(BaseModel):
    username: str
    password: str

@app.post("/register")
def register_user(user: UserCreate):
    db = SessionLocal()
    db_user = User(username=user.username, email=user.email, password=pwd_context.hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.close()
    return {"username": db_user.username}

@app.post("/login")
def login_user(user: UserLogin):
    db = SessionLocal()
    db_user = db.query(User).filter(User.username == user.username).first()
    db.close()
    if db_user and pwd_context.verify(user.password,db_user.password):
        return {"message": "Login successful"}
    return {"message": "Invalid credentials"}
