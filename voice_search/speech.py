# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# import azure.cognitiveservices.speech as speechsdk
# from dotenv import load_dotenv
# import os
# import asyncio
# import logging

# # Load environment variables from .env file
# load_dotenv()

# app = FastAPI()
# logging.basicConfig(level=logging.INFO)

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

#     is_recording = False  # Flag to indicate recording status

#     async def recognized_handler(evt):
#         nonlocal is_recording

#         if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
#             recognized_text = evt.result.text.strip().lower()

#             if not recognized_text:
#                 logging.info("Received empty query, ignoring.")
#                 return

#             logging.info(f"Recognized: {recognized_text}")

#             # Check for the trigger word
#             if "hello" in recognized_text:
#                 is_recording = True
#                 await websocket.send_text("Trigger word detected. Please speak your query.")

#             # If recording, send the query back to the frontend
#             elif is_recording:
#                 await websocket.send_text(f"User query: {recognized_text}")
#                 is_recording = False  # Reset the recording flag

#         elif evt.result.reason == speechsdk.ResultReason.NoMatch:
#             logging.info("No match for speech.")
#             await websocket.send_text("No speech detected, please try again.")
#         elif evt.result.reason == speechsdk.ResultReason.Canceled:
#             cancellation_details = evt.result.cancellation_details
#             logging.error(f"Speech Recognition canceled: {cancellation_details.reason}")
#             await websocket.send_text(f"Speech recognition canceled: {cancellation_details.reason}")

#     # Connect recognized handler
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

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
logging.basicConfig(level=logging.INFO)

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

    is_recording = False  # Flag to indicate recording status

    async def recognized_handler(evt):
        nonlocal is_recording

        if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            recognized_text = evt.result.text.strip().lower()

            if not recognized_text:
                logging.info("Received empty query, ignoring.")
                return

            logging.info(f"Recognized: {recognized_text}")

            # Check for the trigger word
            if "hello" in recognized_text:
                is_recording = True
                await websocket.send_text("Trigger word detected. Please speak your query.")
            # If recording, send the query back to the frontend
            elif is_recording:
                await websocket.send_text(f"User query: {recognized_text}")
                is_recording = False  # Reset after processing the query

        elif evt.result.reason == speechsdk.ResultReason.NoMatch:
            logging.info("No match for speech.")
            await websocket.send_text("No speech detected, please try again.")
        elif evt.result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = evt.result.cancellation_details
            logging.error(f"Speech Recognition canceled: {cancellation_details.reason}")
            await websocket.send_text(f"Speech recognition canceled: {cancellation_details.reason}")

    # Connect recognized handler
    speech_recognizer.recognized.connect(lambda evt: asyncio.run(recognized_handler(evt)))

    try:
        speech_recognizer.start_continuous_recognition()

        while True:
            await asyncio.sleep(0.5)  # Keep the connection alive for continuous recognition

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected.")
    finally:
        speech_recognizer.stop_continuous_recognition()
        logging.info("Speech recognition stopped.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
