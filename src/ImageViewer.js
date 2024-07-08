import React, { useRef } from 'react';
import { View, Image, PanResponder, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const ImageViewer = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const boundX = (value) => Math.max(Math.min(value, width / 2), -width / 2);
  const boundY = (value) => Math.max(Math.min(value, height / 2), -height / 2);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newX = boundX(pan.x._value + gestureState.dx);
        const newY = boundY(pan.y._value + gestureState.dy);
        pan.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start();
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }]
        }}
      >
        <Image
          source={{ uri: 'https://picsum.photos/536/354' }}
          style={{ width, height }}
        />
      </Animated.View>
    </View>
  );
};

export default ImageViewer;
