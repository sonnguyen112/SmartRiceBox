from .database import Base
from sqlalchemy import TIMESTAMP, Column, Integer, String, ForeignKey, Boolean, BigInteger
from sqlalchemy.sql.expression import text


class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True, nullable=False)
    phone_num = Column(String(20), nullable=False, unique=True)
    role = Column(String(20), nullable=False)
    password = Column(String(100), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text("now()"))

class RiceBox(Base):
    __tablename__ = "ricebox"

    id = Column(BigInteger, primary_key=True, nullable=False)
    access_token = Column(String(100), nullable=False, unique=True)
    name = Column(String(100), nullable=False, unique=True)
    house_num_street = Column(String(20), nullable=False)
    ward = Column(String(20), nullable=False)
    district = Column(String(20), nullable=False)
    alarm_rice_threshold = Column(Integer, nullable=False)
    