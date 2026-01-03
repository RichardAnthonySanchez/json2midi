const fs = require('fs');
const { Midi } = require('@tonejs/midi');

// Load your JSON file (replace with your actual path)
const json = JSON.parse(fs.readFileSync('chords.json', 'utf8'));

// Map numeric root to MIDI note numbers (C=0)
const rootToMidi = (root, tonic = 'G') => {
    const scaleMap = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
    const base = scaleMap[tonic] || 0;
    return (root - 1 + base) % 12 + 60; // +60 to put chords around middle C
};

// Simple minor/major chord mapping based on `type`
const chordTypeToIntervals = {
    5: [0, 3, 7],  // minor triad
    4: [0, 4, 7],  // major triad
    // add more types if needed
};

// Create a new MIDI
const midi = new Midi();
const track = midi.addTrack();

// Assume JSON uses beats as quarter notes
json.chords.forEach(chord => {
    if (!chord.isRest) {
        const rootNote = rootToMidi(chord.root, json.keys?.[0]?.tonic || 'C');
        const intervals = chordTypeToIntervals[chord.type] || [0, 3, 7];
        const startTime = (chord.beat - 1) / 4; // convert beat to seconds assuming 1 beat = 1 quarter
        const duration = chord.duration / 4;

        intervals.forEach(interval => {
            track.addNote({
                midi: rootNote + interval,
                time: startTime,
                duration
            });
        });
    }
});

// Write the MIDI file
fs.writeFileSync('output.mid', Buffer.from(midi.toArray()));
console.log('MIDI file created: output.mid');
