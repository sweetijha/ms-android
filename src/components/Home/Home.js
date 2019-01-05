    import React, { Component } from "react";
    import { StyleSheet, Text, View, Image, Button, TouchableHighlight, KeyboardAvoidingView, Animated, BackHandler, Alert, ScrollView, StatusBar, TextInput, Keyboard, TouchableOpacity, Linking, AsyncStorage, WebView, Platform, NativeEventEmitter, NativeModules, NetInfo} from 'react-native';
    import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
    import { Icon } from 'react-native-elements';
    var FloatingLabel = require('react-native-floating-labels');
    import { Dimensions } from "react-native";
    import { Col, Row, Grid } from "react-native-easy-grid";
    import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
    import DatePicker from 'react-native-datepicker';
    import Textarea from 'react-native-textarea';
    import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
    import Modal from "react-native-modal";
    import Toast, {DURATION} from "react-native-easy-toast";
    import backAndroid, {hardwareBackPress, exitApp} from 'react-native-back-android';

    const slideAnimation = new SlideAnimation({
      slideFrom: 'top',
      toValue: 0,
      top: 0,
      position: 'absolute'
    });
    const PolicyHTML = require('./tawk.html');
    const deviceHeight = Dimensions.get('window').height;
    const deviceWidth = Dimensions.get('window').width;
    const { StatusBarManager } = NativeModules;
    let WEBVIEW_REF = 'webview';

    class Home extends Component {
        constructor(props, context) {
            super(props, context);
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
                sHeight : 44,
                typing: false,
                autoSaveLoading : false,
                typingTimeout: 0,
                textAreaEditable : true,
                isModalVisible: false,
                isEditProfileModalVisible : false,
                isChangePasswordModalVisible : false,
                isChatModal : false,
                loader: true,
                dateWidth : 0,
                messageContent : [],
                textAreaColor : {
                  color : 'black'
                },
                pastOrder : false,
                editProfileErrorFlag : false,
                editProfileErrorLabel : '',
                changePasswordErrorFlag : false,
                changePasswordErrorLabel : '',
                password : '',
                confirm_password : '',
                check_date : {},
                userLoginData : JSON.stringify({
                    name : '',
                    email : ''
                }),
                oldUserData : JSON.stringify({
                    name : '',
                    email : '',
                })
            };
            this.checkInternet();
        }
        checkDateTime(){
            fetch('https://api.myshoperoo.com/public/check_date_time',{
                method : 'GET'
            })
            .then((response)=>response.json())
            .then((responseJson)=>{
                this.setState({
                    check_date : responseJson
                });
                let a = new Date(responseJson.year, parseInt(responseJson.month)-1, responseJson.date,responseJson.hour,responseJson.minute,responseJson.second,0);
                this.setState({
                    date : this.dayFormat(a.getDay()) +' '+ this.monthFormat(a.getMonth()) +' '+ this.ordinal_suffix_of(a.getDate()) + ', '+ a.getFullYear()
                });
                this.getOrderDetails();
            })
            .catch((error)=>{
              _self.setState({loader:false});
            });
        }
        incrDateByOne = () => {
          let breakDate = this.dateToDateFormat(this.state.date).split('-');
          let month = this.monthToInt(breakDate[1]);
          let date = breakDate[0];
          let year = breakDate[2];
          let tDate = new Date(year+'-'+(parseInt(month)<10?('0'+(parseInt(month))):(month))+'-'+(parseInt(date)<10?('0'+(parseInt(date))):(date)));
          tDate.setDate(tDate.getDate()+1);
          let fDate = this.dayFormat(tDate.getDay()) +' '+ this.monthFormat(tDate.getMonth()) +' '+ this.ordinal_suffix_of(tDate.getDate()) + ', '+ tDate.getFullYear();
          this.setState({date : fDate});
          setTimeout(() => {
            this.changeDate(fDate);
          }, 500);

        }
        decrDateByOne = () => {
          let breakDate = this.dateToDateFormat(this.state.date).split('-');
          let month = this.monthToInt(breakDate[1]);
          let date = breakDate[0];
          let year = breakDate[2];
          let tDate = new Date(year+'-'+(parseInt(month)<10?('0'+(parseInt(month))):(month))+'-'+(parseInt(date)<10?('0'+(parseInt(date))):(date)));
          tDate.setDate(tDate.getDate()-1);
          let fDate = this.dayFormat(tDate.getDay()) +' '+ this.monthFormat(tDate.getMonth()) +' '+ this.ordinal_suffix_of(tDate.getDate()) + ', '+ tDate.getFullYear();
          this.setState({date : fDate});
          setTimeout(() => {
            this.changeDate(fDate);
          }, 500);
        }
        monthToInt(month){
          switch (month) {
            case 'Jan': return '01';
            case 'Feb': return '02';
            case 'Mar': return '03';
            case 'Apr': return '04';
            case 'May': return '05';
            case 'Jun': return '06';
            case 'Jul': return '07';
            case 'Aug': return '08';
            case 'Sep': return '09';
            case 'Oct': return '10';
            case 'Nov': return '11';
            case 'Dec': return '12';
          }
        }
        checkInternet(){
          // //console.log('check internet');
          // //console.log(NetInfo);
          NetInfo.isConnected.fetch().then(isConnected => {
             if(isConnected)
             {
                 //console.log('Internet is connected');
                 return true;
             }else{
                // this.toast.show("You’re working offline");
                return false;
             }
         })
        }
        ordinal_suffix_of(i) {
          let j = i % 10,
              k = i % 100;
          if (j == 1 && k != 11) {
              return i + "st";
          }
          if (j == 2 && k != 12) {
              return i + "nd";
          }
          if (j == 3 && k != 13) {
              return i + "rd";
          }
          return i + "th";
      }
        dayFormat(day){
          switch(day){
            case 0 : return 'Sun';
            case 1 : return 'Mon';
            case 2 : return 'Tue';
            case 3 : return 'Wed';
            case 4 : return 'Thu';
            case 5 : return 'Fri';
            case 6 : return 'Sat';
          }
        }
        monthFormat(month){
          switch (month) {
            case 0: return 'Jan';
            case 1: return 'Feb';
            case 2: return 'Mar';
            case 3: return 'Apr';
            case 4: return 'May';
            case 5: return 'Jun';
            case 6: return 'Jul';
            case 7: return 'Aug';
            case 8: return 'Sep';
            case 9: return 'Oct';
            case 10: return 'Nov';
            case 11: return 'Dec';
          }
        }

        componentDidMount () {
            this.setState({textAreaStyle :{
                height: Dimensions.get('window').height - 150
            }});
            this.setState({textarea :{
                height: Dimensions.get('window').height - 170
            }});
            this.hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
              AsyncStorage.getItem('userLoginData').then((value) => {
                  let tempUrl = "http://work.myshoperoo.com/tawk.html?name="+JSON.parse(this.state.userLoginData).name+"&email="+JSON.parse(this.state.userLoginData).email_id;
                  //console.log(tempUrl);
                  this.setState({'chatUrl':tempUrl})
                  this.setState({'userLoginData': value});
                  this.setState({fullName: JSON.parse(this.state.userLoginData).name});
                  this.setState({email: JSON.parse(this.state.userLoginData).email_id});
                  this.setState({company_code: JSON.parse(this.state.userLoginData).company_code});
                  this.setState({unique_code: JSON.parse(this.state.userLoginData).unique_code});
                  if(JSON.parse(this.state.userLoginData).company_code){
                    this.setState({edit_company_code: false});
                  }else{
                    this.setState({edit_company_code: true});
                  }
                  
                  // //console.log(this.state.userLoginData);
                  if(this.state.userLoginData) {
                      this.checkDateTime();
                  }else{
                    const resetAction = StackActions.reset({
                        index : 0 ,
                        actions : [NavigationActions.navigate({routeName : 'Login'})],
            
                    });
                    this.props.navigation.dispatch(resetAction);
                  }
              }).done();
              this.setState({sHeight : this.state.chatBoxFlag?(StatusBarManager.HEIGHT>=30?30:StatusBarManager.HEIGHT):44});
              //console.log("count" , "userLoginData");
        }

        componentWillUnmount(){
            this.hardwareBackPressListener = BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }

        onPressButtonHandle(){
            const resetAction = StackActions.reset({
                index : 0 ,
                actions : [NavigationActions.navigate({routeName : 'Login'})],
    
            });
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
              height: Dimensions.get('window').height - e.endCoordinates.height - 150
            }});
            _self.setState({textarea :{
              height: Dimensions.get('window').height - e.endCoordinates.height - 120
            }});
            _self.setState({keyboardOpen : true});
            _self.setState({keyboardHeight : e.endCoordinates.height});
            // alert(e.endCoordinates.height);
        }

        _keyboardDidHide () {
            // alert('Keyboard Hidden');
            _self.setState({keyboardOpen : false});
            _self.setState({textarea :{
                height: deviceHeight - 170
            }});
        }
        onLayout = event => {
            if (this.state.dimensions) return // layout was already called
            let {width, height} = event.nativeEvent.layout
            this.setState({dimensions: {width, height}})
        }
        openPopup(){
            this.popupDialog.show(() => {
              //console.log('callback - will be called immediately')
            });
        }
        openEditModalPage(){
            this.props.navigation.navigate('Editprofile');
        }
        _openFaq(){
            Linking.openURL(`http://work.myshoperoo.com/faq.html`);
        }
        _openTosPolicy(){
            Linking.openURL(`http://work.myshoperoo.com/tos.html`);
        }

        // Model Content

        _renderModalContent = () => (
            <View style={styles.modalContent}>
                <View style={styles.navBar}>
                    <View style={styles.shortName}>
                        <View style={styles.shortNameData}>
                            <Text style={{fontSize:22, color: 'white'}}>{JSON.parse(this.state.userLoginData).name.charAt(0).toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.longName}>
                        <Text style={styles.longNameData}>{JSON.parse(this.state.userLoginData).name}</Text>
                        <Text style={styles.longEmailData}>{JSON.parse(this.state.userLoginData).email_id}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.optionField} onPress={this._editProfileModalToggle}>
                    <View style={styles.optionFieldIcon}>
                        <Image source={require('../../images/editprofile.png')} style={styles.optionFieldIconImage}/>
                    </View>
                    <Text style={styles.optionFieldText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionField} onPress={this._changePasswordModalToggle}>
                    <View style={styles.optionFieldIcon}>
                        <Image source={require('../../images/changepassword.png')} style={styles.optionFieldIconImage}/>
                    </View>
                    <Text style={styles.optionFieldText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionField} onPress={this.onLogoutPress.bind(this)}>
                    <View style={styles.optionFieldIcon}>
                        <Image source={require('../../images/logout.png')} style={styles.optionFieldIconImage}/>
                    </View>
                    <Text style={styles.optionFieldText}>Log Out</Text>
                </TouchableOpacity>
                <View style={styles.linkField}>
                    <Text style={styles.leftSideLink} onPress={this._openFaq}>FAQs</Text>
                    <Text style={styles.rightSideLink} onPress={this._openTosPolicy}>Terms of Service</Text>
                </View>
            </View>
        );

        // Edit Profile Model

        _editProfileModalContent = () => (
            <TouchableOpacity onPress={this.removeKeyboard} style={styles.optionModalContent}>
                <Text style={styles.editProfileLabel}>Profile</Text>
                <TouchableHighlight onPress={this._editProfileModalToggle} style={styles.closeIcon}>
                    <Image style={styles.closeIcon} source={require('../../images/close.png')} />
                </TouchableHighlight>
                <View style={styles.formField}>
                    <View style={styles.inputStyle}>
                        <Image source={require('../../images/user.png')} style={styles.formIcon} />
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
                        <Image source={require('../../images/email.png')} style={styles.formIcon} />
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
                    <View style={styles.inputStyle}>
                        <Image source={require('../../images/email.png')} style={styles.formIcon} />
                        <FloatingLabel
                            labelStyle={styles.labelInput}
                            inputStyle={styles.input}
                            style={styles.formInputPassword}
                            onBlur={this.onBlur}
                            underlineColorAndroid= 'transparent'
                            value={this.state.company_code}
                            keyboardType='default'
                            editable={this.state.edit_company_code?true:false}
                            autoCapitalize='characters'
                            onChangeText = {
                                (text) => this.setState({company_code: text})
                            }>Company Code
                        </FloatingLabel>
                    </View>
                    <View style={styles.inputStyle}>
                        <Image source={require('../../images/email.png')} style={styles.formIcon} />
                        <FloatingLabel
                            labelStyle={styles.labelInput}
                            inputStyle={styles.input}
                            style={styles.formInputPassword}
                            onBlur={this.onBlur}
                            underlineColorAndroid= 'transparent'
                            value={this.state.unique_code}
                            autoCapitalize='characters'
                            keyboardType='default'
                            editable={this.state.edit_company_code?true:false}
                            onChangeText = {
                                (text) => this.setState({unique_code: text})
                            }>Unique Code
                        </FloatingLabel>
                    </View>
                    {this.state.editProfileErrorFlag?
                      <View style={styles.errorStyle}>

                          <Text style={{color:'red'}}>{this.state.editProfileErrorLabel}</Text>

                    </View>:
                    null
                  }
                    <View style={styles.submitButtonView}>
                        <TouchableHighlight
                            onPress={this.onEditProfile.bind(this)}
                            style={styles.submitButton}
                            underlayColor='#fff'>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableOpacity>
        );

        // Change Password Model

        _changePasswordModalContent= () => (
            <TouchableOpacity onPress={this.removeKeyboard} style={styles.optionModalContent}>
                <Text style={styles.editProfileLabel}>Change Password</Text>
                    <TouchableHighlight onPress={this._changePasswordModalToggle} style={styles.closeIcon}>
                        <Image style={styles.closeIcon} source={require('../../images/close.png')} />
                    </TouchableHighlight>
                    <View style={styles.formField}>
                        <View style={styles.inputStyle}>
                            <Image source={require('../../images/changepassword.png')} style={styles.formIcon} />
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
                            <Image source={require('../../images/changepassword.png')} style={styles.formIcon} />
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
                    {this.state.changePasswordErrorFlag?
                      <View style={styles.errorStyle}>

                          <Text style={{color:'red'}}>{this.state.changePasswordErrorLabel}</Text>

                      </View>:
                      null
                    }
                    <View style={styles.submitButtonView}>
                        <TouchableHighlight
                            onPress={this.onChangePassword.bind(this)}
                            style={styles.submitButton}
                            underlayColor='#fff'>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableHighlight>
                    </View>
                 </View>
            </TouchableOpacity>
        );
        removeKeyboard = () => {
            Keyboard.dismiss();
        }
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

          if(this.checkInternet()){

          }else{
            if(this.state.chatBoxFlag){
                this.refs[WEBVIEW_REF].reload();
            }
          this.setState({ chatBoxFlag: !this.state.chatBoxFlag });
          this.setState({sHeight : !this.state.chatBoxFlag?(StatusBarManager.HEIGHT>=30?30:StatusBarManager.HEIGHT):44});
        }
        }

        // Logout

        onLogoutPress(){
            AsyncStorage.removeItem('userLoginData');
            ////console.log('User Logout');
            const resetAction = StackActions.reset({
                index : 0 ,
                actions : [NavigationActions.navigate({routeName : 'Login'})],
    
            });
            this.props.navigation.dispatch(resetAction);
        }

      // Edit Profile
      validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
        onEditProfile(){
            if((this.state.company_code && this.state.unique_code) || (!this.state.company_code && !this.state.unique_code)){
                if(this.validateEmail(this.state.email)){
                    this.setState({editProfileErrorFlag : false});
                    this.setState({editProfileErrorLabel : ""});
                  this.setState({loader:true});
                  fetch('https://api.myshoperoo.com/public/update_profile',{
                    method : 'POST',
                      headers : {
                        'Accept': 'application/json',
                        'Content-Type' : 'application/json',
                      },
                      body : JSON.stringify({
                          user_id : JSON.parse(this.state.userLoginData).user_id,
                          name : this.state.fullName,
                          email : this.state.email,
                          company_code: this.state.company_code,
                          unique_code : this.state.unique_code
                      }),
                  })
                  .then((response)=>response.json())
                  .then((responseJson)=>{
                    this.setState({loader:false});
                    if(responseJson.error){
                      // alert(responseJson.message);
                      this.setState({editProfileErrorFlag : true});
                        this.setState({editProfileErrorLabel : responseJson.message});
                    }else{
                      // alert(responseJson.message);
                      if(responseJson.message !== "Company Code and/Or Unique Code in Invalid"){
                        let tempData = JSON.parse(this.state.userLoginData);
                        tempData.name = this.state.fullName;
                        tempData.email_id = this.state.email;
                        tempData.company_code = this.state.company_code;
                        tempData.unique_code = this.state.unique_code;
                        AsyncStorage.setItem('userLoginData', JSON.stringify(tempData));
                        this._editProfileRemoveModal();
                        this.componentDidMount();
                        this.toast.show('Profile Update Successfully.');
                    }else{
                        this.setState({editProfileErrorFlag : true});
                        this.setState({editProfileErrorLabel : responseJson.message});
                    }
                    }
                  })
                  .catch((error)=>{
                    this.setState({loader:false});
                    //console.log(error);
                  });
                }
                  else{
                    this.setState({loader:false});
                    this.setState({editProfileErrorFlag : true});
                    this.setState({editProfileErrorLabel : "* Incorrect Email Address"});
                  }
            }else{
                this.setState({editProfileErrorFlag : true});
                this.setState({editProfileErrorLabel : "* Can't Update Only One Of the code"});
            }
          
        }

        // Change Password

        onChangePassword(){
          this.setState({loader:true});
          if(this.state.password == '' ||   this.state.confirm_password == ''){
            this.setState({loader:false});
            this.setState({changePasswordErrorFlag : true});
            this.setState({changePasswordErrorLabel : "* Password cannot be empty"});
          }else{
            if(this.state.password == this.state.confirm_password){
            this.setState({changePasswordErrorFlag : false});
            this.setState({changePasswordErrorLabel : ""});
            this.setState({loader:true});
            fetch('https://api.myshoperoo.com/public/change_password',{
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
              this.setState({loader:false});
                if(responseJson.error){
                    // alert(responseJson.message);
                }else{
                    //alert(responseJson.message);
                    this.toast.show('Password Change Successfully.');
                    this._changePasswordRemoveModal();
                }
            })
            .catch((error)=>{
              this.setState({loader:false});
                //console.log(error);
            });
          }else{
            this.setState({loader:false});
            this.setState({changePasswordErrorFlag : true});
            this.setState({changePasswordErrorLabel : "* Password Mismatch"});
          }
          }
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
                    _self.setState({autoSaveLoading:true});
                    self.onSaveOrder();
                }, 2000)
            });

        }
        removeOrdinalSuffix(date){
          return date.slice(0, -2);
        }
        dateToDateFormat(date){
          let tDate = date.split(', ')[0].split(' ');
          let tYear = date.split(', ')[1];
          return this.removeOrdinalSuffix(tDate[2])+'-'+tDate[1]+'-'+tYear;
            //return this.dateFormat(new Date(tDate[2]+'-'+(parseInt(tDate[1])-1)+'-'+tDate[0]));

        }
        dateFormat(date){
          let tDate = date.split(', ')[0].split(' ');
          let tYear = date.split(', ')[1];
          return this.removeOrdinalSuffix(tDate[2])+'-'+tDate[1]+'-'+tYear;
        }

        // Save Order

        onSaveOrder(){


          this.setState({loader:false});
            fetch('https://api.myshoperoo.com/public/add_order',{
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
              setTimeout(function () {
                  _self.setState({autoSaveLoading:false});
              }, 0);
              this.setState({loader:false});
                if(responseJson.error){
                    // alert(responseJson.message);
                }else{
                    // this.toast.show(responseJson.message);
                    // this.getOrderDetails();
                }
            })
            .catch((error)=>{
              setTimeout(function () {
                  _self.setState({autoSaveLoading:false});
              }, 0);
              this.setState({loader:false});
                //console.log(error);
            });
        }

        // Get Order Details

        getOrderDetails(){
          if(this.checkInternet()){

          }else{
          this.setState({loader:true});
            let orderStatus  = false;
            fetch('https://api.myshoperoo.com/public/get_order',{
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
              console.log('check get order');
                console.log(responseJson);
                // alert(JSON.stringify(responseJson));
                let breakDate = this.dateToDateFormat(this.state.date).split('-');
                let month = this.monthToInt(breakDate[1]);
                let date = breakDate[0];
                let year = breakDate[2];
                let tDate = new Date(year+'-'+(parseInt(month)<10?('0'+(parseInt(month))):(month))+'-'+(parseInt(date)<10?('0'+(parseInt(date))):(date)));

                let sDate = new Date(this.state.check_date.year, parseInt(this.state.check_date.month)-1, this.state.check_date.date,this.state.check_date.hour,this.state.check_date.minute,this.state.check_date.second,0);
                let cTime = responseJson.current_time.split(':');

                if((tDate.getTime() < (new Date(sDate.getFullYear()+'-'+(parseInt(sDate.getMonth()+1)<10?('0'+(sDate.getMonth()+1)):(sDate.getMonth()+1))+'-'+(parseInt(sDate.getDate())<10?('0'+parseInt(sDate.getDate())):sDate.getDate()))).getTime()) || ((tDate.getTime() == (new Date(sDate.getFullYear()+'-'+(parseInt(sDate.getMonth()+1)<10?('0'+(sDate.getMonth()+1)):(sDate.getMonth()+1))+'-'+(parseInt(sDate.getDate())<10?('0'+parseInt(sDate.getDate())):sDate.getDate()))).getTime()) && parseInt(cTime[0]) >= 13))
                {
                  this.setState({
                    pastOrder : true
                  });
                  this.setState({
                    textAreaColor : {
                      color: 'gray'
                    }
                  });
                }else{
                  this.setState({
                    pastOrder : false
                  });

                  this.setState({
                    textAreaColor : {
                      color: 'black'
                    }
                  });
                }
                if(responseJson.error){
                    this.setState({orderDetails:''})
                    this.setState({getOrderDetails: responseJson});
                    this.setState({orderStatus:this.state.getOrderDetails.disable});
                    this.setState({outOfOrder:''});
                    this.setState({loader:false});
                    //console.log(this.state.orderStatus);
                    //console.log(responseJson);
                }else{
                    ////console.log(orderStatus);
                    this.setState({getOrderDetails: responseJson});
                    //console.log(this.state.getOrderDetails);
                    this.setState({orderDetails:this.state.getOrderDetails.data.shopping_list});
                    this.setState({orderStatus:this.state.getOrderDetails.disable});
                    this.setState({outOfOrder:this.state.getOrderDetails.data.status});
                    this.setState({loader:false});
                    //console.log(this.state.outOfOrder == 'ordered');
                    //console.log(this.state.orderStatus);
                }
            })
          }
        }

        changeDate(date){
            ////console.log(date);
            if(this.checkInternet()){

            }else{
            this.setState({loader:true});
            this.setState({date: date});
            this.getOrderDetails();
          }
        }

        // Update Order

        onUpdateOrder(){
          if(_self.checkInternet()){

          }else{
            _self.setState({loader:true});
            fetch('https://api.myshoperoo.com/public/add_order',{
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
              _self.setState({loader:false});
                if(responseJson.error){
                    // alert(responseJson.message);
                }else{
                    // //console.log(responseJson);
                    // //console.log(responseJson.error);
                     //_self.toast.show(responseJson.message);
                    _self.getOrderDetails();
                }
            })
            .catch((error)=>{
              _self.setState({loader:false});
                //console.log(error);
            });
          }
        }

        // getUserData(){
        //     AsyncStorage.getItem('userLoginData').then((value) => {
        //         this.setState({'userLoginData': value});
        //     }).done();
        // }

        // For Order

        onSubmitOrder(){
          clearTimeout(_self.state.typingTimeout);
          if(_self.checkInternet()){

          }else{
            AsyncStorage.getItem('userLoginData').then((value) => {
                _self.setState({'userLoginData': value});
            }).done();
            if( _self.state.orderDetails == ''){
                _self.toast.show('shopping Field can not be blank');
            }else{
              _self.setState({loader:true});
              fetch('https://api.myshoperoo.com/public/add_order',{
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
                _self.setState({loader:false});
                  if(responseJson.error){
                      // alert(responseJson.message);
                  }else{
                      //console.log(responseJson);
                      _self.toast.show(responseJson.message);
                      _self.onSendMail();
                      _self.getOrderDetails();
                  }
              })
              .catch((error)=>{
                this.setState({loader:false});
                  //console.log(error);
              });
            }
          }
        }
        onSendMail(){
          console.log('inside mail function');
            AsyncStorage.getItem('userLoginData').then((value) => {
                _self.setState({'userLoginData': value});
            }).done();
              fetch('https://api.myshoperoo.com/public/send_mail',{
                  method : 'POST',
                  headers : {
                      'Accept': 'application/json',
                      'Content-Type' : 'application/json',
                  },
                  body : JSON.stringify({
                      phone  : JSON.parse(_self.state.userLoginData).phone,
                      name  : JSON.parse(_self.state.userLoginData).name,
                      email  : JSON.parse(_self.state.userLoginData).email_id,
                      msg : _self.state.orderDetails,
                      date :  _self.dateToDateFormat(_self.state.date),
                      company_code : JSON.parse(_self.state.userLoginData).company_code
                  }),
              })
              .then((response)=>response.json())
              .then((responseJson)=>{
                  console.log(responseJson);
              })
              .catch((error)=>{
                  console.log(error);
              });

        }
        // Render Function Start
        find_dimesions(layout){
          const {x, y, width, height} = layout;

          let w = Dimensions.get('window').width;
          this.setState({dateWidth:(parseFloat(w)-((parseFloat(w)/2)+(parseFloat(width)/2))-40)});
        }

        render() {
          let tempUrl = "http://work.myshoperoo.com/tawk.html?name="+JSON.parse(this.state.userLoginData).name+"&email="+JSON.parse(this.state.userLoginData).email_id;
          //console.log('asdf');
          //console.log(tempUrl);
            if (this.state.dimensions) {
                var { dimensions } = this.state
                var { width, height } = dimensions
            }
            return (
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior="padding"
                        enabled>
                        {
                          this.state.chatBoxFlag?
                          <TouchableOpacity
                            activeOpacity={1} onPress={this._changeChatModal} style={[styles.closeIconForChat,{top:this.state.sHeight}]}>
                            <Text style={{color:'white',fontSize:20,position:'relative',top:10,textAlign:'right',paddingRight:20}}>x</Text>
                          </TouchableOpacity>
                          :
                          <View></View>
                        }
                            <View style={[this.state.chatBoxFlag?styles.chatBoxOpen:styles.chatBoxClose,{paddingTop:this.state.sHeight}]}>

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
                            android:  () => <WebView
                            source={{uri : tempUrl}}
                            ref={WEBVIEW_REF}
                            style={{height: deviceHeight, width: deviceWidth}}
                          />,
                            ios:      () => <WebView
                            source={{uri : "https://tawk.to/chat/5b35aeb3d0b5a54796824973/1cqpumv9p"}}
                            javaScriptEnabled={true}
                            ref={WEBVIEW_REF}
                            injectedJavaScript={`document.getElementById('prechat0Field').value = "`+JSON.parse(this.state.userLoginData).name+`";
                              document.getElementById('prechat1Field').value = "`+JSON.parse(this.state.userLoginData).email_id+`";
                              document.getElementById('prechat0Field').setAttribute('disabled','disabled');
                              document.getElementById('prechat1Field').setAttribute('disabled','disabled');
                              document.getElementById('formCancel').style.display = 'none';
                              document.getElementById('formInnerHeight').style.display = 'none';
                              document.getElementById('formSubmit').click();`}
                            style={{height: deviceHeight, width: deviceWidth,zIndex:99999}}
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
                                                {
                                                  // <Image source={require('../../images/down.png')} style={styles.downImage}/>
                                                }
                                            </View>
                                            <DatePicker
                                                style={{width:'100%',paddingLeft:0}}
                                                date={this.state.date}
                                                mode="date"
                                                placeholder="select date"
                                                format="ddd MMM Do, YYYY"
                                                confirmBtnText="OK"
                                                cancelBtnText="Cancel"
                                                iconSource={require('../../images/calendaricon.png')}
                                                customStyles={{
                                                      dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 2,
                                                        marginLeft: 0
                                                      },
                                                      dateInput: {
                                                        marginLeft: 40,
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'flex-start',
                                                        borderWidth : 0,
                                                        paddingTop: 4,
                                                        paddingLeft: 4,
                                                        width:0
                                                      },
                                                      placeholderText: {
                                                          fontSize: 18,
                                                          color: '#c7c8ca',
                                                          width:0
                                                      },
                                                      dateText:{
                                                        justifyContent: 'flex-start',
                                                        fontSize: 18,
                                                        width:0
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
                                            <TouchableHighlight onPress={this._toggleModal} style={{width:'100%',position:'relative'}}>
                                                <Image source={require('../../images/user.png')} style={{width:30,height:30}}/>
                                             </TouchableHighlight>
                                        </View>
                                    </Col>
                                </Row>
                            </View>
                            <View style={styles.dateHeader1}>
                                <Row>
                                  {
                                    // <TouchableOpacity onPress={this.decrDateByOne} style={{position:'relative', left: this.state.dateWidth,zIndex:9999999,width:20,height:20}}>
                                    //   <Image source={require('../../images/lefti.png')} style={{width:20,height:20}}/>
                                    // </TouchableOpacity>
                                  }

                                        <View style={styles.datepickerField1}>
                                          <View onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}>
                                            <DatePicker
                                                style={{paddingLeft:0}}
                                                date={this.state.date}
                                                mode="date"
                                                placeholder="select date"
                                                format="ddd MMM Do, YYYY"
                                                confirmBtnText="OK"
                                                cancelBtnText="Cancel"
                                                iconSource={require('../../images/calendaricon.png')}
                                                customStyles={{
                                                      dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 2,
                                                        marginLeft: 0,
                                                        width:0
                                                      },
                                                      dateInput: {

                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderWidth : 0,
                                                        paddingTop: 20,
                                                        paddingLeft: 0
                                                      },
                                                      placeholderText: {
                                                          fontSize: 14,
                                                          color: '#ffffff'
                                                      },
                                                      dateText:{
                                                        justifyContent: 'flex-start',
                                                        fontSize: 14,
                                                        color:'#ffffff'
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
                                        </View>
                                    {
                                    //   <TouchableOpacity onPress={this.incrDateByOne} style={{position:'relative', right: this.state.dateWidth,zIndex:9999999,width:20,height:20}}>
                                    // <Image source={require('../../images/righti.png')} style={{width:20,height:20}}/>
                                    // </TouchableOpacity>
                                  }
                                </Row>
                            </View>
                        </View>
                        <View style={[styles.bodyContent,{top:(this.state.sHeight>=30?108:100),paddingLeft:0}]}>
                          {!this.state.pastOrder && (this.state.orderStatus  || this.state.outOfOrder == 'ordered')?
                            <View style={{position:'absolute',height:(deviceHeight-(this.state.sHeight>=30?108:100)),width:(deviceWidth+20),justifyContent: 'center',alignItems: 'center', backgroundColor:'rgba(144,91,53,0.3)',zIndex:99}}>
                            <View style={{backgroundColor:'#905b35', paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10,borderRadius:10, width:'80%',zIndex:99}}>
                              <Text style={{textAlign:'center', color:'white',fontSize:16}}>Your order is being processed. Click update to make change until 1pm of this day</Text>
                            </View>
                          </View>
                          :
                          null
                        }
                        {
                          this.state.autoSaveLoading?
                          <Image style={{position:'absolute',right:10, width:30, height:30, top:30}} source={require('../../images/autosaveloading.gif')}  />
                          :
                          null
                        }
                            <Row>
                                <Col size={15}>
                                    <View style={styles.listIconView}>
                                        <Image source={require('../../images/list_icon.png')} style={styles.chatIcon}  />
                                    </View>
                                </Col>
                                <Col size={85}>
                                    <Textarea
                                        containerStyle={styles.textAreaStyle}
                                        style={[styles.textarea, this.state.textAreaColor, this.state.textarea]}
                                        // onChangeText={this.onChange}
                                        defaultValue={this.state.orderDetails}
                                        value={this.state.orderDetails}
                                        placeholder={'Enter your shopping list here until 1 PM of any given day...'}
                                        placeholderTextColor={'#c7c7c7'}
                                        underlineColorAndroid={'transparent'}
                                        editable={this.state.pastOrder || (this.state.orderStatus || this.state.outOfOrder == 'ordered') ? false: true}
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
                          {
                            this.state.loader?
                            <View style={styles.loadingView}>
                                <TouchableOpacity onPress={this._changeChatModal}>
                                    <Image source={require('../../images/preloader.gif')} style={{width:35, height:35}} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View></View>
                          }
                            <View style={styles.chatIconView}>
                                <TouchableHighlight onPress={this._changeChatModal}>
                                    <Image source={require('../../images/chat_icon.png')} style={styles.chatIcon} />
                                </TouchableHighlight>
                            </View>
                            {!this.state.pastOrder?
                              this.state.orderStatus  || this.state.outOfOrder == 'ordered' ?
                                <View style={styles.orderIconView}>
                                    <TouchableOpacity onPress={this.onUpdateOrder}>
                                        <Image source={require('../../images/updateorder.png')} style={styles.chatIcon}/>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.orderIconView}>
                                <TouchableOpacity onPress={this.onSubmitOrder}>
                                <Image source={require('../../images/list_iconbg.png')} style={styles.chatIcon} />
                                </TouchableOpacity>
                                </View>
                                :
                                null
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
      loaderImage:{
        width: 50,
        height: 50
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
        width:deviceWidth,
        height: 50,
        bottom: 100,
        alignItems:'center',
        flex: 1,

      },
        container: {
            flex: 1,
            backgroundColor: 'white',
            height : Dimensions.get('window').height
        },
        headerField:{
            position:'absolute',
            marginTop: 20,
            width:Dimensions.get('window').width
        },
        logoImage:{
            marginTop : StatusBar.currentHeight
        },
        downImage:{
            position: 'absolute',
            top : 5,
            right : 92,
            width: 15
        },
        headerImage:{
            flex: 1,
            alignItems:'center'
        },
        dateHeader:{
            paddingLeft:10,
            paddingRight: 10,
            position:'relative',
            top:-40
        },
        dateHeader1:{
            paddingLeft:10,
            paddingRight: 10,
            height:20,
            backgroundColor:'#905b35',
            position:'relative',
            top:-40,
            zIndex : 9999999
        },
        dateRightIcon:{
            position: 'relative',
            top: 0,
            right: 0,
        },
        datepickerField:{
            position: 'relative'
        },
        dateRightIcon1:{
            position: 'relative',
            top: 0,
            right: 0,
        },
        datepickerField1:{
            position: 'relative',
            justifyContent: 'flex-end',
            flex: 1,
            alignItems: 'center',
            width: 'auto',
            zIndex:99999999
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
            width: 90,
            height: 56,
            position : 'relative',
            left : 6,
            zIndex:9999
        },
        loadingView:{
            width: 90,
            height: 50,
            position : 'relative',
            right : 0,
            bottom:10,
            alignItems:'flex-end',
            justifyContent:'flex-end'
        },
        orderIconView:{
            width: 96,
            height: 56,
            marginTop:10,
            left : 1,
            zIndex:9999
        },
        buttonIconsView:{
            position: 'absolute',
            right: 10,
        },
        listIconView:{
            width: 40,
            height: 40,
            position : 'absolute',
            right : 8,
            marginTop:10
        },
        textarea: {
            fontSize: 15,
            top: 10,
            position:'relative',
            height: 600,
            textAlignVertical: 'top',
        },
        textAreaStyle:{
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
            top : 2,
            left : 5
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
            fontSize:18,
            fontWeight: 'bold'

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
            fontSize:15
        },
        shortNameData:{
            borderWidth:1,
            borderColor:'#945e36',
            alignItems:'center',
            justifyContent:'center',
            width:50,
            height:50,
            backgroundColor:'#945e36',
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
            left: 5,
            top: 10
        },
        optionFieldText:{
            flex: 4,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            fontSize:15,
            position: 'absolute',
            top:18,
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
            fontWeight : 'bold'
        },
        rightSideLink:{
            flex : 1,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            textAlign: 'right',
            fontWeight : 'bold'
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
            bottom:5
        },
        closeIcon:{
            position: 'absolute',
            width: 30,
            height:30,
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
          zIndex:99999
        },
        chatBoxClose:{
          position:'absolute',
          height:'0%',
          width:'100%',
          zIndex:0,
        },
        closeIconForChat:{
          position: 'absolute',
          width: 110,
          height:60,
          right:0,
          top:22,
          padding: 5,
          zIndex: 999999,
          backgroundColor:'#905b35'
        },
        errorStyle:{
            width:deviceWidth - 40,
            marginLeft:20,
        },
    });


export default Home;
