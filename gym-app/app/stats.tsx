import { View, Text, StyleSheet } from 'react-native';

export default function ModalPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats here!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
});