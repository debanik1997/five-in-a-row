export function calculateWinner(squares, blackTurn, tileClicked) {
	const marker = blackTurn ? 'B' : 'W'
	
	if (marker === 'W' && checkLeftRight(squares, marker, tileClicked) >= 4) {
		console.log('Clicked ' + tileClicked)
		return marker
	}

	return null
}

function checkLeftRight(squares, marker, tileClicked) {
	var count = 0
	// Check left
	var l = tileClicked - 1
	while (l > 0 && squares[l] === marker) {
		count++;
		l--;
	}
	console.log(count)
	// Check right
	var r = tileClicked + 1
	var rowNum = r / 19
	while (Math.floor(r / 19) === rowNum && squares[r] === marker) {
		count++;
		r++;
	}
	console.log(count)
	return count
}
