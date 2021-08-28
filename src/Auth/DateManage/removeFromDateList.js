import getKey from '../getKey';
import storeItems from '../storeItems';

const normaliseDate = (date) => {
  date.setHours(0,0,0,0)
  date.setDate(date.getDate())
  return date
}

const proccessDate = (date) => {
  let first = date.indexOf('-')
  let second = date.indexOf('-',first+1)

  let day = parseInt(date.substring(0,first))
  let month = parseInt(date.substring(first+1,second)) - 1
  let year = parseInt(date.substring(second+1,date.length))
  let newDate = new Date()
  newDate.setFullYear(year,month,day)
  newDate = normaliseDate(newDate)
  return newDate
}

const removeFromDateList = async (item) => {
	let foods = await getKey("DateItems")
	foods = JSON.parse(foods)

	for (var i = 0; i < foods.length; i++) {
		if (foods[i][0] == item[0] && foods[i][1] == item[1]) {
			foods.splice(i,1)
			break
		}
	}
	storeItems("DateItems", foods)

	let removals = await getKey("removeList")
	if (removals != null) {
		removals = JSON.parse(removals)
		removals.push(item)
		storeItems("removeList", removals)
	} else {
		storeItems("removeList", [item])
	}
}

export default removeFromDateList;