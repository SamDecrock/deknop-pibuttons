#!/usr/bin/env node
var request = require('request');
var buttons = require('./buttons');
var lamps = require('./lamps').lamps;
var config = require('./config');

// verbinden met de websocket:
var io = require('socket.io-client');
console.log("Connecting to socket ...");
socket = io.connect(config.url);

// juiste plakkers op de knoppen plakken:
var button2answer = {};
button2answer['pink'] = ['A', 1];
button2answer['blue'] = ['B', 2];
button2answer['orange'] = ['C', 3];

// tv ding:
var registration_options = {
	username: 'one',
	type: 'tv'
};
var current_question_id = null;

// websocket events:
socket.on('connect', function () {
	console.log('socket connected: ' + JSON.stringify(registration_options));
	socket.emit('register', registration_options);
});

socket.on('disconnect', function () {
	console.log('socket disconnected');
});

socket.on('point', function(data){
  console.log("Points: " + JSON.stringify(data) + ", current qid: " + current_question_id);

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
		current_question_id = null;
		console.log("On TV start: " + current_question_id);
		//lamps.quiz_start();
		lamps.off_all();
	},

	onQuizStart: function(data){
		console.log('Quiz start');
		lamps.disco();
	},

	onQuizEnd: function(data){
		console.log('Quiz end');
		//
		lamps.off_all();
	},

	onQuestionSoon: function(data){
		console.log('Question soon' + JSON.stringify(data));
		//{"type":"question:soon","time":1.5,"id":0,"countdown":2,"buttons":[],"passed":true}
		//{"type":"question:soon","time":4,"buttons":[],"passed":true}
		//lamps.question_soon();
		current_question_id = data.id;
	},

	onQuestionStart: function(data){
		console.log('Question start');
		//{"type":"question:start","time":6,"buttons":["A","B"],"passed":true,"countdown":2}
		current_question_id = data.id;
		lamps.on_all();

	},

	onQuestionEnd: function(data){
		console.log('Question end');
		//{"type":"question:end","time":8,"buttons":[],"passed":true}
		//lamps.question_end();
		lamps.off_all();
	},

	onScoreUpdate: function(data){
		console.log('Score update: ' + JSON.stringify(data));
		//
		if(data.correct){
			lamps.onSuccess();
		} else {
			lamps.onErrorr();	
		}
	}
};


function doAnswer(question_id, answer){
	// http://localhost:9000/api/answer
	console.log("Hallo knop");
	lamps.answer(answer[1]);

	request.post(
		config.url + '/api/answer',
	    { 
	    	form: { 
	    		username: registration_options.username,
	    		id: question_id, 
	    		answer: answer[0].toUpperCase()
	    	} 
	    },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body)
	        }
	    }
	);
}


// buttons in de gaten houden:
buttons.watchButtons(function (err, buttonId){
	// pink, blue, orange
	if(err){
		return console.log(err);
	}
	var answer = button2answer[buttonId];
	console.log("Button Id: " + buttonId + ", answer: " + answer[0] + ", question: " + current_question_id);
	doAnswer(current_question_id, answer);
});
