import React, { Component } from 'react'
import { StyleSheet, Image } from 'react-native';
import NewSheet from '../Components/NewSheet'
import App from '../App'
import AllSheet from '../Components/AllSheets'
import { createStackNavigator } from "react-navigation-stack"
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from "react-navigation"
import PdfDetail from '../Components/pdfDetail'

const NewSheetStackNavigator = createStackNavigator({
  NewSheet: {
    screen: NewSheet,
    navigationOptions: {
      headerShown:false,
      headerLeft: () => (null),
      title: 'Nouveau Bon d\'Intervention'
    }
  }
})
const AllSheetStackNavigator = createStackNavigator({

  AllSheet: {
    screen: AllSheet,
    navigationOptions: {
      headerShown:false,
      headerLeft: () => (null),
      title: 'Tout Mes Bons d\'Intervention'
    }
  },
  PdfDetail: {
    screen: PdfDetail,
    navigationOptions: {
      title: 'Detail du Bon'
    }
  }
})
      
const SheetTabNavigator = createBottomTabNavigator(
  {
    
    NewSheet: {
      screen: NewSheetStackNavigator,
      navigationOptions: {
    tabBarIcon: () => {
          return <Image
            source={require('../Images/ic_new.png')}
            style={styles.iconplus} />
        }
      }
    },
    AllSheet: {
      screen: AllSheetStackNavigator,
      navigationOptions: {
    tabBarIcon: () => {
          return <Image
            source={require('../Images/ic_saved.png')}
            style={styles.icon} />
        }
      }
    }
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#DDDDDD', 
      inactiveBackgroundColor: '#FFFFFF',
      showLabel: false, 
      showIcon: true 
    }
  }
)

const MenuStackNavigator = createStackNavigator({
  Accueil: {
    screen: App,
    navigationOptions: {headerShown:false}

  },
  Menu:{
    screen:SheetTabNavigator,
    navigationOptions: {headerShown:true}
  }
})


const styles = StyleSheet.create({
  iconmenu: {
    width: 20,
    height: 20
  },
  icon: {
    width: 30,
    height: 30
  },
  iconplus: {
    width: 50,
    height: 50
  }
})

export default createAppContainer(MenuStackNavigator)
