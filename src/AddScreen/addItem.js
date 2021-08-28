import hasAuth from '../Auth/hasAuth';
import getKey from '../Auth/getKey';
import storeItems from '../Auth/storeItems';

import addLocalFood from '../Auth/ManageItems/addLocalFood';
import addToDateList from '../Auth/DateManage/addToDateList';

import Item from '../Auth/ManageItems/Item'

let ip = require('../Auth/ip.json')
ip = JSON.stringify(ip)
ip = ip.substring(7)
ip = ip.substring(0,ip.length-2)
ip = ip + "/add/"

const addItem = async (name,date) => {

	console.log("Name, date: ",name,date)

	let result = false

	if (name.trim() == '' || name == "string") {
		return result
	}

	let newItem = new Item(name,date)

	let addList = await getKey("addItems")
	addList = JSON.parse(addList)
	console.log(addList)


	if (addList == null) {
		storeItems("addItems", [[newItem.name,newItem.date]])
	} else {
		console.log(newItem)
		console.log(newItem.name,newItem.date)
		addList.push([newItem.name,newItem.date])
		storeItems("addItems", addList)
	}
	addLocalFood(newItem)
	addToDateList(newItem)

	result = true
	return result
}

export default addItem




// const addItem = async (name,date) => {
// 	let result;
// 	let token;
// 	let username;

// 	if (name.trim() == '' || name == 'string') {
// 		result = false;
// 		return result;
// 	}

	
// 	await getKey("username").then((value) => username = value).catch((err) => { console.log(err); });
// 	await getKey("token").then((value) => token = value).catch((err) => { result=false });
	
// 	let auth;
// 	await hasAuth(username,token).then((value) => auth=value)

// 	if (auth == false) {
// 		result = false;
// 		return result;
// 	}

// 	await fetch(ip, {
// 		method: 'POST',
// 		headers: { 
// 		       'Accept': 'application/json',
// 		       'Content-Type': 'application/json' 
// 		       },
// 		body: JSON.stringify({token:token,name:name,date:date})
// 		})
// 		.then((response) => response.json()) 
// 		.then((data) => {
// 			console.log(data)
// 			if (data[1] == "1") {
// 				result=true;
// 			} else {
// 				result=false;
// 			}
// 		})
// 	.catch((err) => { console.log(err); });
// 	return result
// }