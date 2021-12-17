import random

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Cookie
from starlette.responses import RedirectResponse
import uuid
import random

import cubey as qb
import cube_manipulations

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

c = qb.Cube()
history = {}

async def scramble_cube(c, cube_id):
    if history.get(cube_id, None) is not None:
        for move in history[cube_id]:
            if move == 'r':
                c.r()
            if move == 'r_':
                c.r_prime()
            if move == 'f':
                c.f()
            if move == 'f_':
                c.f_prime()
            if move == 'l':
                c.l()
            if move == 'l_':
                c.l_prime()
            if move == 'b':
                c.b()
            if move == 'b_':
                c.b_prime()
            if move == 'u':
                c.u()
            if move == 'u_':
                c.u_prime()
            if move == 'd':
                c.d()
            if move == 'd_':
                c.d_prime()
    return c

@app.get("/", response_class=HTMLResponse)
async def respond_home(request: Request, session: str = Cookie(None)):
    cube_id = request.cookies.get('cube_id', None)
    if cube_id is None:
        cube_id = uuid.uuid4()
        # cube_id = 1

    await scramble_cube(c, cube_id)

    print(cube_manipulations.cube_sides(c))
    print(cube_manipulations.print_cube(c))

    return templates.TemplateResponse("home.html", {"request": request, "cube": cube_manipulations.cube_sides(c), 'cube_id': cube_id})

@app.get("/move/{m}")
async def rotate_r(request: Request, m: str):
    cube_id = request.cookies.get('cube_id', None)
    if m in ['r', 'r_', 'f', 'f_', 'l', 'l_', 'b', 'b_', 'u', 'u_', 'd', 'd_']:
        if cube_id is not None:
            if history.get(cube_id, None) is None:
                history[cube_id] = list()

            history[cube_id].append(m)
    response = RedirectResponse('/?' + str(random.random()))
    return response

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)
