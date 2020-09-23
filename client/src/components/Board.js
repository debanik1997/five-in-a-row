import React from 'react';
import Square from './Square';

const style = {
    height: '600px',
    width: '600px',
    margin: '0 auto',
    display: 'grid',
    gridTemplate: 'repeat(19, 1fr) / repeat(19, 1fr)'
};

const Board = ({ squares, onClick, myTurn }) => (
    <div style={style}>
        {squares.map((square, i) => (
            <Square key={i} value={square} myTurn={myTurn} onClick={() => onClick(i)} />
        ))}
    </div>
)

export default Board;