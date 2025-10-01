from fastapi import FastAPI
from routers import heritage

app = FastAPI(title="NLP Heritage Backend")

# Register routes
app.include_router(heritage.router)

@app.get("/")
def root():
    return {"message": "Backend running 🚀"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

