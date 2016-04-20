
$('.square').on("click",
function(){
	if (queeningId)
	{
		alert("Queening");
		return;
	}
	if (!end)
	{		
		if (!isFigureTaken && $(":first-child", this).length === 0)
		{
			return;
		}
		if (isFigureTaken && color == $(":first-child", this).attr("color"))
		{			
			Unpaint(arr);
			isFigureTaken = false;
		}
		if (!isFigureTaken)
		{	
			if (color != $(":first-child", this).attr("color"))
			{
				alert("wrong color");
				return;
			}
			
			isFigureTaken = true;
			setFigure(this.getAttribute("id"));
			SetModGetArr();
			Paint(arr);	
		}
		else
		{
			Unpaint(arr);
			isFigureTaken = false;
			var id = $(this).attr("id");
			//if (
			CanMoveTo(id, color);//)
			{
				moveTo(id);				
				
				//рокировка					
				if (figure.attr("name") == "king" && (figureId%10 == 5))
				{
					var rookId = doCastling(id);										
					if (rookId && clientservermod)
					{
						socket.emit("turn_castling", {from : getServerId(rookId)});
					}
					if (!rookId)
						if (clientservermod)
						{
							socket.emit("turn_move", {from : getServerId(figureId), to : getServerId(id)});
						}	
				}
				else	
				
				//дамка
				{
					checkAndSetQueening(id);
					if (queeningId)
					{
						$("#layer").css({display: "block"});
						Pick(color);
						return;
					}		
					else	
						
						if (clientservermod)
						{
							socket.emit("turn_move", {from : getServerId(figureId), to : getServerId(id)});
						}	
				}
				EndOfStep();					
			}
		}
	}
});

$(".pick[name]").on("click",
function (){
	if (!queeningId)
		return;
	doQueening(this);
	$(".pick#pick").css({display: "none"});	
	$("#layer").css({display: "none"});		
	EndOfStep();	
})

/////////////////////////////////////
//финтифлюшки
/////////////////////////////////////

$('.square').hover(
function(){
	$(this).css({backgroundColor: '#B0C4DE'});
},
function(){
	$(this).css({backgroundColor: $(this).attr('prevColor')});
});
