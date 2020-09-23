from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send, join_room, leave_room, emit

import numpy as np

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'

socketio = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

rooms = {}


def valid_move(data):
    if data['currentBoard'][data['move']] is None:
        return True
    else:
        return False


def convert_to_i_j(move):
    return int(move / 19), move % 19


def calculateWinner(board, move):
    i, j = convert_to_i_j(move)
    squares = np.array(board).reshape((19, 19))

    iReset = i
    jReset = j
    #left & right
    count = 0
    curr = squares[i][j]
    # left
    while (j >= 0):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            j = j - 1
        else:
            # no more going left
            break

    # right
    j = jReset + 1
    while (j < len(squares)):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            j = j + 1
        else:
            break

    #up & down
    j = jReset
    count = 0
    # up
    while (i >= 0):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            i = i - 1
        else:
            # no more going up
            break
    # down
    i = iReset + 1
    while (i < len(squares)):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            i = i + 1
        else:
            break

    # diagonal1
    j = jReset
    i = iReset
    count = 0
    # up left
    while (i >= 0 and j >= 0):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            i = i - 1
            j = j - 1
        else:
            # no more going left & up
            break
    # down right
    i = iReset + 1
    j = jReset + 1
    while (i < len(squares) and j < len(squares)):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            i = i + 1
            j = j + 1
        else:
            break

    # diagonal2
    j = jReset
    i = iReset
    count = 0
    # up right
    while (i >= 0 and j < len(squares)):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            i = i - 1
            j = j + 1
        else:
            # no more going up & right
            break
    # down left
    i = iReset + 1
    j = jReset - 1
    while (i < len(squares) and j >= 0):
        if (squares[i][j] == curr):
            count = count + 1
            if (count == 5):
                return True
            i = i + 1
            j = j - 1
        else:
            break
    return False


@socketio.on("message")
def handleMove(data):
    if (valid_move(data)):
        data['currentBoard'][data['move']] = data['player']
        data['player'] = 'B' if data['player'] == 'W' else 'W'

        data['winner'] = calculateWinner(data['currentBoard'], data['move'])
        send(data, room=data['room'])

@socketio.on("join")
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    global rooms
    if room in rooms:
        rooms[room].append(username)
    else:
        rooms[room] = [username]
    data = {'new_join': username, 'current_room': room, 'members': rooms[room]}
    socketio.emit("new_join", data, room=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)


if __name__ == '__main__':
    socketio.run(app)
