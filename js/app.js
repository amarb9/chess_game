// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Initialize the chessboard
    const game = new Chess(); // Create new game instance
    const moveHistory = document.getElementById('move-history'); // Get move history
    let moveCount = 1 // Initialize the move count
    let userColor = 'w'; // Initialize the user color as white
    
    // Function to make a random move for the CPU
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if(game.game_over()) {
            alert("Checkmate!");
        }
        else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];

            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount);
            moveCount++;
        }
    };

    // Function to record and display a move in the move history
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;

        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    // Function to handle the start of a drag position
    const onDragStart = (source, piece) =>  {
        return !game.game_over() && piece.search(userColor) === 0;
    };

    // Function to handle the piece dropping on the board
    const onDrop = (source, target) => {
        const move = game.move({ 
            from: source,
            to: target,
            promotion: 'q',
        });

        if(move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount);
        moveCount++;
    };

    // Function to handle the end of the piece snap
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    // Configuration options for the board
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    // Initialize the board
    board = Chessboard('board', boardConfig);

    // Event listener for "Play Again" button
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    // Event listener for "Set Position" button
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position.");
        
        if(fen !== null) {
            if(game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            }
            else {
                alert("Invalid FEN notation. Please try again.");
            }
        }
    });

    // Event listener for "Flip Board" button
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        userColor = userColor === 'w' ? 'b' : 'w';
    });

});