/////////////////////////////////////
//создание фигур
/////////////////////////////////////

function CreateChessmen(color, divId, name, num)
{
	var img = document.createElement("img");
	img.setAttribute("id",color + '_' + name);
	img.setAttribute("color", color);
	img.setAttribute("name", name);
	img.setAttribute("num", num);
	img.setAttribute("dead", false);
	img.setAttribute("src","..\\..\\" + chessdir + "\\" + img.id + ".png");
	img.id += "_" + num;
	document.getElementById(divId).appendChild(img);
}

function CreatePickChessmen(name)
{
	var img = document.createElement("img");
	img.setAttribute("id", "pick_" + name);
	img.setAttribute("class", "pick");
	img.setAttribute("name", name);
	img.setAttribute("src","..\\..\\" + chessdir + "\\" + "white" + "_" + name + ".png");
	($("#pick")).append(img);
}

/////////////////////////////////////
//заполнение доски фигурами
/////////////////////////////////////
function SetStartPosition(color)
{
	var pawnPos = 2;
	if (color === whiteColor)
	{
		i = 1;
		color = "white";
	}
	else 
	{
		i = 8;
		pawnPos = 7;
		color = "black";
	}
	for (var j = 0; j<3; j++)
	{
		CreateChessmen(color, i*10 + (j+1), chessmen[j], 0); //фигуры, которых по 2
		CreateChessmen(color, i*10 + (8-j), chessmen[j], 1);
		CreateChessmen(color, pawnPos*10 + (j+1), chessmen[5], j); // пешки
	}
	for (var j = 3; j<5; j++)
	{
		CreateChessmen(color, pawnPos*10 + (j+1), chessmen[5], j); // пешки
	}
	
	CreateChessmen(color, i*10 + (3+1), chessmen[4], 0); //чета
	CreateChessmen(color, i*10 + (4+1), chessmen[3], 0); //чета
	for (var j = 5; j<8; j++)
	{		
		CreateChessmen(color, pawnPos*10 + (j+1), chessmen[5], j); // пешки
	}		

}
