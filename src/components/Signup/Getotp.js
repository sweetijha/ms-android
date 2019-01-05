import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, KeyboardAvoidingView, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var FloatingLabel = require('react-native-floating-labels');
import { Dimensions } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { createStackNavigator } from 'react-navigation';

class Getotp extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      dirty: false,
      phoneFlag: true,
      otpFlag: false,
      regFlag: false,
    };
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
  onLoginPress(){
    console.log('phone');

    // fetch('http://softbizz.in/IdealMatch/public/login', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     phone: this.state.phone,
    //     password: this.state.password,
    //     login_type: 'otp',
    //   }),
    // }).then((response) => response.json())
    //     .then((responseJson) => {
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });

  }
  onGetOtp(){
    this.setState({
      phoneFlag: true,
      otpFlag: false,
      regFlag: true,
    })
  }
  onVerifyOtp(){
    this.setState({
      phoneFlag: true,
      otpFlag: true,
      regFlag: false,
    })
  }
  render() {
    return (
      <View style={styles.formField}>
        <View style={styles.inputStyle}>
          <Image source={require('../../images/mobileicon.png')} style={styles.formIcon} />
          <Text style={styles.plusOneLabel}>&nbsp;+1</Text>
          <FloatingLabel
              labelStyle={styles.labelInput}
              inputStyle={styles.input}
              style={styles.formInput}
              onBlur={this.onBlur}
              underlineColorAndroid= 'transparent'
            >Mobile Number (1234567890)</FloatingLabel>
        </View>
        <View style={styles.submitButtonView}>
          <TouchableHighlight
            onPress={this.onGetOtp.bind(this)}
            style={styles.submitButton}
            underlayColor='#fff'
          >
          <Text style={styles.submitButtonText}>Get Verification Code</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.extraLink}>
          <Grid>
              <Col>
                <Text onPress={this.navigateToForgotPassword.bind(this)} style={{textAlign:'center'}}>Login</Text>
              </Col>
          </Grid>

        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
      height : Dimensions.get('window').height
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
    marginTop:10,
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
    position:'relative',
    bottom:0
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
    top:100,
    flex: 1,
    alignItems:'center'
  },
  scrollView:{

  }
});

export default Getotp;
