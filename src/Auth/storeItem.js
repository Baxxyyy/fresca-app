import AsyncStorage from '@react-native-async-storage/async-storage';

const storeItem = async (value, key) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
    console.log("Error in storing item: ", e);
  }
}

export default storeItem