import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, CheckBox, Button, Icon, Image } from 'react-native-elements'
//import { createBottomTabNavigator } from 'react-navigation-tabs'
import { ScrollView } from 'react-native-gesture-handler'
import { baseUrl } from '../shared/baseUrl'
import { Permissions } from 'react-native-unimodules'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from "expo-image-manipulator";
import * as SecureStore from 'expo-secure-store';

const tabNavigator = createBottomTabNavigator();

class LoginTab extends Component {
    state = {
        username: '',
        password: '',
        remember: false
    }
    componentDidMount = () => {
        SecureStore.getItemAsync('userinfo')
            .then(userdata => {
                let userinfo = JSON.parse(userdata)
                if(userinfo){
                    this.setState({
                        username: userinfo.username,
                        password: userinfo.password,
                        remember: true
                    })
                }
            })
    }
    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({ tintColor }) => (
            <Icon 
                name='sign-in'
                type='font-awesome'
                size={24}
                color={tintColor}
            />
        )
    }
    handleLogin = () => {
        console.log(JSON.stringify(this.state))
        if(this.state.remember){
            SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
                .catch(error => console.log('Could not save user'))
        }else{
            SecureStore.deleteItemAsync('userinfo')
                .catch(error => console.log('Could not delete user'))
        }
    }
    render() {
        return (
            <View style={styles.container} >
                <Input 
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                    onChangeText={username => this.setState({ username: username })}
                    value={this.state.username}
                    containerStyle={styles.formInput}
                />
                <Input 
                    placeholder='Password'
                    leftIcon={{ type: 'font-awesome', name: 'key'}}
                    onChangeText={password => this.setState({ password: password} )}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                />
                <CheckBox 
                    title='Remember Me'
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({ remember: !this.state.remember })}
                    containerStyle={styles.formCheck}
                />
                
                <Button 
                    onPress={this.handleLogin}
                    title='Login'
                    icon={
                        <Icon
                            name='sign-in'
                            type='font-awesome'
                            size={24}
                            color='white'
                        /> 
                    }
                    buttonStyle={{ backgroundColor: '#512da8' }}
                    containerStyle={{ margin: 5 }}
                />
            
                <Button 
                    onPress={()=> this.props.navigation.navigate('Register')}
                    title='Register'
                    type='clear'
                    icon={
                        <Icon
                            name='user-plus'
                            type='font-awesome'
                            size={24}
                            color='grey'
                        /> 
                    }
                    titleStyle={{ color: 'blue', fontSize: 20 }}
                    containerStyle={{ margin: 5 }}
                />
              
            </View>
        )
    }
}

class RegisterTab extends Component {
    state = {
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        imageUrl: baseUrl + 'images/logo.png',
        remember: false
    }
    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({ tintColor }) => (
            <Icon 
                name='user-plus'
                type='font-awesome'
                size={24}
                color={tintColor}
            />
        )
    }
    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
               // this.setState({ imageUrl : capturedImage.uri });
                this.processImage(capturedImage.uri);
            }
        }

    }

    processImage = async (imageUri) => {
        let processedImage = await ImageManipulator.manipulateAsync(
            imageUri, 
            [
                {resize: {width: 400}}
            ],
            {format: 'png'}
        );
        console.log(processedImage);
        this.setState({imageUrl: processedImage.uri });

    }

    getImageFromGallery = async ()=>{
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                this.processImage(capturedImage.uri);
            }
        }
    } 

    handleRegister = () => {
        console.log(JSON.stringify(this.state))
        if(this.state.remember){
            SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
                .catch(error => console.log('Could not save user'))
        }
    }
    render() {
        return (
            <ScrollView>
            <View style={styles.container} >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: this.state.imageUrl }}
                        style={styles.image}
                        containerStyle={{ paddingLeft: 10 }}
                    />
                    <Button 
                        title='Camera' 
                        onPress={this.getImageFromCamera}
                        containerStyle={{ paddingTop: 10 }}
                    /> 
                                        <Button 
                        title='Gallery' 
                        onPress={this.getImageFromGallery}
                        containerStyle={{ paddingTop: 10 }}
                    />          
                </View>

                <Input 
                    placeholder='First Name'
                    leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                    onChangeText={firstname => this.setState({firstname:firstname })}
                    value={this.state.firstname}
                    containerStyle={styles.formInput}
                />

                <Input 
                    placeholder='Last Name'
                    leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                    onChangeText={lastname => this.setState({ lastname: lastname })}
                    value={this.state.lastname}
                    containerStyle={styles.formInput}
                />

                <Input 
                    placeholder='Email'
                    leftIcon={{ type: 'font-awesome', name: 'envelope-o'}}
                    onChangeText={email => this.setState({ email: email })}
                    value={this.state.email}
                    containerStyle={styles.formInput}
                />
                <Input 
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                    onChangeText={username => this.setState({ username: username })}
                    value={this.state.username}
                    containerStyle={styles.formInput}
                />
                
                <Input 
                    placeholder='Password'
                    leftIcon={{ type: 'font-awesome', name: 'key'}}
                    onChangeText={password => this.setState({ password: password} )}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                />

                <CheckBox 
                    title='Remember Me'
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({ remember: !this.state.remember })}
                    containerStyle={styles.formCheck}
                />
               
                <Button 
                    onPress={this.handleRegister}
                    title='Register'
                    icon={
                        <Icon
                            name='sign-in'
                            type='font-awesome'
                            size={24}
                            color='white'
                        /> 
                    }
                    buttonStyle={{ backgroundColor: '#512da8' }}
                    containerStyle={{ margin: 5 }}
                />
                  
            </View>
            </ScrollView>
        )
    }
}

function Login() {
    return(
        <NavigationContainer independent={true}>
            <tabNavigator.Navigator
                initialRouteName='Login'
                tabBarOptions={{
                    activeBackgroundColor: '#9575CD',
                    inactiveBackgroundColor: '#D1C4E9',
                    activeTintColor: '#ffffff',
                    inactiveTintColor: 'gray'
                }}>
                <tabNavigator.Screen 
                name='Login' 
                component={LoginTab}
                options={{
                    title: 'Login',
                    tabBarIcon:({ tintColor }) => (
                        <Icon
                          name='sign-in'
                          type='font-awesome'            
                          size={24}
                          iconStyle={{ color: tintColor }}
                        />
                      )
                }}
                />
                <tabNavigator.Screen 
                    name='Register' 
                    component={RegisterTab}
                    options={{
                        title: 'Register',
                        tabBarIcon:({ tintColor }) => (
                            <Icon
                              name='user-plus'
                              type='font-awesome'            
                              size={24}
                              iconStyle={{ color: tintColor }}
                            />
                          )
                    }}
                />
            </tabNavigator.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 5
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        justifyContent: 'center'
    },
    image: {
        width: 80,
        height: 60
    },
    formInput: {
        margin: 5
    },
    formCheck: {
        margin: 5,
        backgroundColor: null
    }
})

export default Login