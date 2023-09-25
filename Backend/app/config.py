from pydantic_settings import BaseSettings
from dotenv import load_dotenv
load_dotenv()

class Settings(BaseSettings):
    database_hostname: str
    database_port: int
    database_username: str
    database_password: str
    database_name: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    thingsboard_username:str
    thingsboard_password:str
    opencage_api_key:str
    thingsboard_url:str
    mapbox_api:str

    class Config:
        env_file = ".env"

settings = Settings()