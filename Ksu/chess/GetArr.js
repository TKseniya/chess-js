//массив клеток, которые находятся под ударом фигур цвета color - уже все
//ход цвета 'color
function getArr(color, arrMod, figure) //arrMod = ["toGo", "check"] - заполняем только toGo и check
{
	var arr = {};
	for (var i = 0; i < arrMod.length; i++)
	{
		arr[arrMod[i]] = [];
	}
	//пройтись по всем фигурам цвета "color" 
	//arr, id, color, name
	if (figure === "all" || figure === "All")
	{
		var chessArr = $("img[color = " + color +"][dead = " + false + "]");
		for (var i = 0; i < chessArr.length; i++)
		{
			SetArr(arr, getFigureDivId($("#" + chessArr[i].attributes["id"].value)),color,chessArr[i].attributes["name"].value,chessArr[i].attributes["id"].value)
		}	
	}
	else
	{
		SetArr(arr, figure.parent().attr("id"), figure.attr("color"), figure.attr("name"), figure.attr("id"));
	}
		for (var i = 0; i < arrMod.length; i++)
	{
		arr[arrMod[i]] = distinct(arr[arrMod[i]]);
	}	
	return arr;
}
