//симуляция движения фигуры с id == fId на клетку id == divIdDest. return "шаха нет". проверки на правильность хода нет и не требуется
function Simulate(fId, divIdDest, color)
{
	//подготовка
	var arr = [];
	var obj = {};
	obj.id = fId;
	obj.divId  = $("#" + fId).parent().attr("id");
	arr.push(obj);
	obj = {};
	obj.id = $(":first-child", $("#" + divIdDest));
	if (obj.id.length != 0)
	{
		obj.id = obj.id.attr("id");
		obj.divId = divIdDest;
		arr.push(obj);
		removeFigure($(":first-child", $("#" + divIdDest)));
	}	
	$("#" + divIdDest).append($("#" + fId));
	
	var result = !isCheck(color);
	
	UndoTo(arr);
	
	return result;
}

function UndoTo(arr)
{
	for (var i = 0; i < arr.length; i++)
	{	
		if (arr[i].id)
		{
			$("#" + arr[i].divId).append($("#" + arr[i].id));
			$("#" + arr[i].id).attr("dead", false);
		}
	}
}
