import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import LiveGame from "./LiveGame";
import GameStartModal from "./GameStartModal";

import io from "socket.io-client";
let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const GameState = {
  NOT_STARTED: 1,
  WAITING_FOR_PLAYER: 2,
  ACTIVE: 3,
};
Object.freeze(GameState);

const Game = () => {
  const [showGameStartModal, setShowGameStartModal] = useState(false);
  const [gameStartMode, setGameStartMode] = useState('');
  const [gameState, setGameState] = useState(GameState.NOT_STARTED);
  const [myTurn, setMyTurn] = useState(true);
  const [me, setMe] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    socket.on("new_join", function (data) {
      if (data && data.current_room) {
        if (data.members.length === 0) {
          setGameState(GameState.NOT_STARTED);
        } else if (data.members.length === 1) {
          setGameState(GameState.WAITING_FOR_PLAYER);
        } else if (data.members.length === 2) {
          setGameState(GameState.ACTIVE);
        } else {
          setGameState(GameState.NOT_STARTED);
        }
      }
    });
  }, []);

  const joinRoom = (userName, roomName) => {
    let form = {
      username: userName,
      room: roomName,
    };
    setMe(userName);
    setRoom(roomName);
    socket.emit("join", form);
  }

  const startGame = () => {
    setGameStartMode("start");
    setShowGameStartModal(true);
  };

  const joinGame = () => {
    setGameStartMode("join");
    setShowGameStartModal(true);
  };

  if (gameState === GameState.ACTIVE) {
    return <LiveGame socket={socket} myTurn={myTurn} me={me} room={room} />;
  } else if (gameState === GameState.WAITING_FOR_PLAYER) {
    return (
      <Spinner animation="grow" variant="primary" />
    );
  }
  return (
    <div>
      <Button variant="primary" onClick={startGame}>
        Start a game
      </Button>{" "}
      <Button variant="success" onClick={joinGame}>
        Join a game
      </Button>{" "}
      <GameStartModal
        showModal={showGameStartModal}
        hideModal={() => setShowGameStartModal(false)}
        gameStartMode={gameStartMode}
        setGameState={setGameState}
        joinRoom={joinRoom}
        setMyTurn={setMyTurn}
      />
    </div>
  );
};

export default Game;
