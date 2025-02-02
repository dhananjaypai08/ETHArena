from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import os 
from dotenv import load_dotenv
from baseAgent import normal_chat, structured_rag_output
from web3 import Web3
import json
from eth_account import Account
import requests


load_dotenv()
api_key = os.environ.get("COHERE_API_KEY")
private_key = os.environ.get("PRIVATE_KEY")
contract_address = os.environ.get("CONTRACT_ADDRESS")
rpc_url = os.environ.get("BASE_RPC_URL")


w3 = Web3(Web3.HTTPProvider(rpc_url))
with open("../contracts/artifacts/contracts/BaseArena.sol/BaseArena.json", "r") as f:
    contract_abi = json.load(f)["abi"]
contract = w3.eth.contract(address=contract_address, abi=contract_abi)
account = Account.from_key(private_key)
user_responses = {}
# print(contract.functions.getAllUsers().call())
# print(account.address, w3.eth.get_balance(account.address))

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:5173",
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

documents =[]
iteration = 0

@app.post("/getUserData")
async def receive_game_data(walletAddress: str, game_data: GameData):
    print(walletAddress)
    # Print for debugging
    global iteration
    
    #print("Received Data: ", game_data)

    # Analyze data (this will later be handled by the AI)
    #print(game_data)
    analysis = analyze_gameplay(game_data)
    print(analysis)
    analysis["data"] = game_data
    global documents
    documents.append(analysis)

    if analysis["current_state"] == "Lost" or analysis["current_state"] == "Won":
        prompt = "Give me a detailed and personalized feeedback on my Gameplay"
        data = await structured_rag_output(prompt, documents)
        json_data = data.strip('```json').strip('```')
        print(json_data)
        data = json.loads(json_data)
        #print(data)
        rewards_earned = data["Personalized Feeds"][0]["rewards earned"]
        user_reputation = data["Personalized Feeds"][0]["user reputation"]
        user_responses[walletAddress] = data
        image_url = image_to_text(rewards_earned)
        print(image_url)
        # data = json.load()
        tx_hash = mint_onchain(rewards_earned, image_url, image_url, walletAddress)
    
        documents = []
        return {"message": "Data received successfully", "aiagent": data, "txn hash": tx_hash}
    
    return {"message": "Data received successfully"}

@app.get("/getAIResponse")
async def getAIResponse(walletAddress: str):
    print(user_responses)
    return user_responses.get(walletAddress)
  

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

def mint_onchain(rewards_earned: int, image_uri: str, doppleganger_uri: str, walletAddress: str):
    nonce = w3.eth.get_transaction_count(account.address)
    # data = "metadata testing"
    # encoded_text = abi.encode(["string"], [data])
    # BLOB_DATA = (b"\x00" * 32 * (4096 - len(encoded_text) // 32)) + encoded_text

    estimated_gas = contract.functions.safeMint(rewards_earned, image_uri, doppleganger_uri, walletAddress).estimate_gas({
            "from": account.address
    })
    print("Estimated Gas:", estimated_gas)
        
        # Add a safety buffer to the gas estimate
    gas_limit = int(estimated_gas * 1.3)
    print("Using Gas Limit:", gas_limit)

    tx = contract.functions.safeMint(rewards_earned, image_uri, doppleganger_uri, walletAddress).build_transaction({
            "from": account.address,
            "gas": gas_limit,  # Adjust gas based on network
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
    })

    # Sign and Send Transaction
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
    print(f"Mint transaction sent! Tx Hash: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Transaction confirmed in block {receipt.blockNumber}")
    return tx_hash.hex()

def save_response_onchain(walletAddress : str, data: str):
    nonce = w3.eth.get_transaction_count(account.address)
    
    tx = contract.functions.saveResponse(walletAddress, data).build_transaction({
            "from": account.address,
            "gas": 3100,  # Adjust gas based on network
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
    })

    # Sign and Send Transaction
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
    print(f"Mint transaction sent! Tx Hash: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Transaction confirmed in block {receipt.blockNumber}")
    return tx_hash.hex()

def image_to_text(rewards: int):
    text = f"The given data : {str(rewards)}. If the given data value is above 5 then generate an animated angry bird with good facial expression and a sword  and plain red background. If the given data is less than 5 than generate an sad animated angry bird with yellow background color. Keep it plain and simple and with facial expressions and a Sword in hand" 
    r = requests.post(
    "https://api.deepai.org/api/text2img",
    data={
        'text': text,
    },
        headers={'api-key': os.environ.get("DEEPAI_API_KEY")},
    )
    return r.json()["share_url"]


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, log_level="info")
