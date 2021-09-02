import getKey from '../getKey';

const findDatePlace = async (date) => {

	let foods = await getKey("DateItems")
	foods = JSON.parse(foods)
	if (foods == null) {
		return 0
	} else if (foods.length == 0) {
		return 0
	}

	let tmpPointer = 0
	let midPoint = Math.floor(foods.length / 2)
	let midItem
	let midDate
	let amend = 0
	let count = 0


	while (true) {
		count += 1
		midItem = foods[midPoint]
		midDate = new Date(midItem.numDate)

		if (midDate > date) {
			// checked date is greater than base date,
			// discard top half of list
			foods.splice(midPoint,foods.length)
			
		} else if (midDate < date) {
			// checked date is less than base date,
			// discard bottom half of list
			foods.splice(0,midPoint + 1)
			amend += midPoint + 1
		} else {
			break
		}
		if (foods.length == 0) {
			break
		}
		if (count > 15) {
			break
		}
		midPoint = Math.floor(foods.length / 2)
	}
	for (var i=0; i < foods.length; i++) {
		if (+(new Date(foods[i].numDate)) == +midDate) {
			midPoint = i
			break
		}
	}
	return amend + midPoint
}

export default findDatePlace