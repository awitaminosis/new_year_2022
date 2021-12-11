from fastapi import FastAPI
# from fastapi import FastAPI, Request, HTTPException
# from fastapi.responses import HTMLResponse
# from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates
# from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get('/')
async def main():
    return {'1': '2'}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)
