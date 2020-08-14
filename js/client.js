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
    for(let i = 0; i < boardSize + 1; i++) {
        // each column
        let row = document.createElement("div");

        row.classList.add("z-10")
        row.classList.add("flex")
        row.classList.add("gap-0")        
        for(let j = 0; j < boardSize + 1; j++) {
            // create a square
            let placer = document.createElement("button");
            // add the Square class
            placer.classList.add("Placer");
            placer.addEventListener("click", function(){
                console.log(String(i)+","+String(j));
            });
            // add it to the board
            row.appendChild(placer);
        }
        goBoard.appendChild(row)
    }
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
            
            //adjust position
            square.style.top = (-15-(boardSize * 30)) + "px";
            
            // add it to the board
            row.appendChild(square);
        }
        goBoard.appendChild(row)
    }
});