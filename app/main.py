from fastapi import FastAPI
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/easy", response_class=HTMLResponse)
async def respond_tmp(request: Request):
    return templates.TemplateResponse("easy.html", {"request": request})


@app.get("/hard", response_class=HTMLResponse)
async def respond_tmp(request: Request):
    cube = []
    return templates.TemplateResponse("hard.html", {"request": request, 'cube': cube})


@app.get("/", response_class=HTMLResponse)
async def respond_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})


# raise HTTPException(
#     status_code=404, detail=f"Memopi with ID {n} not found"
# )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)
