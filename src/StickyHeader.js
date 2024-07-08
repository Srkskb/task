import React from 'react';
import { View, Text, Animated } from 'react-native';

const StickyHeader = ({ scrollY }) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [100, 50],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ height: headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', position: 'absolute', top: 0, left: 0, right: 0 }}>
      <Text>Sticky Header</Text>
    </Animated.View>
  );
};

export default StickyHeader;
