function Start(myColor)
{	
	$("div").remove();
	DrawChessboard(myColor);

	SetStartPosition(whiteColor);
	SetStartPosition(blackColor);

	CreatePickChessmen("rook");
	CreatePickChessmen("queen");
	CreatePickChessmen("knight");
	CreatePickChessmen("bishop");

	CreateLayer();
	
	var color = "#F6CED8";
	var div = document.createElement('div');
	div.setAttribute("baseColor", color);
	div.setAttribute("prevColor", color);
	div.setAttribute("name", "leave");
	div.setAttribute("event", "room_leave");	
	div.setAttribute("class", "menu");
	div.style.background = color;
	div.style.width = 100;
	div.style.height = 20;
	div.style.display = "inline-block";		
	div.innerHTML = "leave";
	document.body.appendChild(div);	

	blackColor = "black";
	whiteColor = "white";
	color = whiteColor;
}
//Start("white");