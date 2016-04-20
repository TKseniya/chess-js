
//смена цвета фигур, чей сейчас ход

function ChangeSide() 
{
	ChangeColor();
	if (color == enPassant.color)
	{
		enPassant.color = null;
		enPassant.id = null;
	}
}


function getKingDivId(color)
{
	return $("#" + color + "_" + chessmen[3] + "_0").parent().attr("id");
}

//пытаемся мувать в id, возвращает удалось или нет
function CanMoveTo(id, color)
{
	toKill = false;
	if (arr.check.indexOf(+id) != -1)
	{
		alert ("! Check ! Color: " + color);
		return false;
	}
	if (arr.toGo.indexOf(+id) != -1)
	{
		//если ход является "проходом"
		if (figure.attr("name") == "pawn" && Math.abs ((+figureId - +figureId%10)/10 - (+id - +id%10)/10) == 2)
		{
			enPassant.id = +figureId > +id ? +figureId - 10 : +id - 10;
			enPassant.color = color;
		}
		return true;
	}			
	if (arr.toKill.indexOf(+id) != -1)
	{
		toKill = true;
		return true;
	}
	if (clientservermod)
	{
		if ($(":first-child", $("#"+id)).length)
			toKill = true;
	}
	return false;
}


function EndOfStep()
{
	mod = [];
	mod.push("toGo");
	mod.push("toKill");		
	mod.push("attacked");	
	mod.push("check");			
	arr = getArr((getUncolor(color)), mod, "all");	
	if (isPat(getUncolor(color)))
	{
		end = true;
		if (isCheck(getUncolor(color)))
		{
			alert ("mat! : " + getUncolor(color));	
		}
		else
		{
			alert ("pat! : " + getUncolor(color));
		}
	}
	if (!end)
	{
		if (isCheck(getUncolor(color)))
		{
			alert (" check! : " + getUncolor(color));
		}
	}
	ChangeSide();
}

function MateOrPat(color)
{
	mod = [];
	mod.push("toGo");
	mod.push("toKill");		
	mod.push("attacked");	
	mod.push("check");			
	arr = getArr(color, mod, "all");	
	if (isPat(color))
	{
		if (isCheck(color))
			return "mate";
		return "pat";
	}
	return "";
}

//удаляет и из массива с оставшимися фигурами

function removeFigure(f)
{
	$(".cemetery[color = "  + f.attr("color") + "]").append(f);
	f.attr("dead", true);
}

function getFigureId(fColor, f)
{
	return fColor + "_" + f.attr("name") + "_" + f.attr("num");
}
//var chessmen = ["rook", "knight", "bishop", "king", "queen", "pawn"];

function getFigureDivId(figure)
{
	return $("#" + getFigureId(figure.attr("color"), figure)).parent().attr("id");
}

//реализация distinct
function distinct(arr)
{
	var uniqueArr = [];
	for (var i = 0; i < arr.length; i++)
	{
		if (uniqueArr.indexOf(arr[i]) == -1)
			uniqueArr.push(arr[i]);
	}
	return uniqueArr;
}

function setFigure(id)
{
	figure = $(":first-child", $("#" + id));
	figureId = id;
}

function SetModGetArr()
{
	var mod = [];
	mod.push("toGo");
	mod.push("toKill");		
	mod.push("attacked");	
	mod.push("check");		
	arr = getArr(color, mod, figure);	
}

function moveTo(id)
{
	if (toKill)
	{
		if (id == enPassant.id)
		{
			if (enPassant.color == whiteColor)
			{
				removeFigure($(":first-child",  $("#"+(+enPassant.id+10))));
			}
			else
			{
				removeFigure($(":first-child", $("#"+(+enPassant.id-10))));						
			}
		}
		else
			removeFigure($(":first-child", $("#"+id)));
	}
	
	//просто перемещаем
	$("#"+id).append(figure);
	didRookOrKingMoved();	
	moveType = "move";
}

function didRookOrKingMoved()
{
	
	if (figure.attr("name") == "rook" || "king")
	{
		if (figureId%10 == 1)
		{
			hasMoved[color][figure.attr("name") + "_1"] = true
		}
		else
		if (figureId%10 == 8)
		{
			hasMoved[color][figure.attr("name") + "_8"] = true
		}
		else
		hasMoved[color][figure.attr("name")] = true;
	}
}

function doCastling(id)
{		
	if (id%10 == 3)
	{
		$("#" + (+id + 1)).append($(":first-child", $("#" + (+ id - 2))));	
		moveType = "castling";
		return (+ id - 2);
	}
	if (id%10 == 7)
	{
		$("#" + (+id - 1)).append($(":first-child", $("#" + (+ id + 1))));
		moveType = "castling";
		return (+ id + 1);
	}
	return false;	
}

function checkAndSetQueening(id)
{
	if (figure.attr("name") == "pawn" && ((id - id%10)/10 == 1 || (id - id%10)/10 == 8))		
		queeningId = id;
}

function doQueening(newFigure)
{
	CreateChessmen(color, queeningId, $(newFigure).attr("name"), "0" + figure.attr("id").charAt(figure.attr("id").length - 1));
	removeFigure(figure);	
	if (clientservermod)
	{
		socket.emit("turn_promotion", {from : getServerId(figureId), to : getServerId(queeningId), newPiece : $(newFigure).attr("name")});
	}
	queeningId = false;	
	figureId = queeningId;
	figure = $(":first-child", $("#" + figureId));
	queeningId = false;	
	moveType = "queening";
}

