import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, KeyboardAvoidingView, ScrollView, Keyboard , AsyncStorage} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var FloatingLabel = require('react-native-floating-labels');
import { Dimensions } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Signup extends Component {
    constructor(props, context) {
        super(props, context);
        this.navigateToOtherComponent = this.navigateToOtherComponent.bind(this);
        _self = this;
        this.state = {
            dirty: false,
            phoneFlag: true,
            otpFlag: false,
            regFlag: false,
            loader: false,
            signupErrorflag : false,
            signupErrorMessage : "",
            fullName :"",
            phone:"",
            email:"",
            password:"",
            company_code:"",
            unique_code :"",
            editProfileErrorFlag : false,
            editProfileErrorLabel : '',
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
        //console.log(Dimensions.get('window').height);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    }

    // componentWillUnmount () {
    //     this.keyboardDidShowListener.removeListener('keyboardDidShow', this._keyboardDidShow);
    //     this.keyboardDidHideListener.removeListener('keyboardDidHide', this._keyboardDidHide);
    // }

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
        const resetAction = StackActions.reset({
            index : 0 ,
            actions : [NavigationActions.navigate({routeName : 'Signup'})],

        });
        this.props.navigation.dispatch(resetAction);
    }
    navigateToForgotPassword(){
        const resetAction = StackActions.reset({
            index : 0 ,
            actions : [NavigationActions.navigate({routeName : 'Forgot'})],

        });
        this.props.navigation.dispatch(resetAction);
    }
    navigateToOtherComponent(component){
        const resetAction = StackActions.reset({
            index : 0 ,
            actions : [NavigationActions.navigate({routeName : component})],

        });
        this.props.navigation.dispatch(resetAction);
    }

    // Sign Up
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    onSignUpPress(){
      if(this.state.fullName == "" || this.state.email == "" || this.state.phone == "" || this.state.password == ""){
        this.setState({
          signupErrorflag : true,
          signupErrorMessage : "(*) Please fill all the mandatory fields"
        });
      }else{
      if(this.validateEmail(this.state.email)){
        this.setState({signupErrorflag : false});
        this.setState({signupErrorMessage : ""});
        this.setState({loader:true});
          fetch('https://api.myshoperoo.com/public/signup',{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
              body: JSON.stringify({
              name: this.state.fullName,
              phone: this.state.phone,
              email : this.state.email,
              password : this.state.password,
              company_code : this.state.company_code,
              unique_code : this.state.unique_code
            }),
          }).then((response) => response.json())
              .then((responseJson) => {

                  if(responseJson.error){
                    this.setState({loader:false});
                      alert(responseJson.message);

                  }else{
                      //alert(responseJson.message);
                      this.onLoginPress(this.state.phone,this.state.password);
                  }
              })
              .catch((error) => {
                this.setState({loader:false});
                console.error(error);
              });
      }else{
        this.setState({signupErrorflag : true});
        this.setState({signupErrorMessage : "* Incorrect Email Address"});
      }
    }

    }
    onLoginPress(phone, password) {
        //console.log(this.state.phone);
        fetch('https://api.myshoperoo.com/public/login', {
            method : 'POST',
            headers : {
                'Accept':'application/json',
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                phone : phone,
                password : password
            }),
        })
            .then((response)=> response.json())
            .then((responseJson) =>{
              this.setState({loader:false});
                if(responseJson.error){
                    alert(responseJson.message);
                }else{
                    AsyncStorage.setItem('userLoginData', JSON.stringify(responseJson.data));
                    const resetAction = StackActions.reset({
                        index : 0 ,
                        actions : [NavigationActions.navigate({routeName : 'Home'})],
            
                    });
                    this.props.navigation.dispatch(resetAction);
                }
            })
            .catch((error)=>{
              this.setState({loader:false});
                console.log(error);
            })
    }

    // Get OTP

    onGetOtp(){
      if(this.state.phone == ""){
        this.setState({
          signupErrorflag : true,
          signupErrorMessage : "Enter Phone Number"
        });
      }else if(this.state.phone.length!=10){
        this.setState({
          signupErrorflag : true,
          signupErrorMessage : "Phone number should be 10 digits"
        });
      }else{
        this.setState({
          signupErrorflag : false,
          signupErrorMessage : ""
        });
      this.setState({loader:true});
        fetch('https://api.myshoperoo.com/public/get_otp',{
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                type : 'signup',
                phone : this.state.phone
            }),
        })
            .then((response)=> response.json())
            .then((responseJson)=>{
              this.setState({loader:false});
                if(responseJson.error){
                  this.setState({
                    signupErrorflag : true,
                    signupErrorMessage : responseJson.message
                  });
                }else{
                    //alert(responseJson.message);
                    this.setState({myAuthyId: responseJson.authy_id});
                    console.log(responseJson);
                    console.log(this.state.myAuthyId);
                    this.setState({
                        phoneFlag: false,
                        otpFlag: true,
                        regFlag: false,
                    })
                }
            })
            .catch((error) => {
              this.setState({loader:false});
                console.error(error);
            });
          }
    }

    // Verify OTP

    onVerifyOtp(){
      this.setState({
        signupErrorflag : false,
        signupErrorMessage : ""
      });
      this.setState({loader:true});
        fetch('https://api.myshoperoo.com/public/verify_otp',{
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                otp : this.state.otp,
                authy_id : this.state.myAuthyId
            }),
        })
            .then((response)=>response.json())
            .then((responseJson)=>{
              this.setState({loader:false});
              console.log(this.state.otpFlag);
                if(!responseJson.success){
                  this.setState({
                    signupErrorflag : true,
                    signupErrorMessage : responseJson.message
                  });
                }else{
                    this.setState({otp:''});
                    Keyboard.dismiss();
                    this.setState({
                      signupErrorflag : false,
                      signupErrorMessage : ""
                    });
                    this.setState({
                        phoneFlag: false,
                        otpFlag: false,
                        regFlag: true,
                        containerStyle : {height : Dimensions.get('window').height-80}
                    })
                }
            })
            .catch((error)=>{
              this.setState({loader:false});
                console.error(error);
            });
    }
    render() {
        return (
            <View style={[this.state.parentContainer,{paddingBottom:this.state.regFlag?60:0}]}>
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
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
                        {
                            this.state.phoneFlag ?
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
                                            keyboardType='numeric'
                                            value={this.state.phone}
                                            onChangeText = {
                                                (text) => {
                                                  if(this.state.phone.length ==10){
                                                    this.setState({
                                                      signupErrorflag : false,
                                                      signupErrorMessage : ""
                                                    });
                                                  }
                                                  this.setState({ phone: text })
                                                }
                                            }
                                        >Mobile Number (1234567890)</FloatingLabel>
                                    </View>
                                    {this.state.signupErrorflag?
                                    <View style={{paddingLeft:20}}>
                                      <Text style={{color:'red'}}>{this.state.signupErrorMessage}</Text>
                                    </View>:
                                    null
                                  }
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
                                                <Text onPress={()=>this.navigateToOtherComponent('Login')} style={{textAlign:'center'}}>Login</Text>
                                            </Col>
                                        </Grid>

                                    </View>
                                </View>
                                :
                                this.state.otpFlag ?
                                <View style={styles.formField} hide={this.state.otpFlag}>
                                        <View style={styles.inputStyle}>
                                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                                            <FloatingLabel
                                                labelStyle={styles.labelInput}
                                                inputStyle={styles.input}
                                                style={styles.formInputPassword}
                                                onBlur={this.onBlur}
                                                underlineColorAndroid= 'transparent'
                                                keyboardType='numeric'
                                                value={this.state.otp}
                                                onChangeText = {
                                                    (text) => this.setState({ otp: text })
                                                }
                                            >Enter Verification Code</FloatingLabel>
                                        </View>
                                        {this.state.signupErrorflag?
                                        <View style={{paddingLeft:20}}>
                                          <Text style={{color:'red'}}>{this.state.signupErrorMessage}</Text>
                                        </View>:
                                        null
                                      }
                                        <View style={styles.submitButtonView}>
                                            <TouchableHighlight
                                                onPress={this.onVerifyOtp.bind(this)}
                                                style={styles.submitButton}
                                                underlayColor='#fff'
                                            >
                                                <Text style={styles.submitButtonText}>Submit</Text>
                                            </TouchableHighlight>
                                        </View>
                                        <View style={styles.extraLink}>
                                            <Grid>
                                                <Col>
                                                    <Text onPress={()=>this.navigateToOtherComponent('Login')} style={{textAlign:'center'}}>Login</Text>
                                                </Col>
                                            </Grid>

                                        </View>
                                    </View>:
                                    <View style={styles.regFormField}>
                                        <View style={styles.inputStyle}>
                                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                                            <FloatingLabel
                                                labelStyle={styles.labelInput}
                                                inputStyle={styles.input}
                                                style={styles.formInputPassword}
                                                onBlur={this.onBlur}
                                                value={this.state.fullName}
                                                underlineColorAndroid= 'transparent'
                                                onChangeText = {
                                                    (text) => this.setState({ fullName: text })
                                                }
                                            >Full Name *</FloatingLabel>
                                        </View>
                                        <View style={styles.inputStyle}>
                                            <Image source={require('../../images/mobileicon.png')} style={styles.formIcon} />
                                            <Text style={styles.plusOneLabel}>&nbsp;+1</Text>
                                            <FloatingLabel
                                                labelStyle={styles.labelInput}
                                                inputStyle={styles.input}
                                                style={styles.formInput}
                                                onBlur={this.onBlur}
                                                underlineColorAndroid= 'transparent'
                                                keyboardType='numeric'
                                                value={this.state.phone}
                                                editable={false}
                                                onChangeText = {
                                                    (text) => this.setState({ phone: text })
                                                }
                                            >Mobile Number (1234567890) *</FloatingLabel>
                                        </View>
                                        <View style={styles.inputStyle}>
                                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                                            <FloatingLabel
                                                labelStyle={styles.labelInput}
                                                inputStyle={styles.input}
                                                style={styles.formInputPassword}
                                                onBlur={this.onBlur}
                                                underlineColorAndroid= 'transparent'
                                                keyboardType='email-address'
                                                onChangeText = {
                                                    (text) => this.setState({ email: text })
                                                }
                                            >Email ID *</FloatingLabel>
                                        </View>
                                        <View style={styles.inputStyle}>
                                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                                            <FloatingLabel
                                                labelStyle={styles.labelInput}
                                                inputStyle={styles.input}
                                                style={styles.formInputPassword}
                                                onBlur={this.onBlur}
                                                underlineColorAndroid= 'transparent'
                                                secureTextEntry={true}
                                                onChangeText = {
                                                    (text) => this.setState({ password: text })
                                                }
                                            >Password *</FloatingLabel>
                                        </View>
                                        <View style={styles.inputStyle}>
                                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                                            <FloatingLabel
                                                labelStyle={styles.labelInput}
                                                inputStyle={styles.input}
                                                style={styles.formInputPassword}
                                                onBlur={this.onBlur}
                                                underlineColorAndroid= 'transparent'
                                                onChangeText = {
                                                    (text) => this.setState({ company_code: text })
                                                }
                                            >Company Code (Optional)</FloatingLabel>
                                        </View>
                                        <View style={styles.inputStyle}>
                                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                                            <FloatingLabel
                                                labelStyle={styles.labelInput}
                                                inputStyle={styles.input}
                                                style={styles.formInputPassword}
                                                onBlur={this.onBlur}
                                                underlineColorAndroid= 'transparent'
                                                onChangeText = {
                                                    (text) => this.setState({ unique_code: text })
                                                }
                                            >Unique Code (Optional)</FloatingLabel>
                                        </View>
                                        {this.state.signupErrorflag?
                                        <View style={{paddingLeft:20}}>
                                          <Text style={{color:'red'}}>{this.state.signupErrorMessage}</Text>
                                        </View>:
                                        null
                                      }
                                        <View style={styles.submitButtonView}>
                                            <TouchableHighlight
                                                onPress={this.onSignUpPress.bind(this)}
                                                style={styles.submitButton}
                                                underlayColor='#fff'
                                            >
                                                <Text style={styles.submitButtonText}>Submit</Text>
                                            </TouchableHighlight>
                                        </View>
                                        <View style={styles.extraLink}>
                                            <Grid>
                                                <Col>
                                                    <Text onPress={()=>this.navigateToOtherComponent('Forgot')} style={{textAlign:'left'}}>Forgot Password</Text>
                                                </Col>
                                                <Col>
                                                    <Text onPress={()=>this.navigateToOtherComponent('Login')} style={{textAlign:'right'}}>Login</Text>
                                                </Col>
                                            </Grid>

                                        </View>
                                    </View>
                        }

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
        top:50,
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
    errorStyle:{
        width:deviceWidth - 40,
        marginLeft:10,
    },
});

export default Signup;
