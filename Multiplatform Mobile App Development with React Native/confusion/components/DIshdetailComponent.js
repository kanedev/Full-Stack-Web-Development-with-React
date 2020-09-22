import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, Modal, TextInput, Button, PanResponder, Alert } from 'react-native';
import { Card, Icon, Rating } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import baseUrl from '../shared/baseUrl';
import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { color, set } from 'react-native-reanimated';


const mapStateToProps = (state) => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,

    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        postFavorite: (dish) => dispatch(postFavorite(dish)),
        postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
    };
};



function RenderDish(props) {
    const [isMV, setMV] = useState(false);
    const [name, setName] = useState('');
    const [cmt, setCmt] = useState('');
    const [rt, setRt] = useState(3);
  //  handleViewRef = ref => this.view = ref;
    let dish = props.dish;
     handleViewRef=ref=>this.view=ref;

     const recognizeComment=({moveX,moveY,dx,dy})=>{
            if(dx>200){
                return true;
            }
            return false;
     };

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200) {
            return true;
        }
        return false;

    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (event, gestureState) => true,
        onPanResponderGrant:()=>{this.view.rubberBand(1000)
                                                        .then(endState=>console.log(endState.finished?"Finished":"Cancelled"))},
        onPanResponderEnd: (event, gestureState) => {
            if (recognizeDrag(gestureState)) {
                Alert.alert("Do you want to add ",
                  dish.name + " as favorite",
                    [
                        { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes', onPress: () => props.favorite ? console.log("Already Favorite") : props.onPress() }
                ],
                    { cancelable: false }
                );
            }
            if(recognizeComment(gestureState)){
                setMV(!isMV);
            }
            return true;
        }
    });

    if (dish != null) {


        return (
            <Animatable.View  ref={this.handleViewRef} {...panResponder.panHandlers}>
                <Card
                    featured={dish.name}
                    image={{ uri: baseUrl + dish.image }}
                >
                    <Text style={{ margin: 10 }}> {dish.description} </Text>
                    <View style={styles.row}>

                        <Icon name={props.favorite ? 'heart' : 'heart-o'} type="font-awesome"
                            color="red" reverse raised size={20} onPress={props.onPress} />
                        <Icon name="pencil" type="font-awesome" raised reverse color="#d83ed8" size={20}
                            onPress={() => setMV(!isMV)} />
                    </View>
                    <Modal
                        animationTye="slide"
                        visible={isMV}
                        transparent={false}
                        onDismiss={() => setMV(!isMV)}
                        onRequestClose={() => setMV(!isMV)}

                    >
                        <SafeAreaView>

                            <Text style={{
                                textAlign: 'center',
                                backgroundColor: '#d83ed8', color: 'white', fontWeight: 'bold', fontSize: 20
                            }}>ADD COMMENTS</Text>

                            <Rating showRating startingValue={3} onFinishRating={(r) => setRt(r)} />

                            <View style={styles.row}>
                                <View style={{ flex: 1, height: 20 }}>
                                    <Icon name="user-tie" type="font-awesome-5" size={24} /></View>
                                <TextInput style={styles.text}
                                    onChangeText={text => setName(text)}
                                    placeholder="Enter Name"
                                />
                            </View>
                            <View style={styles.row}>
                                <View style={{ flex: 1, height: 20 }}>
                                    <Icon name="comment" type="font-awesome-5" size={24} /></View>
                                <TextInput style={{ ...styles.text, height: 50 }}
                                    onChangeText={text => setCmt(text)}
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholder='Enter Comment'
                                />
                            </View>
                            <View style={{ ...styles.row, marginTop: 50 }}>
                                <Button color="#d83ed8" title="Submit" onPress={() => {
                                    props.onPressAddComment(dish.id, rt, name, cmt);
                                    setMV(false);
                                }} />
                            </View>
                            <View style={{ ...styles.row, marginTop: 50 }}>
                                <Button color="#d308d3" title="Back" onPress={() => { setMV(false); }} />
                            </View>
                        </SafeAreaView>
                    </Modal>
                </Card>
            </Animatable.View>
        );

    } else {
        return (<View></View>);
    }

}

function RenderComments(props) {
    let cm = props.comments;

    let renderComments = ({ item, index }) => {
        let dates = new Date(item.date).toUTCString();
        return (<View key={index} style={{ borderBottomWidth: 1, borderBottomColor: "#bfb1b1", margin: 5 }} >
            <Rating style={{ alignItems: 'flex-start' }} imageSize={15} startingValue={item.rating} readonly />

            <Text style={{ fontSize: 18, fontWeight: 'bold' }} >{item.comment}</Text>
            <Text>{item.author + " => " + dates}{"\n"}</Text>

        </View>);
    };

    return (

        <Card title="Comments">

            <FlatList
                data={cm}
                renderItem={renderComments}
                keyExtractor={x => x.id.toString()}
            />

        </Card>)
}

class DishDetail extends Component {



    render() {
        const { params } = this.props.route;

        let favPressed = (dish) => {
            this.props.postFavorite(dish);
        }

        console.log(params.dishId);
        // const dId = this.props.route.getParam(dishId, '')
        return (<SafeAreaView>
            <ScrollView>
                <Animatable.View animation="fadeInDown" duration={2000}>
                    <RenderDish dish={this.props.dishes.dishes[params.dishId]}
                        favorite={this.props.favorites.some(x => x == params.dishId)}
                        onPress={() => favPressed(params.dishId)}
                        onPressAddComment={(dishId, rating, author, comment) => this.props.postComment(dishId, rating, author, comment)} />
                </Animatable.View>
                <Animatable.View animation="fadeInUp" duration={2000}>
                    <RenderComments comments={this.props.comments.comments.filter((x) => x.dishId == params.dishId)} />
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>);
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', margin: 20
    },
    text: { height: 24, borderBottomColor: 'grey', borderBottomWidth: 2, flex: 5, margin: 10 },
    l: {
        flex: 1
    },
    r: {
        flex: 4
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);