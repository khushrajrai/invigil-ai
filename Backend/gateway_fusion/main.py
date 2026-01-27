import httpx
import asyncio
import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fusion_module import TemporalBehaviorFusionModel, FusionFeatures

app = FastAPI()
fusion_model = TemporalBehaviorFusionModel()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with specific domains in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Env-driven service URLs
VISION_URL = os.getenv("VISION_URL", "http://vision:8001/process")
IDENTITY_URL = os.getenv("IDENTITY_URL", "http://identity:8002")  # Base URL
AUDIO_URL = os.getenv("AUDIO_URL", "http://audio:8003/get_features")

#-----------------------------------------------
# Enrollment: Supports multi-file upload
#-----------------------------------------------
@app.post("/enroll")
async def enroll_student(student_name: str = Form(...), files: list[UploadFile] = File(...)):
    target_url = f"{IDENTITY_URL}/enroll"
    
    async with httpx.AsyncClient(timeout=None) as client:
        upload_files = []
        for file in files:
            content = await file.read()
            # Ensure the key is "files" to match what identity_service/main.py expects
            upload_files.append(("files", (file.filename, content, file.content_type)))
        
        response = await client.post(
            target_url,
            data={"student_name": student_name},
            files=upload_files
        )
        return response.json()
#-----------------------------------------------
# Trigger Identity model training
#-----------------------------------------------
@app.post("/train")
async def train_identity():
    target_url = f"{IDENTITY_URL}/train"
    async with httpx.AsyncClient(timeout=None) as client:
        response = await client.post(target_url)
        return response.json()

#-----------------------------------------------
# Analyze session: Vision + Identity + Audio
#-----------------------------------------------
@app.post("/analyze")
async def analyze_session(file: UploadFile = File(...)):
    contents = await file.read()
    
    async with httpx.AsyncClient(timeout=None) as client:
        # parallel requests
        vision_task = client.post(VISION_URL, files={"file": contents})
        identity_task = client.post(f"{IDENTITY_URL}/process", files={"file": contents})
        audio_task = client.get(AUDIO_URL)

        v_res, id_res, a_res = await asyncio.gather(vision_task, identity_task, audio_task)

    v_data = v_res.json()
    id_data = id_res.json()
    a_data = a_res.json()

    # Map to fusion features
    features = FusionFeatures(
        audio_t2=a_data[0], audio_t5=a_data[1], audio_conf=a_data[2],
        vis_phone=v_data[0], vis_multi=v_data[1], vis_miss=v_data[2],
        id_dom=id_data[0], id_switch=id_data[1], id_unkn=id_data[2],
        gaze_off=v_data[3], gaze_turn=v_data[4]
    )

    risk_score = fusion_model.calculate_risk(features)
    status, message = fusion_model.get_violation_status(features)

    return {"risk_score": risk_score, "status": status, "message": message}

#-----------------------------------------------
# Local dev entrypoint
#-----------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
