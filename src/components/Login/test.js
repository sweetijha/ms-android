import {Image, Text, TouchableHighlight, View} from "react-native";
import {Col, Grid} from "react-native-easy-grid";
import React from "react";

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
                this.setState({
                    phone : ''
                })
                alert(JSON.stringify(responseJson));
            }else{
                this.props.navigation.navigate('Home');
                this.setState({
                    phone : '',
                    password : ''
                })
            }
        })
        .catch((error)=>{
            console.error(error);
        })
}


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
        >Password</FloatingLabel>
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
        >Confirm Password</FloatingLabel>
    </View>
    <View style={styles.submitButtonView}>
        <TouchableHighlight
            onPress={this.onLoginPress.bind(this)}
            style={styles.submitButton}
            underlayColor='#fff'
        >
            <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableHighlight>
    </View>
    <View style={styles.extraLink}>
        <Grid>
            <Col>
                <Text onPress={()=>this.navigateToOtherComponent('Login')} style={{textAlign:'left'}}>Login</Text>
            </Col>
            <Col>
                <Text onPress={()=>this.navigateToOtherComponent('Signup')} style={{textAlign:'right'}}>New User</Text>
            </Col>
        </Grid>

    </View>
</View>
