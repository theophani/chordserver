"use strict";

try {
  var context = new webkitAudioContext();
} catch (e) {
  var el = document.createElement('p');
  el.innerHTML = 'Sorry, your browser doesn\'t support this experiment. Try <a href="http://www.google.com/chrome">Chrome</a>.';
  document.body.appendChild(el);
}

var ready = function (sounds) {
  var chord = [sounds.e0, sounds.e1, sounds.e2, sounds.e3, sounds.e4];
  // allow the user to see the interface, indicating that they can play now
  document.body.className = 'loaded';
  document.querySelector('button').addEventListener('click', function () {
    playChord(chord);
  });
};

var frets = (function () {
  var hash = {};
  var permalinks = ["e0-2", "e1-1", "e2-2", "e3-2", "e4-2", "e5-2", "e6-2", "e7-2", "e8-2", "e9-2", "e10-2", "e11-wav"];

  permalinks.forEach( function (permalink, i) {
    hash['e' + i] = '/fronx/' + permalink + '/audio';
  });

  return hash;
}());

var sounds = loadSounds(frets, ready);

// requires context to exist in global scope
var playSound =  function (buffer, at) {
  at = at || 0;
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.noteOn(at);                         // play the source at time 'a'
};

// requires context and playSound to exist in global scope
var playChord = function (chord) {
  var delta = 0.020;
  var startTime = context.currentTime + 0.100;

  // play each string in chord
  chord.forEach(function (string, i) {
    playSound(string, i * delta + startTime);
  });
};


