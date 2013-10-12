var fs = require('fs');

var onoff, Gpio, led, blue, pink, orange;

function watchButtons(buttonCallback){
	// check if we're on the Raspberry Pi:
	fs.exists('/sys/class/gpio/', function (exists){
		if(exists){
			console.log("We're on the Raspberry Pi.. watching GPIOs");
			watchGpio(buttonCallback);
		}else{
			console.log("Looks like we're not on the Raspberry Pi.");
			buttonCallback(new Error("Looks like we're not on the Raspberry Pi."));
		}
	});
}
function watchGpio(buttonCallback){
	var debounceTimeout = 240;

	onoff = require('onoff');
	Gpio = require('onoff').Gpio;
	led = new Gpio(17, 'out');

	blue = new Gpio(23, 'in', 'falling',{
		debounceTimeout : debounceTimeout,
		persistentWatch : true
	});

	pink = new Gpio(25, 'in', 'falling',{
		debounceTimeout : debounceTimeout,
		persistentWatch : true
	});

	orange = new Gpio(22, 'in', 'falling',{
		debounceTimeout : debounceTimeout,
		persistentWatch : true
	});


	blue.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) buttonCallback(null, 'blue'); // 0 = pressed down
	});
	pink.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) buttonCallback(null, 'pink'); // 0 = pressed down
	});
	orange.watch(function (err, value) {
		if (err) return console.log(err);
		if (value == 0) buttonCallback(null, 'orange'); // 0 = pressed down
	});

	blink();
	printStatus();
}

function blink(){
	led.writeSync( 1 );
	setTimeout(function(){
		led.writeSync( 0 );
	},300);
}

function printStatus(){
	console.log("Current State:");
	console.log("- blue: " + blue.readSync() );
	console.log("- pink: " + pink.readSync() );
	console.log("- orange: " + orange.readSync() );
	console.log("==============");
}

exports.watchButtons = watchButtons;

