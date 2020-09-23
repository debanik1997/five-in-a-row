import React, { useEffect, useState } from "react";
// import { calculateWinner } from "../helpers";
import Board from "./Board";

const LiveGame = (props) => {
  const [board, setBoard] = useState(Array(361).fill(null));
  const [blackTurn, setBlackTurn] = useState(true);
  const [myTurn, setMyTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setMyTurn(props.myTurn);
    props.socket.on("message", (data) => {
      if (data && data.currentBoard) {
        setBoard(data.currentBoard);
        setBlackTurn(data.player === "B" ? true : false);
        if (data.me === props.me) {
          setMyTurn(false);
        } else {
          setMyTurn(true);
        }
        if (data.winner) {
          setGameOver(true);
        }
      }
    });
  }, [props.socket, props.myTurn, props.me]);

  const handleMove = (i) => {
    if (myTurn) {
      props.socket.emit("message", {
        currentBoard: board,
        move: i,
        player: blackTurn ? "B" : "W",
        room: props.room,
        me: props.me,
      });
    }
  };

  const resetGame = () => {
    setBoard(Array(361).fill(null));
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div style={{ backgroundColor: "gray" }}>
        <h1 style={{ margin: "0 auto" }}>
          Game Over!
        </h1>
        <Board squares={board} onClick={handleMove} myTurn={false} />
        <button onClick={resetGame}>Reset</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "gray" }}>
      <h1 style={{ margin: "0 auto" }}>
        {blackTurn ? "Black" : "White"}'s turn
      </h1>
      <h2 style={{ margin: "0 auto" }}>
        {myTurn ? "Your turn" : "Opponent's turn"}
      </h2>
      <Board squares={board} onClick={handleMove} myTurn={myTurn} />
      <button onClick={resetGame}>Reset</button>
    </div>
  );
};

export default LiveGame;
