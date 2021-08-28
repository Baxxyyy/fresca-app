import AsyncStorage from '@react-native-async-storage/async-storage';

const storeItems = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // saving error
    console.log(e);
  }
}

export default storeItems