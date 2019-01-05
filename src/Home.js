    import React, { Component } from "react";
    import { StyleSheet, Text, View, Image, Button, TouchableHighlight, KeyboardAvoidingView,  BackHandler, Alert, ScrollView, StatusBar, TextInput, Keyboard, TouchableOpacity, Linking, AsyncStorage, WebView, Platform} from 'react-native';
    import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
    import { Icon } from 'react-native-elements';
    var FloatingLabel = require('react-native-floating-labels');
    import { Dimensions } from "react-native";
    import { Col, Row, Grid } from "react-native-easy-grid";
    import { createStackNavigator } from "react-navigation";
    import DatePicker from 'react-native-datepicker';
    import Textarea from 'react-native-textarea';
    import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
    import Modal from "react-native-modal";
    import Toast, {DURATION} from "react-native-easy-toast";
    import backAndroid, {hardwareBackPress, exitApp} from 'react-native-back-android';
    import AndroidWebView from 'react-native-webview-file-upload-android';

    const slideAnimation = new SlideAnimation({
      slideFrom: 'top',
      toValue: 0,
      top: 0,
      position: 'absolute'
    });

    const deviceHeight = Dimensions.get('window').height;
    const deviceWidth = Dimensions.get('window').width;

    class Home extends Component {
        constructor(props, context) {
            super(props, context);
            // console.log('inside constructor');
            // console.log((parseInt(new Date().getDate())<10?'0'+new Date().getDate():new Date().getDate())+'-'+(new Date().getMonth()+1)+'-'+new Date().getFullYear());
            this.onOderAutoSave = this.onOderAutoSave.bind(this);
            this.changeDate = this.changeDate.bind(this);
            //this._handleBackPress = this._handleBackPress.bind(this);
            this.hardwareBackPress = this.hardwareBackPress.bind(this);
            _self = this;
            this.state = {
                dimensions: undefined,
                chatBoxFlag : false,
                keyboardOpen : false,
                chatUrl : '',
                date : (parseInt(new Date().getDate())<10?'0'+new Date().getDate():new Date().getDate())+'-'+(new Date().getMonth()+1)+'-'+new Date().getFullYear(),
                typing: false,
                typingTimeout: 0,
                textAreaEditable : true,
                isModalVisible: false,
                isEditProfileModalVisible : false,
                isChangePasswordModalVisible : false,
                isChatModal : false,
                messageContent : [],
                userLoginData : JSON.stringify({
                    name : '',
                    email : ''
                }),
                oldUserData : JSON.stringify({
                    name : '',
                    email : '',
                })
            };
        }

        componentDidMount () {
            this.setState({textAreaStyle :{
                height: Dimensions.get('window').height - 100
            }});
            this.hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
              AsyncStorage.getItem('userLoginData').then((value) => {
                  let tempUrl = "http://dev.myshoperoo.com/tawk.html?name="+JSON.parse(this.state.userLoginData).name+"&email="+JSON.parse(this.state.userLoginData).email_id;
                  console.log(tempUrl);
                  this.setState({'chatUrl':tempUrl})
                  this.setState({'userLoginData': value});
                  this.setState({fullName: JSON.parse(this.state.userLoginData).name});
                  this.setState({email: JSON.parse(this.state.userLoginData).email_id});
                  // console.log(this.state.userLoginData);
                  if(this.state.userLoginData) {
                      this.props.navigation.navigate('Home');
                      this.getOrderDetails();
                  }else{
                      this.props.navigation.navigate('Login');
                  }
              }).done();
              console.log("count" , "userLoginData");
        }

        componentWillUnmount(){
            this.hardwareBackPressListener = BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }

        onPressButtonHandle(){
                this.props.navigation.navigate('Login');
        }

        hardwareBackPress() {
            if(this.state.userLoginData) {
              if(this.state.chatBoxFlag){
                this.setState({ chatBoxFlag: !this.state.chatBoxFlag });
              }else{
                Alert.alert(
                    'MyShoperoo',
                    'Want to quit?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                        {text: 'OK', onPress: () => exitApp()}
                    ],
                    {cancelable: false}
                );
              }

            }else{
                Alert.alert(
                    'MyShoperoo',
                    'Want to go back?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                        {text: 'OK', onPress: () => this.onPressButtonHandle()}
                    ],
                    {cancelable: false}
                );
            }
            return true
        };

        _keyboardDidShow (e) {
            // alert(JSON.stringify(_self.state));
            _self.setState({textAreaStyle :{
              height: Dimensions.get('window').height - e.endCoordinates.height - 100
            }});
            _self.setState({keyboardOpen : true});
            _self.setState({keyboardHeight : e.endCoordinates.height});
            // alert(e.endCoordinates.height);
        }

        _keyboardDidHide () {
            // alert('Keyboard Hidden');
            _self.setState({keyboardOpen : false})
        }
        onLayout = event => {
            if (this.state.dimensions) return // layout was already called
            let {width, height} = event.nativeEvent.layout
            this.setState({dimensions: {width, height}})
        }
        openPopup(){
            this.popupDialog.show(() => {
              console.log('callback - will be called immediately')
            });
        }
        openEditModalPage(){
            this.props.navigation.navigate('Editprofile');
        }
        _openPrivacyPolicy(){
            Linking.openURL(`https://google.com`);
        }
        _openTosPolicy(){
            Linking.openURL(`https://yahoo.com`);
        }

        // Model Content

        _renderModalContent = () => (
            <View style={styles.modalContent}>
                <View style={styles.navBar}>
                    <View style={styles.shortName}>
                        <View style={styles.shortNameData}>
                            <Text style={{fontSize:26, color: 'white'}}>M</Text>
                        </View>
                    </View>
                    <View style={styles.longName}>
                        <Text style={styles.longNameData}>{JSON.parse(this.state.userLoginData).name}</Text>
                        <Text style={styles.longEmailData}>{JSON.parse(this.state.userLoginData).email_id}</Text>
                    </View>
                </View>
                <View style={styles.optionField}>
                    <View style={styles.optionFieldIcon}>
                        <Image source={require('../../images/editprofile.png')} style={styles.optionFieldIconImage}/>
                    </View>
                    <Text style={styles.optionFieldText} onPress={this._editProfileModalToggle}>Edit Profile</Text>
                </View>
                <View style={styles.optionField}>
                    <View style={styles.optionFieldIcon}>
                        <Image source={require('../../images/changepassword.png')} style={styles.optionFieldIconImage}/>
                    </View>
                    <Text style={styles.optionFieldText} onPress={this._changePasswordModalToggle}>Change Password</Text>
                </View>
                <View style={styles.optionField}>
                    <View style={styles.optionFieldIcon}>
                        <Image source={require('../../images/logout.png')} style={styles.optionFieldIconImage}/>
                    </View>
                    <Text style={styles.optionFieldText} onPress={this.onLogoutPress.bind(this)}>Log Out</Text>
                </View>
                <View style={styles.linkField}>
                    <Text style={styles.leftSideLink} onPress={this._openPrivacyPolicy}>Privacy Policy</Text>
                    <Text style={styles.rightSideLink} onPress={this._openTosPolicy}>Terms of Services</Text>
                </View>
            </View>
        );

        // Edit Profile Model

        _editProfileModalContent = () => (
            <View style={styles.optionModalContent}>
                <Text style={styles.editProfileLabel}>Profile</Text>
                <TouchableHighlight onPress={this._editProfileModalToggle} style={styles.closeIcon}>
                    <Image style={styles.closeIcon} source={require('../../images/close.png')} />
                </TouchableHighlight>
                <View style={styles.formField}>
                    <View style={styles.inputStyle}>
                        <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                        <FloatingLabel
                            labelStyle={styles.labelInput}
                            inputStyle={styles.input}
                            style={styles.formInputPassword}
                            underlineColorAndroid= 'transparent'
                            value={this.state.fullName}
                            onChangeText = {
                                (text) => this.setState({fullName: text})
                            }>Name
                        </FloatingLabel>
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
                            value={this.state.email}
                            onChangeText = {
                                (text) => this.setState({email: text})
                            }>Email
                        </FloatingLabel>
                    </View>
                    <View style={styles.submitButtonView}>
                        <TouchableHighlight
                            onPress={this.onEditProfile.bind(this)}
                            style={styles.submitButton}
                            underlayColor='#fff'>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );

        // Change Password Model

        _changePasswordModalContent= () => (
            <View style={styles.optionModalContent}>
                <Text style={styles.editProfileLabel}>Change Password</Text>
                    <TouchableHighlight onPress={this._changePasswordModalToggle} style={styles.closeIcon}>
                        <Image style={styles.closeIcon} source={require('../../images/close.png')} />
                    </TouchableHighlight>
                    <View style={styles.formField}>
                        <View style={styles.inputStyle}>
                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                            <FloatingLabel
                                labelStyle={styles.labelInput}
                                inputStyle={styles.input}
                                style={styles.formInputPassword}
                                onBlur={this.onBlur}
                                underlineColorAndroid= 'transparent'
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText = {
                                    (text) => this.setState({password: text})
                                }>New Password
                            </FloatingLabel>
                        </View>
                        <View style={styles.inputStyle}>
                            <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
                            <FloatingLabel
                            labelStyle={styles.labelInput}
                            inputStyle={styles.input}
                            style={styles.formInputPassword}
                            onBlur={this.onBlur}
                            underlineColorAndroid= 'transparent'
                            //secureTextEntry={true}
                            value={this.state.confirm_password}
                            onChangeText = {
                                (text) => this.setState({confirm_password: text})
                            }>Confirm New Password
                        </FloatingLabel>
                    </View>
                    <View style={styles.submitButtonView}>
                        <TouchableHighlight
                            onPress={this.onChangePassword.bind(this)}
                            style={styles.submitButton}
                            underlayColor='#fff'>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableHighlight>
                    </View>
                 </View>
            </View>
        );

        // Chat Model

        _renderChatModalContent = () => (
            <View style={styles.chatModalContent}>
                <View style={styles.navBar}>
                    <View style={styles.shortName}>
                        <View style={styles.shortNameData}>
                            <Text style={{fontSize:26, color: 'white'}}>M</Text>
                        </View>
                    </View>
                    <View style={styles.longName}>
                        <Text style={[styles.chatLongNameData,{fontSize:24}]}>Mohit Prakash</Text>
                        <Text style={styles.longEmailData}>mohit@ideesys.com</Text>
                    </View>
                </View>
            </View>
        );

        // Rander Button

        _renderButton = (text, onPress) => (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.button}>
                    <Text>{text}</Text>
                </View>
            </TouchableOpacity>
        );

        // Model Hide & Show

        _toggleModal = () =>
            this.setState({ isModalVisible: !this.state.isModalVisible });

        _editProfileModalToggle = () =>{
            this._toggleModal();
            this.setState({ isEditProfileModalVisible: !this.state.isEditProfileModalVisible });
        }

        _editProfileRemoveModal = () =>{
            this.setState({ isEditProfileModalVisible: !this.state.isEditProfileModalVisible });
        }

        _changePasswordRemoveModal = () =>{
            this.setState({isChangePasswordModalVisible: !this.state.isChangePasswordModalVisible });
        }

        _changePasswordModalToggle = () =>{
            this._toggleModal();
            this.setState({ isChangePasswordModalVisible: !this.state.isChangePasswordModalVisible });
        }

        _changeChatModal = () =>{
          // this._toggleModal();
          // this.setState({ isChatModal: !this.state.isChatModal });
          this.setState({ chatBoxFlag: !this.state.chatBoxFlag });
        }

        // Logout

        onLogoutPress(){
            AsyncStorage.removeItem('userLoginData');
            console.log('User Logout');
            this.props.navigation.navigate('Login');
        }

      // Edit Profile

        onEditProfile(){
          fetch('https://devapi.myshoperoo.com/public/update_profile',{
            method : 'POST',
              headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
              },
              body : JSON.stringify({
                  user_id : JSON.parse(this.state.userLoginData).user_id,
                  name : this.state.fullName,
                  email : this.state.email
              }),
          })
          .then((response)=>response.json())
          .then((responseJson)=>{
            if(responseJson.error){
              alert(responseJson.message);
            }else{
              // alert(responseJson.message);
                let tempData = JSON.parse(this.state.userLoginData);
                tempData.name = this.state.fullName;
                tempData.email_id = this.state.email;
                AsyncStorage.setItem('userLoginData', JSON.stringify(tempData));
                this._editProfileRemoveModal();
                this.componentDidMount();
                this.toast.show('Profile Update Successfully.');
            }
          })
          .catch((error)=>{
            console.log(error);
          });
        }

        // Change Password

        onChangePassword(){
            fetch('https://devapi.myshoperoo.com/public/change_password',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    phone  : JSON.parse(this.state.userLoginData).phone,
                    password: this.state.password,
                    confirm_password  :this.state.confirm_password
                }),
            })
            .then((response)=> response.json())
            .then((responseJson)=>{
                if(responseJson.error){
                    alert(responseJson.message);
                }else{
                    //alert(responseJson.message);
                    this.toast.show('Password Change Successfully.');
                    this._changePasswordRemoveModal();
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        }

        // Text Input Auto Save On Order

        onOderAutoSave(){
            const self = this;
            if (self.state.typingTimeout) {
                clearTimeout(self.state.typingTimeout);
            }
            self.setState({
                typing: false,
                typingTimeout: setTimeout(function () {
                    self.onSaveOrder();
                }, 2000)
            });
        }
        dateToDateFormat(date){
            let tDate = date.split('-');
            switch(parseInt(tDate[1])-1){
                case 0 : return tDate[0]+'-Jan-'+tDate[2];
                case 1 : return tDate[0]+'-Feb-'+tDate[2];
                case 2 : return tDate[0]+'-Mar-'+tDate[2];
                case 3 : return tDate[0]+'-Apr-'+tDate[2];
                case 4 : return tDate[0]+'-May-'+tDate[2];
                case 5 : return tDate[0]+'-Jun-'+tDate[2];
                case 6 : return tDate[0]+'-Jul-'+tDate[2];
                case 7 : return tDate[0]+'-Aug-'+tDate[2];
                case 8 : return tDate[0]+'-Sep-'+tDate[2];
                case 9 : return tDate[0]+'-Oct-'+tDate[2];
                case 10 : return tDate[0]+'-Nov-'+tDate[2];
                case 11 : return tDate[0]+'-Dec-'+tDate[2];
            }
            //return this.dateFormat(new Date(tDate[2]+'-'+(parseInt(tDate[1])-1)+'-'+tDate[0]));

        }
        dateFormat(date){
            let tDate = parseInt(date.getDate())<10?'0'+date.getDate():date.getDate();
            switch(parseInt(date.getMonth())){
                case 0 : return tDate+'-Jan-'+date.getFullYear();
                case 1 : return tDate+'-Feb-'+date.getFullYear();
                case 2 : return tDate+'-Mar-'+date.getFullYear();
                case 3 : return tDate+'-Apr-'+date.getFullYear();
                case 4 : return tDate+'-May-'+date.getFullYear();
                case 5 : return tDate+'-Jun-'+date.getFullYear();
                case 6 : return tDate+'-Jul-'+date.getFullYear();
                case 7 : return tDate+'-Aug-'+date.getFullYear();
                case 8 : return tDate+'-Sep-'+date.getFullYear();
                case 9 : return tDate+'-Oct-'+date.getFullYear();
                case 10 : return tDate+'-Nov-'+date.getFullYear();
                case 11 : return tDate+'-Dec-'+date.getFullYear();
            }
        }

        // Save Order

        onSaveOrder(){
            fetch('https://devapi.myshoperoo.com/public/add_order',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    phone  : JSON.parse(this.state.userLoginData).phone,
                    name  : JSON.parse(this.state.userLoginData).name,
                    email  : JSON.parse(this.state.userLoginData).email_id,
                    shopping_list : this.state.orderDetails,
                    date :  this.dateToDateFormat(this.state.date),
                    is_admin : 0,
                    status : 'save'
                }),
            })
            .then((response)=>response.json())
            .then((responseJson)=>{
                if(responseJson.error){
                    alert(responseJson.message);
                }else{
                    this.toast.show(responseJson.message);
                    // this.getOrderDetails();
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        }

        // Get Order Details

        getOrderDetails(){
            let orderStatus  = false;
            fetch('https://devapi.myshoperoo.com/public/get_order',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    phone  : JSON.parse(this.state.userLoginData).phone,
                    date :  this.dateToDateFormat(this.state.date),
                    is_admin : 0,
                })
            })
            .then((response) => response.json())
            .then((responseJson)=>{
                //console.log(responseJson);
                if(responseJson.error){
                    this.setState({orderDetails:''})
                    this.setState({getOrderDetails: responseJson});
                    this.setState({orderStatus:this.state.getOrderDetails.disable});
                    this.setState({outOfOrder:''});
                    console.log(this.state.orderStatus);
                    console.log(responseJson);
                }else{
                    //console.log(orderStatus);
                    this.setState({getOrderDetails: responseJson});
                    console.log(this.state.getOrderDetails);
                    this.setState({orderDetails:this.state.getOrderDetails.data.shopping_list});
                    this.setState({orderStatus:this.state.getOrderDetails.disable});
                    this.setState({outOfOrder:this.state.getOrderDetails.data.status});
                    console.log(this.state.outOfOrder == 'ordered');
                    console.log(this.state.orderStatus);
                }
            })
        }

        changeDate(date){
            //console.log(date);
            this.setState({date: date});
            this.getOrderDetails();
        }

        // Update Order

        onUpdateOrder(){
            fetch('https://devapi.myshoperoo.com/public/add_order',{
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    phone  : JSON.parse(_self.state.userLoginData).phone,
                    name  : JSON.parse(_self.state.userLoginData).name,
                    email  : JSON.parse(_self.state.userLoginData).email_id,
                    shopping_list : _self.state.orderDetails,
                    date :  _self.dateToDateFormat(_self.state.date),
                    is_admin : 0,
                    status : 'update'
                }),
            })
            .then((response)=>response.json())
            .then((responseJson)=>{
                if(responseJson.error){
                    alert(responseJson.message);
                }else{
                    // console.log(responseJson);
                    // console.log(responseJson.error);
                     //_self.toast.show(responseJson.message);
                    _self.getOrderDetails();
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        }

        // getUserData(){
        //     AsyncStorage.getItem('userLoginData').then((value) => {
        //         this.setState({'userLoginData': value});
        //     }).done();
        // }

        // For Order

        onSubmitOrder(){
            AsyncStorage.getItem('userLoginData').then((value) => {
                _self.setState({'userLoginData': value});
            }).done();
            fetch('https://devapi.myshoperoo.com/public/add_order',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    phone  : JSON.parse(_self.state.userLoginData).phone,
                    name  : JSON.parse(_self.state.userLoginData).name,
                    email  : JSON.parse(_self.state.userLoginData).email_id,
                    shopping_list : _self.state.orderDetails,
                    date :  _self.dateToDateFormat(_self.state.date),
                    is_admin : 0,
                    status : 'ordered'
                }),
            })
            .then((response)=>response.json())
            .then((responseJson)=>{
                if(responseJson.error){
                    alert(responseJson.message);
                }else{
                    console.log(responseJson);
                    _self.toast.show(responseJson.message);
                    _self.getOrderDetails();
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        }

        // Render Function Start

        render() {
          let tempUrl = "http://dev.myshoperoo.com/tawk.html?name="+JSON.parse(this.state.userLoginData).name+"&email="+JSON.parse(this.state.userLoginData).email_id;
          console.log('asdf');
          console.log(tempUrl);
            if (this.state.dimensions) {
                var { dimensions } = this.state
                var { width, height } = dimensions
            }
            return (
                <ScrollView style={styles.scrollView}>
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior="padding"
                        enabled>
                        {
                          this.state.chatBoxFlag?
                          <TouchableHighlight onPress={this._changeChatModal} style={styles.closeIconForChat}>
                            <Text style={{color:'white',fontSize:20,position:'relative',top:10,textAlign:'right',paddingRight:20}}>x</Text>
                          </TouchableHighlight>
                          :
                          <View></View>
                        }
                            <View style={this.state.chatBoxFlag?styles.chatBoxOpen:styles.chatBoxClose}>

                              {


                              //   <WebView
                              //   source={{uri: 'http://dev.myshoperoo.com/tawk.html'}}
                              //   javaScriptEnabled={true}
                              //   domStorageEnabled={true}
                              //   scalesPageToFit={true}
                              //   style={{height: deviceHeight, width: deviceWidth}}
                              // />
                          }
                          {Platform.select({
                            android:  () => <AndroidWebView
                                              source={{ uri: tempUrl }}
                                            />,
                            ios:      () => <WebView
                            source={{uri: './tawk.html'}}
                            style={{height: deviceHeight, width: deviceWidth}}
                          />
                      })()}
                            </View>
                        <View style={styles.headerField} onLayout={this.onLayout}>
                            <View style={styles.headerImage}>
                                <Image source={require('../../images/vlogo.png')} style={styles.logoImage} />
                            </View>
                            <View style={styles.dateHeader}>
                                <Row>
                                    <Col size={75}>
                                        <View style={styles.datepickerField}>
                                            <View style={styles.dateRightIcon}>
                                                <Image source={require('../../images/down.png')} style={styles.downImage}/>
                                            </View>
                                            <DatePicker
                                                style={{width:'100%',paddingLeft:20}}
                                                date={this.state.date}
                                                mode="date"
                                                placeholder="select date"
                                                format="DD-MM-YYYY"
                                                confirmBtnText="OK"
                                                cancelBtnText="Cancel"
                                                iconSource={require('../../images/calendaricon.png')}
                                                customStyles={{
                                                      dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 4,
                                                        marginLeft: 0
                                                      },
                                                      dateInput: {
                                                        marginLeft: 36,
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'flex-start',
                                                        borderWidth : 0,
                                                        paddingTop: 4,
                                                        paddingLeft: 4
                                                      },
                                                      placeholderText: {
                                                          fontSize: 24,
                                                          color: '#c7c8ca'
                                                      },
                                                      dateText:{
                                                        justifyContent: 'flex-start',
                                                        fontSize: 24,
                                                      },
                                                      btnTextText: {
                                                        color: '#945e36',
                                                      },
                                                      btnTextConfirm: {
                                                        color: '#945e36',
                                                      },
                                                }}
                                                onDateChange={(date) => {this.changeDate(date)} }
                                            />
                                        </View>
                                    </Col>
                                    <Col size={25}>
                                        <View style={styles.profileIcon}>
                                            <TouchableHighlight onPress={this._toggleModal} style={{width:'100%',position:'relative',right:20}}>
                                                <Image source={require('../../images/profileicon.png')} style={{width:'100%',height:'100%'}}/>
                                             </TouchableHighlight>
                                        </View>
                                    </Col>
                                </Row>
                            </View>
                        </View>
                        <View style={[styles.bodyContent,{top:120,paddingLeft:10}]}>
                            <Row>
                                <Col size={15}>
                                    <View style={styles.listIconView}>
                                        <Image source={require('../../images/list_icon.png')} style={styles.chatIcon}  />
                                    </View>
                                </Col>
                                <Col size={85}>
                                    <Textarea
                                        containerStyle={styles.textAreaStyle}
                                        style={styles.textarea}
                                        // onChangeText={this.onChange}
                                        defaultValue={this.state.orderDetails}
                                        value={this.state.orderDetails}
                                        placeholder={'Enter your shopping list here until 1 PM of any given day...'}
                                        placeholderTextColor={'#c7c7c7'}
                                        underlineColorAndroid={'transparent'}
                                        editable={this.state.orderStatus || this.state.outOfOrder == 'ordered' ? false: true}
                                        onChangeText  = {(text) => this.setState({orderDetails: text})}
                                        onChange={orderDetails => this.onOderAutoSave(orderDetails)}
                                    />
                                </Col>
                            </Row>
                        </View>
                        <Toast
                            textStyle={{color:'#ffffff'}}
                            style={{backgroundColor:'#c8936a'}}
                            ref={toast => {
                            this.toast = toast;
                            }}
                        />
                        <View style={[styles.buttonIconsView, {bottom : (this.state.keyboardOpen ? (this.state.keyboardHeight + 10) : 50)}]}>
                            <View style={styles.chatIconView}>
                                <TouchableHighlight onPress={this._changeChatModal}>
                                    <Image source={require('../../images/chat_icon.png')} style={styles.chatIcon} />
                                </TouchableHighlight>
                            </View>
                            {this.state.orderStatus  || this.state.outOfOrder == 'ordered' ?
                                <View style={styles.orderIconView}>
                                    <TouchableHighlight onPress={this.onUpdateOrder}>
                                        <Image source={require('../../images/updateorder.png')} style={styles.chatIcon}/>
                                    </TouchableHighlight>
                                </View>
                                :
                                <View style={styles.orderIconView}>
                                <TouchableHighlight onPress={this.onSubmitOrder}>
                                <Image source={require('../../images/list_iconbg.png')} style={styles.chatIcon} />
                                </TouchableHighlight>
                                </View>
                            }
                        </View>
                        {
                        // <PopupDialog
                        //   containerStyle={styles.opopu}
                        //   ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                        //   dialogAnimation={slideAnimation}
                        // >
                        //   <View>
                        //
                        //   </View>
                        // </PopupDialog>
                        }
                        <Modal isVisible={this.state.isModalVisible} style={styles.topModal}
                            animationIn={'slideInDown'}
                            animationOut={'slideOutUp'}
                            onBackdropPress = {this._toggleModal}
                            onBackButtonPress = {this._toggleModal}>
                            {this._renderModalContent()}
                        </Modal>

                        <Modal isVisible={this.state.isEditProfileModalVisible} style={styles.optionModal}
                            animationIn={'slideInDown'}
                            animationOut={'slideOutDown'}

                            onPress={this._editProfileModalToggle}>
                            {this._editProfileModalContent()}
                        </Modal>

                        <Modal isVisible={this.state.isChangePasswordModalVisible} style={styles.optionModal}
                            animationIn={'slideInDown'}
                            animationOut={'slideOutDown'}
                            onPress={this._changePasswordModalToggle}>
                            {this._changePasswordModalContent()}
                        </Modal>

                        <Modal isVisible={this.state.isChatModal} style={styles.chatModal}
                            animationIn={'slideInUp'}
                            animationOut={'slideOutDown'}
                            onBackButtonPress = {this._changeChatModal}>
                            {this._renderChatModalContent()}
                        </Modal>
                    </KeyboardAvoidingView>
                </ScrollView>
            );
        }
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'white',
            height : Dimensions.get('window').height
        },
        headerField:{
            position:'absolute',
            borderBottomWidth: 2,
            borderBottomColor: '#ddd',
            marginTop: 20,
            width:Dimensions.get('window').width
        },
        logoImage:{
            marginTop : StatusBar.currentHeight
        },
        downImage:{
            position: 'absolute',
            top : 8,
            right : 15,
        },
        headerImage:{
            flex: 1,
            alignItems:'center'
        },
        dateHeader:{
            paddingLeft:10,
            paddingRight: 10,
        },
        dateRightIcon:{
            position: 'relative',
            top: 0,
            right: 0,
        },
        datepickerField:{
            position: 'relative'
        },
        profileIcon:{
            position:'absolute',
            right: 0,
            width: 30,
            height: 30,
            top: 5,
            justifyContent: 'flex-end',
        },
        bodyContent:{
            position:'relative',
            top: 100
        },
        chatIcon:{
            width : '100%',
            height: '100%'
        },
        chatIconView:{
            width: 50,
            height: 50,
            position : 'relative',
            left : 5
        },
        orderIconView:{
            width: 60,
            height: 60,
            marginTop:10
        },
        buttonIconsView:{
            position: 'absolute',
            right: 10,
        },
        listIconView:{
            width: 40,
            height: 40,
            position : 'absolute',
            right : 0,
            marginTop:25
        },
        textarea: {
            fontSize: 18,
            top: 25,
            position:'relative',
            height: 600,
            textAlignVertical: 'top',
        },
        textAreaStyle:{
            height: 600,
            paddingRight: 15
        },
        opopu:{ zIndex: 10, elevation: 10 },
        topModal: {
            justifyContent: 'flex-start',
            margin: 0,
        },
        optionModal: {
            margin: 20,
        },
        chatModal:{
            margin: 0,
            width : Dimensions.get('window').width,
            height : Dimensions.get('window').height
        },
        button: {
            backgroundColor: 'lightblue',
            padding: 12,
            margin: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        modalContent: {
            backgroundColor: 'white',
            paddingTop : 22,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        chatModalContent: {
            backgroundColor: 'white',
            paddingTop : 22,
            width : Dimensions.get('window').width,
            height : Dimensions.get('window').height
        },
        optionModalContent: {
            backgroundColor: 'white',
            paddingTop : 70,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        shortName:{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width:50
        },
        longName:{
            flex: 4,
        },
        navBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
            borderBottomWidth : 1,
            paddingLeft: 22,
            paddingRight: 22,
            borderColor : 'lightgray'
        },
        longNameData:{
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'column',
            fontSize:18
        },
        chatLongNameData:{
            flex: 2,
            justifyContent: 'flex-end',
            flexDirection: 'column',
            fontSize:18
        },
        longEmailData:{
            flex: 1,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            fontSize:18
        },
        shortNameData:{
            borderWidth:1,
            borderColor:'#945e36',
            alignItems:'center',
            justifyContent:'center',
            width:60,
            height:60,
            backgroundColor:'#fff',
            borderRadius:100,
        },
        optionField:{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth : 1,
            paddingLeft: 22,
            paddingRight: 22,
            paddingBottom: 20,
            borderColor : 'lightgray'
        },
        optionFieldIcon:{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
        optionFieldIconImage:{
            width:40,
            height: 40,
            position:'relative',
            left: 20,
            top: 10
        },
        optionFieldText:{
            flex: 4,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            fontSize:22,
            position: 'absolute',
            top:10,
            left: 90
        },
        optionFieldTextField:{
            flex: 1,
            flexDirection: 'column',
        },
        leftSideLink:{
            flex : 1,
            justifyContent: 'flex-start',
            flexDirection: 'row',
        },
        rightSideLink:{
            flex : 1,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            textAlign: 'right'
        },
        linkField:{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 22,
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
        closeIcon:{
            position: 'absolute',
            width: 40,
            height:40,
            right:5,
            top:5,
            padding: 5
        },
        editProfileLabel:{
            position: 'absolute',
            left:20,
            top:20,
            color: '#945e36',
            fontSize: 20
        },
        plusOneLabel:{
            position: 'absolute',
            left:30,
            bottom:5,
            fontSize:16
        },
        formField:{
            position:'relative',
            bottom:20
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
        chatBoxOpen:{
          position:'absolute',
          height:'100%',
          width:'100%',
          zIndex:9999,
          paddingTop:22
        },
        chatBoxClose:{
          position:'absolute',
          height:'0%',
          width:'100%',
          zIndex:0,
          paddingTop:22
        },
        closeIconForChat:{
          position: 'absolute',
          width: 100,
          height:50,
          right:5,
          top:22,
          padding: 5,
          zIndex: 99999,
          backgroundColor:'#905b35'
        },
    });


export default Home;
