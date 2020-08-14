$(function () {
    socket = io();    //Gets the socket from the server (?)

    let boardSize = 19
    let board = []
    for (let i = 0; i < boardSize; i++) {
        let row = []
        for (let j = 0; j < boardSize; j++) {
            row.push(-1)
        }
        board.push(row)
    }
    let goBoard = document.getElementById("Board");

    // each lines
    for(let i = 0; i < boardSize; i++) {
        // each column
        let row = document.createElement("div");

        row.classList.add("flex")
        for(let j = 0; j < boardSize; j++) {
            // create a square
            let square = document.createElement("div");
            // add the Square class
            square.classList.add("Square");
            
            // instead of class linehx
            // square.style.top = 30 * i + "px";
            // or use : square.classList.add("lineh" + i);
            
            // instead of class linevx
            // square.style.left = 30 * j + "px";
            // or use : square.classList.add("linev" + j);
            
            // add it to the board
            row.appendChild(square);
        }
        goBoard.appendChild(row)
    }
});