import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

function Car({ name, company }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 23 }}>{name}</Text>
      <Text style={{ fontSize: 15 }}>{company}</Text>
    </View>
  );
}

class HomeScreen extends React.Component {

  static navigationOptions = () => {
    return {
      title: 'Cars'
    }
  }

  state = {
    car: [],
    refreshing: false,
    fetch: true
  }

  componentDidMount = () => {
    this.props.client.query({
      query: gql`
        {
          allCars {
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
        car: [...this.state.car, ...response.data.allCars]
      })
    })

  }

  carPressed = (_id) => {
    this.props.navigation.navigate('CarDetail', { _id: _id, updateParent: this.updateCarState });
  }

  updateCarState = (_id, newName) => {

    let Cars = this.state.car;

    const newData = Cars.map(obj => {
      if (obj._id === _id) 
        return {
          ...obj,
          name: newName
        }
      return obj
    });
    this.setState({
      car: newData
    })
  }

  render() {
    if (this.state.car.length > 0) {
      return (
        <FlatList
          keyExtractor={(item, index) => item._id.toString()}
          data={this.state.car}
          renderItem={(itemData) =>
            (
              <TouchableOpacity onPress={() => this.carPressed(itemData.item._id)}>
                <Car
                  name={itemData.item.name}
                  company={itemData.item.company.name}
                />
              </TouchableOpacity>
            )
          }
          refreshing={this.state.refreshing}
          onRefresh={this.handleReferesh}
        />
      );
    }
    else
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 10,
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    height: 70,
    paddingLeft: 16,

  },
});

export default withApollo(HomeScreen);