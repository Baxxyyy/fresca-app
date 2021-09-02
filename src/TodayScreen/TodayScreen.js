import React, {useState, useEffect, useRef} from 'react';

import { StyleSheet, Text, View, AppState, ScrollView } from 'react-native';
import { Button, IconButton, Checkbox, Dialog, Portal, Snackbar } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { Tab, TabView } from 'react-native-elements';

import SwipeableViews from 'react-swipeable-views-native';

import getKey from '../Auth/getKey';

import Item from '../Auth/ManageItems/Item';
import getItems from '../Auth/ManageItems/getItems';
import removeLocalFood from '../Auth/ManageItems/removeLocalFood';
import syncItems from '../Auth/ManageItems/syncItems';

import findDatePlace from '../Auth/DateManage/findDatePlace';

function TodayScreen ({navigation}) {

	useEffect(() => {
    const refresh = navigation.addListener('focus', () => {
      syncItems();
      createMainLists();
    });
    return refresh;
  }, [navigation]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/)) {
        syncItems()
      }
    });
    
    try {
      subscription.remove()
    } catch (err) {}
  }, []);

	const [itemList, setItemList] = useState(new Array());

	let colours = ['#fbffea','#f7ffad']
	const dayLength = 86400000

	const [todayList, setTodayList] = useState(new Array());
	const [tomorrowList, setTomorrowList] = useState(new Array());
	const [soonList, setSoonList] = useState(new Array());

	const [checkList, setCheckList] = useState(new Array());

	const [visible, setVisible] = useState(false);
	const [delItem, setDelItem] = useState(false);
	const [section, setSection] = useState(-1);

	const [snackVisible, setSnackVisible] = useState(false);
  const [snackState, setSnackState] = useState(false);

  const [tabIndex, setIndex] = useState(0);


  // Date functions

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

  // Main

  const createMainLists = async () => {

    let newRemoveList = [];
    let newTodayList = [];
    let newTomorrowList = [];
    let newSoonList = [];

    let today = normaliseDate(new Date())
    let tomorrowDate = normaliseDate(new Date()).setDate(today.getDate()+1)
    let soonDate = normaliseDate(new Date()).setDate(today.getDate()+2)
    let endDate = normaliseDate(new Date()).setDate(today.getDate()+4)


    let todayIndex = await findDatePlace(today)
    let tomorrowIndex = await findDatePlace(tomorrowDate)
    let soonIndex = await findDatePlace(soonDate)
    let endIndex = await findDatePlace(endDate)

    await getKey("DateItems")
    .then((response) => JSON.parse(response))
    .then((parsed_value) => {
      if (parsed_value == []) {
        setItemList([])
        setTodayList([])
    		setTomorrowList([])
    		setSoonList([])
        return
      }
      newTodayList = parsed_value.slice(todayIndex,tomorrowIndex)
      newTomorrowList = parsed_value.slice(tomorrowIndex,soonIndex)
      newSoonList = parsed_value.slice(soonIndex,endIndex)
      setItemList(parsed_value)
    })
    .catch((err) => console.log(err))

    setTodayList(newTodayList)
    setTomorrowList(newTomorrowList)
    setSoonList(newSoonList)
  }

  const refreshItems = async () => {
  	await getItems().catch((err) => console.log(err))
  	await loadItems().catch((err) => console.log(err))
  }

  // Deletion functions

  const removeExpired = async (item) => {
    let res = await removeLocalFood(item)
    return res
  }

  const removeUpdate = async (itemList, display, refresh) => {
    let result;
    for (var i=0; i < itemList.length; i++) {
      result = await removeExpired(itemList[i])
      if (!result) {
        break
      }
    }
    if (display) {
      setSnackState(result)
      setSnackVisible(true)
    }
    if (refresh) {
      createMainLists() 
    }
    return result
  }

	const hideDialog = async (item) => {
		setVisible(false)
		let result;
		await removeUpdate([item],true,true).then((res) => result = res);
		setSnackState(result)
		setSnackVisible(true)
	}

	const cancelDialog = () => {
		setVisible(false)
	}

	// Snack functions

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
					</View>
					<ScrollView style={styles.scrollArea}>
						{todayList.map((c, i) => {
							return [
								<View key={i} style={styles.TextBox}>
									<Text key={i} style={styles.Label}>{c.name}</Text>
									<IconButton
										icon={require("../../assets/cross.png")}
										size={30}
										onPress={() => { 
											setDelItem(c) 
											setVisible(true)
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
					</View>
					<ScrollView style={styles.scrollArea}>
						{tomorrowList.map((c, i) => {
							return [
								<View key={i} style={styles.TextBox}>
									<Text key={i} style={styles.Label}>{c.name}</Text>
									<IconButton
										icon={require("../../assets/cross.png")}
										size={30}
										onPress={() => { 
											setDelItem(c) 
											setVisible(true)
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
					</View>
					<ScrollView style={styles.scrollArea}>
						{soonList.map((c, i) => {
							return [
								<View key={i} style={styles.TextBox}>
									<Text key={i} style={styles.Label}>{c.name}</Text>
									<IconButton
										icon={require("../../assets/cross.png")}
										size={30}
										onPress={() => {
											setDelItem(c) 
											setVisible(true)
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
						<Text style={styles.confirm}>Are you sure you want to delete this item?</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={cancelDialog}>Cancel</Button>
						<Button onPress={() => hideDialog(delItem)}>
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
