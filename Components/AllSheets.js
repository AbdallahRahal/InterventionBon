import React, { useState } from 'react';
import { StyleSheet, Image, View, ScrollView, Text, TextInput, Button, FlatList, TouchableOpacity, Switch, FormLabel, ActivityIndicator, FormInput, FormValidationMessage, Platform } from 'react-native'
import * as db from './../Helpers/ApiDB'
import PdfItem from './pdfItem'

class AllSheets extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      list: null,
      isLoading: true

    }
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color="black" />
        </View>
      )
    }
  }
  allpanel() {

    var list = this.state.list
    var x = 0
    listarray = []

    while (!!list && !!list[x]) {
      listarray.push(list[x])

      x++;
    }
    return listarray
  }

  async getAllBon() {
    return await db.getAllBon()
  }
  reloadData() {
    this.getAllBon().then((result) => this.setState({ list: result, isLoading: false }))
  }
  componentDidMount() {
    this.reloadData()
    this.listenDB();
  }

  listenDB() {
    db.dbName().ref('/pdf').on('value', (snapshot) => {
      this.reloadData()
    });

  }
  showpdfDetail = (item) => {

    this.props.navigation.navigate('PdfDetail', { item: item })

  }


  render() {

    var listarraydata = this.allpanel()
    return (

      <View style={{ flex: 1 }}>

        <FlatList
          data={listarraydata}
          extraData={this.state.list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PdfItem showpdfDetail={this.showpdfDetail} item={item} />}

        />
        {this._displayLoading()}
      </View>
    )
  }


};

const styles = StyleSheet.create({

  loading_container: {

    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default AllSheets;
