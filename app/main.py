from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
import random
import uuid

from app.cube_manipulations import *
from app.redis_manipulations import *

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

cubes = {}
history_r = {}

async def scramble_cube(c, cube_id):
    """
    Scrambles cube according to its history of scramble
    :param c:
    :param cube_id:
    """
    history_r = await cache_get(cube_id)
    if history_r is not None:
        for move in history_r:
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
        await cache_set(cube_id, history_r)


async def initial_scramble(cube_id):
    """
    Perform initial cube randomizations
    :param cube_id:
    :return:
    """
    await cache_set(cube_id, list())
    # return

    iter_count = random.randint(1, 4)
    history_r = list()
    for i in range(iter_count):
        action = random.choice(['r', 'r_', 'f', 'f_', 'l', 'l_', 'b', 'b_', 'u', 'u_', 'd', 'd_'])
        history_r.append([action, 1])
    await cache_set(cube_id, history_r)


@app.get("/", response_class=HTMLResponse)
async def respond_home(request: Request):
    cube_id = request.cookies.get('cube_id', None)
    if cube_id is None:
        cube_id = uuid.uuid4()

    c = cubes.get(cube_id, None)
    if c is None:
        c = qb.Cube()
        await initial_scramble(cube_id)

    await scramble_cube(c, cube_id)

    cubes[cube_id] = c

    # print(cube_manipulations.cube_sides(c))
    # print(print_cube(c))
    # print(history)

    printable_history = await cache_get(cube_id)
    printable_history = 'No history yet' if printable_history is None else [x[0] for x in printable_history]

    return templates.TemplateResponse("home.html", {"request": request,
                                                    "cube": cube_sides(c),
                                                    'cube_id': cube_id,
                                                    'history': printable_history
                                                    })

@app.get("/move/{m}")
async def rotate(request: Request, m: str):
    """
    Adds the move to the history of the cube scramble
    :param request:
    :param m:
    :return:
    """
    cube_id = request.cookies.get('cube_id', None)
    if m in ['r', 'r_', 'f', 'f_', 'l', 'l_', 'b', 'b_', 'u', 'u_', 'd', 'd_']:
        if cube_id is not None:
            history_r = await cache_get_clean(cube_id)

            if history_r is None:
                history_r = list()
                await cache_set(cube_id, history_r)

            history_r.append([m, 1])
            await cache_set(cube_id, history_r)
    return RedirectResponse('/?' + str(random.random()))


@app.get('/MjAyMg==')
async def congratulate(request: Request):
    return templates.TemplateResponse("found.html", {"request": request})

@app.get('/2022')
async def congratulate(request: Request):
    return templates.TemplateResponse("found.html", {"request": request})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8002)
