#!/usr/bin/env node

var httpreq = require('httpreq');
var buttons = require('./buttons');

// dit moeten we van de server krijgen:
var username, posturl;

// juiste plakkers op de knoppen plakken:
var button2answer = {};
button2answer['pink'] = 'A';
button2answer['blue'] = 'B';
button2answer['orange'] = 'C';

// verbinden met de websocket:
var io = require('socket.io-client');
console.log("connecting to socket");
socketclient = io.connect('http://localhost:3000');

// websocket events:
socketclient.on('connect', function () {
	console.log('socketclient connected');
	socketclient.send('hi there');
});

socketclient.on('some-event', function (data) {
	console.log(data);
});

socketclient.on('disconnect', function () {
	console.log('socketclient disconnected');
});


// buttons in de gaten houden:
buttons.watchButtons(function (err, buttonId){
	if(err) return console.log(err);

	var response = {
		username: username,
		answer: button2answer[buttonId]
	};

	console.log("sending:");
	console.log(response);

	// ofwel via sockets:
	if(socketclient.connected)
		socketclient.send(response);

	// ofwel via een POST:
	if(posturl){
		httpreq.post(posturl, {parameters: response}, function (err, res){
			if(err) return console.log(err);
		});
	}
});