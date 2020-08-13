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
    let row = document.createElement('tr');
    let data = document.createElement('td');
    data.innerHTML = '+'
    for (let j = 0; j < boardSize-1; j++) {
        row.appendChild(data);
    }
    for (let i = 0; i < boardSize-1; i++) {
        $('Board').append(row);
    }
    console.log("Board Made")
});