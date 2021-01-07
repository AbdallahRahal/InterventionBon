import React, { useState } from 'react'
import { RefreshControl, StyleSheet, Image, View, ScrollView, Text, TextInput, Button, FlatList, TouchableOpacity, Switch, FormLabel, FormInput, FormValidationMessage, Platform, Alert } from 'react-native'
//import CheckBox from '@react-native-community/checkbox'
import DateTimePicker from '@react-native-community/datetimepicker';
import ExportPDF, { ExportPDFfunction } from './ExportPDF.js'
import * as db from './../Helpers/ApiDB'
//import Toast from 'react-native-toast-native';

class NewSheet extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      showpdf: false,
      Bonchoisi: null,
      date: null,
      show: false,
      heightCommande: 0,
      heightExecute: 0,
      Travauxchoisi: null,
      Controle: false,
      Ras: false,
      frais: 0,
      main: 0,
      deplacement: 0,
      HTTotal: 0,
      tva: 0,
      TTCTotal: 0,
      isResponsableEmpty: "black",
      isBonEmpty: "black",
      isBonEmptyWidth: 1,
      isResponsableEmptyWidth: 1
    }


  }


  Affobj() {
    db.getAllKeys();

  }

  onChangeDate(givenDate) {
    let day = new Date(givenDate.nativeEvent.timestamp).getDate().toString();
    if (day.length == 1) {
      day = "0" + day
    }
    let month = new Date(givenDate.nativeEvent.timestamp).getMonth() + 1;
    month = month.toString();
    if (month.length == 1) {
      month = '0' + month
    }
    let year = new Date(givenDate.nativeEvent.timestamp).getFullYear().toString();

    let resultDate = day + "/" + month + "/" + year

    this.setState({ show: false, date: resultDate })
    this.result.Date = resultDate

  }


  SearchTextInputChanged(type, text) {
    switch (type) {
      case "responsable":
        this.result.Responsable = text
        break;

      case "correspondant":
        this.result.Correspondant = text
        break;

      case "client":
        this.result.Client = text
        break;

      case "telephone":
        this.result.Telephone = text
        break;

      case "adresse":
        this.result.Adresse = text
        break;

      case "nomIntervention":
        this.result.NomIntervention = text
        break;

      case "commande":
        this.result.Commande = text
        break;

      case "execute":
        this.result.Execute = text
        break;

      case "jointe":
        this.result.Jointe = text
        break;

      case "frais":
        if (!parseFloat(text) && parseFloat(text) != 0) {
          text = "0"
        }
        text = text.replace(',', '.');
        this.result.Frais = text.toString()
        this.setState({ frais: parseFloat(text) }, () => this.totalHTChanged());

        break;

      case "main":
        if (!parseFloat(text) && parseFloat(text) != 0) {
          text = "0"
        }
        text = text.replace(',', '.');
        this.result.Main = text
        this.setState({ main: parseFloat(text) }, () => this.totalHTChanged());

        break;

      case "deplacement":
        if (!parseFloat(text) && parseFloat(text) != 0) {
          text = "0"
        }
        text = text.replace(',', '.');
        this.result.Deplacement = text
        this.setState({ deplacement: parseFloat(text) }, () => this.totalHTChanged());

        break;

      case "TVA":
        if (!parseFloat(text) && parseFloat(text) != 0) {
          text = "0"
        }
        text = text.replace(',', '.');
        this.result.Tva = text
        this.setState({ tva: parseFloat(text) }, () => this.totalTTCChanged());

        break;

      default:
        console.log("Erreur dans le switch SearchTextInputChanged")
    }

  }

  totalHTChanged() {
    this.setState({ HTTotal: (this.state.main + this.state.frais + this.state.deplacement) }, () => this.funHT());

  }

  totalTTCChanged() {
    this.setState({ TTCTotal: (this.state.HTTotal + (this.state.HTTotal * this.state.tva / 100)) }, () => this.funTT());

  }
  funHT() {
    this.result.HTTotal = this.state.HTTotal

    this.totalTTCChanged()
  }

  funTT() {
    this.result.TTCTotal = this.state.TTCTotal
  }

  clean() {
    this.result =

    {
      Responsable: null,/* Obligatoire */
      TypeBon: null,/* Obligatoire */
      Date: null,
      Correspondant: null,
      Client: null,
      Telephone: null,
      Adresse: null,
      NomIntervention: null,
      Commande: null,
      Execute: null,
      Jointe: null,
      Travaux: null,
      Controle: false,
      Ras: false,
      Frais: null,
      Main: null,
      Deplacement: null,
      HTTotal: null,
      Tva: null,
      TTCTotal: null

    }

    this.textIn0.clear()
    this.textIn1.clear()
    this.textIn2.clear()
    this.textIn3.clear()
    this.textIn4.clear()
    this.textIn5.clear()
    this.textIn6.clear()
    this.textIn7.clear()
    this.textIn8.clear()
    this.textIn9.clear()
    this.textIn10.clear()
    this.textIn11.clear()
    this.textIn12.clear()
    this.textIn13.clear()
    this.textIn14.clear()

  }

  onPressBon(result) {
    this.result.TypeBon = result
    this.setState({ Bonchoisi: result })
  }

  onPressTravaux(result) {
    this.result.Travaux = result
    this.setState({ Travauxchoisi: result })
  }

  onPressControle() {
    this.result.Controle = !this.result.Controle
    this.setState({ Controle: this.result.Controle })
  }

  onPressRAS() {
    this.result.Ras = !this.result.Ras
    this.setState({ Ras: this.result.Ras })
  }

  toDB() {
    if (this.result.Responsable == null || this.result.TypeBon == null) {

      Alert.alert("Fichier non enrengistrer", "Champ obligatoire non renseigner")
      if (this.result.Responsable == null) {

        this.setState({ isResponsableEmpty: "red", isResponsableEmptyWidth: 2 })
      }
      if (this.result.TypeBon == null) {

        this.setState({ isBonEmpty: "red", isBonEmptyWidth: 2 })
      }
    } else {
      this.setState({
        isResponsableEmpty: "black",
        isBonEmpty: "black",
        isResponsableEmptyWidth: 2,
        isBonEmptyWidth: 2
      })

      db.Add(this.result).then(() => this.endNew());
    }

  }
  endNew() {

    this.clean()
    this.props.navigation.navigate('AllSheet')
  }

  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }
  isSelected(test) {

    if (test == this.result.TypeBon) {
      return (
        "#8c8c8c"
      )
    } else {
      return (
        "#e6e6e6"
      )
    }
  }
  isSelected3(test) {

    if (test == this.result.Travaux) {
      return (
        "#8c8c8c"
      )
    } else {
      return (
        "#e6e6e6"
      )
    }
  }



  result = {
    Responsable: null,/* Obligatoire */
    TypeBon: null,/* Obligatoire */
    Date: null,
    Correspondant: null,
    Client: null,
    Telephone: null,
    Adresse: null,
    NomIntervention: null,
    Commande: null,
    Execute: null,
    Jointe: null,
    Travaux: null,
    Controle: false,
    Ras: false,
    Frais: null,
    Main: null,
    Deplacement: null,
    HTTotal: null,
    Tva: null,
    TTCTotal: null


  };

  render() {


    return (

      <ScrollView style={{ flex: 1 }}>

        <View style={[styles.view, { marginTop: 10 }]}>
          <Text style={styles.text}>Responsable de l'affaire :</Text>
          <TextInput ref={input => {this.textIn0 = input}} placeholder='Obligatoire' style={[styles.textinput, { borderColor: this.state.isResponsableEmpty }]}
            onChangeText={(text) => this.SearchTextInputChanged("responsable", text)} maxLength={30} />

          <View style={[{ flexDirection: 'row' }]}>
            <Text style={styles.text}>Bon de : </Text>
            <TouchableOpacity onPress={() => this.onPressBon("Dépannage")}
              style={[styles.TouchableOpacitybutton, { backgroundColor: this.isSelected("Dépannage"), marginRight: 1, borderWidth: this.state.isBonEmptyWidth, borderColor: this.state.isBonEmpty }]}>
              <Text>Dépannage</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressBon("Travaux")}
              style={[styles.TouchableOpacitybutton, { backgroundColor: this.isSelected("Travaux"), marginRight: 1, borderWidth: this.state.isBonEmptyWidth, borderColor: this.state.isBonEmpty }]} >
              <Text>Travaux</Text></TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.setState({ show: true })} style={[styles.TouchableOpacitybutton]}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../Images/ic_today.png')} style={styles.icon} /><Text style={styles.text} >En date du : {this.state.date ? this.state.date : " "}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.state.show && (
            <DateTimePicker
              value={new Date()}
              onChange={(value) => this.onChangeDate(value)}
            />
          )}
          <Text style={styles.text}>Correspondant Client :</Text>
          <TextInput ref={input => {this.textIn1 = input}} style={[styles.textinput]} onChangeText={(text) => this.SearchTextInputChanged("correspondant", text)} />
        </View>


        <View style={[styles.view, { marginTop: 10 }]}>
          <Text style={styles.text}>Client :</Text>
          <TextInput ref={input => {this.textIn2 = input}} style={[styles.textinput]} onChangeText={(text) => this.SearchTextInputChanged("client", text)} />

          <Text style={styles.text}>Téléphone :</Text>
          <TextInput ref={input => {this.textIn3 = input}} style={[styles.textinput]} maxLength={10} keyboardType="phone-pad" onChangeText={(text) => this.SearchTextInputChanged("telephone", text)} />

          <Text style={styles.text}>Adresse :</Text>
          <TextInput ref={input => {this.textIn4 = input}} style={[styles.textinput]} onChangeText={(text) => this.SearchTextInputChanged("adresse", text)} />

          <Text style={styles.text}>Nom et lieu d'intervention :</Text>
          <TextInput ref={input => {this.textIn5 = input}} style={[styles.textinput]} multiline={true} onChangeText={(text) => this.SearchTextInputChanged("nomIntervention", text)} />

          <Text style={styles.text}>Détail des travaux commandés :</Text>
          <TextInput ref={input => {this.textIn6 = input}} style={[styles.textinput, { height: Math.max(60, this.state.heightCommande) }]} multiline={true} textAlignVertical="top"
            onChangeText={(text) => this.SearchTextInputChanged("commande", text)} onContentSizeChange={(event) => this.setState({ heightCommande: event.nativeEvent.contentSize.height })} maxLength={264} />

          <Text style={styles.text}>Détail des travaux exécutés :</Text>
          <TextInput ref={input => {this.textIn7 = input}} style={[styles.textinput, { height: Math.max(60, this.state.heightExecute) }]} multiline={true} textAlignVertical="top"
            onChangeText={(text) => this.SearchTextInputChanged("execute", text)} onContentSizeChange={(event) => this.setState({ heightExecute: event.nativeEvent.contentSize.height })} maxLength={750} />
        </View>

        <View style={[styles.view, { marginTop: 10 }]}>
          <Text style={styles.text}>Piéces jointes</Text>
          <TextInput ref={input => {this.textIn8 = input}} style={[styles.textinput]} multiline={true} onChangeText={(text) => this.SearchTextInputChanged("jointe", text)} />

          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={styles.text}>Contrôle et essais effectués : </Text>
            <TouchableOpacity onPress={() => this.onPressControle()}>
              <Image source={this.state.Controle ? require('../Images/ic_checked.png') : require('../Images/ic_unchecked.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={styles.text}>R.A.S : </Text>
            <TouchableOpacity onPress={() => this.onPressRAS()}>
              <Image source={this.state.Ras ? require('../Images/ic_checked.png') : require('../Images/ic_unchecked.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.text}>Travaux : </Text>
            <TouchableOpacity onPress={() => this.onPressTravaux("En Cours")} style={[styles.TouchableOpacitybutton, { backgroundColor: this.isSelected3("En Cours"), marginRight: 1 }]}><Text>En cours</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressTravaux("Terminé")} style={[styles.TouchableOpacitybutton, { backgroundColor: this.isSelected3("Terminé"), marginRight: 1 }]} ><Text>Terminés</Text></TouchableOpacity>
          </View>
        </View>

        <View style={[styles.view, { marginTop: 10 }]}>
          <Text style={styles.text}>Frais divers :</Text>
          <TextInput ref={input => {this.textIn9 = input}} style={[styles.textinput]} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("frais", text)} />

          <Text style={styles.text}>Main d'oeuvre :</Text>
          <TextInput ref={input => {this.textIn10 = input}} style={[styles.textinput]} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("main", text)} />

          <Text style={styles.text}>Deplacement :</Text>
          <TextInput ref={input => {this.textIn11 = input}} style={[styles.textinput]} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("deplacement", text)} />

          <Text style={styles.text}>Total H.T :</Text>
          <TextInput ref={input => {this.textIn12 = input}} tyle={[styles.textinput]} editable={false} value={
            (this.state.HTTotal).toString()} />

          <Text style={styles.text}>TVA % :</Text>
          <TextInput ref={input => {this.textIn13 = input}} style={[styles.textinput]} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("TVA", text)} />

          <Text style={styles.text}>Total T.T.C :</Text>
          <TextInput ref={input => {this.textIn14 = input}} style={[styles.textinput]} editable={false} value={
            (this.state.TTCTotal).toString()} />


        </View>
        <TouchableOpacity style={{ alignItems: 'center', backgroundColor: "#5991CC" }} onPress={() => this.toDB()}><Text style={{ flex: 1, fontSize: 18, margin: 10 }}>Enrengistrer</Text></TouchableOpacity>

      </ScrollView>


    )
  }
}


const styles = StyleSheet.create({
  view: {
    borderColor: "gray",
    marginLeft: 3,
    marginBottom: 30,
    marginRight: 3,
    borderRadius: 17,
    borderTopWidth: 5,
  }, empty: {

    borderWidth: 2,

  }, empty2: {


  },
  text: {
    marginLeft: 5,
    fontSize: 16
  },
  TouchableOpacitybutton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 9,
    padding: 7

  }, Toast: {
    backgroundColor: "gray",
    width: 40,
    height: 85,
    fontSize: 14,
    borderRadius: 25,
  },
  icon: {
    width: 30,
    height: 30
  },
  textinput: {
    borderRadius: 9,
    marginLeft: 5,
    marginBottom: 5,
    marginRight: 5,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  }
})
export default NewSheet
