const fs = require('fs');
const { Midi } = require('@tonejs/midi');

// Load your JSON file (replace with your actual path)
const json = JSON.parse(fs.readFileSync('chords.json', 'utf8'));

// Scale intervals (semitones from root)
const scaleIntervals = {
    'major': [0, 2, 4, 5, 7, 9, 11],      // W W H W W W H
    'minor': [0, 2, 3, 5, 7, 8, 10],      // W H W W H W W (Natural Minor)
    'mixolydian': [0, 2, 4, 5, 7, 9, 10], // W W H W W H W (Major with b7)
    'dorian': [0, 2, 3, 5, 7, 9, 10],     // Minor with natural 6
    'phrygian': [0, 1, 3, 5, 7, 8, 10],   // Minor with b2
    'lydian': [0, 2, 4, 6, 7, 9, 11],     // Major with #4
    'locrian': [0, 1, 3, 5, 6, 8, 10],    // Minor with b2 and b5
};

// Map numeric root (scale degree) to MIDI note numbers with mode awareness
const rootToMidi = (degree, tonic = 'C', mode = 'major') => {
    const chromaticScale = { 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11 };

    // Normalize tonic to uppercase and handle potential flat/sharp naming if needed
    // Simple lookup here; expanding chromaticScale handles common enharmonics
    const baseMidi = chromaticScale[tonic] !== undefined ? chromaticScale[tonic] : 0;

    // Get intervals for the requested mode, default to major if not found
    const intervals = scaleIntervals[mode.toLowerCase()] || scaleIntervals['major'];

    // Calculate the semitone offset for the given scale degree (1-based index)
    // Handle degrees > 7 (wrapping into next octaves)
    // Degree 1 -> index 0, Degree 8 -> index 0 (+12 semitones)
    const normalizedDegree = degree - 1;
    const octaveOffset = Math.floor(normalizedDegree / 7) * 12;
    const scaleIndex = normalizedDegree % 7;
    const degreeInterval = intervals[scaleIndex];

    return baseMidi + degreeInterval + octaveOffset + 60; // +60 for middle C range
};

// Simple minor/major chord mapping based on `type`
const chordTypeToIntervals = {
    5: [0, 4, 7],  // minor triad
    4: [0, 5, 7],  // major triad
    // add more types if needed
};

// Create a new MIDI
const midi = new Midi();
const track = midi.addTrack();

// Assume JSON uses beats as quarter notes
json.chords.forEach(chord => {
    if (!chord.isRest) {
        const keyInfo = json.keys?.[0] || { tonic: 'C', scale: 'major' };
        const rootNote = rootToMidi(chord.root, keyInfo.tonic, keyInfo.scale);
        const intervals = chordTypeToIntervals[chord.type] || [0, 5, 7];
        const startTime = (chord.beat - 1) / 2; // convert beat to seconds assuming 1 beat = 1 quarter
        const duration = chord.duration / 2;

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
