//Global

var observermod = false;
//цвета
var blackColor;
var whiteColor;
var color;

//для доски
var boardBorder = 1;
var squareHeight = screen.height/15;
var boardHeight = squareHeight*8;
var parentBoardHeight = boardHeight + (squareHeight/3 + boardBorder)*2;

// для фигур
var chessdir = "chessmen";
var chessmen = ["rook", "knight", "bishop", "king", "queen", "pawn"];

// для захвата фигуры
var isFigureTaken = false; 
var figure;
var figureId; //divId взятой фигуры

//массив для возможных и всяких ходов
var arr;
var toKill = false;

//взятие на проходе
var enPassant = {};

//состояния
var queeningId = false;
var end = false;

//в данном случае _1 - это их позиция j
var hasMoved = {};
hasMoved.black = {};
hasMoved.white = {};
hasMoved["black"].king = false;
hasMoved["black"].rook_1 = false;
hasMoved["black"].rook_8 = false;
hasMoved["white"].king = false;
hasMoved["white"].rook_1 = false;
hasMoved["white"].rook_8 = false;

var clientservermod;
var moveType = null;