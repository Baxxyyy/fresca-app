import { StatusBar } from 'expo-status-bar';

import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import getKey from '../Auth/getKey';

function LoginScreen({ navigation }) {

	return (
	<View style={styles.container}>
	<View style={styles.top}>
		  <Text style = {styles.title}> Fresca </Text>
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
				<Button 
				 mode="contained"
				 color="#fbffea"
				 style= {styles.button}
				 onPress = {() => {
				 	navigation.navigate('RegisterScreen')
				 }}
				 > Register
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
		marginBottom: 20,
	},
	loginButton: {
		justifyContent: 'center',
	}
});

export default LoginScreen;
	