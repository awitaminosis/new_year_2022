import colorama
def print_cube(c):
    DIMENSION = 3
    iter_dim = range(DIMENSION)
    string = ''

    # Stringify all dimensions of the cube plus 1 for the header string
    for i in range(DIMENSION + 1):
        # First print the head string
        if i == 0:
            space = ' ' * DIMENSION
            first_space = ' ' * int((DIMENSION / 2))
            # The below order is the same order we add in the init method
            string += colorama.Fore.BLACK + first_space + 'F' + space + 'B' + space + 'L' + space + 'R' + space + 'U' + space + 'D\n'
        # Next print each row of each face
        else:
            for face in [c._F, c._B, c._L, c._R, c._U, c._D]:
                for j in iter_dim:
                    string += qb.color_strings[face[i - 1][j]]
                string += ' '
            string += '\n'
    string += colorama.Style.RESET_ALL
    return string

def cube_sides(c):
    return {
        '_B': c._B,
        '_D': c._D,
        '_F': c._F,
        '_L': c._L,
        '_R': c._R,
        '_U': c._U,
    }
