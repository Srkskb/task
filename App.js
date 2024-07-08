import React, { useState, useEffect, useRef } from 'react';
import { View, Button, ActivityIndicator, ScrollView, Image, Dimensions, Animated, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import ImageViewer from './src/ImageViewer';
import StickyHeader from './src/StickyHeader';
import AnimatedSearchBar from './src/AnimatedSearchBar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const likesAnim = useRef(new Animated.Value(0)).current; // Animated value for likes
  const viewsAnim = useRef(new Animated.Value(0)).current; // Animated value for views
  const likesTranslateY = useRef(new Animated.Value(0)).current; // TranslateY animation for likes
  const viewsTranslateY = useRef(new Animated.Value(0)).current; // TranslateY animation for views

  useEffect(() => {
    const interval = setInterval(() => {
      setLikes((prevLikes) => {
        Animated.sequence([
          Animated.timing(likesTranslateY, {
            toValue: -20,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(likesTranslateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();

        Animated.timing(likesAnim, {
          toValue: prevLikes + 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
        return prevLikes + 1;
      });

      setViews((prevViews) => {
        Animated.sequence([
          Animated.timing(viewsTranslateY, {
            toValue: -20,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(viewsTranslateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();

        Animated.timing(viewsAnim, {
          toValue: prevViews + 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
        return prevViews + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleButtonPress = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toggleModal();
    }, 2000);
  };

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.5, duration: 300, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    toggleModal();
  };

  const images = [
    'https://picsum.photos/536/354',
    'https://picsum.photos/536/352',
    'https://picsum.photos/536/354',
  ];

  const animatedLikes = likesAnim.interpolate({
    inputRange: [0, likes],
    outputRange: [0, likes],
    extrapolate: 'clamp'
  });

  const animatedViews = viewsAnim.interpolate({
    inputRange: [0, views],
    outputRange: [0, views],
    extrapolate: 'clamp'
  });

  return (
    <View style={{ flex: 1 }}>
      <StickyHeader scrollY={scrollY} />
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ height: 1000 }}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }], margin: 20 }}>
            <Button title="Accept Free Trial" onPress={handleButtonPress} />
            {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
          </Animated.View>
          <AnimatedSearchBar />
          <Animated.View style={{ transform: [{ scale: scaleAnim }], margin: 20 }}>
            <Button title="Show Modal" onPress={toggleModal} />
          </Animated.View>
          <ScrollView horizontal pagingEnabled style={{ marginVertical: 20 }}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                resizeMode="contain"
                style={{ width: 300, height: 300 }}
              />
            ))}
          </ScrollView>
          <Image source={{ uri: 'https://picsum.photos/536/354' }} style={{ width: 300, height: 300, resizeMode: 'contain' }} />
        </View>
      </Animated.ScrollView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        style={{
          margin: 50,
          marginVertical: 50,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: 'white',
        }}
        onSwipeComplete={closeModal}
        swipeDirection="down"
      >
        <View style={{ backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', height: 300, flexDirection: 'row', padding: 20 }}>
          <Animated.View style={{ transform: [{ translateY: likesTranslateY }] }}>
            <Animated.Text>Likes: {animatedLikes}</Animated.Text>
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: viewsTranslateY }] }}>
            <Animated.Text>Views: {animatedViews}</Animated.Text>
          </Animated.View>
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  const handleTabPress = () => {
    RNReactNativeHapticFeedback.trigger('selection', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => { handleTabPress(); props.onPress(); }} />
          ),
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;




// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';

// const App = () => {
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const myHeaders = new Headers();
//     myHeaders.append("Authentication", "");
//     myHeaders.append("MerchantId", "B6EF3D74-0017-47D7-B4AA-EB36D6F083EA");
//     myHeaders.append("TerminalId", "1B21F0D0-EF77-4997-A5FB-17A9E021DA6C");
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       "VendorCheckoutPayment": {
//         "RequestID": "123456789",
//         "BuyerInfo": {
//           "BuyerCode": "B0111",
//           "CompanyName": "SuperNet",
//           "EmailAddress": "abc@abc.com"
//         },
//         "TransactionDetails": {
//           "OrderID": "987612345005",
//           "PaymentMode": "CreditCard",
//           "CurrencyCode": "AED",
//           "TransctionAmount": 2000,
//           "PaymentType": "GDI"
//         }
//       }
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow"
//     };

//     fetch("https://uatuae.paymateb2b.com/PartnerAPI/v1/CheckoutPayment", requestOptions)
//       .then(response => response.json())
//       .then(result =>{ setResponse(result)
//          console.log("response","check the response which comes from api" ,JSON.stringify(result))
//       })
     
//       .catch(error => setError('Error: ' + error));
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>API Response</Text>
//       <ScrollView style={styles.scrollView}>
//         {error ? (
//           <Text style={styles.errorText}>{error}</Text>
//         ) : (
//           response ? (
//             <Text style={styles.responseText}>{JSON.stringify(response, null, 2)}</Text>
//           ) : (
//             <Text style={styles.loadingText}>Loading...</Text>
//           )
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#ffffff'
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#343a40'
//   },
//   scrollView: {
//     marginHorizontal: 20,
//   },
//   responseText: {
//     fontSize: 16,
//     color: '#495057'
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#6c757d',
//     textAlign: 'center',
//     marginTop: 20
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginTop: 20
//   }
// });

// export default App;



// import React, { useState, useEffect, useRef } from 'react';
// import { View, Button, ActivityIndicator, ScrollView, Image, Dimensions, Animated, Text, TouchableOpacity, PanResponder } from 'react-native';
// import Modal from 'react-native-modal';
// import ImageViewer from './src/ImageViewer';
// import StickyHeader from './src/StickyHeader';
// import AnimatedSearchBar from './src/AnimatedSearchBar';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

// const { width, height } = Dimensions.get('window');

// const HomeScreen = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [likes, setLikes] = useState(0);
//   const [views, setViews] = useState(0);
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const translateY = useRef(new Animated.Value(height)).current; // Start modal off-screen

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > 5;
//       },
//       onPanResponderMove: Animated.event(
//         [null, { dy: translateY }],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           closeModal();
//         } else {
//           Animated.spring(translateY, {
//             toValue: height / 2,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLikes(likes + 1);
//       setViews(views + 1);
//     }, 30000);
//     return () => clearInterval(interval);
//   }, [likes, views]);

//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//     if (!isModalVisible) {
//       Animated.spring(translateY, {
//         toValue: height / 2,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   const handleButtonPress = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       toggleModal();
//     }, 2000);
//   };

//   const closeModal = () => {
//     Animated.timing(translateY, {
//       toValue: height,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => setModalVisible(false));
//   };

//   const images = [
//     'https://picsum.photos/536/354',
//     'https://picsum.photos/536/352',
//     'https://picsum.photos/536/354',
//   ];

//   return (
//     <View style={{ flex: 1 }}>
//       <StickyHeader scrollY={scrollY} />
//       <Animated.ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingTop: 100 }}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//         scrollEventThrottle={16}
//       >
//         <View style={{ height: 1000 }}>
//           <Animated.View style={{ transform: [{ scale: scaleAnim }], margin: 20 }}>
//             <Button title="Accept Free Trial" onPress={handleButtonPress} />
//             {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
//           </Animated.View>
//           <AnimatedSearchBar />
//           <Button title="Show Modal" onPress={toggleModal} />
//           <ScrollView horizontal pagingEnabled style={{ marginVertical: 20 }}>
//             {images.map((image, index) => (
//               <Image
//                 key={index}
//                 source={{ uri: image }}
//                 resizeMode="contain"
//                 style={{ width: 300, height: 300 }}
//               />
//             ))}
//           </ScrollView>
//         </View>
//       </Animated.ScrollView>
//       <Modal
//         isVisible={isModalVisible}
//         style={{ margin: 0, justifyContent: 'flex-end' }}
//         animationIn="slideInUp"
//         animationOut="slideOutDown"
//         onBackdropPress={closeModal}
//         onSwipeComplete={closeModal}
//         swipeDirection="down"
//       >
//         <Animated.View
//           style={{
//             height: height / 2,
//             backgroundColor: 'white',
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//             transform: [{ translateY }],
//           }}
//           {...panResponder.panHandlers}
//         >
//           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Likes: {likes}</Text>
//             <Text>Views: {views}</Text>
//             <Button title="Close" onPress={closeModal} />
//           </View>
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// };

// const SettingsScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings Screen</Text>
//     </View>
//   );
// };

// const Tab = createBottomTabNavigator();

// const App = () => {
//   const handleTabPress = () => {
//     RNReactNativeHapticFeedback.trigger('selection', {
//       enableVibrateFallback: true,
//       ignoreAndroidSystemSettings: false,
//     });
//   };
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarButton: (props) => (
//             <TouchableOpacity
//               {...props}
//               onPress={() => { handleTabPress(); props.onPress(); }}
//             />
//           ),
//         }}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Profile" component={SettingsScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
