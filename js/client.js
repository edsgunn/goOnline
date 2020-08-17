$(function () {
    socket = io();    //Gets the socket from the server (?)

    let boardSizes = [19,13,9]
    let stars = [["3-3","3-9","3-15","9-3","9-9","9-15","15-3","15-9","15-15"],["3-3","3-9","6-6","9-3","9-9"],["2-2","2-6","4-4","6-2","6-6"]]
    boardSizeIndex = 0
    boardSize = boardSizes[boardSizeIndex]
    let boardRow = new Array(boardSize).fill(-1)
    board = boardRow.map(x => new Array(boardSize).fill(-1))
    lastBoard = board.map(x => x.slice())
    koBoard = lastBoard.map(x => x.slice())
    colour = 1
    turn = 1
    gameStarted = false

    $("#StartBtns").hide()
    adjustBoardSize(boardSizeIndex)

    $("#BoardSizeBtn").click(function () {
        if (boardSizeIndex < 2) {
            boardSizeIndex ++
        } else {
            boardSizeIndex = 0
        }
        adjustBoardSize(boardSizeIndex)
        $("#BoardSizeBtn").html("Board Size: "+boardSize)

    });

    $("#StoneColourChanger").click(function () {
        $("#StoneColour").toggleClass("BlackStone WhiteStone")
        colour = 1-colour

    });
    $("#CreateRoomBtn").click(function(){
        socket.emit('newRoom', {"index":boardSizeIndex, "colour":colour},function (roomid) {
            joinRoom(roomid) 
            $("#RoomBtns").hide()
            $("#StartBtns").show()
        });
    });

    $("#JoinRoomBtn").click(function(){
        let val = $('#RoomId').val()
        if (val.length == 0) {
            return;
        }
        socket.emit("joinRoom", val, function (answer) {
            if (answer.room != -1) {
                joinRoom(val)
                colour = 1 - colour
                adjustBoardSize(answer.boardSizeIndex)
                $("#RoomBtns").hide()
                $("#StartBtns").show()
            } else {
                $('#RoomId').attr('placeholder', "Room ID " + val + "is not valid, the room may be full")
                $('#RoomId').removeClass("border-blue-500").addClass("border-red-500")
            }
        });
    });

    $("#StartBtn").click(function (){
        socket.emit("startGame")
    });

    function joinRoom(roomID) {
        $('#RoomID').text("Room ID: " + roomID)
        console.log("Joining room with id: " + roomID);
        socket = io('/' + roomID);
        setSocket(socket)
        console.log(socket)
        roomID = roomID;
    }
    

    function setSocket(s) {
        console.log(s)

        s.on("updateBoard",function(newBoard) {
            turn = 1 - turn
            updateBoard(newBoard)
            
        });

        s.on("boardSize", function(boardSizeIndex){
            boardSize(boardSizeIndex)
        });

        s.on("startGame", function(){

            $("#StartBtn").hide()
            gameStarted = true
        });

        s.on("pass",function(){
            turn = 1-turn
        });
    }

    function adjustBoardSize(boardSizeIndex) {
        boardSize = boardSizes[boardSizeIndex]
        let boardRow = new Array(boardSize).fill(-1)
        board = boardRow.map(x => new Array(boardSize).fill(-1))
        let goBoard = $("#Board");
        goBoard.empty();
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
                placer.id = i+"-"+j
                placer.addEventListener("click", function(){
                    if (turn == colour && gameStarted) {
                        if (isValidMove(placer.id,colour)) {
                            if (!boardsEqual(board,koBoard)) {
                                koBoard = board.map(x => x.slice())
                                socket.emit("place",board)
                            }
                            else {
                                console.log("Not Valid Move due to Ko")
                                board = lastBoard.map(x => x.slice())
                            }
                        }
                    }
                });
                if (stars[boardSizeIndex].includes(placer.id)) {
                    placer.innerHTML = "•"
                }
                // add it to the board
                row.appendChild(placer);
            }
            goBoard.append(row)
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
            goBoard.append(row)
        }
    }

    function checkTaken(id,playerColour) {
        let opponentTaken = [id]

        for (let stone of opponentTaken) {
            let left = [stone[0],stone[1]-1]
            let right = [stone[0],stone[1]+1]
            let up = [stone[0]-1,stone[1]]
            let down = [stone[0]+1,stone[1]]
            let spaces = [left,right,up,down]
            for (let space of spaces) {
                if (board[space[0]] != undefined) {
                    if (board[space[0]][space[1]] != undefined) {
                        if (board[space[0]][space[1]] == -1){
                            return []
                        }
                        else if (board[space[0]][space[1]] == 1-playerColour) {
                            if (!(arrayIsInArray(space,opponentTaken))) {
                                opponentTaken.push(space)
                            }
                        }
        
                    }
                }
            }
        }
        return opponentTaken

    }
    function isValidMove(id,playerColour){
        let place = id.split("-")
        place = place.map(x => Number(x))
        if (board[place[0]][place[1]] != -1){
            console.log("Space Full")
            return false
        }
        lastBoard = board.map(x => x.slice())
        board[place[0]][place[1]] = playerColour
        let playerStones = [place]
        let opponentStones = []
        let left = [place[0],place[1]-1]
        let right = [place[0],place[1]+1]
        let up = [place[0]-1,place[1]]
        let down = [place[0]+1,place[1]]
        let spaces = [left,right,up,down]
        for (let space of spaces) {
            if (board[space[0]] != undefined) {
                if (board[space[0]][space[1]] != undefined) {
                    if (board[space[0]][space[1]] == 1-playerColour) {
                        let takenStones = checkTaken(space,playerColour)
                        opponentStones = opponentStones.concat(takenStones)
                    }
                }
            }
        }
        if (opponentStones.length > 0) {
            for (let stone of opponentStones) {
                board[stone[0]][stone[1]] = -1
            }
            return true
        }
        for (let stone of playerStones) {
            let left = [stone[0],stone[1]-1]
            let right = [stone[0],stone[1]+1]
            let up = [stone[0]-1,stone[1]]
            let down = [stone[0]+1,stone[1]]
            let spaces = [left,right,up,down]
            for (let space of spaces) {
                if (board[space[0]] != undefined){
                    if (board[space[0]][space[1]] != undefined) {
                        if (board[space[0]][space[1]] == -1){
                            return true
                        }
                        else if (board[space[0]][space[1]] == playerColour) {
                            if (!(arrayIsInArray(space,playerStones))) {
                                playerStones.push(space)
                            }
                        }
                    }
                }
            }
        }
        console.log("Not valid move")
        board[place[0]][place[1]] = -1
        return false
    }
    function arrayIsInArray(array,dArray){
        for (let arr of dArray){
            if (array[0] == arr[0] && array[1] == arr[1]) {
                return true
            }
        }
        return false
    }
    function boardsEqual(board1,board2) {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board1[i][j] != board2[i][j]) {
                    return false
                }
            } 
        }
        return true
    }
    function updateBoard(newBoard) {
        board = newBoard
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                let position = $(`#${i}-${j}`)
                if (board[i][j] == 0) {
                    position.css("background-color", "white");
                    position.css("box-shadow","1px 1px 1px #404040 , inset -3px -3px 5px gray");
                    position.css("font-size","0")

                }
                else if (board[i][j] == 1) { 
                    position.css("background-color", "black");
                    position.css("box-shadow", "1px 1px 1px #404040");
                    position.css("background-image","-webkit-radial-gradient( 40% 40%, circle closest-corner, #404040 0%, rgba(0, 0, 0, 0) 90%)");
                    position.css("background-image", "-moz-radial-gradient( 40% 40%, circle closest-side, #404040 0%, rgba(0, 0, 0, 0) 90%)");
                    position.css("font-size","0")
                }
                else {
                    position.css("background","transparent")
                    position.css("box-shadow", "0px 0px 0px #404040");
                    position.css("font-size","10")
                    position.css("color", "black")
                }
            }
        }
    }
});
