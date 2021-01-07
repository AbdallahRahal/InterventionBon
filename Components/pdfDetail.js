import React, { useState } from 'react';
import { StyleSheet, Image, View, ScrollView, Text, TextInput, Button, FlatList, TouchableOpacity, Switch, FormLabel, FormInput, FormValidationMessage, Platform } from 'react-native'
import * as db from './../Helpers/ApiDB'
import ExportPDF, { ExportPDFfunction } from './ExportPDF.js'
import RNSmtpMailer from "react-native-smtp-mailer";
import RNFS from "react-native-fs";
import DateTimePicker from '@react-native-community/datetimepicker';
import Dialog, { DialogFooter, DialogButton, DialogTitle, DialogContent, SlideAnimation } from 'react-native-popup-dialog';

class pdfDetail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      item: this.props.navigation.state.params.item,
      Responsable: "test",
      showpdf: false,
      Bonchoisi: this.props.navigation.state.params.item.Bonchoisi,
      date: this.props.navigation.state.params.item.Date,
      show: false,
      heightCommande: 0,
      heightExecute: 0,
      Travauxchoisi: this.props.navigation.state.params.item.Travauxchoisi,
      Controle: this.props.navigation.state.params.item.Controle,
      Ras: this.props.navigation.state.params.item.Ras,
      frais: this.props.navigation.state.params.item.Frais,
      main: this.props.navigation.state.params.item.Main,
      deplacement: this.props.navigation.state.params.item.Deplacement,
      HTTotal: this.props.navigation.state.params.item.HTTotal,
      tva: this.props.navigation.state.params.item.Tva,
      TTCTotal: this.props.navigation.state.params.item.TTCTotal,
      isResponsableEmpty: "black",
      isBonEmpty: "black",
      isBonEmptyWidth: 1,
      isResponsableEmptyWidth: 1,
      popupVisible: false

    }
  }

  result = {
    Responsable: this.props.navigation.state.params.item.Responsable, //obligatoire
    TypeBon: this.props.navigation.state.params.item.TypeBon,  //obligatoire
    Date: this.props.navigation.state.params.item.Date,
    Correspondant: this.props.navigation.state.params.item.Correspondant,
    Client: this.props.navigation.state.params.item.Client,
    Telephone: this.props.navigation.state.params.item.Telephone,
    Adresse: this.props.navigation.state.params.item.Adresse,
    NomIntervention: this.props.navigation.state.params.item.NomIntervention,
    Commande: this.props.navigation.state.params.item.Commande,
    Execute: this.props.navigation.state.params.item.Execute,
    Jointe: this.props.navigation.state.params.item.Jointe,
    Travaux: this.props.navigation.state.params.item.Travaux,
    Controle: this.props.navigation.state.params.item.Controle,
    Ras: this.props.navigation.state.params.item.Ras,
    Frais: this.props.navigation.state.params.item.Frais,
    Main: this.props.navigation.state.params.item.Main,
    Deplacement: this.props.navigation.state.params.item.Deplacement,
    HTTotal: this.props.navigation.state.params.item.HTTotal,
    Tva: this.props.navigation.state.params.item.Tva,
    TTCTotal: this.props.navigation.state.params.item.TTCTotal,
    id: this.props.navigation.state.params.item.id,


  };
  Affobj() {

    this.getB64()
  }

  onChangeDate(givenDate) {
    let day = new Date(givenDate.nativeEvent.timestamp).getDate().toString();
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


  Delete() {
    db.Delete(this.result.id).then(() => this.endNew());
  }


  endNew() {
    this.props.navigation.navigate('AllSheet')
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

      db.Update(this.result).then(() => this.setState({ showpdf: false }));
    }

  }

  async getB64() {
    console.log(' dans getb64  item.respon = ' + this.state.item.Responsable)
    this.b64 = await ExportPDFfunction(this.result)

    this.final()

  }
  final() {
    this.setState({ showpdf: !this.state.showpdf })
  }
  async Send() {
    await db.sendMail(this.state.item.id,this.b64)
  }

  render() {
    var b64 = null;

    var lastdatePick = new Date()
    if (this.state.date) {
      var predatePick = this.state.date
      lastdatePick = new Date(predatePick[6] + predatePick[7] + predatePick[8] + predatePick[9] + "-" + predatePick[3] + predatePick[4] + "-" + predatePick[0] + predatePick[1])
    }

    if (!this.state.showpdf) this.Affobj();
    return (

      <View style={{ flex: 1 }}>




        <ExportPDF resources={this.b64} />

        <TouchableOpacity style={{ flexDirection: 'row', JustifyContent: 'center', alignItems: 'center', backgroundColor: "#841584" }} onPress={() => this.Send()}>
          <Text style={{ flex: 1, fontSize: 17 }}>Envoyer par mail</Text><Image source={require('../Images/ic_mail.png')} style={[styles.icon, {}]} />
        </TouchableOpacity>

        <ScrollView style={{ flex: 1 }}>

          <View style={[styles.view, { marginTop: 10 }]}>
            <Text style={styles.text}>Responsable de l'affaire :</Text>
            <TextInput ref={null} defaultValue={this.result.Responsable} style={[styles.textinput, { borderColor: this.state.isResponsableEmpty }]}
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
                value={lastdatePick}
                onChange={(value) => this.onChangeDate(value)}
              />
            )}
            <Text style={styles.text}>Correspondant Client :</Text>
            <TextInput ref={null} defaultValue={this.result.Correspondant} style={[styles.textinput]} onChangeText={(text) => this.SearchTextInputChanged("correspondant", text)} />
          </View>


          <View style={[styles.view, { marginTop: 10 }]}>
            <Text style={styles.text}>Client :</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.Client} onChangeText={(text) => this.SearchTextInputChanged("client", text)} />

            <Text style={styles.text}>Téléphone :</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.Telephone} maxLength={10} keyboardType="phone-pad" onChangeText={(text) => this.SearchTextInputChanged("telephone", text)} />

            <Text style={styles.text}>Adresse :</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.Adresse} onChangeText={(text) => this.SearchTextInputChanged("adresse", text)} />

            <Text style={styles.text}>Nom et lieu d'intervention :</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.NomIntervention} multiline={true} onChangeText={(text) => this.SearchTextInputChanged("nomIntervention", text)} />

            <Text style={styles.text}>Détail des travaux commandés :</Text>
            <TextInput style={[styles.textinput, { height: Math.max(60, this.state.heightCommande) }]} defaultValue={this.result.Commande} multiline={true} textAlignVertical="top"
              onChangeText={(text) => this.SearchTextInputChanged("commande", text)} onContentSizeChange={(event) => this.setState({ heightCommande: event.nativeEvent.contentSize.height })} maxLength={264} />

            <Text style={styles.text}>Détail des travaux exécutés :</Text>
            <TextInput style={[styles.textinput, { height: Math.max(60, this.state.heightExecute) }]} defaultValue={this.result.Execute} multiline={true} textAlignVertical="top"
              onChangeText={(text) => this.SearchTextInputChanged("execute", text)} onContentSizeChange={(event) => this.setState({ heightExecute: event.nativeEvent.contentSize.height })} maxLength={750} />
          </View>

          <View style={[styles.view, { marginTop: 10 }]}>
            <Text style={styles.text}>Piéces jointes</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.Jointe} multiline={true} onChangeText={(text) => this.SearchTextInputChanged("jointe", text)} />

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
            <TextInput style={[styles.textinput]} defaultValue={this.result.Frais} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("frais", text)} />

            <Text style={styles.text}>Main d'oeuvre :</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.Main} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("main", text)} />

            <Text style={styles.text}>Deplacement :</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.Deplacement} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("deplacement", text)} />

            <Text style={styles.text}>Total H.T :</Text>
            <TextInput style={[styles.textinput]} editable={false} value={this.state.HTTotal ? this.state.HTTotal.toString() : ""} />

            <Text style={styles.text}>TVA % :</Text>
            <TextInput style={[styles.textinput]} defaultValue={this.result.Tva} keyboardType="decimal-pad" onChangeText={(text) => this.SearchTextInputChanged("TVA", text)} />

            <Text style={styles.text}>Total T.T.C :</Text>
            <TextInput style={[styles.textinput]} editable={false} value={this.state.TTCTotal ? this.state.TTCTotal.toString() : ""} />


          </View>
          <TouchableOpacity style={{ alignItems: 'center', backgroundColor: "#5991CC" }} onPress={() => this.toDB()}><Text style={{ flex: 1, fontSize: 18, margin: 10 }}>Enrengistrer</Text></TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center', backgroundColor: "#E0222F" }} onPress={() => this.setState({ popupVisible: true })}><Text style={{ flex: 1, fontSize: 18, margin: 10 }}>Supprimer</Text></TouchableOpacity>
          <View >
            <Dialog
              children={undefined}
              visible={this.state.popupVisible}
              dialogTitle={<DialogTitle title="Voulez-vous vraiment supprimer ce bon ?" />}
              onTouchOutside={() => {
                this.setState({ popupVisible: false });
              }}
              footer={
                <DialogFooter>
                  <DialogButton
                    text="Retour"
                    onPress={() => { this.setState({ popupVisible: false }) }}
                  />
                  <DialogButton
                    text="Supprimer"
                    onPress={() => { this.setState({ popupVisible: false }); this.Delete() }}
                  />
                </DialogFooter>
              }
            /*dialogAnimation={new SlideAnimation({
              slideFrom: 'bottom',
            })}*/
            >
            </Dialog>
          </View>
        </ScrollView>
      </View>

    )
  }
}
const styles = StyleSheet.create({
  main_container: {
    backgroundColor: "#e0dede",
    borderWidth: 0.5,
    margin: 0.5,
    marginBottom: 3
  }, icon: {
    width: 40,
    height: 40
  },
  /* view: {
     marginTop: 2,
     marginLeft: 5,
     marginRight: 5,
     flex: 1
   },*/

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
    fontSize: 16,
    marginBottom: 1.5
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
    marginLeft: 5,
    marginBottom: 5,
    marginRight: 5,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 9,
    paddingLeft: 5
  }

})


export default pdfDetail;
