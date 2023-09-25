from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, rice_box

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(rice_box.router)

@app.get("/")
async def root():
    return {"message": "Hello Smart Rice Box"}
