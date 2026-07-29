import os
import sys
import traceback
import asyncio

# Force UTF-8 stdout/stderr encoding on Windows to prevent charmap print errors with Devanagari text
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Set environment variable to auto-accept Coqui Terms of Service non-interactively
os.environ["COQUI_TOS_AGREED"] = "1"

from flask import Flask, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SERVER_DIR = os.path.dirname(os.path.abspath(__file__))

# Global model reference
xtts_model = None
tts_import_error = None

def get_xtts_model():
    global xtts_model, tts_import_error
    if xtts_model is None and tts_import_error is None:
        try:
            import torch
            from TTS.api import TTS
            device = "cuda" if torch.cuda.is_available() else "cpu"
            print(f"Loading XTTSv2 Voice Cloning model on {device}...")
            xtts_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
            print("XTTSv2 Voice Cloning model loaded successfully!")
        except Exception as e:
            tts_import_error = str(e)
            print(f"Coqui TTS not available ({e}). Using ultra-fast Edge-TTS.")
    return xtts_model

def run_async(coro):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

@app.route('/tts', methods=['POST'])
def tts_endpoint():
    data = request.json or {}
    text = data.get('text')
    gender = data.get('gender', 'female').lower()
    use_cloning = data.get('use_cloning', False)
    
    if not text:
        return {"error": "No text provided"}, 400

    try:
        reference_wav = os.path.join(SERVER_DIR, 'reference.wav')

        # Voice cloning via Coqui XTTS: If reference.wav exists in server folder, clone that voice!
        if os.path.exists(reference_wav):
            model = get_xtts_model()
            if model is not None:
                output_file = os.path.join(SERVER_DIR, 'reply.wav')
                print(f"Cloning voice from reference.wav -> server/reply.wav for text: '{text[:40]}...'")
                model.tts_to_file(
                    text=text,
                    speaker_wav=reference_wav,
                    language="hi",
                    file_path=output_file
                )
                print(f"[SAVED TO SERVER FOLDER] Cloned reply audio saved to: {output_file}")
                return send_file(output_file, mimetype="audio/wav")


        # Ultra-fast Edge-TTS generation (Sub-second response time)
        import edge_tts
        output_file = os.path.join(SERVER_DIR, 'reply.mp3')
        voice_name = "ne-NP-SagarNeural" if gender == 'male' else "ne-NP-HemkalaNeural"
        print(f"Generating Fast Voice Reply ({gender.capitalize()}, {voice_name}) -> server/reply.mp3")

        async def generate_audio():
            communicate = edge_tts.Communicate(text, voice_name)
            await communicate.save(output_file)

        run_async(generate_audio())
        print(f"[SAVED TO SERVER FOLDER] Fast voice file created: {output_file}")
        return send_file(output_file, mimetype="audio/mpeg")


    except Exception as e:
        print("=== EXCEPTION IN TTS GENERATION ===")
        traceback.print_exc()
        return {"error": str(e)}, 500

@app.route('/health', methods=['GET'])
def health_check():
    reply_exists = os.path.exists(os.path.join(SERVER_DIR, 'reply.mp3')) or os.path.exists(os.path.join(SERVER_DIR, 'reply.wav'))
    return {
        "status": "ok",
        "server_dir": SERVER_DIR,
        "has_reference_wav": os.path.exists(os.path.join(SERVER_DIR, 'reference.wav')),
        "has_saved_reply": reply_exists
    }

if __name__ == '__main__':
    print(f"Starting Fast Voice Server on http://localhost:8000")
    print(f"Generated voice files will be saved in: {SERVER_DIR}")
    app.run(host='0.0.0.0', port=8000, threaded=True)


