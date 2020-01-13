import { AppLoading } from 'expo';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import { ApolloProvider } from 'react-apollo';

import makeApolloClient from './constants/apollo';


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [client, setClient] = React.useState(null);

  const createClient = async () => {

    const client = makeApolloClient();

    setClient(client);
  }
  React.useEffect(() => {
    createClient();
  }, [])


  if (!isLoadingComplete && !props.skipLoadingScreen && !client) {
    return (
      <AppLoading
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <ApolloProvider client={client}>
          <AppNavigator />
        </ApolloProvider>
      </View>
    );
  }
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
