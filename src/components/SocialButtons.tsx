import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import {
  AppleAuthenticationButton as DefaultAppleButton,
  AppleAuthenticationButtonStyle as AppleButtonStyle,
  AppleAuthenticationButtonType as AppleButtonType
} from 'expo-apple-authentication';
import useColorScheme from '../hooks/useColorScheme';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export type AppleButtonProps = DefaultAppleButton['AppleAuthenticationButtonProps'];
export type TouchableOpacityProps = TouchableOpacity['props'];

export function AppleSignInButton(props: AppleButtonProps) {
  const { style, ...otherProps } = props;
  const theme = useColorScheme();
  let buttonStyle = theme === 'dark' ? AppleButtonStyle.WHITE : AppleButtonStyle.BLACK;

  return <DefaultAppleButton cornerRadius={5} style={[style, {width: styles.button.width, height: styles.button.height}]} {...otherProps} buttonType={AppleButtonType.SIGN_IN} buttonStyle={buttonStyle} />;
}

export function FBSignInButton(props: TouchableOpacityProps) {
  const { style, ...otherProps } = props;
  return <TouchableOpacity style={[style, styles.button, styles.fb]} {...otherProps}>
    <FontAwesome5 style={{ padding: 5 }} color="#fff" size={18} name="facebook-f" />
    <Text style={styles.font}>Sign in with Facebook</Text>
  </TouchableOpacity>
}

export function GoogleSignInButton(props: TouchableOpacityProps) {
  const { style, ...otherProps } = props;
  return <TouchableOpacity style={[style, styles.button, styles.google]} {...otherProps}>
    <FontAwesome style={{ padding: 5 }} color="#e53932" size={18} name="google" />
    <Text style={styles.font}>Sign in with Google</Text>
  </TouchableOpacity>
}

export const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    width: 220,
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  fb: {
    backgroundColor: "#3b5998",
  },
  google: {
    backgroundColor: "#397ded",
  },
  font: {
    color: "#fff", fontSize: 16, fontWeight: "500"
  }
});