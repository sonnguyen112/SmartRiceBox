from fastapi import APIRouter, status, Depends
from .. import schemas, utils, models
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags = ["Auth"]
)

@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user:schemas.UserCreate, db: Session = Depends(get_db)):
    #hash the password
    hashed_password = utils.hash(user.password)
    user.password = hashed_password
     
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user