var request = require('request');

console.log('Lempkes');


url = 'http://192.168.1.102/api/robbywauters/lights/'

bri_max = 255
hue_max = 65535 // Both 0 and 65535 are red, 25500 is green and 46920 is blue.
sat_max = 255

lamps = 3

function random_bri() {
    return Math.floor((Math.random()*hue_bri));
}

function random_hue() {
    return Math.floor((Math.random()*hue_max));
}

function random_sat() {
    return Math.floor((Math.random()*hue_sat));
}


function lamp(settings) {

    x = []

    if(settings.on != undefined) x.push('"on": ' + settings.on)
    if(settings.bri != undefined) x.push('"bri": ' + settings.bri)
    if(settings.hue != undefined) x.push('"hue": ' + settings.hue)
    if(settings.sat != undefined) x.push('"sat": ' + settings.sat)
    if(settings.transitiontime != undefined) x.push('"transitiontime": ' + settings.transitiontime)
    if(settings.alert != undefined) x.push('"alert": "' + settings.alert + '"')

    console.log("X " + x)

    request.put({url:url+settings.id+'/state', body: "{" + x.join(',') + "}"}, function(error, response, body) {console.log(body)});
}

// EFFECTS

function off_all() {
    for (var i=1;i<=lamps;i++) {
        lamp({id: i, on: false})
    }
}

function on_all() {
    lamp({id: 1, on: true, hue: 0, bri: 100, sat: sat_max})
    lamp({id: 2, on: true, hue: 25500, bri: 100, sat: sat_max})
    lamp({id: 3, on: true, hue: 46920, bri: 100, sat: sat_max})
}


function flash(id) {

    lamp({id: id, on: true, sat: sat_max, bri: sat_max, hue: random_hue()})
    setTimeout(function() { lamp({id: id, alert: 'select'}) }, 100)
    setTimeout(function() { lamp({id: id, on: false}) }, 200)

}


function quiz_start(id) {

    lamp({id: id, on: true, bri: 50, sat: 0, hue: 0})

    setTimeout(function() { lamp({id: id, alert: 'select'}) }, 500)
    setTimeout(function() { lamp({id: id, alert: 'select'}) }, 1000)
    setTimeout(function() { lamp({id: id, alert: 'select'}) }, 1500)
}

function quiz_end(id) {

    lamp({id: id, alert: 'select'})

    setTimeout(function() { lamp({id: id, on: false, sat: 0, bri: 0, hue: 10000, transitiontime: 30}) }, 500)
}

function question_soon(id) {

    lamp({id: id, sat: sat_max, bri: 100, hue: 10000})

    setTimeout(function() { lamp({id: id, alert: 'select'}) }, 500)
    setTimeout(function() { lamp({id: id, alert: 'select'}) }, 1000)
}

function question_start(id) {

    lamp({id: id, sat: sat_max, bri: bri_max, hue: 10000})

}

function question_end(id) {

    lamp({id: id, sat: sat_max, bri: 0, hue: 10000, transitiontime: 15})

}
