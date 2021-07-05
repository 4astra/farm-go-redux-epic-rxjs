import { ErrorMessage, SocialProfile } from 'MyModels';
import { createAsyncAction } from 'typesafe-actions';

export const REQUEST_SIGNIN_FB = 'REQUEST_SIGNIN_FB';
export const SIGNIN_FB_SUCCESS = 'SIGNIN_FB_SUCCESS';
export const SIGNIN_FB_FAILED = 'SIGNIN_FB_FAILED';

export const REQUEST_REGISTER_FROM_SOCIAL_NETWORK = 'REQUEST_REGISTER_FROM_SOCIAL_NETWORK';
export const REGISTER_FROM_SOCIAL_NETWORK_SUCCESS = 'REGISTER_FROM_SOCIAL_NETWORK_SUCCESS';
export const REGISTER_FROM_SOCIAL_NETWORK_FAILED = 'REGISTER_FROM_SOCIAL_NETWORK_FAILED';

export const REQUEST_SIGNIN_APPLE = 'REQUEST_SIGNIN_APPLE';
export const SIGNIN_APPLE_SUCCESS = 'SIGNIN_APPLE_SUCCESS';
export const SIGNIN_APPLE_FAILED = 'SIGNIN_APPLE_FAILED';

export const signin_with_fb = createAsyncAction(
  REQUEST_SIGNIN_FB,
  SIGNIN_FB_SUCCESS,
  SIGNIN_FB_FAILED
)<boolean, SocialProfile, ErrorMessage>()

export const signin_with_apple = createAsyncAction(
  REQUEST_SIGNIN_APPLE,
  SIGNIN_APPLE_SUCCESS,
  SIGNIN_APPLE_FAILED
)<boolean, SocialProfile, ErrorMessage>()

export const register_from_social_network = createAsyncAction(
  REQUEST_REGISTER_FROM_SOCIAL_NETWORK,
  REGISTER_FROM_SOCIAL_NETWORK_SUCCESS,
  REGISTER_FROM_SOCIAL_NETWORK_FAILED
)<any, any, ErrorMessage>()