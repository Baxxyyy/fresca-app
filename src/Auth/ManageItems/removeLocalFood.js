import getItems from './getItems';
import storeItems from '../storeItems';
import removeFromDateList from '../DateManage/removeFromDateList';


const removeLocalFood = async (item) => {
	var foods = await getItems();
	foods = JSON.parse(foods)

	let result = false;

	for (var i = 0; i < foods.length; i++) {
		if (foods[i][0] == item[0] && foods[i][1] == item[1]) {
			foods.splice(i,1)
			break
		}
	}
	storeItems("storedItems", foods)
	removeFromDateList(item)
	result = true
	return result
}


export default removeLocalFood;
