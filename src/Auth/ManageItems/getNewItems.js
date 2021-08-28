import hasAuth from '../hasAuth'
import getKey from '../getKey'
import storeItems from '../storeItems'

import Item from './Item';

import AsyncStorage from '@react-native-async-storage/async-storage';

let ip = require('../ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/get/"


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
				console.log(items,"ITEMSFGKLL")
				for (var i=0; i < items.length; i++) {
					let tmp = new Item(items[i][0], items[i][1])
					items[i] = tmp
				}
				
				storeItems("storedItems", items)
			} else {
				result=false;
			}
		})
	.catch((err) => { console.log(err); });
	return result
}

export default getNewItems;
