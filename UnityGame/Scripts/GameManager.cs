using UnityEngine;
using System.Collections.Generic;
using Assets.Scripts;
using System.Linq;
using DG.Tweening;
using System.Collections;
using UnityEngine.Networking;
using System;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;


public class GameManager : MonoBehaviour
{

    public CameraFollow cameraFollow;
    int currentBirdIndex;
    public SlingShot slingshot;
    [HideInInspector]
    public static GameState CurrentGameState = GameState.Start;
    private List<GameObject> Bricks;
    private List<GameObject> Birds;
    private List<GameObject> Pigs;

    private string serverUrl = "http://localhost:8000/getUserData?walletAddress=0x1d72B383cd2F783e4f2eDafE9D7544A3355507C2";

    // Use this for initialization
    void Start()
    {
        CurrentGameState = GameState.Start;
        slingshot.enabled = false;

        // Find all relevant game objects
        Bricks = new List<GameObject>(GameObject.FindGameObjectsWithTag("Brick"));
        Birds = new List<GameObject>(GameObject.FindGameObjectsWithTag("Bird"));
        Pigs = new List<GameObject>(GameObject.FindGameObjectsWithTag("Pig"));

        // Subscribe to events
        slingshot.BirdThrown -= Slingshot_BirdThrown; 
        slingshot.BirdThrown += Slingshot_BirdThrown;

        // Log game data at the start
        LogGameData();
    }



    // Update is called once per frame
    void Update()
    {
        switch (CurrentGameState)
        {
            case GameState.Start:
                if (Input.GetMouseButtonUp(0))
                {
                    LogGameData(); // Log before bird is launched
                    AnimateBirdToSlingshot();
                }
                break;
            case GameState.BirdMovingToSlingshot:
                break;
            case GameState.Playing:
                if (slingshot.slingshotState == SlingshotState.BirdFlying &&
                    (BricksBirdsPigsStoppedMoving() || Time.time - slingshot.TimeSinceThrown > 5f))
                {
                    LogGameData(); // Log after bird stops moving
                    slingshot.enabled = false;
                    AnimateCameraToStartPosition();
                    CurrentGameState = GameState.BirdMovingToSlingshot;
                }
                break;
            case GameState.Won:
            case GameState.Lost:
                if (Input.GetMouseButtonUp(0))
                {
                    LogGameData(); // Log before restarting
                    Application.LoadLevel(Application.loadedLevel);
                }
                break;
        }
    }



    /// <summary>
    /// A check whether all Pigs are null
    /// i.e. they have been destroyed
    /// </summary>
    /// <returns></returns>
    private bool AllPigsDestroyed()
    {
        return Pigs.All(x => x == null);
    }

    /// <summary>
    /// Animates the camera to the original location
    /// When it finishes, it checks if we have lost, won or we have other birds
    /// available to throw
    /// </summary>
    private void AnimateCameraToStartPosition()
    {
        float duration = Vector2.Distance(Camera.main.transform.position, cameraFollow.StartingPosition) / 10f;
        if (duration == 0.0f) duration = 0.1f;
        //animate the camera to start
        Camera.main.transform.DOMove(cameraFollow.StartingPosition, duration). //end position
            OnComplete(() =>
                        {
                            cameraFollow.IsFollowing = false;
                            if (AllPigsDestroyed())
                            {
                                CurrentGameState = GameState.Won;
                            }
                            //animate the next bird, if available
                            else if (currentBirdIndex == Birds.Count - 1)
                            {
                                //no more birds, go to finished
                                CurrentGameState = GameState.Lost;
                            }
                            else
                            {
                                slingshot.slingshotState = SlingshotState.Idle;
                                //bird to throw is the next on the list
                                currentBirdIndex++;
                                AnimateBirdToSlingshot();
                            }
                        });
    }

    /// <summary>
    /// Animates the bird from the waiting position to the slingshot
    /// </summary>
    void AnimateBirdToSlingshot()
    {
        CurrentGameState = GameState.BirdMovingToSlingshot;
        Birds[currentBirdIndex].transform.DOMove
            (slingshot.BirdWaitPosition.transform.position, //final position
            Vector2.Distance(Birds[currentBirdIndex].transform.position / 10,
            slingshot.BirdWaitPosition.transform.position) / 10). //position
                OnComplete(() =>
                        {   CurrentGameState = GameState.Playing;
                            slingshot.enabled = true; //enable slingshot
                            //current bird is the current in the list
                            slingshot.BirdToThrow = Birds[currentBirdIndex];
                        });
    }

    /// <summary>
    /// Event handler, when the bird is thrown, camera starts following it
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void Slingshot_BirdThrown(object sender, System.EventArgs e)
    {
        cameraFollow.BirdToFollow = Birds[currentBirdIndex].transform;
        cameraFollow.IsFollowing = true;
    }

    /// <summary>
    /// Check if all birds, pigs and bricks have stopped moving
    /// </summary>
    /// <returns></returns>
    bool BricksBirdsPigsStoppedMoving()
    {
        foreach (var item in Bricks.Union(Birds).Union(Pigs))
        {
            if (item != null && item.GetComponent<Rigidbody2D>().velocity.sqrMagnitude > Constants.MinVelocity)
            {
                return false;
            }
        }

        return true;
    }

    /// <summary>
    /// Found here
    /// http://www.bensilvis.com/?p=500
    /// </summary>
    /// <param name="screenWidth"></param>
    /// <param name="screenHeight"></param>
    public static void AutoResize(int screenWidth, int screenHeight)
    {
        Vector2 resizeRatio = new Vector2((float)Screen.width / screenWidth, (float)Screen.height / screenHeight);
        GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, new Vector3(resizeRatio.x, resizeRatio.y, 1.0f));
    }

    /// <summary>
    /// Shows relevant GUI depending on the current game state
    /// </summary>
    void OnGUI()
    {
        AutoResize(800, 480);
        switch (CurrentGameState)
        {
            case GameState.Start:
                GUI.Label(new Rect(0, 150, 200, 100), "Tap the screen to start");
                break;
            case GameState.Won:
                GUI.Label(new Rect(0, 150, 200, 100), "You won! Tap the screen to restart");
                break;
            case GameState.Lost:
                GUI.Label(new Rect(0, 150, 200, 100), "You lost! Tap the screen to restart");
                break;
            default:
                break;
        }
    }



    public void LogGameData()
    {
        GameData data = CollectGameData();
        string jsonData = JsonUtility.ToJson(data, true); // Pretty print JSON
        StartCoroutine(PostRequest(serverUrl, jsonData));
        Debug.Log(jsonData);
    }


    IEnumerator PostRequest(string url, string jsonData)
    {
        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("Game Data Sent Successfully: " + request.downloadHandler.text);
            }
            else
            {
                Debug.LogError("Error Sending Data: " + request.error);
            }
        }
    }


    [System.Serializable]
    public class GameData
    {
        public string currentGameState;
        public List<BirdData> birds;
        public List<PigData> pigs;
        public List<BrickData> bricks;
        public SlingshotData slingshot;
    }

    [System.Serializable]
    public class BirdData
    {
        public Vector2 position;
        public string state; // Moving or Idle
    }

    [System.Serializable]
    public class PigData
    {
        public Vector2 position;
        public string state; // Alive or Destroyed
    }

    [System.Serializable]
    public class BrickData
    {
        public Vector2 position;
        public string state; // Moving or Idle
    }

    [System.Serializable]
    public class SlingshotData
    {
        public string birdToThrow;
        public string slingshotState;
    }

    public GameData CollectGameData()
    {
        GameData data = new GameData
        {
            currentGameState = CurrentGameState.ToString(),
            birds = new List<BirdData>(),
            pigs = new List<PigData>(),
            bricks = new List<BrickData>(),
            slingshot = new SlingshotData
            {
                birdToThrow = slingshot.BirdToThrow != null ? slingshot.BirdToThrow.name : "None",
                slingshotState = slingshot.slingshotState.ToString()
            }
        };

        // Collect bird data
        foreach (var bird in Birds)
        {
            if (bird != null)
            {
                data.birds.Add(new BirdData
                {
                    position = bird.transform.position,
                    state = bird.GetComponent<Rigidbody2D>().velocity.sqrMagnitude > 0.01f ? "Moving" : "Idle"
                });
            }
        }

        // Collect pig data
        foreach (var pig in Pigs)
        {
            if (pig != null)
            {
                data.pigs.Add(new PigData
                {
                    position = pig.transform.position,
                    state = "Alive"
                });
            }
            else
            {
                data.pigs.Add(new PigData
                {
                    position = Vector2.zero,
                    state = "Destroyed"
                });
            }
        }

        // Collect brick data
        foreach (var brick in Bricks)
        {
            if (brick != null)
            {
                data.bricks.Add(new BrickData
                {
                    position = brick.transform.position,
                    state = brick.GetComponent<Rigidbody2D>().velocity.sqrMagnitude > 0.01f ? "Moving" : "Idle"
                });
            }
        }
        return data;
    }



}