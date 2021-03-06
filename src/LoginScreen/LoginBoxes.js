import { StatusBar } from 'expo-status-bar';

import React, {useState} from 'react';

import { StyleSheet, Text, View} from 'react-native';
import { TextInput, Button, IconButton, Snackbar} from 'react-native-paper';


import storeItem from '../Auth/storeItem';
import getNewItems from '../Auth/ManageItems/getNewItems';
import createDateList from '../Auth/DateManage/createDateList';
import getEmail from '../Auth/Users/getEmail';

import axios from 'axios';

let ip = require('../Auth/ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/login/"

function LoginBoxes({ navigation }) {

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const [snackVisible, setSnackVisible] = useState(false)
	const [snackState, setSnackState] = useState("")


	const handleNav = async (navigation, token) => {
		await storeItem(token, "token")
		await storeItem(username, "username")
		await getEmail();
		await getNewItems();
		await createDateList();
		navigation.navigate("HomeScreen")
	}


	const handleLogin = async (navigation) => {
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
			data = JSON.parse(data)
			if (data[0] == "1") {
				handleNav(navigation, data[1])
			} else {
				setPassword("")
				setSnackState("Username/Password invalid, please try again.")
				setSnackVisible(true)
			}
		})
		.catch((err) => { console.log(err); });
	}

	const onDismissSnack = () => {
		setSnackVisible(false)
		setSnackState("")
	}

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<IconButton
					icon={require("../../assets/arrow-top-left.png")}
					size={30}
					onPress={() => navigation.goBack()}
				/>
			  <Text style = {styles.title}> Login </Text>
			</View>
			<View style={styles.box}>
				<TextInput
					theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
					label="Username"
					style={styles.input}
					mode='outlined'
					onChangeText={(value) => {setUsername(value)}}
				/>
				<TextInput
					theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
					secureTextEntry={true}
					label="Password"
					style={styles.input}
					mode='outlined'
					onChangeText={(value) => {setPassword(value)}}
					value={password}
				/>
				<Button
					color="#fbffea"
					style={styles.button}
					mode="contained"
					onPress={() => handleLogin(navigation)}
				> Submit
				</Button>
			</View>
			<Snackbar
				visible={snackVisible}
				onDismiss={onDismissSnack}
				duration={1500}
				action={{
					label: 'Dismiss',
					onPress: () => {
						setSnackVisible(false)
					},
				}}
			> {snackState}
			</Snackbar>
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
