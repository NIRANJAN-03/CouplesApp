// Forever_Us/screens/registrations/components/RegistrationProgressBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function RegistrationProgressBar({ step, totalSteps = 6 }) {
  const percentage = `${(step / totalSteps) * 100}%`;

  return (
    <View style={styles.progressBar}>
      <View style={[styles.progressFilled, { width: percentage }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    width: 250,
    height: 6,
    backgroundColor: '#FADCE2',
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  progressFilled: {
    backgroundColor: '#FD5B71',
    height: '100%',
  },
});
