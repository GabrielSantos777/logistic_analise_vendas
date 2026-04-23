from fastapi import FastAPI

app = FastAPI(title="Meu Projeto", description="API para o meu projeto")

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao meu projeto!"}
