import React from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';


class SearchScreen extends React.Component {

  static navigationOptions = () => {
    return {
      title: 'Search'
    }
  }

  state = {
    search: '',
    car: []
  }
  updateSearch = search => {
    this.setState({ search });
  };
  searchCarByName = () => {
    if (this.state.search != "") {
      this.props.client.query({
        query: gql`
        {
          carByName(name:"${this.state.search}") {
            _id,
            name,
            companyId,
            company{
              _id,
              name
            }
          }
        }
      `
      }).then(response => {
        this.setState({
          car: [...this.state.car, ...response.data.carByName]
        })
      })
    }


  }



  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.container, { flex: 0 }]}>
          <View style={{ width: '92%', height: '90%' }}>
            <TextInput placeholder="Search" style={styles.input} onChangeText={text => this.setState({ search: text })} />
          </View>
          <View style={{ paddingTop: 11, width: 30, height: "20%" }}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
              size={30}
              onPress={() => this.searchCarByName()}
            />
          </View>
        </View>

        <View style={[styles.container]}>
          <FlatList
            keyExtractor={(item, index) => item._id.toString()}
            data={this.state.car}
            renderItem={(itemData) =>
              (
                <View style={styles.list} >
                  <TouchableOpacity >
                    <Text >{itemData.item.name}</Text>
                    <Text >{itemData.item.company.name}</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          />

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 1

  },
  input: {
    width: '100%',
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    padding: 10
  },
  list: {
    backgroundColor: '#fff',
    paddingTop: 10,
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    height: 70,
    paddingLeft: 16,

  },
})

export default withApollo(SearchScreen);
