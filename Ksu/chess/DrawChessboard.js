/////////////////////////////////////
//поле для выбора фигур (дамка)
/////////////////////////////////////
function Pick(color)
{
	$(".pick#pick").css({display: "inline-block"});
	$(".pick[name = 'rook']").attr("src", "..\\..\\" + chessdir + "\\" + color + "_" + "rook" + ".png");
	$(".pick[name = 'queen']").attr("src", "..\\..\\" + chessdir + "\\" + color + "_" + "queen" + ".png");
	$(".pick[name = 'knight']").attr("src", "..\\..\\" + chessdir + "\\" + color + "_" + "knight" + ".png");
	$(".pick[name = 'bishop']").attr("src", "..\\..\\" + chessdir + "\\" + color + "_" + "bishop" + ".png");
}

/////////////////////////////////////
//отрисовка доски
/////////////////////////////////////
function DrawCemetery(color)
{	
	var board = document.createElement('div');	
	board.setAttribute("class", "cemetery");	
	board.setAttribute("color", color);	
	board.style.height = squareHeight;
	board.style.width = boardHeight * 2;
	board.style.wordWrap = "break-word";
	board.style.border = "" + boardBorder + "px solid " + blackColor;
	document.body.appendChild(board);	
}

function DrawChessboard(myColor)
{
	
	if (myColor == "white")
	{
		DrawCemetery("black");
	}
	if (myColor == "black")
	{
		DrawCemetery("white");
	}
	color = blackColor;
	var div; 	
	board = document.createElement('div');	
	board.setAttribute("class", "board");	
	board.style.height = boardHeight;
	board.style.width = boardHeight;
	board.style.wordWrap = "break-word";
	board.style.border = "" + boardBorder + "px solid " + blackColor;
	board.style.display = "inline-block";		
	document.body.appendChild(board);	
	
	if (myColor == "white")
	{
		for (var i = 8; i > 0; i--) //столбец
		{
			for (var j = 1; j <= 8; j++) //строка
			{
				ChangeColor();
				drawBoard(div, board, i, j);
			}
			if (i == 6)
			{
				drawPick(div, board);
			}
			ChangeColor();
		}			
	}
	else
	{
		for (var i = 1; i <= 8; i++) //столбец
		{
			for (var j = 8; j >= 1; j--) //строка
			{
				ChangeColor();
				drawBoard(div, board, i, j);
			}
			if (i == 4)
			{
				drawPick(div, board);
			}
			ChangeColor();
		}
		
	}
	if (myColor == "white")
	{
		DrawCemetery("white");
	}
	if (myColor == "black")
	{
		DrawCemetery("black");
	}
}

//фон для затемнения
function CreateLayer()
{	
	var div = document.createElement('div');
	div.id = "layer";
	document.body.appendChild(div);
}

function drawBoard(div, board, i, j)
{
	div = document.createElement('div');
	div.setAttribute('id',i*10 + j);	
	div.setAttribute("baseColor", color);
	div.setAttribute("prevColor", color);	
	div.setAttribute("class", "square");
	div.style.background = color;
	div.style.width = squareHeight;
	div.style.height = squareHeight;
	div.style.display = "inline-block";		
	board.appendChild(div);	
}

function drawPick(div, board)
{	
	div = document.createElement('div');	
	div.setAttribute("class", "pick");		
	div.setAttribute("id", "pick");	
	div.setAttribute("color", color);	
	div.style.height = boardHeight/2;
	div.style.width = squareHeight;
	div.style.border = "" + boardBorder + "px solid " + blackColor;
	div.style.position = "fixed";
	//div.style.display = "inline-block";	
	div.style.display = "none";	
	div.style.background = "#FFE4B5";
	board.appendChild(div);
}