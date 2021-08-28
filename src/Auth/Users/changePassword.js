import hasAuth from '../hasAuth'
import getKey from '../getKey'
import storeItem from '../storeItem'

import AsyncStorage from '@react-native-async-storage/async-storage';


let ip = require('../ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/change/password/"
const changePassword = async (oldPass, newPass) => {
	let result;
	let token;
	let username;

	console.log("starting area")

	await getKey("username").then((value) => username = value).catch((err) => { result=false });
	await getKey("token").then((value) => token = value).catch((err) => { result=false });
	
	let auth;
	await hasAuth(username,token).then((value) => auth=value)

	if (auth == false || result == false) {
		result = false;
		return result;
	}

	console.log("Just before")

	await fetch(ip, {
		method: 'POST',
		headers: { 
		       'Accept': 'application/json',
		       'Content-Type': 'application/json' 
		       },
		body: JSON.stringify({
			username:username,
			token:token,
			oldPass:oldPass,
			newPass:newPass,})
		})
		.then((response) => response.json()) 
		.then((data) => {
			console.log("Data gotten")
			console.log("Data is:  ", data)
			data = JSON.parse(data)
			console.log(data, "Data is this")
			if (data == '1') {
				result = true
			} else {
				result = false
			}
		})
	.catch((err) => { console.log("ERROR: ",err); });
	return result;
}

export default changePassword;
