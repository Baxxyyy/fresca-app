import { StatusBar } from 'expo-status-bar';

import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import hasAuth from '../Auth/hasAuth';
import getKey from '../Auth/getKey';

import getEmail from '../Auth/Users/getEmail';
import getNewItems from '../Auth/ManageItems/getNewItems';
import createDateList from '../Auth/DateManage/createDateList';

const fetchThings = async (navigation) => {
	await getEmail();
	await getNewItems();
	await createDateList();
	navigation.navigate('HomeScreen')
}

const checkToken = async (navigation) => {
	let token;
	let username;
	await getKey("token").then((value) => token = value).catch((err) => { console.log(err); });
	await getKey("username").then((value) => username = value).catch((err) => { console.log(err); });

	await hasAuth(username,token)
	.then((value) => {
		if (value) {
			try {
				fetchThings(navigation)
   	  } catch (error) {
   	  	console.log(error)
      }	
		} else {
			try {
     	  navigation.navigate('LoginScreen')
   	  } catch (error) {
   	  	console.log(error)
      }
		}
	})
	.catch((err) => { console.log(err) });
}

function SplashScreen({ navigation }) {

	React.useEffect(() => {
    const refresh = navigation.addListener('focus', () => {
      checkToken(navigation)
    });

    return refresh;
  }, [navigation]);

	

	return (
		<View style={styles.container}>
			<View style={styles.loading}>
				<Text style={styles.title}>Food App</Text>
				<ActivityIndicator animating={true} color={"black"} size = {"large"}/>
				<StatusBar style="light" backgroundColor="black" />
			</View>
		</View>
		)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97ecb3',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    borderWidth: 5,
    borderColor: 'black',
    flexDirection: 'column',
  },
  title: {
    fontSize: 50,
	},
	loading: {
		display: "flex",
		flexDirection: "column",
		justifyContent:"center",
		alignItems: "center",
		width:"95%",
		flex: 0.35,
		backgroundColor:"white",
		borderColor: "black",
		borderWidth: 5,
		borderRadius: 10,
	},
});

export default SplashScreen