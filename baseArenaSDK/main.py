from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import os 
from dotenv import load_dotenv
from baseAgent import normal_chat, structured_rag_output

load_dotenv()
api_key = os.environ.get("COHERE_API_KEY")

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:5000",
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class Position(BaseModel):
    x: float
    y: float

class GameObjectState(BaseModel):
    position: Position
    state: str

class SlingshotState(BaseModel):
    birdToThrow: str
    slingshotState: str

class GameData(BaseModel):
    currentGameState: str
    birds: List[GameObjectState]
    pigs: List[GameObjectState]
    bricks: List[GameObjectState]
    slingshot: SlingshotState

@app.post("/getUserData")
async def receive_game_data(game_data: GameData):
    # Print for debugging
    print("Received Data: ", game_data)

    # Analyze data (this will later be handled by the AI)
    #print(game_data)
    analysis = analyze_gameplay(game_data)
    print(analysis)
    prompt = "Give me a detailed and personalized feeedback on my Gameplay"
    data = await normal_chat(prompt)
    print(data)
    return {"message": "Data received successfully", "aiagent": data}

def analyze_gameplay(game_data: GameData):
    """
    AI-powered game data analysis
    """
    total_shots = len(game_data.birds)
    total_pigs = len(game_data.pigs)
    destroyed_pigs = sum(1 for pig in game_data.pigs if pig.state == "Destroyed")
    hit_percentage = (destroyed_pigs / total_pigs) * 100 if total_pigs > 0 else 0

    return {
        "total_shots": total_shots,
        "destroyed_pigs": destroyed_pigs,
        "hit_percentage": hit_percentage,
        "current_state": game_data.currentGameState,
        "slingshot_state": game_data.slingshot.slingshotState,
    }

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, log_level="info")
