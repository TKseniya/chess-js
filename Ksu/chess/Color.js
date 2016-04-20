/////////////////////////////////////
//цвета доски
/////////////////////////////////////

blackColor = "brown";
whiteColor = "white";
color = blackColor;

function ChangeColor() 
{
	if (color === blackColor)
		color =  whiteColor;
	else
		color =  blackColor;	
}

function getUncolor(color)
{
	return color == whiteColor ? blackColor : whiteColor;
}
