import React from 'react';

function ChordSheet({ artist, song, transposedChords }) {
    const renderChords = () => {
        let formattedChords = transposedChords;

        formattedChords = formattedChords.replace(/\[ch\]/g, '<b>');
        formattedChords = formattedChords.replace(/\[\/ch\]/g, '</b>');

        formattedChords = formattedChords.replace(/\[tab\]/g, '<div>');
        formattedChords = formattedChords.replace(/\[\/tab\]/g, '</div>');

        return { __html: formattedChords };
    };

    return (
        <div className="chord-sheet">
            <div className="artist">{artist}</div>
            <div className="song">{song}</div>
            <div className="chords" dangerouslySetInnerHTML={renderChords()}></div>
        </div>
    );
}

export default ChordSheet;
