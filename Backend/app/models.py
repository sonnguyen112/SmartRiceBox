from .database import Base
from sqlalchemy import TIMESTAMP, Column, Integer, String, ForeignKey, Boolean, BigInteger, Float
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
    name = Column(String(100), nullable=False)
    house_num_street = Column(String(100), nullable=False)
    ward = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    owner_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    alarm_rice_threshold = Column(Integer, nullable=False)
    current_rice_amount = Column(Integer, nullable=True)
    current_humidity = Column(Integer, nullable=True)
    current_temperature = Column(Integer, nullable=True)
    longitude = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    url_dashboard = Column(String(300), nullable=True)
    have_buy_rice_request = Column(Boolean, default=False)
    tick_deliver = Column(Boolean, default=False)