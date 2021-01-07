import React from 'react'
import { View, Button, Text,Animated, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth';
import * as db from './Helpers/ApiDB'
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-community/google-signin';
import { ease } from 'react-native/Libraries/Animated/src/Easing';
import { Easing } from 'react-native-reanimated';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        isAuthReady: false,
        mail: null,
        isAuthenticated: false,
        fadeAnim : new Animated.Value(0),
        fadeAnim2 : new Animated.Value(0),
        centerAnim : new Animated.Value(60),
    }
  }

  async onGoogleButtonPress() {
    GoogleSignin.configure({
      webClientId: '195402246214-f7k2f3hsj38l3opvrfvq3tjnug8cnlrl.apps.googleusercontent.com'

    });
      console.log('1')
      const {idToken} = await GoogleSignin.signIn()
      console.log('2')
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('3')
      auth().signInWithCredential(googleCredential).then(()=> db.init() ).catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
       var errorMessage = error.message;
         // The email of the user's account used.
         var email = error.email;
         // The firebase.auth.AuthCredential type that was used.
         var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
           alert('Email already associated with another account.');
           // Handle account linking here, if using.
         } else {
         console.error(error);
         }
        });
      console.log('4')
      auth().onAuthStateChanged(this.onAuthStateChanged)
      console.log('5')
      console.log('6')


  }
  
onAuthStateChanged = (user) => {
this.setState({ isAuthReady: true, isAuthenticated: !!user });
}

  async signout(){
    auth().signOut().then(() => console.log('AuthUser signed out!'));
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('GoogleUser signed out!')
    } catch (error) {
      console.error(error);
    }
  this.setState({ isAuthReady: false, isAuthenticated: null})
  console.log('AuthState Restt signed out!')

  }
componentDidMount(){
 
  Animated.timing(
    this.state.fadeAnim,
    {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }
  ).start();
  Animated.timing(
    this.state.fadeAnim2,
    {
      toValue: 1,
      delay: 2000,
      duration: 1000,
      useNativeDriver: true,
    }
  ).start();
  Animated.timing(
    this.state.centerAnim,
    {
      toValue: 0,
      delay: 2000,
      useNativeDriver: false,
      duration: 800,
    }
  ).start();

}
componentDidUpdate(){
  if(this.state.fadeAnim != 1 || this.state.fadeAnim2 != 1 || this.state.centerAnim != 0){
    this.setState({ fadeAnim: 1, fadeAnim2: 1,centerAnim:0})
  }
  if(this.state.isAuthenticated){
    this.props.navigation.navigate('Menu')
  }
}

render(){
  console.log("rendered")
  if(!this.state.isAuthenticated){
    return(
      <View style={{flex: 1}}>
        <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
          <Animated.Text style={{opacity:  this.state.fadeAnim, fontSize:40,paddingTop:70}} >Bonjour</Animated.Text>
        </View>

        <Animated.View style={{flex: 1,alignItems: 'center', opacity:  this.state.fadeAnim2}}>
          <Animated.View style={{marginTop:this.state.centerAnim }}>
            <TouchableOpacity
              onPress={() => this.onGoogleButtonPress()}
              style={{backgroundColor:'#d6d7d9',borderRadius: 9, padding:12}}
            >
              <Text style={{fontSize:21}}>Se connecter avec Google </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
      )
    } else {
      
    return(
         <View style={{flex: 1,alignItems: 'center', justifyContent: 'space-around', marginTop: '30%',marginBottom: '60%'}}>

          <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Menu')}
              style={{backgroundColor:'#d6d7d9',borderRadius: 9, padding:12}}
          >
            <Text style={{fontSize:21}}>Commencer </Text>
          </TouchableOpacity>

        
          <TouchableOpacity
              onPress={() => this.signout()}
              style={{backgroundColor:'#d6d7d9',borderRadius: 9, padding:12}}
          >
            <Text style={{fontSize:21}}>Se deconnecter </Text>
          </TouchableOpacity>

      </View>
      )
    }
  }
  
}