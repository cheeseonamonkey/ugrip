// Sheet.js

import React from 'react';

function Sheet({ artist, song, renderChords }) {
    return (
        <div className="sheet">
            <div className="artist">{artist}</div>
            <div className="song">{song}</div>
            <div className="chords" dangerouslySetInnerHTML={renderChords()}></div>
        </div>
    );
}

export default Sheet;
