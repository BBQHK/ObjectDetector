import os
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from ObjectDetector import Detect

# check if the uploads and outputs folder exists
if not os.path.exists("uploads"):
    os.mkdir("uploads")
if not os.path.exists("outputs"):
    os.mkdir("outputs")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    file_path = os.path.join("uploads", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    output_path = os.path.join("outputs", file.filename)
    Detect(file_path, output_path)

    # return the detected image
    return FileResponse(output_path, media_type="image/jpeg")