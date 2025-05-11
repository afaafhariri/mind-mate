from fastapi import FastAPI
from pydantic import BaseModel
import joblib

model = joblib.load("mental_health_predictor.pkl")

app = FastAPI()

class JournalEntry(BaseModel):
    statement: str

@app.post("/predict/")
def predict(entry: JournalEntry):
    statement = entry.statement
    prediction = model.predict([statement])[0]
    mental_state = "Positive" if prediction == 1 else "Negative"
    return {
        "mental_state": mental_state
    }
