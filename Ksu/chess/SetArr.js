 //общая функция со свитчами
 //arr - массив, куда все запишется
 //divId - divId, на которой стоит фигура
 
function SetArr(arr, divId, color, name, id) {
	switch (name)	//["rook", "knight", "bishop", "king", "queen", "pawn"];
	{
		case chessmen[0]:	//rook
			SetArrForRook(arr, divId, color, id)
			break;
		case chessmen[1]:	//knight
			SetArrForKnight(arr, divId, color, id);
			break;
		case chessmen[2]:	//bishop
			SetArrForBishop(arr, divId, color, id);
			break;
		case chessmen[3]:	//king
			SetArrForKing(arr, divId, color, id)
			break;
		case chessmen[4]:	//queen
			SetArrForRook(arr, divId, color, id)
			SetArrForBishop(arr, divId, color, id);
			break;
		case chessmen[5]:
			SetArrForPawn(arr, divId, color, id);
			break;
	}	
}

//король
function SetArrForKing(arr, divId, color, id)
{
	var j = divId%10;
	var i = (divId - j)/10;
	if (isCorrect(i+1, j+1))
	 setArr (arr, (i+1)*10 + (j+1), color, id);
	if (isCorrect(i+1, j-1))
	 setArr (arr, (i+1)*10 + (j-1), color, id);
	if (isCorrect(i+1, j))
	 setArr (arr, (i+1)*10 + (j), color, id);
 
	if (isCorrect(i-1, j+1))
	 setArr (arr, (i-1)*10 + (j+1), color, id);
	if (isCorrect(i-1, j-1))
	 setArr (arr, (i-1)*10 + (j-1), color, id);
	if (isCorrect(i-1, j))
	 setArr (arr, (i-1)*10 + (j), color, id);
 
	if (isCorrect(i, j+1))
	 setArr (arr, (i)*10 + (j+1), color, id);
	if (isCorrect(i, j-1))
	 setArr (arr, (i)*10 + (j-1), color, id);
 
	//рокировка
	{
		if ((arr.toGo != undefined) && (!isCheck(color)))
		{
			var mod = [];
			mod.push("attacked");
			var attackedArr = getArr(getUncolor(color), mod, "all").attacked;
			if (canCastlingWith(color, 1))
			{
				if (isEmpty(+divId - 1) && isEmpty(+divId - 2) && isEmpty(+divId - 3))
				{					
					if ((!isUnderAttack(+ divId - 1 , attackedArr)) && (!isUnderAttack(+ divId - 2, attackedArr)) && (!isUnderAttack(+ divId - 3, attackedArr)))
					{	
						arr.toGo.push(+divId - 2);							
					}
				}
			}
			if (canCastlingWith(color, 8))
			{
				if (isEmpty(+divId + 1) && isEmpty(+divId + 2)) //&& isEmpty(+divId + 3) )
				{					
					if ((!isUnderAttack(+ divId + 1 , attackedArr)) && (!isUnderAttack(+ divId + 2, attackedArr)))// && (!isUnderAttack(+ divId + 3, attackedArr)))
					{	
						arr.toGo.push(+divId + 2);							
					}
				}
			}
		}
	}
}

//по прямой
function SetArrForRook(arr, divId, color, id)
{
	var j = divId%10;
	var i = (divId - j)/10;
	for (var k = i + 1; k < 9; k++)
	{
		if (!isCorrect(k, j))
			break;
		if (setArr (arr, (k)*10 + (j), color, id))
			break;		
	}
	for (var k = i - 1; k > 0; k--)
	{
		if (!isCorrect(k, j))
			break;
		if (setArr (arr, (k)*10 + (j), color, id))
			break;		
	}
	for (var k = j + 1; k < 9; k++)
	{
		if (!isCorrect(i, k))
			break;
		if (setArr (arr, (i)*10 + (k), color, id))
			break;		
	}
	for (var k = j - 1; k > 0; k--)
	{
		if (!isCorrect(i, k))
			break;
		if (setArr (arr, (i)*10 + (k), color, id))
			break;		
	}	
}

//диагональ 
function SetArrForBishop(arr, divId, color, id)
{
	var j = divId%10;
	var i = (divId - j)/10;
	for (var k = i + 1; k < 9; k++)
	{
		if (!isCorrect(k, j + k - i))
			break;
		if (setArr (arr, (k)*10 + (j + k - i), color, id))
			break;		
	}
	for (var k = i - 1; k > 0; k--)
	{
		if (!isCorrect(k, j + k - i))
			break;
		if (setArr (arr, (k)*10 + (j + k - i), color, id))
			break;		
	}
	for (var k = i + 1; k < 9; k++)
	{
		if (!isCorrect(k, j - k + i))
			break;
		if (setArr (arr, (k)*10 + (j - k + i), color, id))
			break;		
	}
	for (var k = i - 1; k > 0; k--)
	{
		if (!isCorrect(k, j - k + i))
			break;
		if (setArr (arr, (k)*10 + (j - k + i), color, id))
			break;		
	}	
}

//ход конем
function SetArrForKnight(arr, divId, color, id)
{
	var j = divId%10;
	var i = (divId - j)/10;
	
	if (isCorrect(i+2, j+1))
	 setArr (arr, (i+2)*10 + (j+1), color, id);
	if (isCorrect(i+2, j-1))
	 setArr (arr, (i+2)*10 + (j-1), color, id);
 
	if (isCorrect(i-2, j+1))
	 setArr (arr, (i-2)*10 + (j+1), color, id);
	if (isCorrect(i-2, j-1))
	 setArr (arr, (i-2)*10 + (j-1), color, id);
 
	if (isCorrect(i+1, j+2))
	 setArr (arr, (i+1)*10 + (j+2), color, id);
	if (isCorrect(i-1, j+2))
	 setArr (arr, (i-1)*10 + (j+2), color, id);
 
	if (isCorrect(i+1, j-2))
	 setArr (arr, (i+1)*10 + (j-2), color, id);
	if (isCorrect(i-1, j-2))
	 setArr (arr, (i-1)*10 + (j-2), color, id);
 
}

//добавляет в arr отдельную клетку
function setArr(arr, checkedId, color, figureId)
{
	var isCheck = false;
	if (isEmpty(checkedId) || isEnemy(checkedId, color))
	{	
		if (arr.check != undefined)
		{
			if (!Simulate (figureId, checkedId, color))
			{		
				arr.check.push(checkedId);
				isCheck = true;
			}
		}
		if (arr.attacked != undefined)
		{
			arr.attacked.push(checkedId);
		}	
		if (isEmpty(checkedId))
		{
			if (arr.toGo != undefined)
			{
				if (!isCheck)
					arr.toGo.push(checkedId);					
			}
			return false;
		}
		if (arr.toKill != undefined)
		{
			if (!isCheck)
				arr.toKill.push(checkedId);
		}
		return true;
	}
	return true;
}

//многострадальная пешка
function setArrForPawn(arr, checkedId, color, figureId, GoOrKill)
{
	var isCheck = false;
	if (GoOrKill === "go" || GoOrKill === "Go")
	{				
		if (arr.check != undefined)
		{
			if (!Simulate (figureId, checkedId, color))
			{		
				arr.check.push(checkedId)
				isCheck = true;
			}
		}
		if (arr.toGo != undefined)
		{
			if (!isCheck)
				arr.toGo.push(checkedId);
		}	
		return;
	}
	if (GoOrKill === "kill" || GoOrKill === "Kill")
	{				
		if (arr.check != undefined)
		{
			if (!Simulate (figureId, checkedId, color))
			{		
				arr.check.push(checkedId);
				isCheck = true;
			}
		}
		if (arr.toKill != undefined)
		{
			if (!isCheck)
				arr.toKill.push(checkedId);
		}
		if (arr.attacked != undefined)
		{
			arr.attacked.push(checkedId);
		}
		return;
	}
	if (arr.attacked != undefined)
	{
		arr.attacked.push(checkedId);
	}					
	if (arr.check != undefined)
	{
		if (!Simulate (figureId, checkedId, color))
		{		
			arr.check.push(checkedId)
		}
	}
	
}

function SetArrForPawn(arr, divId, color, id)
{
	var a = [10, 2];
	if (color ==="black")
	{
		a[0] = -10;
		a[1] = 7;
	}
	var checkedId;
	checkedId = + divId + a[0];
	if (isEmpty(checkedId))
	{
		setArrForPawn(arr, checkedId, color, id, "go");
		checkedId += a[0];
		if ((divId - divId%10)/10  == a[1] && isEmpty(checkedId))
		{			
			setArrForPawn(arr, checkedId, color, id, "go");
		}
	}
	checkedId = + divId + a[0] - 1;
	if (divId%10 > 1)
	{
		if (isEnemy(checkedId, color) || checkedId == enPassant.id)
		{
			setArrForPawn(arr, checkedId, color, id, "kill");			
		}
		if (isEmpty(checkedId))
		{
			setArrForPawn(arr, checkedId, color, id, "");
		}
	}
	checkedId += 2;
	if (divId%10 < 8)
	{
		if (isEnemy(checkedId, color) || checkedId == enPassant.id)
		{
			setArrForPawn(arr, checkedId, color, id, "kill");			
		}
		if (isEmpty(checkedId))
		{
			setArrForPawn(arr, checkedId, color, id, "");
		}
	}
}
