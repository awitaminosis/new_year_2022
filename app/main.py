from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
import uuid

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
            if move[1] == 1:
                if move[0] == 'r':
                    c.r()
                if move[0] == 'r_':
                    c.r_prime()
                if move[0] == 'f':
                    c.f()
                if move[0] == 'f_':
                    c.f_prime()
                if move[0] == 'l':
                    c.l()
                if move[0] == 'l_':
                    c.l_prime()
                if move[0] == 'b':
                    c.b()
                if move[0] == 'b_':
                    c.b_prime()
                if move[0] == 'u':
                    c.u()
                if move[0] == 'u_':
                    c.u_prime()
                if move[0] == 'd':
                    c.d()
                if move[0] == 'd_':
                    c.d_prime()

                move[1] = 0
    return c


@app.get("/", response_class=HTMLResponse)
async def respond_home(request: Request):
    cube_id = request.cookies.get('cube_id', None)
    if cube_id is None:
        cube_id = uuid.uuid4()

    await scramble_cube(c, cube_id)

    print(cube_manipulations.cube_sides(c))
    print(cube_manipulations.print_cube(c))
    print(history)

    printable_history = 'No history yet' if history.get(cube_id, None) is None else [x[0] for x in history.get(cube_id, None)]

    return templates.TemplateResponse("home.html", {"request": request,
                                                    "cube": cube_manipulations.cube_sides(c),
                                                    'cube_id': cube_id,
                                                    'history': printable_history
                                                    })

@app.get("/move/{m}")
async def rotate_r(request: Request, m: str):
    cube_id = request.cookies.get('cube_id', None)
    if m in ['r', 'r_', 'f', 'f_', 'l', 'l_', 'b', 'b_', 'u', 'u_', 'd', 'd_']:
        if cube_id is not None:
            if history.get(cube_id, None) is None:
                history[cube_id] = list()

            history[cube_id].append([m, 1])
    return RedirectResponse('/')


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)
