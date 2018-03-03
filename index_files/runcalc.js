/*!
  , __
  /|/  \                        o
  |___/         _  _    _  _       _  _    __,
  | \   |   |  / |/ |  / |/ |  |  / |/ |  /  |
  |  \_/ \_/|_/  |  |_/  |  |_/|_/  |  |_/\_/|/
                                            /|
                                            \|
    ___        _               _
   / (_)      | |             | |
  |      __,  | |  __         | |  __, _|_  __   ,_
  |     /  |  |/  /    |   |  |/  /  |  |  /  \_/  |
   \___/\_/|_/|__/\___/ \_/|_/|__/\_/|_/|_/\__/    |_/

  Licensed under The MIT License
  details, see https://opensource.org/licenses/MIT

  Copyright (c) 2018 Ryan Tyler

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  ------------------------------------------------------------------------------
  This calculator was written for personal use and may not be 100% accurate, at the time
  of release extensive testing has not been carried out.

  If you do use any of the code or features please let me know
  Twitter: https://twitter.com/carelesslabs
  Email: carelesslabs@gmail.com
*/

// Conversion ratios
var km2miles = 0.6213711922;
var miles2km = 1.609344;
var precision = 3;

$(document).ready(function() {
  console.log( "CarelessLabs Running Calculator" );

  // Browser Events
  $('.speedDist').on('click', function() {
    var distance = $(this).data('distance');
    var unit = $("#unit").val();
    var control = $("#distance");
    setDistance(distance, unit, control);
    calcSpeed();
  });

  $('.timeDist').on('click', function() {
    var distance = $(this).data('distance');
    var unit = $("#dstUnit").val();
    var control = $("#distanceSpd");
    setDistance(distance, unit, control);
    calcTimeSpeed();
  });

  $('.paceDist').on('click', function() {
    var distance = $(this).data('distance');
    var unit = $("#unitEvent").val();
    var control = $("#distanceEvent");
    setDistance(distance, unit, control);
    calcPace(unit);
  });

  $('.setPrecision').on('input', function() {
      precision = $('.setPrecision').val();
  });

  $('.calc').on('input', function() {
    calcSpeed();
  });

  $('.calcSpd').on('input', function() {
    calcTimeSpeed();
  });

  $("#secSlider").slider({
    tooltip: 'always',
    step: 1,
    min: 0,
    max: 59,
    formatter: function(value) {
      if(value < 10){
        return '0' + value;
      } else {
        return value;
      }
    }
  });

  $("#minSlider").slider({
    tooltip: 'always',
    step: 1,
    min: 3,
    max: 20
  });

  $('.calcPace').on('change input', function() {
    var unit = $("#unitEvent").val();
    calcPace(unit);
  });

});

// FUNCTIONS

// Set distance buttons update the value of a distance control
function setDistance(distance, unit, control){
  if(distance == "5km"){
    if(unit == "mile"){
      control.val(3.10686);
    } else {
      control.val(5);
    }
  } else if(distance == "10km"){
    if(unit == "mile"){
      control.val(6.21371);
    } else {
      control.val(10);
    }
  } else if(distance == "half"){
    if(unit == "mile"){
      control.val(13.1094);
    } else {
      control.val(21.0975);
    }
  } else if(distance == "mara"){
    if(unit == "mile"){
      control.val(26.2188);
    } else {
      control.val(42.195);
    }
  }
}

// SPEED TAB
// Update the speed given the time and distance
function calcSpeed(){
  // distance
  var dst = $("#distance").val();
  var unit = $("#unit").val();

  // Time
  var hour = $("#hour").val();
  var minute = $("#minute").val();
  var second = $("#second").val();

  // Totals
  var totalSeconds = (+hour) * 60 * 60 + (+minute) * 60 + (+second);
  var mph = 0;
  var kmh = 0;

  if(dst != 0 && totalSeconds != 0){
    if(unit == "mile"){
      var mph = (dst / totalSeconds) * 3600;
      var kmh = mph * miles2km;
    } else {
      var kmh = (dst / totalSeconds) * 3600;
      var mph = kmh * km2miles;
    }

    $("#speedMPH").text(mph.toFixed(precision) + " MPH");
    $("#speedKMH").text(kmh.toFixed(precision) + " KHM");
  } else {
    $("#speedMPH").text("0 MPH");
    $("#speedKMH").text("0 KHM");
  }
}

// TIME TAB
// Update the time given the speed and distance
function calcTimeSpeed(){
  // distance
  var dst = $("#distanceSpd").val();
  var dstUnit = $("#dstUnit").val();
  var unitSpeed = $("#unitSpd").val();
  var speed = $("#speed").val();
  var totalTime = 0;

  if(dst != 0 && speed != 0){
    if(dstUnit == "mile"){
      if(unitSpeed == "mph"){
        totalTime = (dst / speed);
      } else {
        totalTime = (dst / (speed * km2miles));
      }
    } else {
      if(unitSpeed == "kmh"){
        totalTime = (dst / speed);
      } else {
        totalTime = (dst / (speed * miles2km));
      }
    }

    var hours = parseInt(totalTime);
    var rMins = (totalTime - hours) * 60;
    var minutes = parseInt(rMins);
    var rSecs = (rMins - minutes) * 60;
    var split = rSecs.toFixed(precision).toString().split(".");

    if (split.length > 1) {
         split = split[1];
     } else {
       split = "00";
    }

    var time = padNum(hours) + ":" + padNum(minutes) + ":" + padNum(parseInt(rSecs)) + "." + split;
    $("#outputSpd").text(time);
  } else {
    $("#outputSpd").text("00:00:00.00");
  }
}

// PACE TAB
// Update time, speed and the time per mile/km table
function calcPace(unit){
  // Calculate minute miling
  var table = $("#breakdownTable");
  var distance = $("#distanceEvent").val();
  var distanceInt = Math.ceil(distance);
  var mins = $("#minSlider").val();
  var seconds = $("#secSlider").val();
  var secsPerUnit = (parseInt(mins) * 60);
  secsPerUnit = add(secsPerUnit, seconds);
  var paceUnit = $("#paceUnit").val();
  var mph = 0;
  var kmh = 0;

  $("#paceMPH").text("");
  $("#paceKMH").text("");

  if(unit == "mile"){
    $("#unitPace").text("Mile");

    if(paceUnit == "km"){
      secsPerUnit = secsPerUnit * miles2km;
    }

    // Set Speeds
    mph = (1/ secsPerUnit) * 3600;
    kmh = mph * miles2km;

  } else {
    $("#unitPace").text("KM");

    if(paceUnit == "mile"){
      secsPerUnit = secsPerUnit * km2miles;
    }

    // Set Speeds
    kmh = (1/ secsPerUnit) * 3600;
    mph = kmh * km2miles;
  }

  $("#paceMPH").text(mph.toFixed(precision) + " MPH");
  $("#paceKMH").text(kmh.toFixed(precision) + " KMH");

  table.empty();

  if(distance > 0){
    for(i = 1; i <= distanceInt; i++) {
      var time = (i * secsPerUnit);
      var timeStr = getTime(time);

      if(i < distanceInt || distance == distanceInt){
        createTableRow(table, i, timeStr);
      } else {
        var over = subtract(distanceInt,distance,8);
        var extra = subtract(1,over,8);
        time = (i-1) * secsPerUnit;
        time = time + (extra * secsPerUnit)
        timeStr = getTime(time);

        createTableRow(table, distance, timeStr);
      }
    }

    $("#paceTime").text(timeStr);
  }
}

// Convert time in seconds to hh:mm:ss.split
// e.g 01:28:12.00
function getTime(time){
  var rem = 0;
  var hours = Math.floor(time / 3600);
  var hoursSeconds = hours * 3600;
  rem = subtract(time,hoursSeconds);

  var minutes = Math.floor(rem / 60);
  var minuteSeconds = minutes * 60;

  rem = subtract(rem,minuteSeconds);
  var seconds = rem;
  return padNum(hours) + ":" + padNum(minutes) + ":" + padNum(seconds);
}

// Append a new table row to an existing table
// Used for added mile / km times to the breakdown table
function createTableRow(table, unit, time){
    var row = "<tr><td scope='row' class='text-left'>" + unit + "</td><td class='text-left'>" + time + "</td></tr>";
    table.append(row);
}

// Work arounds for floating point issues
function add(a, b, precision) {
  var x = Math.pow(10, precision || 2);
  return (Math.round(a * x) + Math.round(b * x)) / x;
}

function subtract(a, b, precision) {
  var x = Math.pow(10, precision || 2);
  return (Math.round(a * x) - Math.round(b * x)) / x;
}

// Make sure 1 minutes is show as 01 etc
function padNum(num){
  if(num < 10){
    return "0" + num;
  } else {
    return num;
  }
}
