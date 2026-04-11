from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

class StoreRequest(BaseModel):
    chunks: list[str]

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

texts = []
index = None


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
    query_vec = model.encode([req.query])
    query_vec = np.array(query_vec).astype("float32")

    D, I = index.search(query_vec, req.top_k)
    results = [texts[i] for i in I[0]]

    return {"results": results}
