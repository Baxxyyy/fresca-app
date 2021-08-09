import hasAuth from '../Auth/hasAuth'
import getKey from '../Auth/getKey'

import AsyncStorage from '@react-native-async-storage/async-storage';

let ip = "http://46.137.133.17:8000/add/"       // aws ip
// let ip = "http://127.0.0.1:8000/add/"        // local ip

const addItem = async (name,date) => {
	let result;
	let token;
	let username;

	if (name.trim() == '' || name == 'string') {
		result = false;
		return result;
	}

	
	await getKey("username").then((value) => username = value).catch((err) => { console.log(err); });
	await getKey("token").then((value) => token = value).catch((err) => { result=false });
	
	let auth;
	await hasAuth(username,token).then((value) => auth=value)

	if (auth == false) {
		result = false;
		return result;
	}

	await fetch(ip, {
		method: 'POST',
		headers: { 
		       'Accept': 'application/json',
		       'Content-Type': 'application/json' 
		       },
		body: JSON.stringify({token:token,name:name,date:date})
		})
		.then((response) => response.json()) 
		.then((data) => {
			console.log(data)
			if (data[1] == "1") {
				result=true;
			} else {
				result=false;
			}
		})
	.catch((err) => { console.log(err); });
	return result
}


export default addItem