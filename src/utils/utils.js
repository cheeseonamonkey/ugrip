// utils.js

export function formatChords(chords) {
    let formattedChords = chords;

    formattedChords = formattedChords.replace(/\[ch\]/g, '<b>');
    formattedChords = formattedChords.replace(/\[\/ch\]/g, '</b>');

    formattedChords = formattedChords.replace(/\[tab\]/g, '<div>');
    formattedChords = formattedChords.replace(/\[\/tab\]/g, '</div>');

    return { __html: formattedChords };
}

export function findInObject(obj, key) {
    let objects = [];
    const keys = Object.keys(obj || {});

    for (let i = 0; i < keys.length; i += 1) {
        const _key = keys[i];
        if (Object.prototype.hasOwnProperty.call(obj, _key)) {
            if (typeof obj[_key] === 'object') {
                objects = [...objects, ...findInObject(obj[_key], key)];
            } else if (_key === key) {
                objects.push(obj[_key]);
            }
        }
    }

    return objects;
}
