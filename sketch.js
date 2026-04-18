let silhouettes = [];
let silhouetteImgs = [];
let bursts = []; 
let cols = 4; 
let rows = 3;
let typeCounter = 0;
let instruments = [
    "accordion", "acoustic_bass", "acoustic_grand_piano", "acoustic_guitar_nylon", 
    "acoustic_guitar_steel", "agogo", "alto_sax", "applause", "bagpipe", "banjo", 
    "baritone_sax", "bassoon", "bird_tweet", "blown_bottle", "brass_section", 
    "breath_noise", "bright_acoustic_piano", "celesta", "cello", "choir_aahs", 
    "church_organ", "clarinet", "clavinet", "contrabass", "distortion_guitar", 
    "drawbar_organ", "dulcimer", "electric_bass_finger", "electric_bass_pick", 
    "electric_grand_piano", "electric_guitar_clean", "electric_guitar_jazz", 
    "electric_guitar_muted", "electric_piano_1", "electric_piano_2", "english_horn", 
    "fiddle", "flute", "french_horn", "fretless_bass", "fx_1_rain", "fx_2_soundtrack", 
    "fx_3_crystal", "fx_4_atmosphere", "fx_5_brightness", "fx_6_goblins", "fx_7_echoes", 
    "fx_8_scifi", "glockenspiel", "guitar_fret_noise", "guitar_harmonics", "gunshot", 
    "harmonica", "harpsichord", "helicopter", "honkytonk_piano", "kalimba", "koto", 
    "lead_1_square", "lead_2_sawtooth", "lead_3_calliope", "lead_4_chiff", 
    "lead_5_charang", "lead_6_voice", "lead_7_fifths", "lead_8_bass__lead", 
    "marimba", "melodic_tom", "music_box", "muted_trumpet", "oboe", "ocarina", 
    "orchestra_hit", "orchestral_harp", "overdriven_guitar", "pad_1_new_age", 
    "pad_2_warm", "pad_3_polysynth", "pad_4_choir", "pad_5_bowed", "pad_6_metallic", 
    "pad_7_halo", "pad_8_sweep", "pan_flute", "percussive_organ", "piccolo", 
    "pizzicato_strings", "recorder", "reed_organ", "reverse_cymbal", "rock_organ", 
    "seashore", "shakuhachi", "shamisen", "shanai", "sitar", "slap_bass_1", 
    "slap_bass_2", "soprano_sax", "steel_drums", "string_ensemble_1", "string_ensemble_2", 
    "synth_bass_1", "synth_bass_2", "synth_brass_1", "synth_brass_2", "synth_choir", 
    "synth_drum", "synth_strings_1", "synth_strings_2", "taiko_drum", "tango_accordion", 
    "telephone_ring", "tenor_sax", "timpani", "tinkle_bell", "tremolo_strings", 
    "trombone", "trumpet", "tuba", "tubular_bells", "vibraphone", "viola", 
    "violin", "voice_oohs", "whistle", "woodblock", "xylophone"
];
let currentInstrument = "electric_piano_1";
let pitchesAll = [
    "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3",
    "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4",
    "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5",
    "C6"
];

let pitchesNorm = [
    "C3", "D3", "E3", "F3", "G3", "A3", "B3",
    "C4", "D4", "E4", "F4", "G4", "A4", "B4",
    "C5", "D5", "E5", "F5", "G5", "A5", "B5",
    "C6"
];

let activePitches = pitchesNorm;

let palette = [
    '#00FFFF', '#FF00FF', '#00FF00', '#FFFF00', // Original Neons
    '#FF4500', '#1E90FF', '#FF1493', '#8A2BE2', // Bright Oranges/Blues/Pinks
    '#ADFF2F', '#FFD700', '#00FA9A', '#DC143C', // Lime, Gold, Seafoam, Crimson
    '#00BFFF', '#F0E68C', '#EE82EE'             // Sky Blue, Khaki, Violet
];


// Sound Variables for the 5 notes
let pianoA, pianoC, pianoD, pianoE, pianoG;
let sequenceIndex = 0; // Tracks which note of the 18 to play

function preload() {
    // 1. Load the 12 Grid Images
    for (let i = 0; i < 12; i++) {
        silhouetteImgs.push(loadImage(`cell${i}.png`));
    }
    
    // 2. Fetch the Electric Piano MP3s directly from GitHub
    let baseURL = "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/master/FluidR3_GM/electric_piano_1-mp3/";
    
    pianoA = loadSound(baseURL + "A4.mp3");
    pianoC = loadSound(baseURL + "C4.mp3");
    pianoD = loadSound(baseURL + "D4.mp3");
    pianoE = loadSound(baseURL + "E4.mp3");
    pianoG = loadSound(baseURL + "G4.mp3");
}

function setup() {
    let container = select('#canvas-container');
    let canvas = createCanvas(container.width, container.height);
    canvas.parent('canvas-container');

    let txtBox = select('#user-input');
    txtBox.input(onTyping);

    initializeGrid();
}

function initializeGrid() {
    silhouettes = []; 
    let cellW = width / cols;
    let cellH = height / rows;
    
    // Using your specific colors from the Canva screenshot
    let colors = ['#8B0000', '#FBC02D', '#7B9C6A']; 

    let imgIndex = 0;
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            silhouettes.push({
                x: i * cellW,
                y: j * cellH,
                w: cellW,
                h: cellH,
                isBroken: false,
                bgColor: colors[(i + j) % colors.length],
                img: silhouetteImgs[imgIndex]
            });
            imgIndex++;
        }
    }
}

function draw() {
    background(0);

    for (let s of silhouettes) {
        noStroke();
        fill(s.isBroken ? 255 : s.bgColor); 
        rect(s.x, s.y, s.w, s.h);

        if (!s.isBroken) {
            let imgRatio = s.img.width / s.img.height;
            let renderW = s.w * 0.85; 
            let renderH = renderW / imgRatio;
            
            if (renderH > s.h * 0.85) {
                renderH = s.h * 0.85;
                renderW = renderH * imgRatio;
            }

            image(s.img, s.x + (s.w - renderW)/2, s.y + (s.h - renderH)/2, renderW, renderH);
        }
    }

    for (let b of bursts) {
        fill(b.color);
        for (let p of b.parts) {
            rect(b.x + p.dx, b.y + p.dy, p.w, p.h);
        }
    }
}

function onTyping() {
    // 1. FILTER (Same as before)
    if (key === ' ' || keyCode === BACKSPACE || keyCode === ENTER) return; 

    // 2. GRID & BURST LOGIC (Keep your current code here)
    let remaining = silhouettes.filter(s => !s.isBroken);
    if (remaining.length > 0) random(remaining).isBroken = true;

    // 3. VISUAL BURST LOGIC

    let newBurst = {
        x: random(width),
        y: random(height),
        color: color(random(palette)),
        parts: []
    };

    for(let i = 0; i < 20; i++) { 
        newBurst.parts.push({
            dx: random(-150, 150), 
            dy: random(-150, 150),
            w: random(50, 150),    
            h: random(10, 40)      
        });
    }
    bursts.push(newBurst);

    // 3. SOUND PHASE LOGIC
    if (typeCounter < 18) {
        // PHASE 1: The Riff
        triggerPolyphonicRiff(typeCounter); 
    } else {
        // PHASE 2: Discovery
        
        // Every 25 characters, toggle the pitch array
        // (typeCounter - 18) starts the count from the moment Phase 2 begins
        if ((typeCounter - 18) % 25 === 0) {
            if (activePitches === pitchesNorm) {
                activePitches = pitchesAll;
                console.log("Switching to: CHROMATIC (Experimental)");
            } else {
                activePitches = pitchesNorm;
                console.log("Switching to: DIATONIC (Structured)");
            }
        }

        currentInstrument = random(instruments);
        playRandomNoteFromLibrary(currentInstrument);
    }

    typeCounter++;
}

// 4. Update the Helper Function
function playRandomNoteFromLibrary(inst) {
    // Now pulls from whichever array is currently "active"
    let randomPitch = random(activePitches); 
    
    let noteURL = `https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/master/FluidR3_GM/${inst}-mp3/${randomPitch}.mp3`;
    
    let tempSound = loadSound(noteURL, () => {
        tempSound.play();
    });
}

function triggerPolyphonicRiff(index) {
    // Stop all notes to keep it staccato-like
    [pianoA, pianoC, pianoD, pianoE, pianoG].forEach(n => n.stop());

    // 18 note sequence
    let sequence = [
        [pianoD, pianoA], [pianoD, pianoA], [pianoD, pianoA], [pianoD, pianoA], // 0,1,2,3 -> 4x (D+A)
        [pianoC, pianoG], [pianoC, pianoG],                                     // 4,5 -> 2x (C+G)
        [pianoA, pianoE], [pianoA, pianoE],                                     // 6,7 -> 2x (A+E)
        [pianoC, pianoG],                                                       // 8 -> 1x (C+G)
        [pianoD, pianoA], [pianoD, pianoA], [pianoD, pianoA], [pianoD, pianoA], // 0,1,2,3 -> 4x (D+A)
        [pianoC, pianoG], [pianoC, pianoG],                                     // 4,5 -> 2x (C+G)
        [pianoA, pianoE], [pianoA, pianoE],                                     // 6,7 -> 2x (A+E)
        [pianoC, pianoG],     
    ];

    // Play the notes for the current keystroke
    let currentStep = sequence[index];
    
    // for debug
    console.log("Keystroke:", index, "playing step:", currentStep);

    if (currentStep) {
        currentStep.forEach(note => {
            if (note && note.isLoaded()) {
                note.play();
            }
        });
    }
}

// Fetches a random pitch from a random instrument folder
function playRandomNoteFromLibrary(inst) {
    let randomPitch = random(activePitches);
    
    // Construct the URL on the fly
    let noteURL = `https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/master/FluidR3_GM/${inst}-mp3/${randomPitch}.mp3`;
    
    // Load and play immediately (requires Live Server to work!)
    let tempSound = loadSound(noteURL, () => {
        tempSound.play();
    });
}

function windowResized() {
    let container = select('#canvas-container');
    resizeCanvas(container.width, container.height);
}