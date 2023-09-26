from passlib.context import CryptContext
import requests
from .config import settings
from fastapi import HTTPException
from . import ChristofidesAlgorithm

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") 

def hash(password):
    return pwd_context.hash(password)

def verify(plain_password, hash_password):
    return pwd_context.verify(plain_password, hash_password)

def build_graph(rice_boxs):
    try:
        storage_lng = 106.69495369143044
        storage_lat = 10.767071077096517
        query_api = [f"{storage_lng},{storage_lat}"]
        for e in rice_boxs:
            query_api.append(f"{e.longitude},{e.latitude}")
        query_api = ";".join(query_api)
        print(query_api)
        matrix_duration = requests.get(
            f"https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{query_api}?access_token={settings.mapbox_api}"
        )
        matrix_duration = matrix_duration.json()
        print(matrix_duration)
        matrix_duration = matrix_duration["durations"]
        graph = {}
        for i in range(len(matrix_duration)):
            for j in range(len(matrix_duration)):
                if j != i:
                    if i not in graph:
                        graph[i] = {}
                    graph[i][j] = matrix_duration[i][j]
        return graph
    except Exception as e:
        print(e)
        return None
    

def find_shortest_route(rice_boxs):
    graph = build_graph(rice_boxs)
    if (graph is None): return []
    lengh_path,shortest_path = ChristofidesAlgorithm.tsp(graph)
    result = []
    for i in range(1, len(shortest_path)-1):
        result.append(rice_boxs[shortest_path[i]-1])
    return result