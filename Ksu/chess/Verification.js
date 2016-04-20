//Verification

function isCorrect (i, j)
{
	return i > 0 && i < 9 && j > 0 && j < 9;
}

function isEmpty(divId)
{
	return ($('#' + divId).children().length == 0);
}

function isEnemy(divId, color)
{
	return !(isEmpty(divId)) && ($('#' + divId).children().attr("color") != color);
}

function canCastlingWith(color, rookId)
{
	return (!hasMoved[color].king) && (!hasMoved[color]["rook_" + rookId]);
}

//есть ли шах фигурам цвета "color" (ход uncolor, проверка шаха у противника)
function isCheck(color)
{
	//под ударом ли позиция короля цвета color
	var mod = [];
	mod.push("attacked");
	return isUnderAttack(getKingDivId(color), getArr(getUncolor(color), mod, "all").attacked);//attackedArr);
}

function isUnderAttack(divId, attackedArr)
{
	return attackedArr.indexOf(+divId) != -1;
}

function isPat(color)
{
	if (arr.toGo.length > 0 || arr.toKill.length > 0)
		return false;
	return true;
}

function isCheckmat(color)
{
	return isCheck(color) && isPat(color);
}
 
