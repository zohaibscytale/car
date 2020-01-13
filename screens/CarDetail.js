import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import { HeaderBackButton } from 'react-navigation-stack';

import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { TextInput } from 'react-native-gesture-handler';


class CarDetail extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: `Car Detail`,
            headerLeft: (<HeaderBackButton onPress={() => {
                navigation.goBack();
                const { _id, newName } = params.getStateData();
                navigation.state.params.updateParent(_id, newName);
            }} />)
        }
    }

    getStateData = () => {
        return {
            _id: this.state.car._id,
            newName: this.state.newName
        }
    }

    componentDidMount = () => {
        const { _id } = this.props.navigation.state.params;
        this.props.navigation.setParams({ getStateData: this.getStateData });

        if (this.state.car === null) {
            this.props.client.query({
                query: gql`
              {
                carById(carId: "${_id}"){
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
                    car: response.data.carById,
                    newName: response.data.carById.name
                })
            })
        }
    }


    editPressed = () => {
        this.setState({
            edit: true
        })
    }

    cancelPressed = () => {
        this.setState({
            edit: false
        })
    }

    savePressed = () => {


        this.props.client.mutate({
            mutation: gql`
            mutation updateCarName($_id: String!, $newName: String!){
                updateCarName(_id:$_id, newName:$newName)
                {
                    _id,
                    name,
                    companyId,
                    company{
                    _id,
                    name
                    }
                }
              }
        `,
            variables: {
                _id: this.state.car._id,
                newName: this.state.newName
            }
        }).then(response => {
            this.setState({
                car: response.data.updateCarName,
                edit: false
            }, () => {
            })
        }).catch(e => console.log(e.message))

    }


    state = {
        car: null,
        edit: false,
        newName: ''
    }

    render() {
        if (this.state.car !== null) {
            return (
                <View style={styles.container}>
                    <View style={{ width: '100%', height: '20%', flexDirection: 'column' }}>
                        <Text style={{ fontSize: 16, paddingLeft: 5 }}>CAR</Text>
                        <TextInput style={{ color: 'gray', paddingLeft: 9, marginBottom: 7, backgroundColor: this.state.edit ? '#C0C0C0' : '#FFF' }}
                            editable={this.state.edit} value={this.state.newName}
                            onChangeText={text => this.setState({ newName: text })}
                        />
                        <Text style={{ fontSize: 16, paddingLeft: 5 }}>COMPANY</Text>
                        <TextInput style={{ color: 'gray', paddingLeft: 9, marginBottom: 7 }} editable={false} value={this.state.car.company.name} />
                    </View>
                    {!this.state.edit ?
                        <View>
                            <TouchableOpacity onPress={() => this.editPressed()}>
                                <View style={[styles.button, { backgroundColor: 'gray' }]}>
                                    <Text style={{ color: 'white' }} >Edit</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => this.cancelPressed()}>
                                <View style={[styles.button, { flex: 1, backgroundColor: '#ef473a' }]}>
                                    <Text style={{ color: 'white' }} >Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.savePressed()}>
                                <View style={[styles.button, { backgroundColor: '#33cd5f' }]}>
                                    <Text style={{ color: 'white' }}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    }
                </View>
            )
        }
        else
            return null

    }
}



// Add some simple styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 25,
        paddingRight: 25,

    },
    button: {
        height: 45,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 10
    }
})

export default withApollo(CarDetail);