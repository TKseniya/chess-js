// Подключаем модуль и ставим на прослушивание 8080-порта - 80й обычно занят под http-сервер
var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io').listen(http); 
http.listen(3056);

var log4js = require('log4js');
var log = log4js.getLogger();

var rooms = [];
var players = [];
var wait = [];

function indexOfRoom(socket)
{
	for (var i = 0; i < rooms.length; i++)
		if (rooms[i].player1 == socket || rooms[i].player2 == socket)
			return i;
	return null;
}

function clearRoom(roomId)
{	
	rooms.splice(roomId, 1);
}

function endGame(winner, reason)
{	
	var roomId = indexOfRoom(winner);
	var socket_2 = getPlayer2(winner, roomId);
	
	winner.emit("game_end", {
		msg : reason,
		winnerColor : rooms[roomId].player1 == winner ? "white" : "black"
	})		
	if (reason != "leave")
	{
		socket_2.emit("game_end", {
			msg : reason,
			winnerColor : rooms[roomId].player1 == winner ? "white" : "black"
		})	
	}
	winner.disconnect();
	socket_2.disconnect();
	clearRoom(roomId);
	players.splice(players.indexOf(winner), 1);	
	players.splice(players.indexOf(socket_2), 1);

	log.debug(reason);		
}

log.debug("YEAH");

function getPlayer2(player1, roomId)
{
	return rooms[roomId].player1 == player1 ? rooms[roomId].player2 : rooms[roomId].player1;
}

function getWinnerColor(winner, reason)
{
	if (reason == "draw")
		return null;
	return rooms[indexOfRoom(winner)].player1 == winner ? "white" : "black";
}
// Подключение нового клиента, дальше все в его контексте
io.sockets.on("connection", function (socket) 
{
	//добавление игрока
	players.push(socket);
	log.debug(socket.id + " connected");
	
	// отключение игрока
	socket.on("disconnect", function() 
	{
		log.debug(socket.id + " disconnected");
		players.splice(players.indexOf(socket), 1);				
		var roomId = indexOfRoom(socket);
		if (roomId != -1)
		{
			var socket_2 = getPlayer2(socket, roomId);
			socket_2.disconnect();
			clearRoom(roomId);
		}
		
	});
	
	socket.on("room_leave", function()
	{
		endGame(socket_2, "leave");		
	});
	
	socket.on ("game_find", function()
	{
		if (wait.indexOf(socket) == -1)
			wait.push(socket);
		var roomID = wait[0].id;
		if (wait.length > 1)
		{
			rooms.push({roomID : roomID, player1 : wait[0], player2 : wait[1]});
			
			wait[0].emit("game_found", {color: "white", roomID: roomID});
			wait[1].emit("game_found", {color: "black", roomID: roomID});
			wait.splice(0, 2);

			log.debug(roomID + " start");
		}
	});
	
	socket.on ("game_stopFinding", function()
	{	
		var index = wait.indexOf(socket);
		if (index != -1)
			wait.splice(index, 1);
	});
	
	socket.on ("turn_move", function(move)
	{
		var roomId = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomId);
		socket_2.emit("player_move", {from : move.from, to : move.to, playerColor : rooms[roomId].player1 == socket ? "white" : "black"});
		log.debug(socket.id + " move from " + move.from.x + "" + move.from.y + " to " + move.to.x + "" + move.to.y);
	});
	
	socket.on ("turn_castling", function(move)
	{
		var roomId = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomId);
		socket_2.emit("player_castling", {
			from : move.from, 
			playerColor : rooms[roomId].player1 == socket ? "white" : "black"});
		log.debug(socket.id + " castling from " + move.from.x + "" + move.from.y);		
	});
	socket.on ("turn_promotion", function(move)
	{
		var roomId = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomId);
		socket_2.emit("player_promotion", {
			from : move.from, 
			to : move.to, 
			playerColor : rooms[roomId].player1 == socket ? "white" : "black", 
			newPiece : move.newPiece});
		log.debug(socket.id + " promotion from " + move.from.x + "" + move.from.y + " to " + move.to.x + "" + move.to.y + " new : " + move.newPiece);		
	});
	
	socket.on ("turn_mate", function()
	{
		var roomId = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomId);
		socket_2.emit("player_mate");
		log.debug(socket.id + " : mated");
	});
	
	socket.on ("turn_draw", function()
	{
		var roomId = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomId);
		socket_2.emit("player_draw");
		log.debug(socket.id + " : draw");		
	});
	
	socket.on ("turnValidation_invalid", function()
	{
		endGame(socket, "invalid turn");
	});	
	
	socket.on ("turnValidation_mate", function()
	{
		endGame(socket, "mate");		
	});	
	
	socket.on ("turnValidation_draw", function()
	{
		endGame(socket, "draw");
	});	
});