// Controls.js

import React from 'react';
import { TextInput, Button, Select, RangeInput, CheckBox, RadioButtonGroup, Box, Text } from 'grommet';

function Controls({ uri, setUri, transposeStep, setTransposeStep, loadSong, downloadPdf, parsingStyle, setParsingStyle, halftoneStyle, setHalftoneStyle, simplify, setSimplify }) {
  return (
    <div className="controls">
      <TextInput value={uri} onChange={e => setUri(e.target.value)} />

      <Box className="box-1" pad="none">
        <Text>{`TRANSPOSE: ${transposeStep}`}</Text>
        <RangeInput
          style={{ minWidth: '200px' }}
          min={-12}
          max={12}
          step={1}
          value={transposeStep}
          onChange={e => setTransposeStep(parseInt(e.currentTarget.value, 10))}
        />
      </Box>

      <Box className="box-2" pad="none" style={{ flexDirection: 'row' }}>
        <Button primary onClick={loadSong} label="LOAD SONG" />
        <Button primary onClick={downloadPdf} label="DOWNLOAD PDF" />
      </Box>

      <Select
        options={['NORMAL', 'NORTHERN EUROPEAN', 'SOUTHERN EUROPEAN']}
        placeholder={'PARSING STYLE'}
        value={parsingStyle}
        onChange={({ option }) => setParsingStyle(option)}
      />

      <Box className="box-3" pad="none" style={{ flexDirection: 'row' }}>
        <RadioButtonGroup
          name="halftoneStyle"
          options={['SHARPS', 'FLATS']}
          value={halftoneStyle}
          onChange={e => setHalftoneStyle(e.currentTarget.value)}
        />

        <CheckBox
          label="SIMPLIFY"
          checked={simplify}
          onChange={e => setSimplify(e.target.checked)}
        />
      </Box>
    </div>
  );
}

export default Controls;
