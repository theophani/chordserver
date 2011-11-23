"use strict";

try {
  var context = new webkitAudioContext();
} catch (e) {
  var el = document.createElement('p');
  el.innerHTML = 'Sorry, your browser doesn\'t support this experiment. Try <a href="http://www.google.com/chrome">Chrome</a>.';
  document.body.appendChild(el);
}

var ready = function (sounds) {
  var chord = [sounds.g5, sounds.d2, sounds.a0, sounds.e0];
  // allow the user to see the interface, indicating that they can play now
  document.body.className = 'loaded';
  document.querySelector('button').addEventListener('click', function () {
    playChord(chord);
  });
};

var notes = {
  g5: '/fronx/g5-1/audio',
  d2: '/fronx/d2-1/audio',
  a0: '/fronx/a0-1/audio',
  e0: '/fronx/e0-2/audio'
};

var sounds = loadSounds(notes, ready);

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

var chordKey = window.location.hash;

var chordKeyToToneKeys = function(chordKey) {
  return chordKey           // #e0b1g2D2A0Ex--A_minor
    .replace('#', '')       // e0b1g2D2A0Ex--A_minor
    .split('--')[0]         // e0b1g2D2A0Ex
    .split(/([a-zA-Z]\d+)/) // ["", "e0", "", "b1", "", "g2", "", "D2", "", "A0", "Ex"]
    .filter(function(item){ // [e0", b1", g2", D2", A0"]
      return item.match(/([a-zA-Z]\d+)/);
    });
};

