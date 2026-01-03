# JSON to MIDI Converter (Tone.js / Node.js)

This repository contains a Node.js script that converts a Tone.js-style JSON chord/scale project into a **MIDI file**. It uses `@tonejs/midi` to generate the MIDI and `fs` to handle file reading/writing.

---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/json-to-midi.git
cd json-to-midi
```

2. Install dependencies:

```bash
npm install @tonejs/midi
```

`@tonejs/midi` is used to generate MIDI files. `fs` is Node's built-in filesystem module for reading/writing files.

---

## 📝 Files

* **`json-to-midi.js`** — Main Node.js script. Reads a JSON file (`chords.json`) containing chords and keys, and outputs `output.mid`.
* **`chords.json`** — Example JSON input (Tone.js-style) with the following structure:

```json
{
  "chords": [
    {"root":1,"beat":1,"duration":8,"type":5,"inversion":0,"isRest":false},
    {"root":5,"beat":9,"duration":8,"type":5,"inversion":0,"isRest":false}
  ],
  "keys": [{"beat":1,"scale":"minor","tonic":"G"}],
  "fp": "9e2a1f6f2225f56537bd2cb5cd1adbb44c4b4108"
}
```

* **`output.mid`** — Generated MIDI file (created after running the script).

---

## ⚡ Usage

1. Place your Tone.js-style JSON in `chords.json`.
2. Run the script:

```bash
node json-to-midi.js
```

3. Check the folder — `output.mid` will be generated. You can open it in any DAW or MIDI player.

---

## ⚙️ How it works

* **Root conversion:** Converts numeric chord roots to MIDI pitches, relative to the key tonic.
* **Chord types:** Supports basic minor (`type: 5`) and major (`type: 4`) chords. Other types can be added in `chordTypeToIntervals`.
* **Timing:** Beats in the JSON are converted to MIDI time (quarter note = 1 beat).
* **Octave:** Chords are placed around middle C (+60 in MIDI note numbers).

---

## 🔧 Customization

* Adjust `rootToMidi` to change octave or mapping.
* Expand `chordTypeToIntervals` for 7th, 9th, suspended, or altered chords.
* Modify beat-to-time conversion if your project uses a different tempo.

---

## 💻 Requirements

* Node.js >= 14
* npm
* `@tonejs/midi`
* `fs` (built-in)

---

## 📜 License

MIT License