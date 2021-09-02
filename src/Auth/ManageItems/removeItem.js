// Deprecated - use add/remove local food instead and sync


// ------------===== DO NOT USE =====------------

import hasAuth from '../hasAuth'
import getKey from '../getKey'

import AsyncStorage from '@react-native-async-storage/async-storage';


let ip = require('../ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/remove/"


const removeItem = async (item) => {
	let result;
	let username;
	let token;

	console.log("item is: ",item)

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
		body: JSON.stringify({username:username,token:token,item:item})
		})
		.then((response) => response.json()) 
		.then((data) => {
			if (data[1] == "1") {
				result=true;
			} else {
				result=false;
			}
		})
	.catch((err) => { console.log(err); });
	return result
}

export default removeItem;