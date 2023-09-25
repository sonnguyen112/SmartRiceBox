import socket
import json

def udp_client(message, server_ip='localhost', server_port=12345):
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client.sendto(message.encode(), (server_ip, server_port))
    data, addr = client.recvfrom(1024)
    print(f"Received '{data.decode()}' from {addr}")

if __name__ == "__main__":
    data = {
        "imei" : "1415672829129",
        "rice_amount": 5,
        "humidity": 100,
        "temperature": 100
    }
    udp_client(json.dumps(data))
