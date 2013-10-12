#!/usr/bin/env node

var httpreq = require('httpreq');
var buttons = require('./buttons');
var config = require('./config');

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
socketclient = io.connect(config.url);

// websocket events:
socketclient.on('connect', function () {
	console.log('socketclient connected');
	socketclient.send('hi there');
});

socketclient.on('disconnect', function () {
	console.log('socketclient disconnected');
});

socketclient.on('point', function(data){
  //console.log('Point received: ' + JSON.stringify(data));

  switch(data.type){
  	case "tv:start": events.onTvStart(data);break;	
    case "quiz:start": events.onQuizStart(data);break;
    case "quiz:end": events.onQuizEnd(data);break;
    case "question:soon": events.onQuestionSoon(data);break;
    case "question:start": events.onQuestionStart(data);break;
    case "question:end": events.onQuestionEnd(data);break;
    case "score:update": events.onScoreUpdate(data);break;
  }
});

var events = {
	onTvStart: function(data){
		console.log("On TV start");
	},

	onQuizStart: function(data){
		console.log('Quiz start');
		//
	},

	onQuizEnd: function(data){
		console.log('Quiz end');
		//
	},

	onQuestionSoon: function(data){
		console.log('Question soon');
		//{"type":"question:soon","time":4,"buttons":[],"passed":true}
	},

	onQuestionStart: function(data){
		console.log('Question start');
		//{"type":"question:start","time":6,"buttons":["A","B"],"passed":true,"countdown":2}
	},

	onQuestionEnd: function(data){
		console.log('Question end');
		//{"type":"question:end","time":8,"buttons":[],"passed":true} 
	},

	onScoreUpdate: function(data){
		console.log('Score update');
		//
	}	
};

/*
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
*/