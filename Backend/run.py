import uvicorn
from app.udp_server import ThreadedUDPServer
import multiprocessing

if __name__ == "__main__":
    udp_server = ThreadedUDPServer()
    udp_server_process = multiprocessing.Process(target=udp_server.start)
    udp_server_process.start()

    uvicorn.run(app="app.main:app", host="0.0.0.0", port=12345)