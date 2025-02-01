import cohere
from dotenv import load_dotenv
import os 

load_dotenv()

api_key = os.environ.get("COHERE_API_KEY")

co = cohere.ClientV2(api_key=api_key)

async def normal_chat(prompt: str):
    try:
        # Stream the response from Cohere
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": """Context: You are an expert Mobile + First Person Shooter Game Analyzer. 
                    Instructions: 
                    - Generate a JSON response for a user query about his Game data that includes his accuracy, total shots, destroyed pigs, hit percentage, current state, slingshot state and strictly adhere to the below given points without None values
                    - Analyze the user's query about Games based on his Game data
                    - Provide a comprehensive, step-by-step response
                    - Include game recommendations, potential benefits, rewards, Game Scope (Amount of users who play and earn from it), Game popularity, Game reviews, Game ratings, Game genre, Game platform, Game developer, Game publisher, Game release date, Game price, Game features, game benefits in terms of money and tournaments
                    - Format response as a clean, informative JSON object
                    - The response should also contain a short Fun pun which should also boast about base network and should also give a fun fact about the user based on his game data and should include one individual from the base team. Find below the details of base(a blockchain company) individuals
                    - Along with this it should also give a Name of the doppleganger or best partner / individual best suited for the user based on his game data from the below given individuals
                    - {
                        "name": "Jesse Pollak","description": "He is builder #001 of base and is looking to onboard everyone onchain and create a global economy by building base. Loves to go out on the street and offer on-chain money to randoms. He loves to give out money and bring people onchain and is a fun guy",
                        "name": "Saxena Saheb", "description": "The most hardworking and fun guy but sometimes looks very serious and he is on a mission to make builders build cool stuff and help base grow",
                        "name": "David Tso", "description": "He is the most fun guy in the base team and is an Ecosystem manager at Base",
                        "name": "Denver Dsouza", "description": "He is the guy who started Devfolio(A hackathon platform which supports tons of developers around the world). He is hard working and focused on the Indian builders to build cool stuff that are also impactful",
                        "name": "Kabir", ""description": "He is the guy who does the multi tasking stuff for the community, He handles strategy, operations and grants to empower builders to build consumer facing products",
                        "name": "Nader Dabit","description": "AI Agent and Finance enthusiast and he is the goat of dev rel and currently works at Eigen labs",
                    }
                    - For every single response, Include the 'overall performance', 'user reputation', 'recommendation for games based on his capabilities that can earn him rewards', 'estimate rewards', 'game genre'
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field or worst case just mock some appropriate data
                    
                    Required JSON Structure:
                    {
                        "fun pun": "string",
                        "gamer match/ doppleganger": "string",
                        "overall performance": "string",
                        "Personalized Feeds": [
                            {
                                "rewards earned": 1,
                                "user reputation": "string",
                                "percentile": "string",
                                "onchain footprints": "string",
                                "game genres": ["string"]
                            }
                        ],
                        "game download links": "string",
                        "estimated rewards": "string",
                        "accuracy": "string",
                        "overall_benefit": "string",
                        "recommended games for esports players": [
                            "game scope": "string",
                            "game popularity": "string",
                            "game benefits in terms of money and tournaments": "string"
                        ]
                    }
                """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"}
        )
        print(res.message)
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    
async def structured_rag_output(prompt: str, documents: list):
    #print(documents)
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            documents=documents,
            messages=[
                {
                    "role": "system",
                    "content": """Context: You are an expert Mobile + First Person Shooter Game Analyzer. 
                    Instructions: 
                    - Generate a JSON response for a user query about his Game data that includes his accuracy, total shots, destroyed pigs, hit percentage, current state, slingshot state and strictly adhere to the below given points without None values
                    - Analyze the user's query about Games based on his Game data
                    - Provide a comprehensive, step-by-step response
                    - Include game recommendations, potential benefits, rewards, Game Scope (Amount of users who play and earn from it), Game popularity, Game reviews, Game ratings, Game genre, Game platform, Game developer, Game publisher, Game release date, Game price, Game features, Game modes, Game mechanics, Game story, Game graphics, Game sound, Game controls, Game physics, Game AI, Game difficulty, Game progression, Game replayability, Game monetization, Game community, Game updates, Game events, Game tournaments, Game competitions, Game leagues, Game championships, Game seasons, Game patches, Game expansions, Game sequels, Game prequels, Game remakes, Game remasters, Game ports, Game adaptations, Game crossovers, Game collaborations, Game partnerships, Game sponsorships, Game promotions, Game marketing, Game advertisements, Game trailers, Game teasers, Game demos, Game betas, Game alphas, Game early access, Game full release, Game post-launch, Game post-release, Game post-launch content, Game post-release content, Game post-launch updates, Game post-release updates, Game post-launch events, Game post-release events, Game post-launch tournaments, Game post-release tournaments, Game post-launch competitions, Game post-release competitions, Game post-launch leagues, Game post-release leagues, Game post-launch championships, Game post-release championships, Game post-launch seasons, Game post-release seasons, Game post-launch patches, Game post-release patches, Game post-launch expansions, Game post-release expansions, Game post-launch sequels, Game post-release sequels, Game post-launch prequels, Game post-release prequels, Game post-launch remakes, Game post-release remakes, Game post-launch remasters, Game post-release remasters, Game post-launch ports, Game post-release ports, Game post-launch adaptations, Game post-release adaptations, Game post-launch crossovers, Game post-release crossovers, Game post-launch collaborations, Game post-release collaborations, Game post-launch partnerships, Game post-release partnerships, Game post-launch sponsorships, Game post-release sponsorships, Game post-launch promotions, Game post-release promotions, Game post-launch marketing, Game post-release marketing, Game post-launch advertisements, Game post-release advertisements, Game post-launch trailers, Game post-release trailers, Game post-launch teasers, Game post-release teasers, Game post-launch demos, Game post-release demos, Game post-launch betas, Game post-release betas, Game post-launch alphas, Game post-release alphas, Game post-launch early access, Game post-release early access, Game post-launch full release
                    - Format response as a clean, informative JSON object
                    - The response should also contain a Fun pun which should also boast about base network and should also give a fun fact about the user based on his game data and should include one individual from the base team. Find below the details of base(a blockchain company) individuals
                    - {
                        "name": "Nader Dabit","description": "AI Agent and Finance enthusiast and he is the goat of dev rel and currently works at Eigen labs",
                        "name": "Jesse Pollak","description": "He is builder #001 of base and is looking to onboard everyone onchain and create a global economy by building base",
                        "name": "Saxena Saheb", "description": "The most hardworking and fun guy but sometimes looks very serious and he is on a mission to make builders build cool stuff and help base grow",}
                    - For every single response, Include the 'overall performance', 'user reputation', 'recommendation for games based on his capabilities that can earn him rewards', 'estimate rewards', 'game genre'
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field
                    
                    Required JSON Structure:
                    {
                        "fun pun": "string",
                        "overall performance": "string",
                        "Personalized Feeds": [
                            {
                                "rewards earned": 1,
                                "user reputation": "string",
                                "percentile": "string",
                                "onchain footprints": "string",
                                "game genres": ["string"]
                            }
                        ],
                        "game links": "string",
                        "estimated rewards": "string",
                        "accuracy": "string",
                        "overall_benefit": "string",
                        "recommended games": [
                            "game scope": "string",
                            "game popularity": "string",
                            "game benefits": "string"
                        ]
                    }
                """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            # response_format={"type": "json_object"}
        )
        if "None" in res.message.content[0].text:
            data = await normal_chat(prompt)
            return data
        return res.message.content[0].text
    except Exception as e:
        raise Exception(f"Error generating response: {str(e)}") 
    
