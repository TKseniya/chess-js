var myColor;
clientservermod = true;
window.onload = function()
{
	//я
	socket = io.connect("http://127.0.0.1:3056");
	//Фидан
	//socket = io.connect("http://192.168.1.158:3056");
	//Федя
	//socket = io.connect("http://192.168.1.63:3056");
	
	//socket = io.connect("http://10.254.18.103:3056");
	
	//socket = io.connect("http://172.31.100.184:3056");
	
	socket.on("connect", function () 
	{
		//socket.emit("game_find");
		menu();
		
		socket.on("game_found", function(obj)
		{
			
			if (!(checkObj(obj) && checkStr(obj.color) && checkStr(obj.roomID) && checkColor(obj.color)))
			{
				turnInvalid();
				return;
			}
			
			myColor = obj.color;
			Start(myColor);
			color = "white";
			//include("Events.js");
		});
		
		socket.on ("game_logs", function (arr)
		{
			Start("white");
			for (var i = 0; i < arr.length; i++)
			{
				justMove(arr[i].moveData, arr[i].moveType);
			}
		});
		
		socket.on ("roomsList", function (arr)
		{
			for (var i = 0; i < arr.length; i++)
			{
				$(".room").remove();
				createRoom(arr[i].roomID, arr[i].length);
			}
		});
		
		socket.on("player_move", function(obj)
		{
			if (observermod)
			{				
				if (!(checkObj(obj) && checkStr(obj.playerColor) && checkColor(obj.playerColor) && checkCoord(obj.from) && checkCoord(obj.to)))
				{
					alert("Кривые данные на вход");
					return;
				}
				else
				{
					justMove(obj, "move");
				}
			}
			else
			{
				if (!(checkObj(obj) && checkStr(obj.playerColor) && checkColor(obj.playerColor) && checkCoord(obj.from) && checkCoord(obj.to)))
				{
					turnInvalid();
					return;
				}
				if (tryMove(obj))
				{				
					if (moveType != "move")
					{
						turnInvalid();
						return;
					}
					EndOfStep();
					checkMateOrPat(myColor);
				}
			}
		});
		
		socket.on("player_castling", function(obj)
		{			
			if (observermod)
			{				
				if (!(checkObj(obj) && checkStr(obj.playerColor) && checkColor(obj.playerColor) && checkCoord(obj.from)))
				{
					alert("Кривые данные на вход");
					return;
				}
				else
				{
					justMove(obj, "castling");
				}
			}
			else
			{
				if (!(checkObj(obj) && checkStr(obj.playerColor) && checkColor(obj.playerColor) && checkCoord(obj.from)))
				{
					turnInvalid();
					return;
				}
				if (tryCastlingWith(obj))
				{
					if (moveType != "castling")
					{
						turnInvalid();
						return;
					}
					EndOfStep();
					checkMateOrPat(myColor);
				}
			}
		});
		
		socket.on("player_promotion", function(obj)
		{			
			if (observermod)
			{				
				if (!(checkObj(obj) && checkStr(obj.playerColor) && checkColor(obj.playerColor) && checkCoord(obj.from) && checkCoord(obj.to) && checkStr(obj.newPiece) && checkFigure(obj.newPiece)))
				{
					alert("Кривые данные на вход");
					return;
				}
				justMove(obj, "promotion");
			}
			else
			{
				if (!(checkObj(obj) && checkStr(obj.playerColor) && checkColor(obj.playerColor) && checkCoord(obj.from) && checkCoord(obj.to) && checkStr(obj.newPiece) && checkFigure(obj.newPiece)))
				{
					turnInvalid();
					return;
				}
				if (tryPromotion(obj))
				{				
				if (moveType != "queening")
				{
					turnInvalid();
					return;
				}
				EndOfStep();
				checkMateOrPat(myColor);
			}
			}
		});		
		
		socket.on("player_mate", function()
		{
			validateMate(getUncolor(myColor));			
		});
		
		socket.on("player_draw", function()
		{			
			validatePat(getUncolor(myColor));
		});
		
		socket.on("game_end", function(obj)
		{
			
			if (!(checkObj(obj) && (checkStr(obj.winnerColor) || obj.winnerColor === null) && checkWinnerColor(obj.winnerColor) && checkStr(obj.msg) &&checkMsg(obj.msg)))
			{
				turnInvalid();
				return;
			}
			alert(obj.msg);
			if (!obj.winnerColor)
				obj.winnerColor = "no";
			alert("Winner: " + obj.winnerColor);
			menu();
		});	
	});	
};

function getMyId(obj)
{
	return obj.y + "" + (obj.x.charCodeAt(0) - 'A'.charCodeAt(0) + 1);
}

function getServerId(id) 
{
	return {x : String.fromCharCode('A'.charCodeAt(0) + (id%10) - 1), y : (id - id%10)/10};
}

function tryCastlingWith(obj)
{
	var rookId = getMyId(obj.from);
	if (($("#" + rookId)).attr("color") == myColor)
	{
		turnInvalid();
		return false;
	}
	if (!canCastlingWith(obj.playerColor, rookId)) 
	{
		turnInvalid();
		return false;
	}
	var toId = rookId%10 == 1 ? + rookId + 2 : + rookId - 1;
	obj.from = getServerId(getKingDivId(obj.playerColor));
	obj.to = getServerId(toId);
	if (!tryMove(obj))
		return false;
	doCastling(toId);
	return true;	
}

function tryMove(obj)
{	
	var id = getMyId(obj.from);
	setFigure(id);
	if (figure.attr("color") == myColor)
	{
		turnInvalid();	
		return false;
	}		
	SetModGetArr();
	if (!CanMoveTo (getMyId(obj.to), getUncolor(myColor)))
	{
		turnInvalid();
		return false;
	}
	moveTo(getMyId(obj.to));
	return true;
}

function justMove(obj, type)
{
	switch (type)
	{
		case "move":
			setFigure(getMyId(obj.from));	
			SetModGetArr();
			if (CanMoveTo (getMyId(obj.to), color))
				moveTo(getMyId(obj.to));
		break;
		case "castling":		
			var rookId = getMyId(obj.from);
			var toId = rookId%10 == 1 ? + rookId + 2 : + rookId - 1;
			obj.from = getServerId(getKingDivId(obj.playerColor));
			obj.to = getServerId(toId);
			setFigure(getMyId(obj.from));	
			SetModGetArr();
			moveTo(getMyId(obj.to));
			doCastling(toId);
		break;
		case "promotion":			
			setFigure(getMyId(obj.from));	
			SetModGetArr();
			moveTo(getMyId(obj.to));
			checkAndSetQueening(getMyId(obj.to));
			clientservermod = false;	
			doQueening($(".pick[name = '" + obj.newPiece + "']"));	
			clientservermod = true;
		break;
	}
	EndOfStep();
}

function tryPromotion (obj)
{
	if (!tryMove(obj))
		return false;	
	
	checkAndSetQueening(getMyId(obj.to));
	if (!queeningId)
	{
		turnInvalid();	
		return false;
	}
	
	clientservermod = false;	
	doQueening($(".pick[name = '" + obj.newPiece + "']"));	
	clientservermod = true;
	return true;
}

function include(url) {
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
	
function turnInvalid()
{	
	socket.emit("turnValidation_invalid");	
}

function turnMate()
{
	socket.emit("turn_mate");
}

function turnDraw()
{
	socket.emit("turn_draw");
}

function checkMateOrPat(color)
{
	var result = MateOrPat(color);
	if (result == "mate")
		turnMate();
	if (result == "pat")
		turnDraw();	
}

function validateMate(color)
{
	var result = MateOrPat(color);
	if (result == "mate")
	{
		socket.emit("turnValidation_mate");
	}
	else
		turnInvalid();
}

function validatePat(color)
{
	var result = MateOrPat(color);
	if (result == "pat")
	{
		socket.emit("turnValidation_draw");
	}
	else
		turnInvalid();	
}

function checkObj(obj)
{
	return obj !== null && typeof(obj) === "object" ;
}

function checkStr(obj)
{
	return true;//typeof(obj) === "string";
}

function checkColor(obj)
{
	return obj === "white" || obj === "black";
}

function checkWinnerColor(obj)
{
	return checkColor(obj) || obj === null;
}

function checkLetter(obj)
{
	return 'A'.charCodeAt(0) <= obj.charCodeAt(0) && obj.charCodeAt(0) <= 'H'.charCodeAt(0);
}

function checkInt(obj)
{
	return typeof(obj) === "number" && 1 <= obj && obj <= 8;
}

function checkFigure(obj)
{
	return obj === "knight" || obj === "rook" || obj === "bishop" || obj === "queen";
}

function checkMsg(obj)
{	
	return obj === "mate" || obj === "draw" || obj === "invalid turn" || obj === "leave";
}

function checkCoord(obj)
{
	return checkObj(obj) && checkStr(obj.x) && checkLetter(obj.x) && checkInt(+obj.y)
}

function createRoom(roomID, length)
{		
	var color = "#F0C0D0";
	var div = document.createElement('div');
	div.setAttribute("baseColor", color);
	div.setAttribute("prevColor", color);
	div.setAttribute("roomID", roomID);
	div.setAttribute("length", length);	
	div.setAttribute("class", "room");
	div.style.background = color;
	div.style.width = 50;
	div.style.height = 10;
	div.style.display = "inline-block";		
	div.innerHTML = roomID;
	document.body.appendChild(div);	
}

function createMenuDiv(name, event)
{	
	var color = "#F6CED8";
	var div = document.createElement('div');
	div.setAttribute("baseColor", color);
	div.setAttribute("prevColor", color);
	div.setAttribute("name", name);
	div.setAttribute("event", event);	
	div.setAttribute("class", "menu");
	div.style.background = color;
	div.style.width = 100;
	div.style.height = 20;
	div.style.display = "inline-block";		
	div.innerHTML = name;
	document.body.appendChild(div);	
}

function menu()
{
	$("div").remove();
	createMenuDiv("wait", "game_find");
	createMenuDiv("unwait", "game_stopFinding");
	createMenuDiv("subscribe", "roomsList_subscribe");
	createMenuDiv("unsubscribe", "roomsList_unsubscribe");	
}