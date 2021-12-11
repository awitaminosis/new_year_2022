from fastapi import FastAPI
# from fastapi import FastAPI, Request, HTTPException
# from fastapi.responses import HTMLResponse
# from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates
# from fastapi.responses import HTMLResponse
# from content import ar_words

app = FastAPI()

@app.get('/')
async def main():
    return {'1':'2'}

# app.mount("/static", StaticFiles(directory="static"), name="static")
# templates = Jinja2Templates(directory="templates")

# @app.get("/lvl1", response_class=HTMLResponse)
# async def respond_lvl_1(request: Request):
#     return templates.TemplateResponse("lvl1.html", {"request": request})

# @app.get("/lvl2", response_class=HTMLResponse)
# async def respond_lvl_2(request: Request):
#     return templates.TemplateResponse("lvl2.html", {"request": request})
#
# @app.get("/", response_class=HTMLResponse)
# async def respond_home(request: Request):
#     return templates.TemplateResponse("home.html", {"request": request, 'words': ar_words})
#
# @app.get("/lvl/{n}", response_class=HTMLResponse)
# async def respond_home(request: Request, n: int):
#     max = len(ar_words)
#     if n >= 1 and n <= max:
#         return templates.TemplateResponse("lvl.html", {"request": request, 'n': n, 'max': max})
#     else:
#         raise HTTPException(
#             status_code=404, detail=f"Memopi with ID {n} not found"
#         )


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)
