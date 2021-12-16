from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import cubey as qb
import cube_manipulations

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

c = qb.Cube()
# c.r()
# c.u()
# c.r_prime()
# c.u_prime()
print(cube_manipulations.cube_sides(c))
print (cube_manipulations.print_cube(c))


@app.get("/", response_class=HTMLResponse)
async def respond_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "cube": cube_manipulations.cube_sides(c)})


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)
