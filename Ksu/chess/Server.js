var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io').listen(http); 
http.listen(3056);

var log4js = require('log4js');
var log = log4js.getLogger();

var rooms = [];//{roomID, player1 - белый, player2 - черный, observers - подписаны на комнату}
var wait = [];//socket - ждут игру
var players = [];//{roomID, socket} - на данный момент играют
var observers = [];//socket - подписаны на обновления комнат
var allObservers = []; //{roomID, socket} - вообще все обсерверы

function getObserver(socket)
{
	for (var i = 0; i < allObservers.length; i++)
		if (allObservers[i].socket === socket)
			return allObservers[i];
	return false;
}

function getPlayer(socket)
{
	for (var i = 0; i < players.length; i++)
		if (players[i].socket === socket)
			return players[i];	
	return false;
}

function delObserverFromRoom(roomID, observer)
{		
	rooms[roomID].observers.splice(rooms[roomID].observers.indexOf(observer), 1);
	getObserver(observer).roomID = -1;
	sendUpdates();
}

function pushObserverToRoom(roomID, observer)
{
	if (!rooms[roomID].observers)
		rooms[roomID].observers = [];
	rooms[roomID].observers.push(observer);
	getObserver(socket).roomID = roomID;
	sendUpdates();
}

function indexOfRoomPlayer(socket)
{
	for (var i = 0; i < players.length; i++)
		if (players[i].socket === socket)
			return players[i].roomID;
}

function isRoom(roomID)
{
	if (typeof(roomID) !== "string")
		return false;
	for (var i = 0; i < rooms.length; i++)
		if (rooms[i].roomID === roomID)
			return true;
	return false;	
}

function getRoomsArr()
{	
	var arr = [];
	for (int i =0; i< rooms.length; i++)
	{
		arr.push({
			roomID: rooms[i].roomID;
			length: 2 + rooms[i].observers ? rooms[i].observers.length : 0;
		});
	}
	return arr;
}

function sendUpdates()
{
	var arr = getRoomsArr();
	for (var i = 0; i < observers.length; i++)
	{
		observers[i].emit("roomsList", function (arr));
	}
}

function disconnect(socket)
{
	observer = getObserver(socket);
}

function clearRoom(roomID)
{	
	
	rooms.splice(roomID, 1);
	sendUpdates();
}

function endGame(winner, reason)
{	
	var roomID = indexOfRoom(winner);
	if (roomID != -1)
	{
		var socket_2 = getPlayer2(winner, roomID);
	}
	
	winner.emit("game_end", {
		msg : reason,
		winnerColor : rooms[roomID].player1 == winner ? "white" : "black"
	})	
if (roomID != -1)	
	if (reason != "leave")
	{
		socket_2.emit("game_end", {
			msg : reason,
			winnerColor : rooms[roomID].player1 == winner ? "white" : "black"
		})	
	}
	winner.disconnect();
	if (roomID != -1)
	socket_2.disconnect();
	clearRoom(roomID);
	players.splice(players.indexOf(winner), 1);	
	if (roomID != -1)
	players.splice(players.indexOf(socket_2), 1);

	log.debug(reason);		
}

log.debug("YEAH");

function getPlayer2(player1, roomID)
{
	return rooms[roomID].player1 == player1 ? rooms[roomID].player2 : rooms[roomID].player1;
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
	log.debug(socket.id + " connected");
	
	// отключение игрока
	socket.on("disconnect", function() 
	{
		log.debug(socket.id + " disconnected");
		
		var roomID = indexOfRoom(socket);
		if (roomID != -1)
		{
			var socket_2 = getPlayer2(socket, roomID);
			socket_2.disconnect();
			clearRoom(roomID);
		}
		
	});
	
	socket.on("room_leave", function()
	{
		var roomID = indexOfRoom(socket);
		if (roomID == -1)
			return;
		if (isPlayerInRoom(roomID, socket))
			endGame(socket_2, "leave");		
		else
			if (isObserverInRoom(roomID, socket))
				delObserverFromRoom(roomID, observer);
				
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
			players.push({
				roomID : roomID,
				socket : wait[0]});				
			players.push({
				roomID : roomID,
				socket : wait[1]});
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
		var roomID = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomID);
		socket_2.emit("player_move", {from : move.from, to : move.to, playerColor : rooms[roomID].player1 == socket ? "white" : "black"});
		log.debug(socket.id + " move from " + move.from.x + "" + move.from.y + " to " + move.to.x + "" + move.to.y);
	});
	
	socket.on ("turn_castling", function(move)
	{
		var roomID = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomID);
		socket_2.emit("player_castling", {
			from : move.from, 
			playerColor : rooms[roomID].player1 == socket ? "white" : "black"});
		log.debug(socket.id + " castling from " + move.from.x + "" + move.from.y);		
	});
	
	socket.on ("turn_promotion", function(move)
	{
		var roomID = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomID);
		socket_2.emit("player_promotion", {
			from : move.from, 
			to : move.to, 
			playerColor : rooms[roomID].player1 == socket ? "white" : "black", 
			newPiece : move.newPiece});
		log.debug(socket.id + " promotion from " + move.from.x + "" + move.from.y + " to " + move.to.x + "" + move.to.y + " new : " + move.newPiece);		
	});
	
	socket.on ("turn_mate", function()
	{
		var roomID = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomID);
		socket_2.emit("player_mate");
		log.debug(socket.id + " : mated");
	});
	
	socket.on ("turn_draw", function()
	{
		var roomID = indexOfRoom(socket);
		var socket_2 = getPlayer2(socket, roomID);
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
	
	socket.on("roomsList_subscribe", function()
	{
		socket.emit("roomsList", function (getRoomsArr()));
		observers.push(socket);
	});
	
	socket.on ("room_enter", function(obj)
	{	
		if (isRoom(obj.roomID))
			pushObserverToRoom(roomID, socket);
	});
});