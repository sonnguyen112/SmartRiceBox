import socket
import json
import uuid

def udp_client(message, server_ip='115.78.92.253', server_port=12345):
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client.sendto(message.encode(), (server_ip, server_port))
    data, addr = client.recvfrom(1024)
    print(f"Received '{data.decode()}' from {addr}")

if __name__ == "__main__":
    data = {
        "imei" : "868333032606955",
        "rice_amount": 100,
        "humidity": 60,
        "temperature": 30,
        "rsrp":0
    }
    print(json.dumps(data))
    udp_client(json.dumps(data))
