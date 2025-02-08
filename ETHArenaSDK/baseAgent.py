import cohere
from dotenv import load_dotenv
import os 
import requests

load_dotenv()

api_key = os.environ.get("GAIA_API_KEY")


async def normal_chat(prompt: str):
    try:
        url = "https://0x0c8923d457934eae1a4ce708f07a980f1ce57a32.gaia.domains/v1/chat/completions"
        headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
        }
        final_prompt = f"Answer this : {prompt}"
        data = {
        "messages": [
            {
                "role": "system",
                "content": """Context: You are an expert Mobile + First Person Shooter Game Analyzer. 
                    Instructions: 
                    - Generate a JSON response for a user query about his Game data that includes his accuracy, total shots, destroyed pigs, hit percentage, current state, slingshot state and strictly adhere to the below given points without None values
                    - Analyze the user's query about Games web3d on his Game data
                    - Format response as a clean, informative JSON object
                    - Within the JSON Response it should contain the 'fun pun' key with the value that should be fun, unique and describes the users gameplay and also includes one of the individuals given below and roasting them
                    - Along with this, the JSON response should also contain a Name of the doppleganger or best partner / individual best suited for the user web3d on his game data from the below given individuals
                    - Individuals : {
                        
                        "name": "Matt Hamilton", "description": "The genuis behind stylus sdk for rust devs who works at Arbitrum (Offchain Labs) and is very supportive",
                        "name": "Harish Kotra", "description": "The most supportive and humble coder at Gaia with a typical south indian accent that looks very cute on him",
                        "name": "Tomasz Stańczak", "description": "He is the founder and the most fun guy in the Nethermind team and is an Ecosystem manager at web3",
                        "name": "Nader Dabit","description": "AI Agent and Finance enthusiast and he is the goat of dev rel and currently works at Eigen labs",
                        "name": "Kartik Talwar","description": "He is the one who hosts and manages ETHGlobal hackathons and events globally and somewhat finds himself funny",
                        "name": "Chainyoda", "description": "The most fun and old KOL till date. Core contributor of Hadron and an angel investor with good meme knowledge",
                    }
                    - Change your puns response in the JSON every single time with new twists
                    - For every single response, within the JSON response:  Include the 'overall performance', 'user reputation', 'recommendation for games web3d on his capabilities that can earn him rewards', 'estimate rewards', 'game genre'
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field or worst case just mock some appropriate data
                    - Only give the structured JSON Response in JSON format Only and please don't give any other response except the JSON response
                    
                    Strict Instructions : 
                        1. Response Type : JSON Structure
                        2. No additional data to be present in the response expect the JSON Response
                        3. Only give the appropriate JSON Response
                    
                    Required JSON Structure:
                    {
                        "fun pun": "string",
                        "gamer match/ doppleganger": "string",
                        "overall performance": "string",
                        "Personalized Feeds": [
                            {
                                "rewards earned": integer, #value should strictly be in between 0 to 10 and without any units just the number
                                "user reputation": "string",
                                "percentile": "string",
                                "onchain footprints": "string", # some mocked data in between 0-5
                                "game genres": ["string"]
                            }
                        ],
                        "game download links": "string",
                        "estimated rewards": "string", # the generated value should be strictly in between 0 and 100000
                        "accuracy": "string",
                        "overall_benefit": "string",
                        "recommended games for esports players": [
                            "game scope": "string", # the generated value should be strictly in between 0 and 10
                            "game popularity": "string", #value should be in between 0 to 10
                            "game benefits in terms of money and tournaments": "string"
                        ]
                    }          
                """
            },
            {"role": "user", "content": final_prompt}
        ],
        "model": "llama-3.2-3B-Instruct"
        }
        response = requests.post(url, json=data, headers=headers)
        data = response.json()
        #print(data)
        return data['choices'][0]['message']['content']
    except Exception as e:
        return f"Error generating response: {str(e)}"
    
async def structured_rag_output(prompt: str, documents: list):
    rag_doc = str(documents)
    print(rag_doc)
    try:
        url = "https://0x0c8923d457934eae1a4ce708f07a980f1ce57a32.gaia.domains/v1/chat/completions"
        headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
        }
        final_prompt = f"From the given data of game movements: {rag_doc}. Answer this : {prompt}"
        data = {
        "messages": [
            {
                "role": "system",
                "content": """Context: You are an expert Mobile + First Person Shooter Game Analyzer. 
                    Instructions: 
                    - Generate a JSON response for a user query about his Game data that includes his accuracy, total shots, destroyed pigs, hit percentage, current state, slingshot state and strictly adhere to the below given points without None values
                    - Analyze the user's query about Games web3 on his Game data
                    - Format response as a clean, informative JSON object
                    - Within the JSON Response it should contain the 'fun pun' key with the value that should be fun, unique and describes the users gameplay and also includes one of the individuals given below and roasting them
                    - Along with this, the JSON response should also contain a Name of the doppleganger or best partner / individual best suited for the user web3d on his game data from the below given individuals
                    - Individuals : {
                        
                       "name": "Matt Hamilton", "description": "The genuis behind stylus sdk for rust devs who works at Arbitrum (Offchain Labs) and is very supportive",
                        "name": "Harish Kotra", "description": "The most supportive and humble coder at Gaia with a typical south indian accent that looks very cute on him",
                        "name": "Tomasz Stańczak", "description": "He is the founder and the most fun guy in the Nethermind team and is an Ecosystem manager at web3",
                        "name": "Nader Dabit","description": "AI Agent and Finance enthusiast and he is the goat of dev rel and currently works at Eigen labs",
                        "name": "Kartik Talwar","description": "He is the one who hosts and manages ETHGlobal hackathons and events globally and somewhat finds himself funny",
                        "name": "Chainyoda", "description": "The most fun and old KOL till date. Core contributor of Hadron and an angel investor with good meme knowledge",
                    }
                    - Change your puns response in the JSON every single time with new twists
                    - For every single response, within the JSON response:  Include the 'overall performance', 'user reputation', 'recommendation for games web3d on his capabilities that can earn him rewards', 'estimate rewards', 'game genre'
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field or worst case just mock some appropriate data
                    - Only give the structured JSON Response in JSON format Only and please don't give any other response except the JSON response
                    
                    Strict Instructions : 
                        1. Response Type : JSON Structure
                        2. No additional data to be present in the response expect the JSON Response
                        3. Only give the appropriate JSON Response
                    
                    Required JSON Structure:
                    {
                        "fun pun": "string",
                        "gamer match/ doppleganger": "string",
                        "overall performance": "string",
                        "Personalized Feeds": [
                            {
                                "rewards earned": integer, #value should strictly be in between 0 to 10 and without any units just the number
                                "user reputation": "string",
                                "percentile": "string",
                                "onchain footprints": "string", # some mocked data in between 0-5
                                "game genres": ["string"]
                            }
                        ],
                        "game download links": "string",
                        "estimated rewards": "string", # the generated value should be strictly in between 0 and 100000
                        "accuracy": "string",
                        "overall_benefit": "string",
                        "recommended games for esports players": [
                            "game scope": "string", # the generated value should be strictly in between 0 and 10
                            "game popularity": "string", #value should be in between 0 to 10
                            "game benefits in terms of money and tournaments": "string"
                        ]
                    }          
                """
            },
            {"role": "user", "content": final_prompt}
        ],
        "model": "llama-3.2-3B-Instruct"
        }
        response = requests.post(url, json=data, headers=headers)
        data = response.json()
        #print(data)
        return data['choices'][0]['message']['content']
    except Exception as e:
        raise Exception(f"Error generating response : {str(e)}")
    
async def structured_rag_response(prompt : str, documents: list):
    rag_doc = str(documents)
    try:
        url = "https://0x0c8923d457934eae1a4ce708f07a980f1ce57a32.gaia.domains/v1/chat/completions"
        headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
        }
        final_prompt = f"From the given data of game movements: {rag_doc}. Answer this : {prompt}"
        data = {
        "messages": [
            {
                "role": "system",
                "content": """Context: You are an expert Mobile + First Person Shooter Game Analyzer. 
                    Instructions: 
                    - Generate a JSON response for a user query about his Game data that includes his accuracy, total shots, destroyed pigs, hit percentage, current state, slingshot state and strictly adhere to the below given points without None values
                    - Analyze the user's query about Games web3 on his Game data
                    - Format response as a clean, informative JSON object
                    - Within the JSON Response it should contain the 'fun pun' key with the value that should be fun, unique and describes the users gameplay and also includes one of the individuals given below and roasting them
                    - Along with this, the JSON response should also contain a Name of the doppleganger or best partner / individual best suited for the user web3d on his game data from the below given individuals
                    - Individuals : {
                        "name": "Matt Hamilton", "description": "The genuis behind stylus sdk for rust devs who works at Arbitrum (Offchain Labs) and is very supportive",
                        "name": "Harish Kotra", "description": "The most supportive and humble coder at Gaia with a typical south indian accent that looks very cute on him",
                        "name": "Tomasz Stańczak", "description": "He is the founder and the most fun guy in the Nethermind team and is an Ecosystem manager at web3",
                        "name": "Nader Dabit","description": "AI Agent and Finance enthusiast and he is the goat of dev rel and currently works at Eigen labs",
                        "name": "Kartik Talwar","description": "He is the one who hosts and manages ETHGlobal hackathons and events globally and somewhat finds himself funny",
                        "name": "Chainyoda", "description": "The most fun and old KOL till date. Core contributor of Hadron and an angel investor with good meme knowledge",
                    }
                    - Change your puns response in the JSON every single time with new twists
                    - For every single response, within the JSON response:  Include the 'overall performance', 'user reputation', 'recommendation for games web3d on his capabilities that can earn him rewards', 'estimate rewards', 'game genre'
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field or worst case just mock some appropriate data
                    - Only give the structured JSON Response in JSON format Only and please don't give any other response except the JSON response
                    
                    Strict Instructions : 
                        1. Response Type : JSON Structure
                        2. No additional data to be present in the response expect the JSON Response
                        3. Only give the appropriate JSON Response
                        4. No addtional data to be returned except the JSON response. No addtional notes, responses, points in the Response and just the JSON response
                    
                    Required JSON Structure:
                    {
                        "fun pun": "string",
                        "gamer match/ doppleganger": "string",
                        "overall performance": "string",
                        "Personalized Feeds": [
                            {
                                "rewards earned": integer, #value should strictly be in between 0 to 10 and without any units just the number
                                "user reputation": "string",
                                "percentile": "string",
                                "onchain footprints": "string", # some mocked data in between 0-5
                                "game genres": ["string"]
                            }
                        ],
                        "game download links": "string",
                        "estimated rewards": "string", # the generated value should be strictly in between 0 and 100000
                        "accuracy": "string",
                        "overall_benefit": "string",
                        "recommended games for esports players": [
                            "game scope": "string", # the generated value should be strictly in between 0 and 10
                            "game popularity": "string", #value should be in between 0 to 10
                            "game benefits in terms of money and tournaments": "string"
                        ]
                    }          
                """
            },
            {"role": "user", "content": final_prompt}
        ],
        "model": "llama-3.2-3B-Instruct"
        }
        response = requests.post(url, json=data, headers=headers)
        data = response.json()
        #print(data)
        return data['choices'][0]['message']['content']
    except Exception as e:
        raise Exception(f"Error generating response : {str(e)}")
    
