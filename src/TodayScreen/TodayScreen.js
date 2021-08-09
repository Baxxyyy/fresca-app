import React, {useState} from 'react';

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, IconButton, Checkbox, Dialog, Portal, Snackbar } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { Tab, TabView } from 'react-native-elements';

import SwipeableViews from 'react-swipeable-views-native';

import getItems from '../Auth/getItems'
import getNewItems from '../Auth/getNewItems'
import removeItem from '../Auth/removeItem'


function TodayScreen ({navigation}) {

	const [itemList, setItemList] = useState(new Array());

	let colours = ['#fbffea','#f7ffad']
	const dayLength = 86400000

	const [todayList, setTodayList] = useState(new Array());
	const [tomorrowList, setTomorrowList] = useState(new Array());
	const [soonList, setSoonList] = useState(new Array());

	const [checkList, setCheckList] = useState(new Array());

	const [fetched, setFetched] = useState(false);

	const [visible, setVisible] = useState(false);
	const [section, setSection] = useState(-1);

	const [snackVisible, setSnackVisible] = useState(false);
  const [snackState, setSnackState] = useState(false);

  const [tabIndex, setIndex] = useState(0);

	const normaliseDate = (date) => {
  	date.setHours(0,0,0,0)
  	date.setDate(date.getDate()+1)
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

  const removeExpired = async (item) => {
  	let result;
		await removeItem(item)
		.then((res) => result = res)
		.catch((err) => console.log(err))
		return result
  }
  
  const checkForToday = (date, checkDate) => {
  	if (+date == +checkDate) {
  		return true
  	} else {
  		return false
  	}
  }

  const checkForTomorrow = (date, checkDate) => {
  	if (date > checkDate &&
  	 	 (date - dayLength) == checkDate - 0) 
  	{
  		return true
  	} else {
  	 return false
  	}
  }

  const checkForSoon = (date, checkDate) => {
  	if ((date > checkDate)  &&
  		 ((date - 4*dayLength) < checkDate))
  	{
  		return true
  	} else {
  		return false
  	}
  }

	const loadItems = async () => {
  	let newTodayList = [];
  	let newTomorrowList = [];
  	let newSoonList = [];

  	let date;
  	let currentDate = normaliseDate(new Date())
  	
  	await getItems()
  	.then((response) => JSON.parse(response))
  	// .then((parsed_value) => setItemList(parsed_value))
  	.then((parsed_value) => {
  		if (parsed_value == null) {
  			setCheckList([])
		  	setTodayList([])
		  	setTomorrowList([])
		  	setSoonList([])
		  	setFetched(true)
  			return
  		}
  		for (var i=0; i < parsed_value.length; i++) {
  			date = parsed_value[i][1]
  			date = proccessDate(date)

  			if (date < currentDate) {
  				removeExpired(parsed_value[i])
  			} else if (checkForToday(date, currentDate)) {
  				newTodayList.push(parsed_value[i])
  			} else if (checkForTomorrow(date, currentDate)) {
  				newTomorrowList.push(parsed_value[i])
  			} else if (checkForSoon(date, currentDate)) {
  				newSoonList.push(parsed_value[i])
  			}
  		}	
  	})
  	.catch((err) => console.log(err))
  	let newCheckList = []
  	for (var i=0; i < (newTodayList.length + newTomorrowList.length +
  										 newSoonList.length);i++)
  	{
  		newCheckList.push(false)
  	}
  	setCheckList(newCheckList)
  	setTodayList(newTodayList)
  	setTomorrowList(newTomorrowList)
  	setSoonList(newSoonList)
  	setFetched(true)
  }

  if (!fetched) {loadItems()}

  const refreshItems = async () => {
  	await getNewItems().catch((err) => console.log(err))
  	await loadItems().catch((err) => console.log(err))
  }

	const dealWithDelete = async () => {
		console.log("A")
		let start = 0;
		let end = 0;
		let newList;
		let result = false;
		if (section == 0) {
			start = 0
			end = todayList.length
		} else if (section == 1) {
			start = todayList.length
			end = todayList.length + tomorrowList.length
		} else if (section == 2) {
			start = todayList.length + tomorrowList.length
			end = todayList.length + tomorrowList.length + soonList.length + 1
		}

		newList = checkList.slice(start,end)
		for (var i=0; i < newList.length; i++) {
			if (newList[i] == true) {
				if (section == 0) {
					await removeExpired(todayList[i]).then((res) => result = res)
				} else if (section == 1) {
					await removeExpired(tomorrowList[i]).then((res) => result = res)
				} else {
					await removeExpired(soonList[i]).then((res) => result = res)
				}
			}
		}
		return result;
	}

	const hideDialog = async (item) => {
		setVisible(false)
		let result;
		await dealWithDelete().then((res) => result = res)
		setSnackState(result)
		await refreshItems().catch((err) => console.log(err))
		await loadItems().catch((err) => console.log(err))
		setSnackVisible(true)
	}

	const cancelDialog = () => {
		setVisible(false)
	}

	const onDismissSnack = () => {
  	setSnackVisible(false)
  }

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<IconButton
					icon={require("../../assets/arrow-top-left.png")}
					size={30}
					onPress={() => {navigation.goBack()}}
				/>
				<Text style={styles.headerText}>Eat Up</Text>
			</View>
			<View style={styles.tabBox}>
				<Button color="black" disabled={tabIndex != 0}> Today </Button>
				<Button color="black" disabled={tabIndex != 1}> Tomorrow </Button>
				<Button color="black" disabled={tabIndex != 2}> Soon </Button>
			</View>
			<SwipeableViews
			 style={styles.content} 
			 onSwitching={(i) => setIndex(i)}
			 >
			 {/*// today box*/}
				<View style={styles.todayBox}>
					<View style={styles.todayTitleBorder}>
						<Text style={styles.contentTitle}>Today</Text>
						<IconButton
							icon={require("../../assets/cross.png")}
							size={30}
							onPress={() => {
								setSection(0) 
								setVisible(true)
							}}
						/>
					</View>
					<ScrollView style={styles.scrollArea}>
						{todayList.map((c, i) => {
							return [
								<View key={i} style={styles.TextBox}>
									<Text key={i} style={styles.Label}>{c[0]}</Text>
									<Checkbox
										status={checkList[i] ? 'checked' : 'unchecked'}
										onPress={() => {
											let tmp = checkList.slice(0)
											tmp[i] = !tmp[i]
											setCheckList(tmp)
										}}
									/>
								</View>
							]
						})}
					</ScrollView>
				</View>
			{/*// tomorrow box*/}
				<View style={styles.tomorrowBox}>
					<View style={styles.tomorrowTitleBorder}>
						<Text style={styles.contentTitle}>Tomorrow</Text>
						<IconButton
							icon={require("../../assets/cross.png")}
							size={30}
							onPress={() => {
								setSection(1)
								setVisible(true)
							}}
						/>
					</View>
					<ScrollView style={styles.scrollArea}>
						{tomorrowList.map((c, i) => {
							return [
								<View key={i} style={styles.TextBox}>
									<Text key={i} style={styles.Label}>{c[0]}</Text>
									<Checkbox
										status={checkList[i+todayList.length] ? 'checked' : 'unchecked'}
										onPress={() => {
											let tmp = checkList.slice(0)
											tmp[i+todayList.length] = !tmp[i+todayList.length]
											setCheckList(tmp)
										}}
									/>
								</View>
							]
						})}
					</ScrollView>
				</View>
			{/*// Soon box*/}
				<View style={styles.soonBox}>
					<View style={styles.soonTitleBorder}>
						<Text style={styles.contentTitle}>2-3 Days</Text>
						<IconButton
							icon={require("../../assets/cross.png")}
							size={30}
							onPress={() => {
								setSection(2)
								setVisible(true)
							}}
						/>
					</View>
					<ScrollView style={styles.scrollArea}>
						{soonList.map((c, i) => {
							return [
								<View key={i} style={styles.TextBox}>
									<Text key={i} style={styles.Label}>{c[0]}</Text>
									<Checkbox
										status={checkList[i+todayList.length+tomorrowList.length] ? 'checked' : 'unchecked'}
										onPress={() => {
											let tmp = checkList.slice(0)
											tmp[i+todayList.length+tomorrowList.length] = !tmp[i+todayList.length+tomorrowList.length]
											setCheckList(tmp)
										}}
									/>
								</View>
							]
						})}
					</ScrollView>
				</View>
			</SwipeableViews>
			<Portal>
				<Dialog 
				dismissable={false}
				visible={visible} 
				onDismiss={hideDialog}
				style={styles.popupStyle}>
					<Dialog.Title style={styles.newTitle}>Confirm</Dialog.Title>
					<Dialog.Content>
						<Text style={styles.confirm}>Are you sure you want to delete all selected items?</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={cancelDialog}>Cancel</Button>
						<Button onPress={() => hideDialog()}>
							Confirm
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<Snackbar
				visible={snackVisible}
				onDismiss={onDismissSnack}
				duration={1500}
				action={{
					label: 'Dismiss',
					onPress: () => {
						setSnackVisible(false)
					},
				}}
			> {snackState ? 'Items removed' : 'Woops, something went wrong'}
			</Snackbar>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97ecb3',
    alignItems: 'center',
    display: 'flex',
    borderWidth: 5,
    borderColor: 'black',
    paddingTop:15,
  },
  header: {
  	height:60,
  	width: '100%',
    backgroundColor: 'white',
    borderBottomWidth: 5,
    borderBottomColor: 'black',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
  	fontSize: 40,
  },
  content: {
  	width: '100%',
  },
  contentTitle: {
  	fontSize: 40,
  },
  Label: {
  	fontSize: 35,
  	alignSelf: 'flex-end',
  	alignItems: 'flex-end',
  },
  TextBox: {
  	borderBottomWidth: 3,
  	borderBottomColor: 'black',
  	backgroundColor: "#fbffea",
  	flex: 0.1,
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	borderRightWidth: 2,
  	borderRightColor: 'grey',
  	borderLeftWidth: 2,
  	borderLeftColor: 'grey',
  },
  popupStyle: {
  	height: '32%',
  	borderRadius: 20,
  },
  newTitle: {
  	width:'90%',
  	borderBottomColor: 'grey',
  	borderBottomWidth: 2,
  },
  confirm: {
  	fontSize: 30,
  },
  tabBox: {
  	backgroundColor: '#97ecb3',
  	width: '100%',
  	flexDirection: 'row',
  	borderBottomColor: 'black',
  	borderBottomWidth: 2,
  	justifyContent: 'space-between',
  },
  tabButton: {
  	backgroundColor: '#97ecb3',
  	borderBottomColor: 'black',
  	borderBottomWidth: 2,
  },
  todayBox: {
  	flex:1,
  	backgroundColor: '#97ecb3',
	},
	todayTitleBorder: {
  	borderBottomWidth: 3,
  	borderBottomColor: 'grey',
  	borderRightWidth: 2,
  	borderRightColor: 'grey',
  	backgroundColor: '#ffb5ad',
  	flexDirection: 'row',
  	justifyContent: 'space-between',
	},
	tomorrowBox: {
  	flex:1,
  	backgroundColor: '#97ecb3',
  },
	tomorrowTitleBorder: {
  	borderBottomWidth: 3,
  	borderBottomColor: 'grey',
  	borderRightWidth: 2,
  	borderRightColor: 'grey',
  	borderLeftWidth: 2,
  	borderLeftColor: 'grey',
  	backgroundColor: '#ffdead',
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  },
  soonBox: {
  	flex:1,
  	backgroundColor: '#97ecb3',
  },
	soonTitleBorder: {
  	borderBottomWidth: 3,
  	borderBottomColor: 'grey',
  	borderLeftWidth: 2,
  	borderLeftColor: 'grey',
  	backgroundColor: '#f7ffad',
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  },
 })

export default TodayScreen;
