import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, KeyboardAvoidingView, ScrollView, Animated, Keyboard, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var FloatingLabel = require('react-native-floating-labels');
import { Dimensions } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';


class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.navigateToOtherComponent = this.navigateToOtherComponent.bind(this);
        _self = this;
        this.state = {
            dirty: false,
            phone: '',
            password:'',
            phoneFlag: true,
            otpFlag: false,
            regFlag: false,
            loader: false,
            logoImage : require('../../images/logo.png'),
            containerStyle:{
                height : Dimensions.get('window').height-250
            },
            parentContainer : {
                height: Dimensions.get('window').height+50,
                backgroundColor:'white',
            },
            toScroll: true
        };
        AsyncStorage.getItem('userLoginData').then((value) => {
            this.setState({'userLoginData': value});
            if(this.state.userLoginData) {
                this.props.navigation.navigate('Home');
            }
        }).done();
    }

    componentDidMount () {
        
        if(_self.state.regFlag){
            _self.setState({containerStyle:{height : Dimensions.get('window').height-80}})
        }
        else{
            _self.setState({containerStyle:{height : Dimensions.get('window').height-250}})
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    }

    componentWillUnmount () {
        
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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
        this.setState({phone:''});
        this.setState({password:''});
        const resetAction = StackActions.reset({
            index : 0 ,
            actions : [NavigationActions.navigate({routeName : 'Signup'})],

        });
        this.props.navigation.dispatch(resetAction);
    }
    navigateToForgotPassword(){
        this.setState({phone:''});
        this.setState({password:''});
        const resetAction = StackActions.reset({
            index : 0 ,
            actions : [NavigationActions.navigate({routeName : 'Forgot'})],

        });
        this.props.navigation.dispatch(resetAction);
    }
    navigateToOtherComponent(component){
        this.setState({phone:''});
        this.setState({password:''});
        const resetAction = StackActions.reset({
            index : 0 ,
            actions : [NavigationActions.navigate({routeName : component})],

        });
        this.props.navigation.dispatch(resetAction);
    }

    onLoginPress() {
      this.setState({loader:true});
        fetch('https://api.myshoperoo.com/public/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: this.state.phone,
                password: this.state.password
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({loader:false});
                if (responseJson.error) {
                    alert(responseJson.message);
                } else {
                    console.log(responseJson);
                    this.setState({phone:''});
                    this.setState({password:''});
                    AsyncStorage.setItem('userLoginData', JSON.stringify(responseJson.data));
                    this.props.navigation.navigate('Home');
                }
            })
            .catch((error) => {
              this.setState({loader:false});
                console.log(error);
            })
    }

    render() {

        return (

            <View style={this.state.parentContainer} keyboardShouldPersistTaps="handled">
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
                                               underlineColorAndroid = 'transparent'
                                               keyboardType='numeric'
                                               value={this.state.phone}
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
                                               underlineColorAndroid = 'transparent'
                                               secureTextEntry = { true }
                                               value={this.state.password}
                                               onChangeText = {
                                                   (text) => this.setState({ password: text })
                                               } >
                                    Password
                                </FloatingLabel>
                            </View>
                            <View style = { styles.submitButtonView } >
                                <TouchableHighlight onPress = { this.onLoginPress.bind(this)}
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
                    {
                      this.state.loader?
                      <View style={[styles.loaderImageView,this.state.loadingStyle]}>

                        <Image style={{position:'absolute', width:60, height:60}} source={require('../../images/preloader.gif')}  />
                      </View>
                      :
                      <View></View>
                    }
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
    },
    loaderText:{
      backgroundColor: '#905b35',
      padding:10,
      color:'white',
      borderRadius:5,
      opacity : 0.7,
      paddingLeft:20,
      paddingRight:20
    },
    loaderImageView:{
      position: 'absolute',
      width:Dimensions.get('window').width,
      height: 50,
      bottom: 200,
      alignItems:'center',
      flex: 1,

    },
});

export default Login;
