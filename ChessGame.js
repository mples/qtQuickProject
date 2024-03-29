var boardSideSize = 8;
var boardSize = boardSideSize * boardSideSize;
var figureArray = new Array(boardSize);
var aviableMoves = new Array;
var component;
var componentCell;

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function index(column, row) {
    return column + (row * boardSideSize);
}

function isValidBoardCoord(point) {
    return ( point.x >=0 && point.x < 8 && point.y >= 0 && point.y < 8);
}

function getFigureAt(point) {
    return figureArray[index(point.x, point.y)];
}

function oppositeSide(side) {
    if(board.movingSide == "white") {
        return "black";
    }
    else {
        return "white";
    }
}

function changeMovingSide() {
    board.movingSide = oppositeSide(board.movingSide);
}

function getFigures(side) {
    var figures = new Array();
    for(var i = 0 ; i < boardSize ; ++i) {
        var figure = figureArray[i];
        if(figure != null) {
            if(figure.side == side) {
                figures.push(figure);
            }
        }
    }
    return figures;
}
function getKing(side) {
    for(var i = 0 ; i < boardSideSize ; ++i) {
        for(var j = 0 ; j < boardSideSize; ++j) {
            var figure = figureArray[index(i,j)];
            if(figure != null) {
                if(figure.type == "king" && figure.side == side) {
                    return new Point(i,j);
                }
            }

        }

    }
    return null;
}
function isChecked() {
    var figures = getFigures(oppositeSide(board.movingSide));
    var king = getKing(board.movingSide);

    for(var i = 0 ; i < figures.length ; ++i) {
        var moves = figures[i].moves(figures[i]);
        for(var j = 0 ; j < moves.length ; ++j) {
            if(moves[j].x == king.x && moves[j].y == king.y) {
                return true;
            }
        }
    }

    return false;
}

function isCheckMate() {
    var figures = getFigures(board.movingSide);
    var moves;
    for(var i = 0 ; i < figures.length ; ++i) {
        moves = figures[i].moves(figures[i]);
        for(var j = 0 ; j < moves.length ; ++j) {
            if(isMovePossible(new Point(figures[i].boardColumn, figures[i].boardRow), moves[j])) {
                return false;
            }
        }
    }
    return true;
}

function isDraw() {
    var figures = getFigures(oppositeSide(board.movingSide) );
    var moves = new Array();
    for(var i = 0 ; i < figures.length ; ++i) {
        moves = moves.concat(figures[i].moves(figures[i]) );
    }
    return moves.length == 0;
}

function clearAviableMoves() {
    aviableMoves.forEach(function(item, index, array) {
      item.destroy();
    });
    aviableMoves = new Array;
}

function clearFiguresArray() {
    for(var i = 0 ; i < boardSize ; ++i) {
        if(figureArray[i] != null) {
            figureArray[i].destroyAnim.start();
        }
    }
    figureArray = new Array(boardSize);
}

function startNewGame() {
    clearFiguresArray();
    board.movingSide = "white";

    for(var i = 0 ; i < boardSideSize ; ++i){
        figureArray[index(i,6)] = null;
        createFigure("pawn", "white", i,6);
    }
    for(var i = 0 ; i < boardSideSize ; ++i){
        figureArray[index(i,1)] = null;
        createFigure("pawn", "black", i,1);
    }
    figureArray[index(0,7)] = null;
    createFigure("rook", "white", 0,7);
    figureArray[index(7,7)] = null;
    createFigure("rook", "white", 7,7);

    figureArray[index(0,0)] = null;
    createFigure("rook", "black", 0,0);
    figureArray[index(7,0)] = null;
    createFigure("rook", "black", 7,0);

    figureArray[index(1,7)] = null;
    createFigure("knight", "white", 1,7);
    figureArray[index(6,7)] = null;
    createFigure("knight", "white", 6,7);

    figureArray[index(1,0)] = null;
    createFigure("knight", "black", 1,0);
    figureArray[index(6,0)] = null;
    createFigure("knight", "black", 6,0);

    figureArray[index(2,7)] = null;
    createFigure("bishop", "white", 2,7);
    figureArray[index(5,7)] = null;
    createFigure("bishop", "white", 5,7);

    figureArray[index(2,0)] = null;
    createFigure("bishop", "black", 2,0);
    figureArray[index(5,0)] = null;
    createFigure("bishop", "black", 5,0);

    figureArray[index(4,7)] = null;
    createFigure("king", "white", 4,7);
    figureArray[index(3,7)] = null;
    createFigure("queen", "white", 3,7);

    figureArray[index(4,0)] = null;
    createFigure("king", "black", 4,0);
    figureArray[index(3,0)] = null;
    createFigure("queen", "black", 3,0);

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
        figure.boardRow = row;
        figure.boardColumn = column;
        figure.boardSize = board.cellSize;
        figure.height = board.cellSize;
        figure.side = side;
        figure.type = type;
        figure.moves = getClickedFunc(type);
        figure.clickFunc = function() {
            clearAviableMoves();
            if(figure.side == board.movingSide) {
                var moves = figure.moves(figure);
                moves.forEach(function(item, index, array) {
                    if(isMovePossible(new Point(figure.boardColumn, figure.boardRow) , item) ) {
                                createMoveCell(figure, item.x ,item.y);
                    }
                });

            }
        };
        figureArray[index(column,row)] = figure;
    }
    else {
        console.log("Error: loading figure component");
        return false;
    }
    return true;

}
function isMovePossible(from, to) {
    var possible = false;
    var move_figure = figureArray[index(from.x, from.y)];
    var attacked_figure = figureArray[index(to.x, to.y)];
    figureArray[index(to.x, to.y)] = move_figure;
    figureArray[index(from.x, from.y)] = null;

    possible = !isChecked();

    figureArray[index(to.x, to.y)] = attacked_figure;
    figureArray[index(from.x, from.y)] = move_figure;
    return possible;
}

function moveFigure(from, to) {
    var move_figure = figureArray[index(from.x, from.y)];
    var attacked_figure = figureArray[index(to.x, to.y)];
    if(attacked_figure != null) {
        attacked_figure.destroyAnim.start();
    }
    figureArray[index(to.x, to.y)] = move_figure;
    figureArray[index(from.x, from.y)] = null;
}


function createMoveCell(figure, column, row) {
    if(componentCell == null) {
        componentCell = Qt.createComponent("MoveCell.qml");
    }
    if(componentCell.status == Component.Ready){
        var moveCell = componentCell.createObject(board);
        if(moveCell == null){
            console.log("Error: creating move cell.");
            return false;
        }
        moveCell.boardRow = row;
        moveCell.boardColumn = column;
        moveCell.boardSize = board.cellSize;
        moveCell.figureToMove = figure;
        moveCell.clickFunc = function() {
            if(isMovePossible(new Point(moveCell.figureToMove.boardColumn, moveCell.figureToMove.boardRow), new Point(moveCell.boardColumn ,moveCell.boardRow))) {
                moveFigure(new Point(moveCell.figureToMove.boardColumn, moveCell.figureToMove.boardRow), new Point(moveCell.boardColumn ,moveCell.boardRow));
                moveCell.figureToMove.boardRow = moveCell.boardRow;
                moveCell.figureToMove.boardColumn = moveCell.boardColumn;
                figure.notmoved = false;
                changeMovingSide();
            }

            clearAviableMoves();
            if(isCheckMate()){
                var won_side = oppositeSide(board.movingSide);
                won_side = won_side.charAt(0).toUpperCase() + won_side.substr(1);
                winDialog.winningSide = won_side;
                winDialog.open();
            }
            if(isDraw()){
                drawDialog.open();
            }

        };
        aviableMoves.push(moveCell);

    }
    else {
        console.log("Error: loading MoveCell component");
        return false;
    }
    return true;

}


function getIconImage(type, side) {
    return "qrc:/images/img/"+ type +"_" + side + ".svg";
}

function getClickedFunc(type) {
    switch (type) {
    case "pawn":
        return pawnMoves;
    case "bishop":
        return bishopMoves;
    case "rook":
        return rookMoves;
    case "queen":
        return queenMoves;
    case "king":
        return kingMoves;
    case "knight":
        return knightMoves;
    default:
        return function() {console.log("Error, bad figure type")}
    }
}

function pawnMoves(figure) {
    var moves = new Array;

        if(figure.side == "white") {
            if(figure.boardRow - 1 >= 0 && figureArray[index(figure.boardColumn, figure.boardRow - 1)] == null) {
                moves.push(new Point(figure.boardColumn , figure.boardRow - 1));
                if(figure.notmoved) {
                    if(figure.boardRow - 2 >= 0 && figureArray[index(figure.boardColumn, figure.boardRow - 2)] == null)
                        moves.push(new Point(figure.boardColumn , figure.boardRow - 2));
                }
                if(figure.boardColumn - 1 >= 0) {
                    var temp = new Point(figure.boardColumn - 1, figure.boardRow - 1);
                    var temp_figure = figureArray[index(temp.x, temp.y)];
                    if(temp_figure != null) {
                        if(figure.side != temp_figure.side) {
                            moves.push(temp);
                        }
                    }
                }
            }

            if(figure.boardColumn + 1 < boardSideSize ) {
                var temp = new Point(figure.boardColumn + 1, figure.boardRow - 1);
                var temp_figure = figureArray[index(temp.x, temp.y)];
                if(temp_figure != null) {
                    if(figure.side != temp_figure.side) {
                        moves.push(temp);
                    }
                }
            }
            if(figure.boardColumn - 1 >= 0 ) {
                var temp = new Point(figure.boardColumn - 1, figure.boardRow - 1);
                var temp_figure = figureArray[index(temp.x, temp.y)];
                if(temp_figure != null) {
                    if(figure.side != temp_figure.side) {
                        moves.push(temp);
                    }
                }
            }

        }
        else if(figure.side == "black") {
            if(figure.boardRow + 1 >= 0 && figureArray[index(figure.boardColumn, figure.boardRow + 1)] == null) {
                moves.push(new Point(figure.boardColumn , figure.boardRow + 1));
                if(figure.notmoved) {
                    if(figure.boardRow + 2 >= 0 && figureArray[index(figure.boardColumn, figure.boardRow + 2)] == null)
                        moves.push(new Point(figure.boardColumn , figure.boardRow + 2));
                }
                if(figure.boardColumn + 1 >= 0) {
                    var temp = new Point(figure.boardColumn + 1, figure.boardRow + 1);
                    var temp_figure = figureArray[index(temp.x, temp.y)];
                    if(temp_figure != null) {
                        if(figure.side != temp_figure.side) {
                            moves.push(temp);
                        }
                    }
                }
            }

            if(figure.boardColumn + 1 < boardSideSize ) {
                var temp = new Point(figure.boardColumn + 1, figure.boardRow + 1);
                var temp_figure = figureArray[index(temp.x, temp.y)];
                if(temp_figure != null) {
                    if(figure.side != temp_figure.side) {
                        moves.push(temp);
                    }
                }
            }
            if(figure.boardColumn - 1 < boardSideSize ) {
                var temp = new Point(figure.boardColumn - 1, figure.boardRow + 1);
                var temp_figure = figureArray[index(temp.x, temp.y)];
                if(temp_figure != null) {
                    if(figure.side != temp_figure.side) {
                        moves.push(temp);
                    }
                }
            }

        }


    return moves;
}

function getMovesSE(figure) {
    var moves = new Array;
    var temp = new Point(figure.boardColumn + 1, figure.boardRow + 1 );
    while(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.x += 1;
        temp.y += 1;
    }
    return moves;
}

function getMovesNW(figure) {
    var moves = new Array;
    var temp = new Point(figure.boardColumn - 1, figure.boardRow - 1 );

    while(isValidBoardCoord(temp)) {

        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.x -= 1;
        temp.y -= 1;
    }
    return moves;
}

function getMovesSW(figure){
    var moves = new Array;

    var temp = new Point(figure.boardColumn - 1, figure.boardRow + 1 );

    while(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.x -= 1;
        temp.y += 1;
    }
    return moves;
}

function getMovesNE(figure){
    var moves = new Array;
    var temp = new Point(figure.boardColumn + 1, figure.boardRow - 1 );

    while(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.x += 1;
        temp.y -= 1;
    }
    return moves;
}

function getMovesN(figure){
    var moves = new Array;
    var temp = new Point(figure.boardColumn, figure.boardRow - 1);

    while(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.y -= 1;
    }

    return moves;
}

function getMovesS(figure) {
    var moves = new Array;
    var temp = new Point(figure.boardColumn, figure.boardRow + 1);

    while(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.y += 1;
    }

    return moves;
}

function getMovesW(figure) {
    var moves = new Array;
    var temp = new Point(figure.boardColumn - 1, figure.boardRow  );

    while(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.x -= 1;
    }

    return moves;
}

function getMovesE(figure) {
    var moves = new Array;
    var temp = new Point(figure.boardColumn + 1, figure.boardRow  );
    while(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
            break;
        }
        moves.push(new Point(temp.x, temp.y) );
        temp.x += 1;
    }
    return moves;
}

function queenMoves(figure) {
    var moves = new Array;

    moves = moves.concat(getMovesSE(figure));
    moves = moves.concat(getMovesSW(figure));
    moves = moves.concat(getMovesNW(figure));
    moves = moves.concat(getMovesNE(figure));
    moves = moves.concat(getMovesS(figure));
    moves = moves.concat(getMovesN(figure));
    moves = moves.concat(getMovesW(figure));
    moves = moves.concat(getMovesE(figure));

    return moves;
}

function bishopMoves(figure) {
    var moves = new Array;

    moves = moves.concat(getMovesSE(figure));
    moves = moves.concat(getMovesSW(figure));
    moves = moves.concat(getMovesNW(figure));
    moves = moves.concat(getMovesNE(figure));

    return moves;
}

function kingMoves(figure) {
    var moves = new Array;
        var temp = new Point(figure.boardColumn + 1, figure.boardRow + 1 );
        if(isValidBoardCoord(temp)) {
            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );
            }

        }

        var temp = new Point(figure.boardColumn - 1, figure.boardRow - 1 );

        if(isValidBoardCoord(temp)) {

            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );

            }
        }

        var temp = new Point(figure.boardColumn - 1, figure.boardRow + 1 );

        if(isValidBoardCoord(temp)) {
            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );
            }
        }

        var temp = new Point(figure.boardColumn + 1, figure.boardRow - 1 );

        if(isValidBoardCoord(temp)) {
            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );
            }
        }

        var temp = new Point(figure.boardColumn, figure.boardRow - 1);

        if(isValidBoardCoord(temp)) {
            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );
            }
        }

        var temp = new Point(figure.boardColumn, figure.boardRow + 1);

        if(isValidBoardCoord(temp)) {
            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );
            }
        }


        var temp = new Point(figure.boardColumn - 1, figure.boardRow  );

        if(isValidBoardCoord(temp)) {
            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );
            }
        }

        var temp = new Point(figure.boardColumn + 1, figure.boardRow  );
        if(isValidBoardCoord(temp)) {
            if(getFigureAt(temp) != null) {
                var temp_figure = getFigureAt(temp);
                if(temp_figure.side != figure.side) {
                    moves.push(new Point(temp.x, temp.y) );
                }
            }
            else {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        return moves;

}

function rookMoves(figure) {
    var moves = new Array;

    moves = moves.concat(getMovesS(figure));
    moves = moves.concat(getMovesN(figure));
    moves = moves.concat(getMovesW(figure));
    moves = moves.concat(getMovesE(figure));

    return moves;
}

function knightMoves(figure) {
    var moves = new Array();

    var temp = new Point(figure.boardColumn + 1, figure.boardRow + 2 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }

    temp = new Point(figure.boardColumn + 1, figure.boardRow - 2 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }
    temp = new Point(figure.boardColumn - 1, figure.boardRow + 2 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }

    temp = new Point(figure.boardColumn - 1, figure.boardRow - 2 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }


    temp = new Point(figure.boardColumn + 2, figure.boardRow + 1 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }

    temp = new Point(figure.boardColumn + 2, figure.boardRow - 1 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }
    temp = new Point(figure.boardColumn - 2, figure.boardRow + 1 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }

    temp = new Point(figure.boardColumn - 2, figure.boardRow - 1 );
    if(isValidBoardCoord(temp)) {
        if(getFigureAt(temp) != null) {
            var temp_figure = getFigureAt(temp);
            if(temp_figure.side != figure.side) {
                moves.push(new Point(temp.x, temp.y) );
            }
        }
        else {
            moves.push(new Point(temp.x, temp.y) );
        }
    }

    return moves;
}
