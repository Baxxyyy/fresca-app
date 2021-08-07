import AsyncStorage from '@react-native-async-storage/async-storage';

const getMyStringValue = async (key) => {
  try {
    return await AsyncStorage.getItem(key)
  } catch(e) {
    console.log(e)
  }
}

export default getMyStringValue;