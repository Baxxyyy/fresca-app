import { StatusBar } from 'expo-status-bar';

import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import hasAuth from '../Auth/hasAuth';
import getKey from '../Auth/getKey';

const checkToken = async (navigation) => {
	let token;
	let username;
	await getKey("token").then((value) => token = value).catch((err) => { console.log(err); });
	await getKey("username").then((value) => username = value).catch((err) => { console.log(err); });
	console.log(token)
	console.log(username)

	await hasAuth(username,token)
	.then((value) => {
		if (value) {
			try {
     	  navigation.navigate('HomeScreen')
   	  } catch (error) {
      	console.log(error);
      }
		} else {
			
		}
	})
	.catch((err) => { console.log(err); });
}


function LoginScreen({ navigation }) {



	checkToken(navigation)

	return (
	<View style={styles.container}>
	<View style={styles.top}>
		  <Text style = {styles.title}> Food App </Text>
	</View>
		<View style={styles.bottom}>
		  <View style={styles.text}>
				<Text style = {{marginBottom: 20,fontSize: 30}}>Hello and welcome</Text>
				<Button 
				 mode="contained"
				 color="#fbffea"
				 style= {styles.button}
				 onPress = {() => {
				 	navigation.navigate('loginBox')
				 }}
				 > Login
				</Button>
			</View>
		</View>
		<StatusBar style="light" backgroundColor="black" />
	</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97ecb3',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    borderWidth: 5,
    borderColor: 'black',
  },
  title: {
    fontSize: 50,
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.25,
    width: '100%',
    display: 'flex',
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'black',
    marginBottom: 300,
  },
  bottom: {
    flex: 0.5,
    display: 'flex',
  },
  text: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	button: {
		borderWidth :2,
		borderColor: 'black',
	},
	loginButton: {
		justifyContent: 'center',
	}
});

export default LoginScreen;
	