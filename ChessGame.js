var boardSideSize = 8;
var boardSize = boardSideSize * boardSideSize;
var boardArray = new Array(boardSize);
var component ;
var figureSize = 100;


function index(column, row) {
    return column + (row * boardSize);
}

function startNewGame() {
    for(var i = 0 ; i < boardSize ; ++i) {
        if(boardArray[i] != null) {
            boardArray[i].destroy();
        }
    }
    boardArray = new Array(boardSize);

    for(var i = 0 ; i < boardSideSize ; ++i){
        boardArray[index(i,6)] = null;
        createFigure("pawn", "white", i,6);
    }
    for(var i = 0 ; i < boardSideSize ; ++i){
        boardArray[index(i,1)] = null;
        createFigure("pawn", "black", i,1);
    }
    boardArray[index(0,7)] = null;
    createFigure("rook", "white", 0,7);
    boardArray[index(7,7)] = null;
    createFigure("rook", "white", 7,7);

    boardArray[index(0,0)] = null;
    createFigure("rook", "black", 0,0);
    boardArray[index(7,0)] = null;
    createFigure("rook", "black", 7,0);

    boardArray[index(1,7)] = null;
    createFigure("knight", "white", 1,7);
    boardArray[index(6,7)] = null;
    createFigure("knight", "white", 6,7);

    boardArray[index(1,0)] = null;
    createFigure("knight", "black", 1,0);
    boardArray[index(6,0)] = null;
    createFigure("knight", "black", 6,0);

    boardArray[index(2,7)] = null;
    createFigure("bishop", "white", 2,7);
    boardArray[index(5,7)] = null;
    createFigure("bishop", "white", 5,7);

    boardArray[index(2,0)] = null;
    createFigure("bishop", "black", 2,0);
    boardArray[index(5,0)] = null;
    createFigure("bishop", "black", 5,0);

    boardArray[index(3,7)] = null;
    createFigure("king", "white", 3,7);
    boardArray[index(4,7)] = null;
    createFigure("queen", "white", 4,7);

    boardArray[index(3,0)] = null;
    createFigure("king", "black", 3,0);
    boardArray[index(4,0)] = null;
    createFigure("queen", "black", 4,0);

}

function createFigure(type, side, column, row) {

    if(component == null) {
        component = Qt.createComponent("Figure.qml");
    }
    if(component.status == Component.Ready){
        var figure = component.createObject(board);
        if(figure == null){
            console.log("Error: creating figure.");
            return false;
        }
        figure.imagePath = getIconImage(type,side);
        figure.x = column * figureSize;
        figure.y = row * figureSize;
        figure.height = figureSize;
        figure.clickFunc = function() {
             console.log("figure clicked")
        };

        boardArray[index(row,column)] = figure;
    }
    else {
        console.log("Error: loading figure component");
        return false;
    }
    return true;

}

function getIconImage(type, side) {
    return "qrc:/images/img/"+ type +"_" + side + ".svg";
}

function getClickedFunc(type) {

}


