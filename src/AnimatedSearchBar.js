// import React, { useState, useRef } from 'react';
// import { View, TextInput, Animated } from 'react-native';

// const AnimatedSearchBar = () => {
//   const [isFocused, setIsFocused] = useState(false);
//   const placeholderAnim = useRef(new Animated.Value(0)).current;

//   const handleFocus = () => {
//     setIsFocused(true);
//     Animated.timing(placeholderAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//     Animated.timing(placeholderAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   };

//   return (
//     <View style={{ padding: 10 }}>
//       <TextInput
//         style={{ borderColor: 'grey', borderWidth: 1, borderRadius: 5, padding: 10, }}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         placeholder="Search..."
//         placeholderTextColor="#000"
//       />
//     </View>
//   );
// };

// export default AnimatedSearchBar;

import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';

const AnimatedSearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const placeholderAnim = useRef(new Animated.Value(0)).current;
  const [placeholderText, setPlaceholderText] = useState('Search...');
  const placeholderTexts = ['Search here...', 'Type here...', 'Look for...', 'Find Something ...'];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomText = placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)];
      setPlaceholderText(randomText);
      Animated.sequence([
        Animated.timing(placeholderAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(placeholderAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholderAnim]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const translateY = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      {!isFocused && (
        <Animated.View style={[styles.placeholderContainer, { transform: [{ translateY }] }]}>
          <Animated.Text style={styles.placeholderText}>{placeholderText}</Animated.Text>
        </Animated.View>
      )}
      <TextInput
        style={styles.textInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // placeholder={isFocused ? '' : placeholderText}
        // placeholderTextColor="#000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: 'relative',
  },
  placeholderContainer: {
    position: 'absolute',
    left: 15,
    top: 30,
  },
  placeholderText: {
    color: 'grey',
  },
  textInput: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    paddingLeft: 15,
  },
});

export default AnimatedSearchBar;

