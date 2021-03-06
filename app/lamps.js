var lamps = (function(){
    var request = require('request');
    console.log('Lempkes');

    var url = 'http://192.168.1.102/api/robbywauters/lights/';

    var bri_max = 255;
    var hue_max = 65535;// Both 0 and 65535 are red, 25500 is green and 46920 is blue.
    var sat_max = 255;

    var lamps = 3;


    function random_bri(){
        return Math.floor((Math.random()*hue_bri));
    }

    function random_hue(){
        return Math.floor((Math.random()*hue_max));
    }

    function random_sat(){
        return Math.floor((Math.random()*hue_sat));
    }


    function lamp(settings){

        x = []

        if(settings.on != undefined) x.push('"on": ' + settings.on);
        if(settings.bri != undefined) x.push('"bri": ' + settings.bri);
        if(settings.hue != undefined) x.push('"hue": ' + settings.hue);
        if(settings.sat != undefined) x.push('"sat": ' + settings.sat);
        if(settings.transitiontime != undefined) x.push('"transitiontime": ' + settings.transitiontime);
        if(settings.alert != undefined) x.push('"alert": "' + settings.alert + '"');

        console.log("X " + x);

        request.put({url:url+settings.id+'/state', body: "{" + x.join(',') + "}"}, function(error, response, body) {console.log(body)});
    }

    // EFFECTS

    function off_all(){
        for (var i=1;i<=lamps;i++) {
            lamp({id: i, on: false});
        }
    }

    function on_all(){
        // Purple
        lamp({id: 1, on: true, hue: 50000, bri: 200, sat: sat_max});

        // Blue
        lamp({id: 2, on: true, hue: 47000, bri: 200, sat: sat_max});
        
        // orange
        lamp({id: 3, on: true, hue: 10000, bri: 200, sat: sat_max});  
        //lamp({id: 3, on: true, hue: 46920, bri: 100, sat: sat_max})
    }


    function flash(id){
        lamp({id: id, on: true, sat: sat_max, bri: sat_max, hue: random_hue()});
        setTimeout(function() { lamp({id: id, alert: 'select'}) }, 100);
        setTimeout(function() { lamp({id: id, on: false}) }, 200);
    }


    function quiz_start(){
        for (var id=1;id<=lamps;id++) {
            lamp({id: id, on: true, bri: 50, sat: 0, hue: 0});
            //setTimeout(function() { lamp({id: id, alert: 'select'}) }, 500);
            //setTimeout(function() { lamp({id: id, alert: 'select'}) }, 1000);
            //setTimeout(function() { lamp({id: id, alert: 'select'}) }, 1500);
        }
    }

    function quiz_end(){
        for (var id=1;id<=lamps;id++) {
            lamp({id: id, alert: 'select'});
            setTimeout(function() { lamp({id: id, on: false, sat: 0, bri: 0, hue: 10000, transitiontime: 30}) }, 500);
        }
    }

    function question_soon(){
        for (var id=1;id<=lamps;id++) {
            lamp({id: id, sat: sat_max, bri: 100, hue: 10000});
            setTimeout(function() { lamp({id: id, alert: 'select'}) }, 500);
            setTimeout(function() { lamp({id: id, alert: 'select'}) }, 1000);
        }
    }

    function question_start(){
        for (var id=1;id<=lamps;id++) {
            lamp({id: id, sat: sat_max, bri: bri_max, hue: 10000});
        }
    }

    function question_end(){
        for (var id=1;id<=lamps;id++) {
            lamp({id: id, sat: sat_max, bri: 0, hue: 10000, transitiontime: 15});
        }
    }

    function answer(id){
        for(var i=1;i<=lamps;i++){
            if(id!==i){
                lamp({id: i, on:false});  
            }
        }
    }

    function disco(){
        var hues = [0, 60000, 0, 25000, 60000, 0, 35000, 0, 60000, 25000, 10000, 0, 60000, 0, 25000, 60000, 0, 35000, 0, 60000, 25000, 10000];

        function buts(hue){
            lamp({id: 1, on:true, sat: 255, bri: 100, hue: hue});
            lamp({id: 2, on:true, sat: 255, bri: 100, hue: hue});
            lamp({id: 3, on:true, sat: 255, bri: 100, hue: hue});
        }

        function timeout(index){
            setTimeout(function(){
                if(index<hues.length){
                    buts(hues[index]); 
                    timeout(index+1);
                }else{
                    off_all();
                }
            }, 500);
        }

        timeout(0);
    }

    function onSuccess(){
        for(var i=1;i<=lamps;i++){
            lamp({id: i, on:true, sat: 255, bri: 200, hue: 25000});
        }
        setTimeout(function(){off_all()}, 9000);
    }

    function onErrorr(){
        for(var i=1;i<=lamps;i++){
            lamp({id: i, on:true, sat: 255, bri: 200, hue: 0});
        }
        setTimeout(function(){off_all()}, 9000);
    }

    return {
        on_all: on_all,
        off_all: off_all,
        lamp: lamp,
        question_soon: question_soon,
        question_start: question_start,
        question_end: question_end,
        quiz_start: quiz_start,
        answer: answer,
        disco: disco,
        onSuccess: onSuccess,
        onErrorr: onErrorr
    }

})();

exports.lamps = lamps
