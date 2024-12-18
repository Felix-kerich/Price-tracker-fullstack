# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# import azure.cognitiveservices.speech as speechsdk
# from dotenv import load_dotenv
# import os
# import asyncio
# import logging
# import websockets

# # Load environment variables from .env file
# load_dotenv()

# app = FastAPI()
# logging.basicConfig(level=logging.INFO)

# LLM_SERVER_URL = "ws://localhost:8001/ws/llm_response"  # URL of the LLM project WebSocket

# @app.websocket("/ws/recognize")
# async def transcribe_audio(websocket: WebSocket):
#     await websocket.accept()

#     # Load Azure Speech Service credentials
#     speech_key = os.getenv('SPEECH_KEY')
#     speech_region = os.getenv('SPEECH_REGION')

#     if not speech_key or not speech_region:
#         await websocket.send_text("SPEECH_KEY and/or SPEECH_REGION are not set in the environment variables.")
#         await websocket.close()
#         return

#     # Configure Azure Speech SDK
#     speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
#     speech_config.speech_recognition_language = "en-US"

#     # Use the default microphone for audio input
#     audio_input = speechsdk.AudioConfig(use_default_microphone=True)
#     speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)

#     is_recording = False  # Flag to indicate whether we should process input

#     async def recognized_handler(evt):
#         nonlocal is_recording

#         if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
#             recognized_text = evt.result.text.strip().lower()
            
#             if not recognized_text:
#                 logging.info("Received empty query, ignoring.")
#                 return  # Ignore empty queries

#             logging.info(f"Recognized: {recognized_text}")

#             # Check for trigger word to start recording
#             if "hello" in recognized_text:
#                 is_recording = True
#                 await websocket.send_text("Trigger word detected. Please speak your query.")

#             # Check for stopping word to stop recording
#             elif recognized_text in ["stop", "terminate"]:
#                 is_recording = False
#                 await websocket.send_text("Stopping transcription as 'stop' or 'terminate' was detected.")
            
#             # If recording is active, process the query
#             elif is_recording:
#                 await websocket.send_text(f"Processing input: {recognized_text}")

#                 # Send the query to the LLM server
#                 try:
#                     async with websockets.connect(LLM_SERVER_URL) as llm_socket:
#                         await llm_socket.send(recognized_text)
#                         llm_response = await llm_socket.recv()  # Receive LLM response
#                         await websocket.send_text(llm_response)  # Send response back to the WebSocket
#                 except Exception as e:
#                     logging.error(f"Error connecting to LLM server: {e}")
#                     await websocket.send_text("Error connecting to LLM server.")


#         elif evt.result.reason == speechsdk.ResultReason.NoMatch:
#             logging.info("No match for speech.")
#             await websocket.send_text("No speech detected, please try again.")
#         elif evt.result.reason == speechsdk.ResultReason.Canceled:
#             cancellation_details = evt.result.cancellation_details
#             logging.error(f"Speech Recognition canceled: {cancellation_details.reason}")
#             await websocket.send_text(f"Speech recognition canceled: {cancellation_details.reason}")

#     speech_recognizer.recognized.connect(lambda evt: asyncio.run(recognized_handler(evt)))

#     try:
#         speech_recognizer.start_continuous_recognition()

#         while True:
#             await asyncio.sleep(0.5)

#     except WebSocketDisconnect:
#         logging.info("WebSocket disconnected.")
#     finally:
#         speech_recognizer.stop_continuous_recognition()
#         logging.info("Speech recognition stopped.")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)


# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# import azure.cognitiveservices.speech as speechsdk
# from dotenv import load_dotenv
# import os
# import asyncio
# import logging
# import requests
# import json
# import websockets

# # Load environment variables from .env file
# load_dotenv()

# app = FastAPI()
# logging.basicConfig(level=logging.INFO)

# JUMIA_SEARCH_URL = "http://127.0.0.1:8080/jumia/search"  # Jumia search API endpoint
# LLM_SERVER_URL = "ws://localhost:8001/ws/llm_response" 

# @app.websocket("/ws/recognize")
# async def transcribe_audio(websocket: WebSocket):
#     await websocket.accept()

#     # Load Azure Speech Service credentials
#     speech_key = os.getenv('SPEECH_KEY')
#     speech_region = os.getenv('SPEECH_REGION')

#     if not speech_key or not speech_region:
#         await websocket.send_text("SPEECH_KEY and/or SPEECH_REGION are not set in the environment variables.")
#         await websocket.close()
#         return

#     # Configure Azure Speech SDK
#     speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
#     speech_config.speech_recognition_language = "en-US"

#     # Use the default microphone for audio input
#     audio_input = speechsdk.AudioConfig(use_default_microphone=True)
#     speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)

#     is_recording = False  # Flag to indicate whether we should process input

#     async def recognized_handler(evt):
#         nonlocal is_recording

#         if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
#             recognized_text = evt.result.text.strip().lower()
            
#             if not recognized_text:
#                 logging.info("Received empty query, ignoring.")
#                 return  # Ignore empty queries

#             logging.info(f"Recognized: {recognized_text}")

#             # Check for trigger word to start recording
#             if "hello" in recognized_text:
#                 is_recording = True
#                 await websocket.send_text("Trigger word detected. Please speak your query.")

#             # Check for stopping word to stop recording
#             elif recognized_text in ["stop", "terminate"]:
#                 is_recording = False
#                 await websocket.send_text("Stopping transcription as 'stop' or 'terminate' was detected.")
            
#             # If recording is active, process the query
#             elif is_recording:
#                 await websocket.send_text(f"Processing input: {recognized_text}")

#                 # Check if the query starts with "search"
#                 if recognized_text.startswith("search "):
#                     search_query = recognized_text[7:]  # Extract the search terms
#                     try:
#                         # Make a POST request to the Jumia search endpoint
#                         response = requests.post(JUMIA_SEARCH_URL, json={"query": search_query})
#                         response.raise_for_status()
#                         products_data = response.json()
#                         # Send product data back to the client
#                         await websocket.send_text(json.dumps(products_data))
#                     except requests.RequestException as e:
#                         logging.error(f"Error connecting to Jumia API: {e}")
#                         await websocket.send_text("Error connecting to Jumia API.")
#                 else:
#                     # await websocket.send_text("Query does not start with 'search', skipping API call.")
#                     await websocket.send_text(f"Processing input: {recognized_text}")
#                     # Send the query to the LLM server
#                     try:
#                         async with websockets.connect(LLM_SERVER_URL) as llm_socket:
#                             await llm_socket.send(recognized_text)
#                             llm_response = await llm_socket.recv()  # Receive LLM response
#                             await websocket.send_text(llm_response)  # Send response back to the WebSocket
#                     except Exception as e:
#                         logging.error(f"Error connecting to LLM server: {e}")
#                         await websocket.send_text("Error connecting to LLM server.")

#         elif evt.result.reason == speechsdk.ResultReason.NoMatch:
#             logging.info("No match for speech.")
#             await websocket.send_text("No speech detected, please try again.")
#         elif evt.result.reason == speechsdk.ResultReason.Canceled:
#             cancellation_details = evt.result.cancellation_details
#             logging.error(f"Speech Recognition canceled: {cancellation_details.reason}")
#             await websocket.send_text(f"Speech recognition canceled: {cancellation_details.reason}")

#     speech_recognizer.recognized.connect(lambda evt: asyncio.run(recognized_handler(evt)))

#     try:
#         speech_recognizer.start_continuous_recognition()

#         while True:
#             await asyncio.sleep(0.5)

#     except WebSocketDisconnect:
#         logging.info("WebSocket disconnected.")
#     finally:
#         speech_recognizer.stop_continuous_recognition()
#         logging.info("Speech recognition stopped.")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)


# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# import azure.cognitiveservices.speech as speechsdk
# from dotenv import load_dotenv
# import os
# import asyncio
# import logging
# import requests
# import json
# import websockets
# import re

# # Load environment variables from .env file
# load_dotenv()

# app = FastAPI()
# logging.basicConfig(level=logging.INFO)

# JUMIA_SEARCH_URL = "http://127.0.0.1:8080/jumia/search"  # Jumia search API endpoint
# LLM_SERVER_URL = "ws://localhost:8001/ws/llm_response"

# @app.websocket("/ws/recognize")
# async def transcribe_audio(websocket: WebSocket):
#     await websocket.accept()

#     # Load Azure Speech Service credentials
#     speech_key = os.getenv('SPEECH_KEY')
#     speech_region = os.getenv('SPEECH_REGION')

#     if not speech_key or not speech_region:
#         await websocket.send_text("SPEECH_KEY and/or SPEECH_REGION are not set in the environment variables.")
#         await websocket.close()
#         return

#     # Configure Azure Speech SDK
#     speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
#     speech_config.speech_recognition_language = "en-US"

#     # Use the default microphone for audio input
#     audio_input = speechsdk.AudioConfig(use_default_microphone=True)
#     speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)

#     is_recording = False  # Flag to indicate whether we should process input

#     async def recognized_handler(evt):
#         nonlocal is_recording

#         if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
#             recognized_text = evt.result.text.strip().lower()
            
#             if not recognized_text:
#                 logging.info("Received empty query, ignoring.")
#                 return  # Ignore empty queries

#             logging.info(f"Recognized: {recognized_text}")

#             # Check for trigger word to start recording
#             if "hello" in recognized_text:
#                 is_recording = True
#                 await websocket.send_text("Trigger word detected. Please speak your query.")

#             # Check for stopping word to stop recording
#             elif recognized_text in ["stop", "terminate"]:
#                 is_recording = False
#                 await websocket.send_text("Stopping transcription as 'stop' or 'terminate' was detected.")
            
#             # If recording is active, process the query
#             elif is_recording:
#                 await websocket.send_text(f"Processing input: {recognized_text}")


#                 # Check for "track item X" command using regex
#                 match = re.search(r"track item (\d+)", recognized_text)
#                 if match:
#                     try:
#                         index = int(match.group(1))  # Extract the item index
#                         await websocket.send_text(f"track item {index}")
#                     except ValueError:
#                         await websocket.send_text("Invalid index for track item command.")

#                 # Check if the query starts with "search"
#                 elif recognized_text.startswith("search "):
#                     search_query = recognized_text[7:]  # Extract the search terms
#                     # Remove the last word from the search query
#                     search_query = search_query[:-1]
#                     print(search_query)
#                     try:
#                         # Make a POST request to the Jumia search endpoint
#                         response = requests.post(JUMIA_SEARCH_URL, json={"query": search_query})
#                         response.raise_for_status()
#                         products_data = response.json()
#                         # Send product data back to the client
#                         await websocket.send_text(json.dumps(products_data))
#                     except requests.RequestException as e:
#                         logging.error(f"Error connecting to Jumia API: {e}")
#                         await websocket.send_text("Error connecting to Jumia API.")
#                 else:
#                     await websocket.send_text(f"Processing input: {recognized_text}")
#                     # Send the query to the LLM server
#                     try:
#                         async with websockets.connect(LLM_SERVER_URL) as llm_socket:
#                             await llm_socket.send(recognized_text)
#                             llm_response = await llm_socket.recv()  # Receive LLM response
#                             await websocket.send_text(llm_response)  # Send response back to the WebSocket
#                     except Exception as e:
#                         logging.error(f"Error connecting to LLM server: {e}")
#                         await websocket.send_text("Error connecting to LLM server.")

#         elif evt.result.reason == speechsdk.ResultReason.NoMatch:
#             logging.info("No match for speech.")
#             await websocket.send_text("No speech detected, please try again.")
#         elif evt.result.reason == speechsdk.ResultReason.Canceled:
#             cancellation_details = evt.result.cancellation_details
#             logging.error(f"Speech Recognition canceled: {cancellation_details.reason}")
#             await websocket.send_text(f"Speech recognition canceled: {cancellation_details.reason}")

#     speech_recognizer.recognized.connect(lambda evt: asyncio.run(recognized_handler(evt)))

#     try:
#         speech_recognizer.start_continuous_recognition()

#         while True:
#             await asyncio.sleep(0.5)

#     except WebSocketDisconnect:
#         logging.info("WebSocket disconnected.")
#     finally:
#         speech_recognizer.stop_continuous_recognition()
#         logging.info("Speech recognition stopped.")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)


from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import os
import asyncio
import logging
import requests
import json
import websockets
import re

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
logging.basicConfig(level=logging.INFO)

JUMIA_SEARCH_URL = "http://127.0.0.1:8080/jumia/search"  # Jumia search API endpoint
LLM_SERVER_URL = "ws://localhost:8001/ws/llm_response"

@app.websocket("/ws/recognize")
async def transcribe_audio(websocket: WebSocket):
    await websocket.accept()

    # Load Azure Speech Service credentials
    speech_key = os.getenv('SPEECH_KEY')
    speech_region = os.getenv('SPEECH_REGION')

    if not speech_key or not speech_region:
        await websocket.send_text("SPEECH_KEY and/or SPEECH_REGION are not set in the environment variables.")
        await websocket.close()
        return

    # Configure Azure Speech SDK
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
    speech_config.speech_recognition_language = "en-US"

    # Use the default microphone for audio input
    audio_input = speechsdk.AudioConfig(use_default_microphone=True)
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)

    is_recording = False  # Flag to indicate whether we should process input

    async def recognized_handler(evt):
        nonlocal is_recording

        if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            recognized_text = evt.result.text.strip().lower()
            
            if not recognized_text:
                logging.info("Received empty query, ignoring.")
                return  # Ignore empty queries

            logging.info(f"Recognized: {recognized_text}")

            # Check for trigger word to start recording
            if "hello" in recognized_text:
                is_recording = True
                await websocket.send_text("Trigger word detected. Please speak your query.")

            # Check for stopping word to stop recording
            elif recognized_text in ["stop", "terminate"]:
                is_recording = False
                await websocket.send_text("Stopping transcription as 'stop' or 'terminate' was detected.")
            
            # If recording is active, process the query
            elif is_recording:
                await websocket.send_text(f"Processing input: {recognized_text}")

                # Check for "track item X" command using regex
                match = re.search(r"track item (\d+)", recognized_text)
                if match:
                    id = match.group(1)  # Extract the item index
                    await websocket.send_text(f"track item {id}")  # Send track command with item ID
                else:
                    # Handle other commands like search
                    if recognized_text.startswith("search "):
                        search_query = recognized_text[7:]  # Extract the search terms
                        search_query = search_query[:-1]
                        print(search_query)
                        try:
                            response = requests.post(JUMIA_SEARCH_URL, json={"query": search_query})
                            response.raise_for_status()
                            products_data = response.json()
                            await websocket.send_text(json.dumps(products_data))  # Send product data back
                        except requests.RequestException as e:
                            logging.error(f"Error connecting to Jumia API: {e}")
                            await websocket.send_text("Error connecting to Jumia API.")
                    else:
                        await websocket.send_text(f"Processing input: {recognized_text}")
                        # Send the query to the LLM server
                        try:
                            async with websockets.connect(LLM_SERVER_URL) as llm_socket:
                                await llm_socket.send(recognized_text)
                                llm_response = await llm_socket.recv()  # Receive LLM response
                                await websocket.send_text(llm_response)  # Send response back to the WebSocket
                        except Exception as e:
                            logging.error(f"Error connecting to LLM server: {e}")
                            await websocket.send_text("Error connecting to LLM server.")

        elif evt.result.reason == speechsdk.ResultReason.NoMatch:
            logging.info("No match for speech.")
            await websocket.send_text("No speech detected, please try again.")
        elif evt.result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = evt.result.cancellation_details
            logging.error(f"Speech Recognition canceled: {cancellation_details.reason}")
            await websocket.send_text(f"Speech recognition canceled: {cancellation_details.reason}")

    speech_recognizer.recognized.connect(lambda evt: asyncio.run(recognized_handler(evt)))

    try:
        speech_recognizer.start_continuous_recognition()

        while True:
            await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected.")
    finally:
        speech_recognizer.stop_continuous_recognition()
        logging.info("Speech recognition stopped.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
