import { StatusBar } from 'expo-status-bar';

import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

let ip = "http://46.137.133.17:8000/login/"      // aws ip
//let ip = "http://127.0.0.1:8000/login/"        // local ip

let setStringValue = async(key,value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch(e) {
    console.log(e)
  }
  console.log('Done.')
}

async function handleLogin(username,password,navigation) {
	await fetch(ip, {
  method: 'POST',
  headers: { 
           'Accept': 'application/json',
           'Content-Type': 'application/json' 
           },
  body: JSON.stringify({username:username,password:password})
	})
	.then((response) => response.json()) 
	.then((data) => {
		if (data[2] == "1") {
			setStringValue("token",data.substring(7,71))
			setStringValue("username",username)
			navigation.navigate("HomeScreen")
		}
	})
	.catch((err) => { console.log(err); });
}


function LoginBoxes({ navigation }) {

	var username = ""
	var password = ""

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<IconButton
					icon={require("../../assets/arrow-top-left.png")}
					size={30}
					onPress={() => navigation.goBack()}
				/>
			  <Text style = {styles.title}> Login Screen </Text>
			</View>
			<View style={styles.box}>
				<TextInput
					theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
					label="Username"
					style={styles.input}
					mode='outlined'
					onChangeText={(value) => {username = value}}
				/>
				<TextInput
					theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
					secureTextEntry={true}
					label="Password"
					style={styles.input}
					mode='outlined'
					onChangeText={(value) => {password = value}}
				/>
				<Button
					color="#fbffea"
					style={styles.button}
					mode="contained"
					onPress={() => handleLogin(username,password,navigation)}
				> Submit
				</Button>
			</View>
			<StatusBar style="light" backgroundColor="black" />
		</View>
	)	
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97ecb3',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    width: '100%',
    borderWidth: 5,
    borderColor: 'black',
    flexDirection: 'column',
  },
  input: {
  	backgroundColor: '#ffdead',
  	alignSelf: 'center',
  	width: '100%',
  	paddingHorizontal: 25,
  	height:60,
  	fontSize: 30,
  	color:"black",
  },
  box: {
  	justifyContent: 'space-evenly',
    flex: 0.5,
    width: '90%',
    display: 'flex',
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'black',
    marginBottom: 150,
    borderRadius: 10,
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
    marginBottom: 0,
    flexDirection: 'row',
  },
  button: {
		borderWidth :2,
		borderColor: 'black',
		alignSelf: 'center',
		color: 'white',
	},
	back: {
		height:100,
		marginBottom:10,
	}
});

export default LoginBoxes;
