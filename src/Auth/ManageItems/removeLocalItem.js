import AsyncStorage from '@react-native-async-storage/async-storage';

const removeLocalItem = async (key) => {
  try {
    return await AsyncStorage.removeItem(key)
  } catch(e) {
    // remove error
    return 0
  }
}

export default removeLocalItem;