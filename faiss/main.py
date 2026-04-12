from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from PyPDF2 import PdfReader

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

# ------------------ REQUEST MODELS ------------------

class StoreRequest(BaseModel):
    chunks: list[str]

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

class PDFRequest(BaseModel):
    file_path: str

# ------------------ FAISS STORAGE ------------------

texts = []
index = None

# ------------------ ROUTES ------------------

@app.post("/store")
def store(req: StoreRequest):
    global index

    vectors = model.encode(req.chunks)
    vectors = np.array(vectors).astype("float32")

    dim = vectors.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(vectors)

    texts.clear()
    texts.extend(req.chunks)

    return {"stored": len(req.chunks)}

@app.post("/search")
def search(req: SearchRequest):
    if index is None:
        return {"error": "Index not initialized. Call /store first."}

    query_vec = model.encode([req.query])
    query_vec = np.array(query_vec).astype("float32")

    D, I = index.search(query_vec, req.top_k)
    results = [texts[i] for i in I[0]]

    return {"results": results}

# ------------------ PDF TEXT EXTRACTION ------------------

@app.post("/extract-text")
def extract_text(req: PDFRequest):
    try:
        reader = PdfReader(req.file_path)
        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

        return {"text": text}

    except Exception as e:
        return {"error": str(e)}