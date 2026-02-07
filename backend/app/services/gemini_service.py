"""
Google Gemini AI service - Food image analysis using Gemini API
FULL AUTO MODEL VERSION (v1beta SAFE)
"""

import os
import io
import json
import asyncio
from PIL import Image
import google.generativeai as genai
from fastapi import UploadFile, HTTPException
from app.config import settings
from app.schemas.food_log import AIFoodAnalysis


# ============================
# Configure Gemini
# ============================

if not settings.GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not configured")

genai.configure(api_key=settings.GEMINI_API_KEY)


# ============================
# Auto Select Vision Model
# ============================

def get_available_vision_model():

    models = genai.list_models()

    for m in models:
        if "generateContent" in m.supported_generation_methods:
            return m.name

    raise RuntimeError("No Gemini model supports generateContent")


# ============================
# Analyze Food Image
# ============================

async def analyze_food_image(image_file: UploadFile) -> AIFoodAnalysis:

    try:
        # Read image once
        image_bytes = await image_file.read()
        await image_file.seek(0)

        # Convert to PIL Image (MANDATORY)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Get working Gemini model dynamically
        model_name = get_available_vision_model()
        print("Using Gemini model:", model_name)

        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config={"temperature": 0.2}
        )

        prompt = """
You are a professional nutritionist.

Analyze this food image.

Return ONLY valid JSON:

{
 "food_name": "",
 "calories": number,
 "protein": "Xg",
 "carbs": "Xg",
 "fats": "Xg",
 "confidence": "high/medium/low",
 "description": ""
}

Estimate based on visible portion.
Combine multiple foods.
No markdown.
No extra text.
"""

        response = await asyncio.to_thread(
            model.generate_content,
            [prompt, image]
        )

        # Safe extraction
        text = response.candidates[0].content.parts[0].text.strip()

        data = json.loads(text)

        return AIFoodAnalysis(
            food_name=data.get("food_name", "Unknown"),
            calories=float(data.get("calories", 200)),
            protein=data.get("protein"),
            carbs=data.get("carbs"),
            fats=data.get("fats"),
            description=data.get("description"),
            confidence=data.get("confidence", "medium")
        )

    except json.JSONDecodeError:
        raise HTTPException(500, "Gemini returned invalid JSON")

    except Exception as e:

        if "429" in str(e):
            raise HTTPException(429, "Gemini quota exceeded")

        raise HTTPException(500, f"Gemini error: {str(e)}")


# ============================
# Save Uploaded Image
# ============================

async def save_uploaded_image(image_file: UploadFile) -> str:

    from datetime import datetime
    import uuid

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    ext = os.path.splitext(image_file.filename)[1]

    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}{ext}"

    path = os.path.join(settings.UPLOAD_DIR, filename)

    content = await image_file.read()

    with open(path, "wb") as f:
        f.write(content)

    await image_file.seek(0)

    return path
