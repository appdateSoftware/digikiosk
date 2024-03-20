import React from 'react';
;
import {View,  } from 'react-native';

const Loading = ({ItemComponent, count=10, pad=12, containerStyle={}}) => {
  let results = [];
  for (let i = 0; i < count; i++) {
    results.push(
      <ItemComponent key={i} style={i !== count - 1 && {marginBottom: pad}} />,
    );
  }
  return <View style={containerStyle}>{results.map(data => data)}</View>;
}

export default Loading;
