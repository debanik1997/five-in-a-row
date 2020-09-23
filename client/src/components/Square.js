import React, { useEffect, useState } from "react";

const Square = ({ value, myTurn, onClick }) => {
    const [backgroundColor, setBackgroundColor] = useState('orange');
    useEffect(() => {
        switch (value) {
            case 'B':
                setBackgroundColor('black')
                break
            case 'W':
                setBackgroundColor('white')
                break
            default:
                setBackgroundColor('orange')
                break
        }
    }, [value]);

    return (
        <button
        style={{ backgroundColor: backgroundColor }}
        disabled={!myTurn}
        onClick={onClick}
      ></button>
    )
}

export default Square;
