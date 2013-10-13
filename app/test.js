#!/usr/bin/env node
var lamps = require('./lamps').lamps;

//lamps.disco();
//lamps.lamp({id: 1, on:true, sat: 255, bri: 200, hue: 25000});
//lamps.lamp({id: 1, on:true, sat: 255, bri: 200, hue: 0});
lamps.off_all();
//lamps.lamp({id: 1, on:true, sat: 255, bri: 200, hue: 10000});