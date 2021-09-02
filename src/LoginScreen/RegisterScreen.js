import { StatusBar } from 'expo-status-bar';

import React, {useState} from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button, IconButton, Snackbar } from 'react-native-paper';

import getKey from '../Auth/getKey';
import storeItem from '../Auth/storeItem';
import storeItems from '../Auth/storeItems';

import register from '../Auth/Users/register';
import getNewItems from '../Auth/ManageItems/getNewItems';
import createDateList from '../Auth/DateManage/createDateList';


const RegisterScreen = ({ navigation }) => {

	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordCon, setPasswordCon] = useState("")

	const [snackVisible, setSnackVisible] = useState(false)
	const [snackState, setSnackState] = useState("")


	const handleReg = async (navigation) => {
		await register(username,email,password,passwordCon)
		.then((res) => {
			if (res[0] == '1') {
				handleNav(navigation, res[1])
			} else {
				if (res == "Email is not valid") {
					setEmail("")
				} else if (res == "username taken") {
					setUsername("")
				}
				setPassword("")
				setPasswordCon("")
				setSnackState(res)
				setSnackVisible(true)
			}
		})
	}

	const handleNav = async (navigation, token) => {
		await storeItem(token, "token")
		await storeItem(username, "username")
		await storeItem(email, "email")
		await storeItems("storedItems", [])
		await storeItems("DateItems", [])
		navigation.navigate("HomeScreen")
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
			  <Text style = {styles.title}> Register </Text>
			</View>
			<View style={styles.box}>
				<TextInput
					theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
					label="Username"
					style={styles.input}
					mode='outlined'
					onChangeText={(value) => {setUsername(value)}}
					value={username}
				/>
				<TextInput
					theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
					label="Email"
					style={styles.input}
					mode='outlined'
					onChangeText={(value) => {setEmail(value)}}
					value={email}
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
				<TextInput
					theme={{ colors: { primary: 'black',underlineColor:'transparent',}}}
					secureTextEntry={true}
					label="Confirm password"
					style={styles.input}
					mode='outlined'
					onChangeText={(value) => {setPasswordCon(value)}}
					value={passwordCon}
				/>
				<Button
					color="#fbffea"
					style={styles.button}
					mode="contained"
					onPress={() => handleReg(navigation)}
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

export default RegisterScreen;