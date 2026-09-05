from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import mines, production, forecast, risks, recommendations, prospectivity, upload

app = FastAPI(title="SIH26009 Manganese API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mines.router)
app.include_router(production.router)
app.include_router(forecast.router)
app.include_router(risks.router)
app.include_router(recommendations.router)
app.include_router(prospectivity.router)
app.include_router(upload.router)

@app.get("/")
def read_root():
    return {"message": "SIH26009 backend is running"}