import { StatusBar } from 'expo-status-bar';

import React, {useState} from 'react';

import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, IconButton } from 'react-native-paper';

import getItems from '../Auth/ManageItems/getItems';
import getNewItems from '../Auth/ManageItems/getNewItems';

import getEmail from '../Auth/Users/getEmail';

import addItem from '../AddScreen/addItem';
import syncItems from '../Auth/ManageItems/syncItems';
import storeItems from '../Auth/storeItems';

function HomeScreen({ navigation }) {

	React.useEffect(() => {
    const refresh = navigation.addListener('focus', () => {
      fetchItemList()
    });
    return refresh;
  }, [navigation]);

	const [itemList, setItemList] = useState(new Array());
	const [outItems, setOutItems] = useState(0);

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

	const fetchItemList = async () => {
		let tmp = 0;
		await syncItems();
		await getItems()
		.then((response) => JSON.parse(response))
		.then((parsed_value) =>  {
			let currentDate = normaliseDate(new Date())
			let date
			if (parsed_value == null) {
				setItemList([])
				parsed_value = []
			} else {
				setItemList(parsed_value)
			}
			for (var i=0; i < parsed_value.length; i++) {
  			date = new Date(parsed_value[i].numDate)
  			if (+date == +currentDate) {
  				tmp += 1
				}
			}
		})
		.catch((err) => console.log(err));
		setOutItems(tmp)
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Home</Text>
				<IconButton
					style={{alignSelf: 'center',marginLeft: 'auto'}}
					icon={require("../../assets/cog.png")}
					size={30}
					onPress={() => {navigation.navigate('SettingsScreen')}}
				/>
			</View>
			<View style={styles.options}>
				<Button
					color="#ffb5ad"
					labelStyle={styles.optionLabel} 
					style={styles.button}
					contentStyle={styles.buttonStyle}
					mode="contained"
					onPress={() => {navigation.navigate('AllScreen')}}
					>
					ALL ITEMS
				</Button>
				<Button
					color="#ffdead"
					labelStyle={styles.optionLabel}  
					style={styles.button}
					contentStyle={styles.buttonStyle}
					mode="contained"
					onPress={() => {navigation.navigate('TodayScreen')}}
					>
					EAT UP ITEMS
				</Button>
				<Button
					color="#f7ffad"
					labelStyle={styles.optionLabel} 
					style={styles.button}
					contentStyle={styles.buttonStyle}
					mode="contained"
					onPress={() => {navigation.navigate('ManuelAddScreen')}}
					>
					ADD NEW ITEMS
				</Button>
			</View>
			<View style={styles.stats}>
				<View style={styles.display}>
					<Text style={styles.large}>{outItems}</Text>
					<Text style={styles.small}>out of date today</Text>
				</View>
				<View style={styles.display}>
					<Text style={styles.large}>{itemList.length}</Text>
					<Text style={styles.small}>Total items stored</Text>
				</View>
			</View>
			<StatusBar style="light" backgroundColor="black" />
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
  	height:80,
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
  options: {
  	flex: 0.8,
  	width: '90%',
  	display: 'flex',
  	justifyContent: 'space-evenly',
  },
  optionLabel: {
  	color: 'black',
  	fontSize:30,
  },
  button: {
  	justifyContent: 'center',
		borderWidth :5,
		borderColor: 'black',
		borderRadius: 10,
		fontSize:50,
	},
	buttonStyle: {
		height: 70,
	},
  stats: {
  	borderTopColor: 'grey',
  	borderTopWidth: 5,
  	backgroundColor: '#fbffea',
  	display: 'flex',
  	width:'100%',
  	flexDirection: 'row',
  	justifyContent: 'space-around',
  	alignItems: 'center',
  	flex: 0.2,
  },
 	display: {

 	},
 	large: {
 		fontSize: 40,
 	},
 	small: {
 		fontSize: 20,
 	}, 
});


export default HomeScreen