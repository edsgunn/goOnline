$(function () {
    socket = io();    //Gets the socket from the server (?)

    let boardSizes = [19,13,9]
    let stars = [["3,3","3,9","3,15","9,3","9,9","9,15","15,3","15,9","15,15"],["3,3","3,9","6,6","9,3","9,9"],["2,2","2,6","4,4","6,2","6,6"]]
    let boardSizeIndex = 2
    let boardSize = boardSizes[boardSizeIndex]
    // let boardRow = new Array(boardSize).fill(-1)
    // let board = boardRow.map(x => new Array(boardSize).fill(-1))
    // for (let i = 0; i < boardSize; i++) {
    //     let row = []
    //     for (let j = 0; j < boardSize; j++) {
    //         row.push(-1)
    //     }
    //     board.push(row)
    // }
    let goBoard = document.getElementById("Board");

    // each lines
    for(let i = 0; i < boardSize; i++) {
        // each column
        let row = document.createElement("div");
        row.classList.add("z-10")
        row.classList.add("flex")
        row.classList.add("gap-0")        
        for(let j = 0; j < boardSize; j++) {
            // create a square
            let placer = document.createElement("button");
            // add the Square class
            placer.classList.add("Placer");
            placer.id = i+","+j
            placer.addEventListener("click", function(){
                socket.emit("place",placer.id)
            });
            if (stars[boardSizeIndex].includes(placer.id)) {
                placer.innerHTML = "•"
            }
            // add it to the board
            row.appendChild(placer);
        }
        goBoard.appendChild(row)
    }
    // each lines
    for(let i = 0; i < boardSize-1; i++) {
        // each column
        let row = document.createElement("div");

        row.classList.add("flex")
        for(let j = 0; j < boardSize-1; j++) {
            // create a square
            let square = document.createElement("div");
            // add the Square class
            square.classList.add("Square");
            
            //adjust position
            square.style.top = (15-(boardSize * 30)) + "px";
            
            // add it to the board
            row.appendChild(square);
        }
        goBoard.appendChild(row)
    }

    socket.on("updateBoard",function(newBoard) {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (newBoard[i][j] == 0) {
                    console.log(i+","+j+" white")
                    $("#"+i+","+j).css("background-color", "white");
                }
                else if (newBoard[i][j] == 1) { 
                    $("#"+i+","+j).css("background-color", "black");
                    console.log(i+","+j+" black")
                }
            }
        }
    })
});