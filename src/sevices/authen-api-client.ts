import * as Facebook from 'expo-facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AppleAuthenticationFullName } from 'expo-apple-authentication';
import { SocialProfile, ErrorMessage } from "MyModels";
import xfetch, { FB_GRAPH_API, BASE_URL } from '../network';

/**
 * POST Social Profile to register authentication
 * @param {SocialProfile} social is information to register
 * @returns {Promise<any>} of response body
 */
export const register_from_social_network = async (social: SocialProfile): Promise<any> => {
  const body = {
    "full_name": social.full_name,
    "id": social.id,
    "social_type": social.type,
    "user_photo": social.user_photos,
    "email": social.email
  }
  try {
    const res = await xfetch.post(`${BASE_URL}/v1/auth/social-network`,body);
    return res;
  } catch (error) {
    return error;
  }
}

export const authen_in_fb = async (): Promise<SocialProfile | ErrorMessage> => {
  return new Promise(async (resolve, reject) => {
    try {
      await Facebook.initializeAsync({
        appId: 'fb439343123763406',
      });
      const {
        type,
        token,
        // expirationDate,
        // permissions,
        // declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email', 'user_photos']
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`${FB_GRAPH_API}?access_token=${token}`);
        const data = await response.json();

        const social: SocialProfile = { id: data.id, full_name: data.name, type: 'fb' }
        resolve(social)
      } else {
        // type === 'cancel'
        const message: ErrorMessage = { message: "User has cancelled", code: -1 };
        reject(message)
      }
    } catch ({ message }) {
      const error: ErrorMessage = { message: `FB login error: ${message}`, code: -1 };
      reject(error)
    }
  })
}

export const authen_in_apple = () => {
  return new Promise<SocialProfile>(async (resolve, reject) => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { givenName, nickname } = credential.fullName as AppleAuthenticationFullName
      const social = { email: credential.email, fullName: givenName, type: 'apple' } as SocialProfile
      resolve(social)
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
        reject({ message: "User cancelled", code: -1 } as ErrorMessage)
      } else {
        // handle other errors
        reject({ message: `Apple login error: ${e}`, code: -1 } as ErrorMessage)
      }
    }
  })
}
