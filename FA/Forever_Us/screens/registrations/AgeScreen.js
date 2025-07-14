import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RegistrationProgressBar from './components/RegistrationProgressBar';

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

export default function AgeScreen({ navigation, route }) {
  const { name, email, phone } = route.params || {};
  const [selectedAge, setSelectedAge] = useState(22);
  const [scrollIndex, setScrollIndex] = useState(selectedAge - 13);
  const flatListRef = useRef(null);

  const ages = Array.from({ length: 83 }, (_, i) => i + 13); // 13–95

  useEffect(() => {
    const index = selectedAge - 13;
    flatListRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: false,
    });
  }, []);

  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setScrollIndex(index);
  };

  const handleScrollEnd = () => {
    const finalAge = ages[scrollIndex] || 22;
    setSelectedAge(finalAge);
  };

  const handleContinue = () => {
    if (selectedAge < 13) {
      alert('You must be at least 13 years old.');
      return;
    }
    navigation.navigate('Gender', { name, email, phone, age: selectedAge });
  };

  return (
    <ImageBackground
      source={require('../../assets/Splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <View style={styles.progressWrapper}>
        <RegistrationProgressBar step={4} />
      </View>

      <Text style={styles.title}>How Old Are You?</Text>
      <Text style={styles.subtitle}>Please provide your age in years</Text>

      <View style={styles.wheelContainer}>
        <FlatList
          ref={flatListRef}
          data={ages}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={{
            paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
          }}
          renderItem={({ item, index }) => {
            const distance = Math.abs(index - scrollIndex);
            let fontSize = 20;
            let opacity = 0.3;
            let fontWeight = '400';

            if (distance === 0) {
              fontSize = 50;
              opacity = 1;
              fontWeight = '700';
            } else if (distance === 1) {
              fontSize = 32;
              opacity = 0.6;
              fontWeight = '500';
            }

            return (
              <View style={styles.item}>
                <Text style={{ fontSize, opacity, fontWeight, color: '#FD5B71' }}>
                  {item}
                </Text>
              </View>
            );
          }}
        />
        <View style={styles.indicatorLine} />
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: '#FFEFF1',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  progressWrapper: {
    marginBottom: 40,
    marginTop: -3,
    marginLeft: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  wheelContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    marginBottom: 40,
    position: 'relative',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorLine: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    height: ITEM_HEIGHT,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#FD5B71',
    left: 130,
    right: 130,
  },
  continueBtn: {
    backgroundColor: '#FD5B71',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
