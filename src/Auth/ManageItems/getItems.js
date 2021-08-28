import AsyncStorage from '@react-native-async-storage/async-storage';

const getItems = async () => {
   try {
    return await AsyncStorage.getItem('storedItems')
  } catch(e) {
    // error reading value
    console.log(e)
  }
}

export default getItems;