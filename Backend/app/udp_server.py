import requests
import os
import json
import socket
import threading
from .config import settings
import uuid
from sqlalchemy.orm import Session
from .database import get_db
from fastapi import Depends
from . import models


class ThreadedUDPServer:
    def __init__(self, host='0.0.0.0', port=12345):
        self.server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.server.bind((host, port))

    def start(self):
        print("UDP Start")
        while True:
            data, addr = self.server.recvfrom(1024)
            threading.Thread(target=self.handle_client,
                             args=(data, addr)).start()

    def get_auth_token_thingsboard(self):
        token_response = requests.post(
            f"{settings.thingsboard_url}/api/auth/login",
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "username": "{}".format(settings.thingsboard_username),
                "password": "{}".format(settings.thingsboard_password)
            })
        )
        # print(token_response.json())
        token = token_response.json()["token"]
        return token

    def add_new_device(self, data, addr, db: Session = next(get_db())):
        add_device_payload = json.dumps(
            {
                "device": {
                    "name": f"Rice_Box_{data['imei']}",
                    "label": "Rice Box",
                    "deviceProfileId": {
                        "entityType": "DEVICE_PROFILE",
                        "id": "63bba4b0-5451-11ee-8a92-55c95dc16ff3"
                    },
                    "additionalInfo": {
                        "gateway": False,
                        "overwriteActivityTime": False,
                        "description": ""
                    },
                    "customerId": None
                },
                "credentials": {
                    "credentialsType": "ACCESS_TOKEN",
                    "credentialsId": f"{data['imei']}",
                    "credentialsValue": None
                }
            }
        )
        # print(add_device_payload)
        add_device_response = requests.post(
            f"{settings.thingsboard_url}/api/device-with-credentials",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.get_auth_token_thingsboard()}'
            },
            data=add_device_payload
        )
        if add_device_response.ok:
            make_device_public_res = requests.post(
                f"{settings.thingsboard_url}/api/customer/public/device/{add_device_response.json()['id']['id']}",
                headers={
                    'Authorization': f'Bearer {self.get_auth_token_thingsboard()}'
                }
            )
            if (make_device_public_res.ok):
                dashboard_url = self.add_new_dashboard(
                    add_device_response.json()["id"]["id"], data['imei'])
                if dashboard_url:
                    print("Add device to Thingsboard")
                    new_device = models.RiceBox(
                        access_token=data["imei"],
                        name=f"Rice_Box_{data['imei']}",
                        house_num_street="",
                        ward="",
                        district="",
                        city="",
                        alarm_rice_threshold=20,
                        url_dashboard=dashboard_url
                    )
                    db.add(new_device)
                    db.commit()
                    self.server.sendto("OK".encode(), addr)
                else:
                    self.server.sendto("ERROR".encode(), addr)
            else:
                print(make_device_public_res.text)
                self.server.sendto("ERROR".encode(), addr)
        else:
            print(add_device_response.text)
            self.server.sendto("ERROR".encode(), addr)

    def update_attribute_device(self, data, addr, db: Session = next(get_db())):
        update_attribute_payload = json.dumps({
            "rice_amount": data["rice_amount"],
            "humidity": data["humidity"],
            "temperature": data["temperature"]
        })

        update_response = requests.post(
            f"{settings.thingsboard_url}/api/v1/{data['imei']}/telemetry",
            headers={
                "Content-Type": "application/json"
            },
            data=update_attribute_payload
        )
        if update_response.ok:
            device_query = db.query(models.RiceBox).filter(
                models.RiceBox.access_token == data["imei"])
            if (device_query.first().current_rice_amount != None and data["rice_amount"] > device_query.first().current_rice_amount + 10):
                device_query.update({
                    "current_rice_amount": data["rice_amount"],
                    "current_humidity": data["humidity"],
                    "current_temperature": data["temperature"],
                    "have_buy_rice_request" : False,
                    "tick_deliver" : False
                })
                db.commit()
            else:
                device_query.update({
                    "current_rice_amount": data["rice_amount"],
                    "current_humidity": data["humidity"],
                    "current_temperature": data["temperature"]
                })
                db.commit()
            if (device_query.first().alarm_rice_threshold != None and data["rice_amount"] <= device_query.first().alarm_rice_threshold):
                self.push_notification(device_query.first())
            self.server.sendto("OK".encode(), addr)
        else:
            self.server.sendto("ERROR".encode(), addr)

    def push_notification(self, rice_box, db: Session = next(get_db())):

        try:
            url = "https://app.nativenotify.com/api/indie/notification"

            payload = json.dumps({
                "subID": db.query(models.User).filter(models.User.id == rice_box.owner_id).first().phone_num,
                "appId": 12544,
                "appToken": "E7ZuZRkeUzZrSmf6B2Gjrd",
                "title": "Thông báo về số lượng gạo",
                "message": f'Thùng gạo với tên "{rice_box.name}" của bạn sắp hết, vui lòng sử dụng chức năng mua thêm gạo trong ứng dụng để chúng tôi nhanh chóng cung cấp gạo cho bạn nhé. Xin trân trong cảm ơn bạn. Chúc bạn một ngày tốt lành!'
            })
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.request("POST", url, headers=headers, data=payload)
            print(response.text)
        except Exception as e:
            print(e)

    def handle_client(self, data, addr, db: Session = next(get_db())):
        data = json.loads(data.decode())
        print(f"Received '{data}' from {addr}")

        exist_device = db.query(models.RiceBox).filter(
            models.RiceBox.access_token == data["imei"]).first()
        if (exist_device):
            self.update_attribute_device(data, addr)
        else:
            self.add_new_device(data, addr)

    def add_new_dashboard(self, device_id, imei):
        add_new_dashboard_payload = json.dumps({
            "title": f"Rice_Box_Dashboard_{imei}",
            "image": None,
            "mobileHide": None,
            "mobileOrder": None,
            "configuration": {
                "description": ""
            }
        })
        add_new_dashboard_res = requests.post(
            f"{settings.thingsboard_url}/api/dashboard",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.get_auth_token_thingsboard()}'
            },
            data=add_new_dashboard_payload
        )
        # print(add_new_dashboard_payload)
        dashboard_id = add_new_dashboard_res.json()["id"]["id"]
        # print(dashboard_id)

        # Set up Dashboard
        f = open(r"./app/json_payloads/set_up_dashboard_payload.json")
        set_up_dashboard_payload = json.load(f)
        f.close()
        # print(set_up_dashboard_payload)
        set_up_dashboard_payload["id"]["id"] = dashboard_id
        set_up_dashboard_payload["title"] = f"Rice_Box_Dashboard_{imei}"
        set_up_dashboard_payload["configuration"]["widgets"][
            "2b0011ba-bdb5-dd75-9f18-2e42bbb6b5a5"]["config"]["datasources"][0]["deviceId"] = device_id
        set_up_dashboard_payload["configuration"]["widgets"][
            "41aa6afa-8548-f130-c145-51d6160b1fec"]["config"]["datasources"][0]["deviceId"] = device_id
        set_up_dashboard_payload["configuration"]["widgets"][
            "6226385c-b906-dc78-6e50-a0ba06a47e71"]["config"]["datasources"][0]["deviceId"] = device_id
        set_up_dashboard_payload["configuration"]["widgets"][
            "74141f86-4b04-92ea-a440-3b11294b6e83"]["config"]["datasources"][0]["deviceId"] = device_id
        set_up_dashboard_payload["configuration"]["widgets"][
            "8e4e51a0-2407-8a2e-a406-994f8c77811f"]["config"]["datasources"][0]["deviceId"] = device_id
        set_up_dashboard_payload["name"] = f"Rice_Box_Dashboard_{imei}"
        set_up_dashboard_payload["configuration"]["states"][
            "default"]["name"] = f"Rice_Box_Dashboard_{imei}"
        set_up_dashboard_payload = json.dumps(set_up_dashboard_payload)
        set_up_dashboard_res = requests.post(
            f"{settings.thingsboard_url}/api/dashboard",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.get_auth_token_thingsboard()}'
            },
            data=set_up_dashboard_payload
        )
        if (set_up_dashboard_res.ok):
            make_public_res = requests.post(
                f"{settings.thingsboard_url}/api/customer/public/dashboard/{dashboard_id}",
                headers={
                    'Authorization': f'Bearer {self.get_auth_token_thingsboard()}'
                },
            )
            if (make_public_res.ok):
                public_url = f"{settings.thingsboard_url}/dashboard/{dashboard_id}?publicId={make_public_res.json()['assignedCustomers'][0]['customerId']['id']}"
                print("URL", public_url)
                return public_url
            else:
                print(make_public_res.text)
                return None
        else:
            print(set_up_dashboard_res.text)
            return None
