var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io').listen(http); 
http.listen(3056);

var log4js = require('log4js');
var log = log4js.getLogger();

var rooms = [];//{roomID, player1 - белый, player2 - черный, observers, moves - подписаны на комнату}
var wait = [];//socket - ждут игру
var players = [];//{roomID, socket} - на данный момент играют
var observers = [];//socket - подписаны на обновления комнат
var allObservers = []; //{roomID, socket} - вообще все обсерверы

function emitMove(socket, roomID, move, type)
{
	if (isRoom(roomID))
	{
		rooms[roomID].moves.push({
			moveType : type,
			moveData : move
		});
	
		var arr = [];
		pushTo(arr, (getPlayer2(socket, roomID)));
		arr = arr.concat(rooms[roomID].observers);
		
		log.debug(arr);
		switch (type)
		{
			case "move":
			for (var i = 0; i < arr.length; i++)
			{
				arr[i].emit("player_move", {
					from : move.from, 
					to : move.to, 
					playerColor : rooms[roomID].player1 == socket ? "white" : "black"
				});
				log.debug(socket.id + " move from " + move.from.x + "" + move.from.y + " to " + move.to.x + "" + move.to.y);
			}
			break;
			
			case "castling":
			for (var i = 0; i < arr.length; i++)
			{
				arr[i].emit("player_castling", {
					from : move.from, 
					playerColor : rooms[roomID].player1 == socket ? "white" : "black"
				});
				log.debug(socket.id + " castling from " + move.from.x + "" + move.from.y);	
			}
			break;
			
			case "promotion":
			for (var i = 0; i < arr.length; i++)
			{
				arr[i].emit("player_promotion", {
					from : move.from, 
					to : move.to, 
					playerColor : rooms[roomID].player1 == socket ? "white" : "black", 
					newPiece : move.newPiece
				});
				log.debug(socket.id + " promotion from " + move.from.x + "" + move.from.y + " to " + move.to.x + "" + move.to.y + " new : " + move.newPiece);	
			}
			break;		
		}
	}
}

function getAllObserver(socket)
{
	for (var i = 0; i < allObservers.length; i++)
		if (allObservers[i].socket === socket)
			return allObservers[i];
	return false;
}

function getObserver(socket)
{
	var index = observers.indexOf(socket);
	if (index === -1)
		return null;
	return observers[index];
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
	if (!observer)
		return;
	if (rooms[roomID])
	if (rooms[roomID].observers)
	spliceIn(rooms[roomID].observers, rooms[roomID].observers.indexOf(observer));
	if (getAllObserver(observer))
	getAllObserver(observer).roomID = -1;
	sendUpdates();
	log.debug("Delete observer " + observer.id + " from room " + roomID);
}

function pushObserverToRoom(roomID, observer)
{
	pushTo(rooms[roomID].observers, observer);
	getAllObserver(observer).roomID = roomID;
	sendUpdates();
	log.debug("Push observer " + observer.id + " to room " + roomID);
}

function pushTo(arr, elem)
{
	if (arr.indexOf(elem) === -1)
		arr.push(elem);
}

function spliceIn(arr, elem)
{
	var index = arr.indexOf(elem);
	if (index !== -1)
		arr.splice(index, 1);
}

function indexOfRoomPlayer(socket)
{
	for (var i = 0; i < players.length; i++)
		if (players[i].socket === socket)
			return players[i].roomID;
}

function isRoom(roomID)
{
	if (rooms[roomID])
		return true;
	else
		return false;
}

function getRoomsArr()
{	
	var arr = [];
	for (var i = 0; i < rooms.length; i++)
	{
		pushTo(arr, {
			roomID: i,
			length: 2 + rooms[i].observers ? rooms[i].observers.length : 0
		});
	}
	return arr;
}

function sendUpdates()
{
	var arr = getRoomsArr();
	for (var i = 0; i < observers.length; i++)
	{
		observers[i].emit("roomsList", arr);
		log.debug("Send updates to observer " + observers[i].id);
	}
}

function leave(socket, reason)
{	
	log.debug(socket.id + " " + reason);
	var smbd = getAllObserver(socket);
	if (smbd)
	{
		if (smbd.roomID !== -1)
		{
			delObserverFromRoom(smbd.socket);
		}
		if (reason === "disconnect")
		{
			spliceIn(observers, smbd.socket);
			spliceIn(allObservers, smbd);
		}
		sendUpdates();
		return;
	}
	smbd = getPlayer(socket);
	if (smbd)
	{		
		log.debug(smbd.roomID + " " + smbd.socket.id);
		endGame(getPlayer2(smbd.socket, smbd.roomID), "leave");
	}
}

function clearRoom(roomID)
{	
	if (isRoom(roomID))
	{
		log.debug("clear " + roomID);
		var smbd = rooms[roomID].player1;
		smbd = getPlayer(smbd);		
		if (smbd)
		{			
			log.debug("splice " + smbd.socket.id);
			spliceIn(players, smbd);
		}
		smbd = rooms[roomID].player2;
		smbd = getPlayer(smbd);
		if (smbd)
		{			
			log.debug("splice " + smbd.socket.id);
			spliceIn(players, smbd);
		}
		for (var i = 0; i < rooms[roomID].observers.length; i++)
		{
			smbd = rooms[roomID].observers[i];
			smbd = getAllObserver(smbd);
			smbd.roomID = -1;
		}
		spliceIn(rooms, roomID);			
		log.debug("splice " + roomID);
	}
	sendUpdates();
}

function endGame(winner, reason)
{	
	var smbd = getPlayer(winner);
	if (smbd)
	{
		var roomID = smbd.roomID;
		if (isRoom(roomID))
		{
			smbd.socket.emit("game_end", {
				msg : reason,
				winnerColor : rooms[roomID].player1 == smbd.socket ? "white" : "black"
			});			
			var socket_2 = getPlayer2(smbd.socket, roomID);		
			socket_2.emit("game_end", {
				msg : reason,
				winnerColor : rooms[roomID].player1 == winner ? "white" : "black"
			});			
			clearRoom(roomID);
			log.debug(reason);	
		}			
	}	
}

function getPlayer2(player1, roomID)
{
	return rooms[roomID].player1 == player1 ? rooms[roomID].player2 : rooms[roomID].player1;
}

function getWinnerColor(winner, reason)
{
	if (reason == "draw")
		return null;
	return rooms[indexOfRoomPlayer(winner)].player1 == winner ? "white" : "black";
}

function start()
{
	var roomID = rooms.length;
	rooms.push({
		roomID : roomID, 
		player1 : wait[0], 
		player2 : wait[1],
		observers : [],
		moves : []
	});			
	wait[0].emit("game_found", {
		color: "white", 
		roomID: "" + roomID
	});
	wait[1].emit("game_found", {
		color: "black", 
		roomID: "" + roomID
	});
	players.push({
		roomID : roomID,
		socket : wait[0]});				
	players.push({
		roomID : roomID,
		socket : wait[1]});
	wait.splice(0, 2);

	log.debug(roomID + " start");
}

log.debug("YEAH");


// Подключение нового клиента, дальше все в его контексте
io.sockets.on("connection", function (socket) 
{
	log.debug(socket.id + " connected");
	
	// отключение игрока
	socket.on("disconnect", function() 
	{
		leave(socket, "disconnect");
	});
	
	socket.on("room_leave", function()
	{		
		leave(socket, "leave");
	});
	
	socket.on ("game_find", function()
	{
		if (wait.indexOf(socket) == -1)
			wait.push(socket);
		if (wait.length > 1)
		{
			start();
		}
	});
	
	socket.on ("game_stopFinding", function()
	{	
		spliceIn(wait, socket);
	});
	
	socket.on ("turn_move", function(move)
	{
		emitMove(socket, indexOfRoomPlayer(socket), move, "move");
	});
	
	socket.on ("turn_castling", function(move)
	{		
		emitMove(socket, indexOfRoomPlayer(socket), move, "castling");
	});
	
	socket.on ("turn_promotion", function(move)
	{		
		emitMove(socket, indexOfRoomPlayer(socket), move, "promotion");	
	});
	
	socket.on ("turn_mate", function()
	{
		var roomID = indexOfRoomPlayer(socket);
		var socket_2 = getPlayer2(socket, roomID);
		socket_2.emit("player_mate");
		log.debug(socket.id + " : mated");
	});
	
	socket.on ("turn_draw", function()
	{
		var roomID = indexOfRoomPlayer(socket);
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
		log.debug("subscribe " + socket.id);
		
		socket.emit("roomsList", getRoomsArr());
		
		pushTo(observers, socket);
		pushTo(allObservers, socket);
	});
	
	socket.on("roomsList_unsubscribe", function()
	{
		log.debug("unsub");
			spliceIn(observers, socket);
			/*
		var index = observers.indexOf(socket);
		if (index != -1)
		{
		}
		*/
	});
	
	socket.on ("room_enter", function(obj)
	{	
		var roomID = obj.roomID;
		log.debug("room enter " + roomID);
		if (isRoom(roomID))
		{
			log.debug("is room" + roomID);
			pushObserverToRoom(roomID, socket);
			//pushTo(observers, socket);			
			pushTo(allObservers, {
				roomID : roomID,
				socket : socket
			});
			socket.emit("game_logs", rooms[roomID].moves);
			
		log.debug("emit " + rooms[roomID].moves);
		}
	});
});