from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
from typing import List, Tuple
import logging

app = FastAPI(title="color palette extractor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])


def kmeans_numpy(pixels: np.ndarray, k: int, max_iter: int = 100) -> np.ndarray:
    # انتخاب تصادفی مراکز اولیه (روش kmeans++)
    rng = np.random.default_rng(42)
    centers = pixels[rng.choice(len(pixels), k, replace=False)].astype(float)

    for _ in range(max_iter):
        # محاسبه فاصله هر پیکسل از مراکز
        distances = np.linalg.norm(pixels[:, np.newaxis] - centers, axis=2)
        labels = np.argmin(distances, axis=1)

        # آپدیت مراکز
        new_centers = np.array([
            pixels[labels == i].mean(axis=0) if np.any(labels == i) else centers[i]
            for i in range(k)
        ])

        if np.allclose(centers, new_centers, atol=0.5):
            break
        centers = new_centers

    return centers.astype(int)


async def extract_colors(image: Image.Image, n_colors: int = 5) -> List[dict]:
    try:
        image = image.resize((150, 150))
        image = image.convert('RGB')
        pixels = np.array(image).reshape(-1, 3)

        unique_colors = len(np.unique(pixels, axis=0))
        effective_n_colors = min(n_colors, unique_colors) if unique_colors > 0 else 1

        if effective_n_colors < n_colors:
            logger.info(f"تنوع رنگی کم است، تعداد خوشه‌ها به {effective_n_colors} کاهش یافت")

        colors = kmeans_numpy(pixels, k=effective_n_colors)

        unique_colors_list = list(dict.fromkeys([tuple(c) for c in colors]))
        return [
            {
                "rgb": [int(c) for c in color],
                "hex": rgb_to_hex(tuple(int(c) for c in color))
            } for color in unique_colors_list
        ]
    except Exception as e:
        logger.error(f"خطا در پردازش تصویر: {str(e)}")
        raise HTTPException(status_code=500, detail="خطا در پردازش تصویر")


@app.post("/extract-colors/")
async def extract_colors_endpoint(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="فایل ارسالی باید تصویر باشد")

        content = await file.read()
        image = Image.open(io.BytesIO(content))

        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="فایل تصویر بیش از حد بزرگ است")

        colors = await extract_colors(image)
        return {"colors": colors}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"خطا در آپلود فایل: {str(e)}")
        raise HTTPException(status_code=500, detail="خطای سرور")