from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
import uuid
import random

from rubik.cube import Cube


def cube_sides(c):
    s = c.flat_str()  # 'WWWWWWWWWOOOGGGRRRBBBOOOGGGRRRBBBOOOGGGRRRBBBYYYYYYYYY'

    return {
        '_B': [[int(s[18]), int(s[19]), int(s[20])],
               [int(s[30]), int(s[31]), int(s[32])],
               [int(s[42]), int(s[43]), int(s[44])]
               ],
        '_D': [[int(s[45]), int(s[46]), int(s[47])],
               [int(s[48]), int(s[49]), int(s[50])],
               [int(s[51]), int(s[52]), int(s[53])]
               ],
        '_F': [[int(s[12]), int(s[13]), int(s[14])],
               [int(s[24]), int(s[25]), int(s[26])],
               [int(s[36]), int(s[37]), int(s[38])]
               ],
        '_L': [[int(s[9]),  int(s[10]), int(s[11])],
               [int(s[21]), int(s[22]), int(s[23])],
               [int(s[33]), int(s[34]), int(s[35])]
               ],
        '_R': [[int(s[15]), int(s[16]), int(s[17])],
               [int(s[27]), int(s[28]), int(s[29])],
               [int(s[39]), int(s[40]), int(s[41])]
               ],
        '_U': [[int(s[0]), int(s[1]), int(s[2])],
               [int(s[3]), int(s[4]), int(s[5])],
               [int(s[6]), int(s[7]), int(s[8])],
               ],
    }


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
                    c.R()
                if move[0] == 'r_':
                    c.Ri()
                if move[0] == 'f':
                    c.F()
                if move[0] == 'f_':
                    c.Fi()
                if move[0] == 'l':
                    c.L()
                if move[0] == 'l_':
                    c.Li()
                if move[0] == 'b':
                    c.B()
                if move[0] == 'b_':
                    c.Bi()
                if move[0] == 'u':
                    c.U()
                if move[0] == 'u_':
                    c.Ui()
                if move[0] == 'd':
                    c.D()
                if move[0] == 'd_':
                    c.Di()

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
        c = Cube("000000000333444222555333444222555333444222555111111111")
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
async def congratulate_decoded(request: Request):
    return templates.TemplateResponse("found_decode.html", {"request": request})

@app.get('/secret')
async def secret():
    """
    yep, this is a 'secret' api endpoint;) congratulations! visit: /static/api.png
    :return:
    """
    pass

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8002)
