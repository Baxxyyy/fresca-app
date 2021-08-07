import React, {useState} from 'react';

import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';


const SettingButton = (props) => {
	return (
		<Button 
	    style={styles.settingsOption}
	    labelStyle={styles.settingsText}
	    onPress={props.function}
	    color='black'
	  >
	    {props.text}
	  </Button>
  )
}

const styles = StyleSheet.create({
	settingsOption: {
    // alignItems: 'flex-start',
    width: '100%',
  },
  settingsText: {
    color: 'black',
    fontSize: 30,
  },
})

export default SettingButton;