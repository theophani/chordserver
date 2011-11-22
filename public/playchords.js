"use strict";

try {
  var context = new webkitAudioContext();
} catch (e) {
  var el = document.createElement('p');
  el.innerHTML = 'Sorry, this only work in <a href="http://www.google.com/chrome">Chrome</a> right now.';
  document.body.appendChild(el);
}

var ready = function () {
  // allow the user to see the interface, indicating that they can play now
  document.body.className = 'loaded';
};

var soundHash = (function () {
  var hash = {};
  for (var i = 1; i < 17; i++) {
    hash['woody'+i] = 'woody_'+i+'.ogg';
  }
  return hash;
}());

var sounds = loadSounds(soundHash, ready);

// requires context to exist in global scope
var playSound =  function (buffer, at) {
  at = at || 0;
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.noteOn(at);                         // play the source at time 'a'
};

var keyMap = {
  49:  1, // 1 2 3 4
  50:  2,
  51:  3,
  52:  4,
  81:  5, // q w e r
  87:  6,
  69:  7,
  82:  8,
  65:  9, // a s d f
  83: 10,
  68: 11,
  70: 12,
  89: 13, // y x c v
  90: 13, // z
  88: 14,
  67: 15,
  86: 16
};

// requires keyMap, playSound and highlightKey in globel scope
document.addEventListener('keydown', function (e) {
  if (keyMap[e.keyCode]) {
    playSound(sounds['woody'+ keyMap[e.keyCode]]);
    highlightKey(keyMap, e.keyCode);
  }
});

// requires context and playSound to exist in global scope
var playSequence = function (sequence, tempo, bars, beats) {
  tempo = tempo || 180; // BPM (beats per minute)
  bars = bars || 1;
  beats = beats || 8;

  var eighthNoteTime = (60 / tempo) / 2;

  // delayed start
  var startTime = context.currentTime + 0.100;

  // Play x bars of the sequence:
  for (var bar = 0; bar < bars; bar++) {
    var time = startTime + bar * beats * eighthNoteTime;
    sequence.forEach(function (track) {
      track.beats.forEach( function (hit, i) {
        if (hit) {
          playSound(track.sound, i * eighthNoteTime + time);
        }
      });
    });
  }
};

var sequentialize = function (tracks, samples) {
  var sequence = [];
  for (instrument in tracks) {
    sequence.push({
      sound: samples[instrument],
      beats: tracks[instrument]
     });
  }
  return sequence;
};

// requires playSequence and sequentialize to exist in global scope
var play = function (tracks, samples, tempo, bars, beats) {
  var maxBeats = 0;
  if (!beats) {
    for (track in tracks) {
      if (tracks[track].length > maxBeats) {
        maxBeats = tracks[track].length;
      }
    }
    beats = maxBeats;
  }
  playSequence(sequentialize(tracks, samples), tempo, bars, beats);
};

var colours = [
  '',
  'yellow',
  'green',
  'blue',
  'red',
  'pink',
  'orange'
];

var nextColour =  function (colours, colour) {
  colour = colour || '';
  var index = colours.indexOf(colour) + 1;
  if (index < colours.length)
    return colours[index];
  else
   return colours[0];
};

// requires nextColour to exist in global scope
var highlightKey = function (keyMap, keyCode) {
  var key = keyMap[keyCode];
  var el = document.getElementById('key'+key);
  var currentColour = el.style.backgroundColor;
  el.style.backgroundColor =  nextColour(colours, currentColour);
};
