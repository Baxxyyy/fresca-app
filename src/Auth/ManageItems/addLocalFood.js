import getItems from './getItems';
import storeItems from '../storeItems';

const addLocalFood = async (item) => {
	let foods = await getItems();
	foods = JSON.parse(foods)

	try {
		foods.push(item)
		storeItems("storedItems", foods)
	} catch {
		storeItems("storedItems", [item])
	}
}

export default addLocalFood;