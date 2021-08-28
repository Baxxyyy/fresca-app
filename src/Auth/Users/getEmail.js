import hasAuth from '../hasAuth'
import getKey from '../getKey'
import storeItem from '../storeItem'

import AsyncStorage from '@react-native-async-storage/async-storage';

let ip = require('../ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/email/"


const getEmail = async () => {
	let result;
	let token;
	let username;
	let email;

	await getKey("username").then((value) => username = value).catch((err) => { result=false });
	await getKey("token").then((value) => token = value).catch((err) => { result=false });
	
	let auth;
	await hasAuth(username,token).then((value) => auth=value)

	if (auth == false || result == false) {
		result = false;
		return result;
	}

	await fetch(ip, {
		method: 'POST',
		headers: { 
		       'Accept': 'application/json',
		       'Content-Type': 'application/json' 
		       },
		body: JSON.stringify({username:username,token:token})
		})
		.then((response) => response.json()) 
		.then((data) => {
			data = JSON.parse(data)
			if (data[0] != "0") {
				storeItem(data[1], "email")
				return true;
			} else {
				return false;
			}
		})
	.catch((err) => { console.log("ERROR: ",err); });
	return result;
}

export default getEmail;
