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
        query_api = ["106.705339, 10.753545"]
        for e in rice_boxs:
            query_api.append(f"{e.longitude},{e.latitude}")
        query_api = ";".join(query_api)
        print(query_api)
        matrix_duration = requests.get(
            f"https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{query_api}?access_token={settings.mapbox_api}"
        ).json()["durations"]
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
        raise HTTPException(status_code=400,
                            detail="Error in build graph")
    

def find_shortest_route(rice_boxs):
    graph = build_graph(rice_boxs)
    lengh_path,shortest_path = ChristofidesAlgorithm.tsp(graph)
    result = []
    for i in range(1, len(shortest_path)-1):
        result.append(rice_boxs[shortest_path[i]-1])
    return result