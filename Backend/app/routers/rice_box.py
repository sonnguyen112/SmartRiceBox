from fastapi import APIRouter, status, Depends, HTTPException
from .. import schemas, utils, models, oauth2
from sqlalchemy.orm import Session
from ..database import get_db
from typing import List, Dict
from opencage.geocoder import OpenCageGeocode
from ..config import settings
from sqlalchemy import or_

router = APIRouter(
    prefix="/api/rice_box",
    tags=["Rice Box"]
)

geocoder = OpenCageGeocode(settings.opencage_api_key)


@router.get("", status_code=status.HTTP_200_OK, response_model=List[schemas.GetRiceBoxRes])
def getRiceBox(cur_user_id: schemas.TokenData = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    print(cur_user_id)
    devices = db.query(models.RiceBox).filter(
        models.RiceBox.owner_id == cur_user_id).all()
    return devices


@router.put("", status_code=status.HTTP_200_OK, response_model=schemas.UpdateRiceBoxRes)
def updateRiceBox(update_rice_box_req: schemas.UpdateRiceBoxReq, cur_user_id: schemas.TokenData = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    if (update_rice_box_req.longitude and update_rice_box_req.latitude):
        long = update_rice_box_req.longitude
        lat = update_rice_box_req.latitude
    else:
        address = f"{update_rice_box_req.house_num_street}, {update_rice_box_req.ward}, {update_rice_box_req.district}, {update_rice_box_req.city}"
        coord = geocoder.geocode(address)
        long = float(coord[0]['geometry']['lng'])
        lat = float(coord[0]['geometry']['lat'])
    # print(coord[0]['geometry']['lat'], coord[0]['geometry']['lng'])
    rice_box_query = db.query(models.RiceBox).filter(
        models.RiceBox.access_token == update_rice_box_req.rice_box_seri)
    if (rice_box_query.first()):
        rice_box_query.update({
            "house_num_street": update_rice_box_req.house_num_street,
            "ward": update_rice_box_req.ward,
            "district": update_rice_box_req.district,
            "city": update_rice_box_req.city,
            "owner_id": cur_user_id,
            "alarm_rice_threshold": update_rice_box_req.alarm_rice_threshold,
            "name": update_rice_box_req.name,
            "longitude": long,
            "latitude": lat
        })
        db.commit()
        return rice_box_query.first()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Seri Number")


@router.get("/get_marker", status_code=status.HTTP_200_OK, response_model=Dict[int, List[schemas.GetMarkerRes]])
def getMarker(city_filter: str = None, district_filter: str = None, ward_filter: str = None, get_alarm: bool = False, db: Session = Depends(get_db)):
    customers = db.query(models.User).all()
    response = {}
    for customer in customers:
        query = db.query(models.RiceBox).filter(
            models.RiceBox.owner_id == customer.id)
        if city_filter:
            query.filter(models.RiceBox.city == city_filter)
        if district_filter:
            query.filter(models.RiceBox.district == district_filter)
        if ward_filter:
            query.filter(models.RiceBox.ward == ward_filter)
        if get_alarm:
            query.filter(models.RiceBox.current_rice_amount <=
                         models.RiceBox.alarm_rice_threshold)
        response[customer.id] = query.all()

    return response


@router.put("/send_buy_rice_request", status_code=status.HTTP_200_OK)
def send_buy_rice_request(rice_box_id: int, db: Session = Depends(get_db)):
    query = db.query(models.RiceBox).filter(models.RiceBox.id == rice_box_id)
    if (query.first()):
        query.update({
            "have_buy_rice_request": True
        })
        db.commit()
        return {
            "message": "OK"
        }
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Not found rice box")


@router.get("/get_data_table", status_code=status.HTTP_200_OK)
def get_data_table(db: Session = Depends(get_db)):
    response = []
    rice_boxs = db.query(models.RiceBox).filter(or_(models.RiceBox.current_rice_amount <=
                                                models.RiceBox.alarm_rice_threshold, models.RiceBox.have_buy_rice_request == True)).all()
    for e in rice_boxs:
        response.append(
            {
                "imei": e.access_token,
                "address": f"{e.house_num_street}, {e.ward}, {e.district}, {e.city}",
                "phone_num": db.query(models.User).filter(models.User.id == e.owner_id).first().phone_num,
                "status_request": e.have_buy_rice_request,
                "is_tick": e.tick_deliver,
                "amount": e.current_rice_amount
            }
        )
    return response


@router.put("/tick_deliver", status_code=status.HTTP_200_OK)
def tick_deliver(access_token:str, db: Session = Depends(get_db)):
    rice_box_query = db.query(models.RiceBox).filter(models.RiceBox.access_token==access_token)
    if (rice_box_query.first()):
        rice_box_query.update({
            "tick_deliver" : not(rice_box_query.first().tick_deliver)
        })
        db.commit()
        return {
            "message": "OK"
        }
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Seri Number")
    
@router.get("/find_route", status_code=status.HTTP_200_OK)
def find_route(db: Session = Depends(get_db)):
    rice_boxs = db.query(models.RiceBox).filter(models.RiceBox.tick_deliver==True).all()
    shortest_route = utils.find_shortest_route(rice_boxs)
    response = []
    for e in shortest_route:
        response.append(
            {
                "address": f"{e.house_num_street}, {e.ward}, {e.district}, {e.city}",
                "phone": db.query(models.User).filter(e.owner_id==models.User.id).first().phone_num,
                "id": e.id,
                "position" : {
                    "lat": e.latitude,
                    "lng": e.longitude
                }
            }
        )
    return response