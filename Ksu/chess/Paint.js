//закрашивание полей в соот цвета

function Paint(arr)
{
	if (arr.toGo && arr.toGo.length > 0)
	{
		for (var i = 0; i < arr.toGo.length; i++)
		{
			$("#" + arr.toGo[i]).css({backgroundColor: '#00FF7F'});
			$("#" + arr.toGo[i]).attr("prevColor", '#00FF7F');
		}
	}
	if (arr.toKill && arr.toKill.length > 0)
	{
		for (var i = 0; i < arr.toKill.length; i++)
		{
			$("#" + arr.toKill[i]).css({backgroundColor: '#FF4500'});
			$("#" + arr.toKill[i]).attr("prevColor", '#FF4500');
		}
	}	
	if (arr.check && arr.check.length > 0)
	{
		for (var i = 0; i < arr.check.length; i++)
		{
			$("#" + arr.check[i]).css({backgroundColor: '#E9967A'});
			$("#" + arr.check[i]).attr("prevColor", '#E9967A');
		}
	}
	
}

//возвращение исходного цвета клеток

function Unpaint(arr)
{	
	if (arr.toGo.length > 0)
		for (var i = 0; i < arr.toGo.length; i++)
		{
			$("#" + arr.toGo[i]).css({backgroundColor: $("#" + arr.toGo[i]).attr('baseColor')});
			$("#" + arr.toGo[i]).attr('prevColor', $("#" + arr.toGo[i]).attr('baseColor'));
		}
	if (arr.toKill.length > 0)
		for (var i = 0; i < arr.toKill.length; i++)
		{
			$("#" + arr.toKill[i]).css({backgroundColor: $("#" + arr.toKill[i]).attr('baseColor')});
			$("#" + arr.toKill[i]).attr('prevColor', $("#" + arr.toKill[i]).attr('baseColor'));
		}		
	if (arr.check.length > 0)
		for (var i = 0; i < arr.check.length; i++)
		{
			$("#" + arr.check[i]).css({backgroundColor: $("#" + arr.check[i]).attr('baseColor')});
			$("#" + arr.check[i]).attr('prevColor', $("#" + arr.check[i]).attr('baseColor'));
		}
		
}

