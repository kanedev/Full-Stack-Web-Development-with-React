import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Picker, Switch, Button, Alert, Modal } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-datepicker'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from 'react-native-animatable';




export default class Reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            dateVisible: false,
            modalVisible: false
        }
    }

    toggleModal() {
        this.setState({ modalVisible: !this.state.modalVisible });
    }

    showConfirmationAlert=()=>{
        Alert.alert('Your Reservation OK?',
        "Number of Guests:"+this.state.guests+"\n"+    "Smoking:"+this.state.smoking+"\n"+
        "Date and Time:"+this.state.date
    
        ,[
            {text:"Cancel",style:'cancel',onPress:()=>{this.handleReservation();}},
            {text:'Ok', onPress:()=>{this.handleReservation();}

            }],{cancelable:true})
    }
    


    hideDatePicker = () => {
        this.setState({ dateVisible: false });
    }
    showDatePicker = () => {
        this.setState({ dateVisible: true });
    }

    datePressed = (date) => {
        date = new Date(date.getTime())
        this.setState({ date: date });
        this.hideDatePicker();
    }

    handleReservation() {

        //   Alert.alert("RESVERVATION Guests: " + this.state.guests +
        //       "\nDate: " + this.state.date.toUTCString());
        // console.log("date:::::::::::::::"+this.state.date.toUTCString());
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date()
        });
    }

    render() {

        return (
            <SafeAreaView>
<Animatable.View animation="zoomIn" duration={500}>
                <View style={styles.row}>

                    <Text style={styles.label} >Guests:</Text>
                    <Picker style={styles.item}
                        selectedValue={this.state.guests}
                        onValueChange={(item, index) => {
                            this.setState({ guests: item });
                        }}>
                        <Picker.Item value="1" label="1" />
                        <Picker.Item value="2" label="2" />
                        <Picker.Item value="3" label="3" />
                        <Picker.Item value="4" label="4" />
                        <Picker.Item value="5" label="5" />

                    </Picker>


                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Smoking/Non-Smoking:</Text>
                    <Switch
                        style={styles.item}
                        value={this.state.smoking}
                        trackColor="blue"
                        onValueChange={(value) => {
                            this.setState({ smoking: value })
                        }}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Date and Time:</Text>
                    <Text style={styles.item}>{this.state.date.getDate() + '-' + this.state.date.getMonth() + '-' + this.state.date.getFullYear()}</Text>
                    <Icon type="font-awesome-5" name="calendar-alt" raised onPress={() => {
                        this.setState({ dateVisible: true })
                    }} />

                    <DateTimePickerModal
                        isVisible={this.state.dateVisible}
                        mode='datetime'
                        minimumDate={this.state.date}
                        onConfirm={this.datePressed}
                        onCancel={this.hideDatePicker}
                    />

                </View>



                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 30
                }}>
                    <Button
                        onPress={() => this.showConfirmationAlert()}
                        color="green"
                        title="Reserve"
                        accessibilityLabel="Learn about Green Button"

                    />


                </View>

                <Modal
                    animationType="slide"
                    visible={this.state.modalVisible}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                    transparent={false}
                >
                    <SafeAreaView >
                        <Text style={{fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'blue',
        textAlign: 'center',
        color: 'white',
        marginBottom: 15}}>Your Reservation Details</Text>
                           <View style={styles.row}>
                    <Text style={styles.label}>Guests</Text>
                    <Text style={styles.item}>{this.state.guests}</Text>
                        </View>
                        <View style={styles.row}>
                    <Text style={styles.label}>Smoking</Text>
                    <Text style={styles.item}>{this.state.smoking ? "Yes" : "No"}</Text>
                        </View>
                        <View style={styles.row}>
                    <Text style={styles.label}>Date and Time:</Text>
                    <Text style={{flex:4}}>{this.state.date.toUTCString()}</Text>
                        </View>
                        <View style={styles.modalrow}>
                            <Button title="Close" onPress={() => { this.toggleModal(); this.handleReservation(); }}
                                color="blue" style={{ flex: 1, margin: 10 }} />
                        </View>
                    </SafeAreaView>
                </Modal>
</Animatable.View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    modalrow:{
        fontSize: 15,
        fontWeight: 'bold',
        
        textAlign: 'center',
       
        margin: 10
  
    },
    label: {
        flex: 2,
        fontWeight: 'bold',
        margin: 20

    },
    item: {
        flex: 1,
        margin: 20
    }

});