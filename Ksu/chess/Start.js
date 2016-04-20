function Start(myColor)
{
	DrawChessboard(myColor);

	SetStartPosition(whiteColor);
	SetStartPosition(blackColor);

	CreatePickChessmen("rook");
	CreatePickChessmen("queen");
	CreatePickChessmen("knight");
	CreatePickChessmen("bishop");

	CreateLayer();

	blackColor = "black";
	whiteColor = "white";
	color = whiteColor;
}
//Start("white");