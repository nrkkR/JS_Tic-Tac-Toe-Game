let currentPlayer = 'X';
let cpuSymbol = 'O';
let difficulty = 'medium';
let vsCPU = false;

function chooseMode(mode) {
    vsCPU = mode === 'cpu';
    document.getElementById('message').textContent = vsCPU ? 'VS CPU Mode Selected' : '2 Player Mode Selected';
    document.querySelector('.mode-options').style.display = 'none';
    document.querySelector('.first-move-options').style.display = 'flex';
    if (vsCPU) {
        document.querySelector('.difficulty-options').style.display = 'flex';
    }
}

function chooseFirstMove(symbol) {
    currentPlayer = symbol;
    cpuSymbol = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('message').textContent = `Player ${currentPlayer}'s turn`;
    document.querySelector('.first-move-options').style.display = 'none';
}

function setDifficulty(level) {
    difficulty = level;
    document.getElementById('message').textContent = `Difficulty set to ${level.charAt(0).toUpperCase() + level.slice(1)}`;
    document.querySelector('.difficulty-options').style.display = 'none';
}

function resetGame() {
    currentPlayer = 'X';
    cpuSymbol = 'O';
    vsCPU = false;
    document.getElementById('message').textContent = `Player ${currentPlayer}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled', 'winner-x', 'winner-o');
    });
    document.querySelector('.mode-options').style.display = 'flex';
    document.querySelector('.first-move-options').style.display = 'none';
    document.querySelector('.difficulty-options').style.display = 'none';
}

function makeMove(index) {
    const cell = document.getElementById('board').children[index];
    if (cell.textContent === '') {
        cell.textContent = currentPlayer;
        cell.classList.add('disabled');
        if (checkWinner()) {
            return;
        }
        if (vsCPU) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('message').textContent = `Player ${currentPlayer}'s turn`;
            if (currentPlayer === cpuSymbol) {
                setTimeout(cpuMove, 500);
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('message').textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

function cpuMove() {
    const bestMove = findBestMove();
    makeMove(bestMove);
}

function findBestMove() {
    const board = Array.from(document.querySelectorAll('.cell')).map(cell => cell.textContent);
    if (difficulty === 'easy') {
        const emptyCells = getAvailableMoves(board);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    if (difficulty === 'medium') {
        for (let move of getAvailableMoves(board)) {
            if (isWinningMove(board, move, cpuSymbol)) {
                return move;
            }
        }

        for (let move of getAvailableMoves(board)) {
            if (isWinningMove(board, move, currentPlayer === 'X' ? 'O' : 'X')) {
                return move;
            }
        }

        if (board[4] === '') {
            return 4;
        }

        const emptyCells = getAvailableMoves(board);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    if (difficulty === 'hard') {
        return minimax(board, cpuSymbol).index;
    }
}

function minimax(newBoard, player) {
    const availSpots = getAvailableMoves(newBoard);

    if (checkWinner(newBoard, cpuSymbol)) {
        return { score: 10 };
    } else if (checkWinner(newBoard, currentPlayer === 'X' ? 'O' : 'X')) {
        return { score: -10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === cpuSymbol) {
            const result = minimax(newBoard, currentPlayer === 'X' ? 'O' : 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, cpuSymbol);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === cpuSymbol) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getAvailableMoves(board) {
    return board.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);
}

function isWinningMove(board, move, player) {
    const tempBoard = [...board];
    tempBoard[move] = player;
    return checkWinner(tempBoard, player);
}

function checkWinner(board = null, player = null) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    if (!board) {
        board = Array.from(document.querySelectorAll('.cell')).map(cell => cell.textContent);
        player = currentPlayer;
    }

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            pattern.forEach(index => document.getElementById('board').children[index].classList.add(`winner-${player.toLowerCase()}`));
            document.getElementById('message').textContent = `Player ${board[a]} wins!`;
            Array.from(document.querySelectorAll('.cell')).forEach(cell => cell.classList.add('disabled'));
            return true;
        }
    }

    if (board.every(cell => cell !== '')) {
        document.getElementById('message').textContent = "It's a draw!";
        return true;
    }

    return false;
}

// Initialize the game
resetGame();
