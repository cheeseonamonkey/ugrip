import React, { useState, useCallback, useEffect } from 'react';
import { parse, transpose, prettyPrint } from 'chord-magic';
import generatePDF from './lib/generate-pdf';
import Controls from './components/Controls';
import Sheet from './components/Sheet';
import { formatChords, findInObject } from './utils/utils';
import './App.css';

const corsURI = process.env.REACT_APP_CORS_SERVER;

function App() {
  const [uri, setUri] = useState(
    'https://tabs.ultimate-guitar.com/tab/hillsong-united/heart-of-worship-chords-1012850'
  );

  const [chords, setChords] = useState('paste a ultimate-guitar.com link and press `Load Song`..');
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');

  const [parsingStyle, setParsingStyle] = useState(undefined);
  const [halftoneStyle, setHalftoneStyle] = useState('FLATS');
  const [simplify, setSimplify] = useState(false);

  const [transposeStep, setTransposeStep] = useState(0);
  const [transposedChords, setTransposedChords] = useState(chords);

  const renderChords = useCallback(() => formatChords(transposedChords), [transposedChords]);
  const downloadPdf = useCallback(() => generatePDF(artist, song, transposedChords), [
    artist,
    song,
    transposedChords
  ]);

  const loadSong = useCallback(() => {
    fetch(`${corsURI}${uri}`)
      .then(res => res.text())
      .then(text => {
        const div = document.createElement('div');
        div.innerHTML = text;

        const [store] = div.getElementsByClassName('js-store');
        const storeJson = store.getAttribute('data-content');

        const storeData = JSON.parse(storeJson);

        const [parsedSongName] = findInObject(storeData, 'song_name');
        const [parsedArtistName] = findInObject(storeData, 'artist_name');
        const [parsedChords] = findInObject(storeData, 'content');

        setArtist(parsedArtistName);
        setSong(parsedSongName);
        setChords(parsedChords);
      });
  }, [uri]);

  useEffect(() => {
    const parseOptions = {};

    let transChords = chords.split(/\[ch\]|\[\/ch\]/g);
    let regex = [];

    switch (parsingStyle) {
      case 'NORTHERN EUROPEAN':
        parseOptions.naming = 'NorthernEuropean';
        break;

      case 'SOUTHERN EUROPEAN':
        parseOptions.naming = 'SouthernEuropean';
        break;

      case 'NORMAL':
      default:
        break;
    }

    for (let i = 1; i <= transChords.length; i += 2) {
      const chord = transChords[i];

      if (chord) {
        try {
          let tones = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

          if (halftoneStyle === 'FLATS') {
            tones = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];
          }

          const parsedChord = parse(chord, parseOptions);
          const transChord = transpose(parsedChord, transposeStep);

          if (simplify) {
            delete transChord.extended;
            delete transChord.suspended;
            delete transChord.added;
            delete transChord.overridingRoot;
          }

          const prettyChord = prettyPrint(parsedChord, { naming: tones });
          const prettyTransChord = prettyPrint(transChord, { naming: tones });

          const chordsDiff = prettyTransChord.length - prettyChord.length;
          const chordsDiffPos = Math.abs(chordsDiff);

          const replacer = chordsDiff >= 0 ? '-'.repeat(chordsDiff) : ' '.repeat(chordsDiffPos);

          transChords[i] = `[ch]${prettyTransChord}[/ch]`;
          transChords[i] += replacer;

          if (chordsDiff >= 0) {
            regex.push(replacer + ' '.repeat(chordsDiff));
          }
        } catch (error) {
          console.info('failed to transpose', chord);
        }
      }
    }

    regex = regex.filter(r => r.length > 1);
    regex = [...new Set(regex)];

    transChords = transChords
      .join('')
      .replace(new RegExp(regex.join('|'), 'gm'), '')
      .replace(new RegExp('-+(\\n|\\r|\\S)', 'gm'), '$1')
      .replace(/\[\/ch\]\s\[ch\]/g, '[/ch]  [ch]')
      .replace(/\[\/ch\]\[ch\]/g, '[/ch] [ch]')
      .replace(/\[\/ch\](\w)/g, '[/ch] $1');

    setTransposedChords(transChords);
  }, [transposeStep, chords, parsingStyle, halftoneStyle, simplify]);

  return (
    <>
      <Controls
        uri={uri}
        setUri={setUri}
        transposeStep={transposeStep}
        setTransposeStep={setTransposeStep}
        loadSong={loadSong}
        downloadPdf={downloadPdf}
        parsingStyle={parsingStyle}
        setParsingStyle={setParsingStyle}
        halftoneStyle={halftoneStyle}
        setHalftoneStyle={setHalftoneStyle}
        simplify={simplify}
        setSimplify={setSimplify}
      />

      <Sheet artist={artist} song={song} renderChords={renderChords} />
    </>
  );
}

export default App;
