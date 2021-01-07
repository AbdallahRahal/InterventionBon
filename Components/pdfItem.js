import React, {useState} from 'react';
import {StyleSheet,Image, View,ScrollView, Text, TextInput, Button, FlatList, TouchableOpacity , Switch,FormLabel, FormInput, FormValidationMessage,Platform } from 'react-native'
import * as db from './../Helpers/ApiDB'
import ExportPDF, {ExportPDFfunction} from './ExportPDF.js'

class pdfItem extends React.Component {

      constructor(props) {
          super(props)
          this.state = {
          }
        }

render() {
 const {showpdfDetail} = this.props
        return (


          <TouchableOpacity  onPress={()=> showpdfDetail(this.props.item)} style={styles.main_container} >

            <View style={styles.view}>
            <Text style={styles.text}>N° enrengistrement : {this.props.item.id} </Text>
            <Text style={styles.text} >{this.props.item.TypeBon ? this.props.item.TypeBon : "Travaux/Dépannage" } du {this.props.item.Date ? this.props.item.Date : "" }  {this.props.item.Travaux ? "( "+this.props.item.Travaux+" )" : "" } </Text>
            <Text style={styles.text}>{this.props.item.NomIntervention ? this.props.item.NomIntervention : <Text style={{fontStyle: 'italic',fontSize: 12}}>Nom et lieu d'intervention non renseigner</Text>  }</Text>
            <Text style={styles.text}>Client : {this.props.item.Client ? this.props.item.Client : "" } </Text>
            <Text style={styles.text}>Travaux commandés : {this.props.item.Commande ? this.props.item.Commande : "" } </Text>
            <View style={{flexDirection: 'row',alignItems:"flex-end"}}>
            <Text style={{flex:1,marginBottom: 1}}>Total TTC : {this.props.item.TTCTotal ? this.props.item.TTCTotal :   <Text style={{fontStyle: 'italic',fontSize: 12}}>non renseigner</Text>  } </Text>

            </View></View>
          </TouchableOpacity>


      )
    }
}

const styles =  StyleSheet.create({
  main_container: {
      backgroundColor: "#e0dede",
      borderWidth: 0.5,
      margin: 0.5,
      marginBottom: 3
    },icon: {
        width: 40,
        height: 40
      },
    view: {
      marginTop:2,
      marginLeft:5,
      marginRight:5,
      flex:1
    },
    text:{
      marginBottom:1.5
    }

})

export default pdfItem;
