import React, { Component } from 'react';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import { DISHES } from '../shared/dishes';
import { View, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';


const MenuNavigator = createStackNavigator({
  Menu: { screen: Menu },
  Dishdetail: { screen: Dishdetail }
},
{
  initialRouteName: 'Menu',
  navigationOptions: {
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          color: "#fff"            
      }
  }
}
);



class Main extends Component {
 
  render() {
 
    return (
      // Uncomment this  line in prod mode ;-)
      // <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
      <View style={{flex:1}}>
      <MenuNavigator />
      </View>
    );
  }
}
  
export default Main;