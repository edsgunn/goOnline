$(function () {
    socket = io();    //Gets the socket from the server (?)

    let boardSizes = [19,13,9]
    let stars = [["3-3","3-9","3-15","9-3","9-9","9-15","15-3","15-9","15-15"],["3-3","3-9","6-6","9-3","9-9"],["2-2","2-6","4-4","6-2","6-6"]]
    boardSizeIndex = 0
    boardSize = boardSizes[boardSizeIndex]
    let boardRow = new Array(boardSize).fill(-1)
    board = boardRow.map(x => new Array(boardSize).fill(-1))
    colour = 1

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
        colour = !colour

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
                adjustBoardSize(answer.boardSizeIndex)
                colour = !answer.room
                $("#RoomBtns").hide()
                $("#StartBtns").show()
            } else {
                $('#RoomId').attr('placeholder', "Room ID " + val + "is not valid, the room may be full")
                $('#RoomId').removeClass("border-blue-500").addClass("border-red-500")
            }
        });
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
            let boardSize = newBoard[0].length
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (newBoard[i][j] == 0) {
                        let position = $(`#${i}-${j}`)
                        position.css("background-color", "white");
                        position.css("box-shadow","1px 1px 1px #404040 , inset -3px -3px 5px gray");
                        position.css("font-size","0")
    
                    }
                    else if (newBoard[i][j] == 1) { 
                        position = $(`#${i}-${j}`)
                        position.css("background-color", "black");
                        position.css("box-shadow", "1px 1px 1px #404040");
                        position.css("background-image","-webkit-radial-gradient( 40% 40%, circle closest-corner, #404040 0%, rgba(0, 0, 0, 0) 90%)");
                        position.css("background-image", "-moz-radial-gradient( 40% 40%, circle closest-side, #404040 0%, rgba(0, 0, 0, 0) 90%)");
                        position.css("font-size","0")
                    }
                }
            }
        });

        s.on("boardSize", function(boardSizeIndex){
            boardSize(boardSizeIndex)
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
                    socket.emit("place",placer.id)
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
});