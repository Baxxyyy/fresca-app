import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, IconButton, Checkbox, Dialog, Portal, Snackbar} from 'react-native-paper';

import removeLocalItem from '../Auth/removeLocalItem';
import getMyStringValue from '../Auth/getKey';

import SettingBox from './SettingBox';

function SettingsScreen ({navigation}) {

  const [showEmailPopup, setEmailPopup] = useState(false);
  const [showPassPopup, setPassPopup] = useState(false);

  const [currentEmail, setCurrentEmail] = useState(new String())

  const logout = (navigation) => {

    removeLocalItem("token")
    removeLocalItem("username")
    removeLocalItem("storedItems")

    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  }

  const changeEmail = () => {
    setEmailPopup(false)

  }

  const changePassword = () => {
    setPassPopup(false)  
  }

  const cancelDialog = () => {
    setEmailPopup(false)
    setPassPopup(false)
  }

  return (
		<View style={styles.container}>
			<View style={styles.header}>
				<IconButton
					icon={require("../../assets/arrow-top-left.png")}
					size={30}
					onPress={() => {navigation.goBack()}}
				/>
				<Text style={styles.headerText}>Settings</Text>
			</View>
      <View style={styles.content}>
        <View style={styles.settingsBox}>
          <SettingBox text="Logout" function={() => {logout(navigation)}} />
        </View>
        <View style={styles.settingsBox}>
          <SettingBox text="Change Email" function={() => {setEmailPopup(true)}} />
          <SettingBox text="Change Password" function={() => {setPassPopup(true)}} />
        </View>
      </View>

    <Portal>
      <Dialog 
      dismissable={false}
      visible={showEmailPopup} 
      onDismiss={cancelDialog}
      style={styles.popupStyle}>
        <Dialog.Title style={styles.title}>Change Email</Dialog.Title>
        <Dialog.Content>
          <View style={styles.emailContent}>
            <Text style={styles.topText}>Current Email: {currentEmail}</Text>
          </View> 
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={cancelDialog}>Cancel</Button>
          <Button 
          onPress={() => changeEmail()}
          >
          Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    <Portal>
      <Dialog 
      dismissable={false}
      visible={showPassPopup} 
      onDismiss={cancelDialog}
      style={styles.popupStyle}>
        <Dialog.Title style={styles.title}>Change Password</Dialog.Title>
        <Dialog.Content>
          
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={cancelDialog}>Cancel</Button>
          <Button 
          onPress={() => changePassword()}
          >
          Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

		<StatusBar style="dark" backgroundColor="#fdfdfd" />
		</View>
		
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    alignItems: 'center',
    display: 'flex',
    paddingTop:60,
    borderBottomColor: 'black',
    borderBottomWidth: 5,
  },

  header: {
    height:60,
    width: '100%',
    backgroundColor: '#fdfdfd',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
  	fontSize: 55,
  	color: 'black',
  },

  content: {
    marginTop: 80,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  settingsBox: {
    borderColor: '#818181',
    borderWidth: 5,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    width: '95%',
  },

  popupStyle: {
    height: '30%',
  },
  title: {
    fontSize: 30,
  },
  emailContent: {
  
  },
  topText: {
    fontSize: 20,
  },
})

export default SettingsScreen;