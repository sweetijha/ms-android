import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var FloatingLabel = require('react-native-floating-labels');
import { Dimensions } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { createStackNavigator } from 'react-navigation';


class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.navigateToOtherComponent = this.navigateToOtherComponent.bind(this);
        _self = this;
        this.state = {
            dirty: false,
            phoneFlag: true,
            otpFlag: false,
            regFlag: false,
            logoImage : require('../../images/logo.png'),
            containerStyle:{
                height : Dimensions.get('window').height-250
            },
            parentContainer : {
                height: Dimensions.get('window').height+50,
                backgroundColor:'white',
            }
        };
    }

    componentDidMount () {
        if(this.state.regFlag){
            this.setState({containerStyle:{height : Dimensions.get('window').height-80}})
        }
        else{
            this.setState({containerStyle:{height : Dimensions.get('window').height-250}})
        }
        console.log(Dimensions.get('window').height);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    _keyboardDidShow (e) {
        _self.setState({parentContainer :{
                height: Dimensions.get('window').height - e.endCoordinates.height,
                backgroundColor:'white'
            }});
        if(_self.state.regFlag){
            _self.setState({containerStyle:{height : Dimensions.get('window').height-80}})
            _self.setState({logoImage:require('../../images/logo.png')})
        }
        else{
            _self.setState({containerStyle:{height : Dimensions.get('window').height-250}})
            _self.setState({logoImage:require('../../images/logo.png')})
        }
    }

    _keyboardDidHide () {
        _self.setState({parentContainer :{
                height: Dimensions.get('window').height+50,
                backgroundColor:'white'
            }});
        _self.setState({logoImage:require('../../images/logo.png')})
    }
    onBlur() {
        console.log('#####: onBlur');
    }
    navigateToSignup(){
        this.props.navigation.navigate('Signup');
    }
    navigateToForgotPassword(){
        this.props.navigation.navigate('Forgot');
    }
    navigateToOtherComponent(component){
        this.props.navigation.navigate(component);
    }
    onLoginPress() {
        console.log(this.state.phone);
        fetch('https://devapi.myshoperoo.com/public/login', {
            method : 'POST',
            headers : {
                'Accept':'application/json',
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                phone : this.state.phone,
                password : this.state.password
            }),
        })
            .then((response)=> response.json())
            .then((responseJson) =>{
                if(responseJson.error){
                    alert(responseJson.message);
                }else{
                    this.props.navigation.navigate('Home');
                }
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    render() {
        return (
            <View style={this.state.parentContainer}>
                <ScrollView style={styles.scrollView}>
                    {
                        this.state.regFlag?
                            <View style={styles.vLogoView}>
                                <Image source={this.state.logoImage} style={styles.logoImage} />
                            </View>
                            :
                            <View style={styles.logoView}>
                                <Image source={require('../../images/logo.png')} style={styles.logoImage} />
                            </View>

                    }

                    <View style={[styles.container, this.state.containerStyle]}>


                        <View style = { styles.formField }>
                            <View style = { styles.inputStyle } >
                                <Image source = { require('../../images/mobileicon.png') }
                                       style = { styles.formIcon} />
                                <Text style = { styles.plusOneLabel } >+1</Text>
                                <FloatingLabel labelStyle = { styles.labelInput }
                                               inputStyle = { styles.input }
                                               style = { styles.formInput }
                                               onBlur = { this.onBlur }
                                               underlineColorAndroid = 'transparent'
                                               keyboardType='numeric'
                                               onChangeText = {
                                                   (text) => this.setState({ phone: text })
                                               } >
                                    Mobile Number(1234567890)
                                </FloatingLabel>
                            </View>
                            <View style = { styles.inputStyle }>
                                <Image source = { require('../../images/passwordicon.png') }
                                       style = { styles.formIcon }/>
                                <FloatingLabel labelStyle = { styles.labelInput }
                                               inputStyle = { styles.input }
                                               style = { styles.formInputPassword }
                                               onBlur = { this.onBlur }
                                               underlineColorAndroid = 'transparent'
                                               secureTextEntry = { true }
                                               onChangeText = {
                                                   (text) => this.setState({ password: text })
                                               } >
                                    Password
                                </FloatingLabel>
                            </View>
                            <View style = { styles.submitButtonView } >
                                <TouchableHighlight onPress = { this.onLoginPress.bind(this) }
                                                    style = { styles.submitButton }
                                                    underlayColor = '#fff' >
                                    <Text style = { styles.submitButtonText } > Login </Text>
                                </TouchableHighlight >
                            </View>
                            <View style = { styles.extraLink } >
                                <Grid >
                                    <Col >
                                        <Text onPress = { this.navigateToSignup.bind(this) }
                                              style = {
                                                  { textAlign: 'left' }
                                              } > New User
                                        </Text>
                                    </Col >
                                    <Col >
                                        <Text onPress = { this.navigateToForgotPassword.bind(this) }
                                              style = {
                                                  { textAlign: 'right' }
                                              } > Forgot Password
                                        </Text>
                                    </Col >
                                </Grid >
                            </View >
                        </View >

                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    labelInput: {
        color: '#a8a8a8',
        fontSize: 16,
        marginTop:10
    },
    inputStyle:{
        borderBottomWidth: 1,
        borderColor: '#c9c9c9',
        width:Dimensions.get('window').width - 40,
        marginLeft:20,
    },
    formInput: {
        marginLeft: 50,
        marginRight: 20,
        width: Dimensions.get('window').width - 70,
        top:5,
        position: 'relative'
    },
    formInputPassword: {
        marginLeft: 30,
        marginRight: 20,
        width: Dimensions.get('window').width - 70,
        top:5,
        position: 'relative'
    },
    input: {
        borderWidth: 0,
        fontSize:16,
        marginTop:10
    },
    formIcon:{
        position: 'absolute',
        width: 20,
        height:20,
        left:10,
        bottom:8
    },
    plusOneLabel:{
        position: 'absolute',
        left:30,
        bottom:5,
        fontSize:16
    },
    formField:{
        position:'absolute',
        backgroundColor:'white',
        width: Dimensions.get('window').width,
        bottom: 30,
        zIndex:2000
    },
    regFormField:{
        position:'absolute',
        backgroundColor:'white',
        width: Dimensions.get('window').width,
        bottom: 50,
        zIndex:2000
    },
    submitButtonView:{
        width: Dimensions.get('window').width - 80,
        left: 40,
        position: 'relative',
        marginTop: 20,
    },
    submitButton:{
        padding:10,
        backgroundColor:'#945e36',
        borderRadius:40,
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden'
    },
    submitButtonText:{
        color:'#ffffff',
        textAlign:'center',
        fontSize:20
    },
    extraLink:{
        marginTop:20,
        width:Dimensions.get('window').width - 80,
        marginLeft:40,
    },
    logoView:{
        alignItems:'center',
        position:'relative',
        width: Dimensions.get('window').width,
        height:200,
        top:100,
        zIndex:1000
    },
    scrollView:{
        backgroundColor:'white',
        height: Dimensions.get('window').height
    },
    vLogoView:{
        alignItems:'center',
        position:'relative',
        width: Dimensions.get('window').width,
        height:150,
        top:100,
        zIndex:1000
    }
});

export default Login;
