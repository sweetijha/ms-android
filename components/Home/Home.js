import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, KeyboardAvoidingView, ScrollView, StatusBar, TextInput, Keyboard, TouchableOpacity, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Icon } from 'react-native-elements';
var FloatingLabel = require('react-native-floating-labels');
import { Dimensions } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { createStackNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import Textarea from 'react-native-textarea';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import Modal from "react-native-modal";

const slideAnimation = new SlideAnimation({
  slideFrom: 'top',
  toValue: 0,
  top: 0,
  position: 'absolute'
});

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    _self = this;
    this.state = {
      dimensions: undefined,
      keyboardOpen : false,
      date : new Date(),
      isModalVisible: false,
      isEditProfileModalVisible : false,
      isChangePasswordModalVisible : false,
      isChatModal : false
    };
  }
  componentDidMount () {
    this.setState({
        name : 'Mohit Prakash',
        email_id : 'mohit@ideesys.com',
        phone : '7022488224',
        unique_id : 'ABC',
        company_code : '12345'
    });

    this.setState({textAreaStyle :{
      height: Dimensions.get('window').height - 100
    }});
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
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
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style={styles.navBar}>
        <View style={styles.shortName}>
          <View style={styles.shortNameData}>
            <Text style={{fontSize:26, color: 'white'}}>M</Text>
          </View>
        </View>
        <View style={styles.longName}>
            <Text style={styles.longNameData}>Mohit Prakash</Text>
            <Text style={styles.longEmailData}>mohit@ideesys.com</Text>
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
        <Text style={styles.optionFieldText}>Log Out</Text>
      </View>
      <View style={styles.linkField}>
        <Text style={styles.leftSideLink} onPress={this._openPrivacyPolicy}>Privacy Policy</Text>
        <Text style={styles.rightSideLink} onPress={this._openTosPolicy}>Terms of Services</Text>
      </View>
    </View>
  );
  checkModal = () =>
    alert('asdf');

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
          >Name</FloatingLabel>
      </View>
      <View style={styles.inputStyle}>
        <Image source={require('../../images/passwordicon.png')} style={styles.formIcon} />
        <FloatingLabel
            labelStyle={styles.labelInput}
            inputStyle={styles.input}
            style={styles.formInputPassword}
            onBlur={this.onBlur}
            underlineColorAndroid= 'transparent'
          >Email</FloatingLabel>
      </View>
      <View style={styles.submitButtonView}>
        <TouchableHighlight
          style={styles.submitButton}
          underlayColor='#fff'
        >
        <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    </View>
  </View>
  );

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
          >New Password</FloatingLabel>
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
          >Confirm New Password</FloatingLabel>
      </View>
      <View style={styles.submitButtonView}>
        <TouchableHighlight
          style={styles.submitButton}
          underlayColor='#fff'
        >
        <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    </View>
  </View>
  );

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
  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  _editProfileModalToggle = () =>{
    this._toggleModal();
    this.setState({ isEditProfileModalVisible: !this.state.isEditProfileModalVisible });
  }
  _changePasswordModalToggle = () =>{
    this._toggleModal();
    this.setState({ isChangePasswordModalVisible: !this.state.isChangePasswordModalVisible });
  }

  _changeChatModal = () =>{
    // this._toggleModal();
    this.setState({ isChatModal: !this.state.isChatModal });
  }

  render() {

    if (this.state.dimensions) {
      var { dimensions } = this.state
      var { width, height } = dimensions
    }

    return (
      <ScrollView style={styles.scrollView}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        enabled
        >
        <View style={styles.headerField} onLayout={this.onLayout}>
          <View style={styles.headerImage}>
            <Image source={require('../../images/vlogo.png')} style={styles.logoImage} />
          </View>
          <View style={styles.dateHeader}>
            <Row>
              <Col size={80}>
                <View style={styles.datepickerField}>
                  <View style={styles.dateRightIcon}>
                    <Icon
                      name='angle-down'
                      type='font-awesome'
                      onPress={() => console.log('hello')}
                      iconStyle={{
                        fontSize:35
                      }}/>
                  </View>
                  <DatePicker
                    style={{width:'100%',paddingLeft:20}}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="MM-DD-YYYY"
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
                    onDateChange={(date) => {this.setState({date: date})}}
                  />
                </View>
              </Col>
              <Col size={20}>
                <View style={styles.profileIcon}>
                  <TouchableHighlight onPress={this._toggleModal}>
                    <Image source={require('../../images/profileicon.png')} style={{width:'100%',height:'100%'}}/>
                  </TouchableHighlight>

                </View>
              </Col>
            </Row>
          </View>
        </View>
        <View style={[styles.bodyContent, {top:120,paddingLeft:10}]}>
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
              onChangeText={this.onChange}
              defaultValue={this.state.text}
              placeholder={'Enter your shopping list here until 1 PM of any given day...'}
              placeholderTextColor={'#c7c7c7'}
              underlineColorAndroid={'transparent'}
            />
            </Col>
          </Row>
        </View>
        <View style={[styles.buttonIconsView, {bottom : (this.state.keyboardOpen ? (this.state.keyboardHeight + 10) : 50)}]}>
          <View style={styles.chatIconView}>
            <TouchableHighlight onPress={this._changeChatModal}>
            <Image source={require('../../images/chat_icon.png')} style={styles.chatIcon} />
            </TouchableHighlight>
          </View>
          <View style={styles.orderIconView}>
            <Image source={require('../../images/list_iconbg.png')} style={styles.chatIcon} />
          </View>
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
          onBackButtonPress = {this._toggleModal}
          onBlur={this.checkModal}>
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
  headerImage:{
    flex: 1,
    alignItems:'center'
  },
  dateHeader:{
    paddingLeft:10,
    paddingRight: 10,
  },
  dateRightIcon:{
    position: 'absolute',
    top: 0,
    right: 0
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
       borderRadius:100,
       backgroundColor : '#945e36'
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
});


export default Home;
