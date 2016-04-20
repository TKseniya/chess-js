window.onload = function()
{
	socket = io.connect('http://127.0.0.1:9898');
	
	socket.on("connect", function () 
	{
		console.log('Подключились');
		socket.emit("game_find");
		socket.on("game_found", function()
		{
			console.log('game_found');
			socket.emit("turn_move", {playerColor: 'white', from: {x: 'E',y: 2},to: {x: 'E',y: '4'}})
			console.log('turn_move');
		});
		/*
		socket.on("turn_invalid", function()
		{
			console.log('turn_invalid');
		});
		socket.on("turnValidation_invalid", function()
		{
			console.log('turn_invalid');
		});
		
		socket.on("disconnect", function()
		{
			console.log("disconnect");
		});
		*/
	});
};
