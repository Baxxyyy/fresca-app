import hasAuth from './hasAuth'
import getKey from './getKey'
import storeItems from './storeItems'

import AsyncStorage from '@react-native-async-storage/async-storage';

let ip = "http://46.137.133.17:8000/get/"       // aws ip
//let ip = "http://127.0.0.1:8000/get/"        // local ip

const getNewItems = async () => {
	let result;
	let token;
	let username;
	let items;

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
		body: JSON.stringify({token:token})
		})
		.then((response) => response.json()) 
		.then((data) => {
			data = JSON.parse(data)
			if (data.length == 1) {
				return result // must be '0'
			}

			if (data[1][0] == "1") {
				result=true;
				items = data[0]
				storeItems(data[0])
			} else {
				result=false;
			}
		})
	.catch((err) => { console.log(err); });
	return result
}

export default getNewItems;
