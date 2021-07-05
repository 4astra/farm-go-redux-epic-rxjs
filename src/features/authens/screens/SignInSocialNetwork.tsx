import * as React from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, View, } from '../../../components/Themed';
import { AppleSignInButton, GoogleSignInButton, FBSignInButton } from '../../../components/SocialButtons'
import { useDispatch, useSelector } from 'react-redux';
import { signin_with_fb, signin_with_apple } from '../actions';
import { RootState } from 'typesafe-actions';

export default function SignInSocialNetwork() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.socialNetwork.isLoading);

  const sign_in_fb = () => {
    dispatch(signin_with_fb.request(true))
  }
  
  return (
    <View style={styles.container}>
      {
        isLoading ?
          <ActivityIndicator color="red" size="large" />
          : <View />
      }

      <FBSignInButton style={{ margin: 10 }} onPress={sign_in_fb} />
      <GoogleSignInButton style={{ margin: 10 }} />
      <AppleSignInButton style={{ margin: 10 }} onPress={() => dispatch(signin_with_apple.request(true))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
