import { combineReducers } from 'redux';
import { createReducer, RootAction, RootState } from 'typesafe-actions';
import { signin_with_fb, signin_with_apple, register_from_social_network } from './actions';

const initState = {
  isLoading: false,
  profile: []
}

const socialNetworkReducer = createReducer(initState)
  .handleAction(
    [signin_with_fb.request], (state, action) => ({ ...state, isLoading: true })
  )
  .handleAction(
    [signin_with_fb.success], (state, action) => ({ ...state, profile: [], isLoading: false })
  )
  .handleAction(
    [signin_with_fb.failure], (state, action) => ({ ...state, isLoading: false })
  )
  .handleAction(
    [signin_with_apple.request], (state, action) => ({ ...state, isLoading: true })
  )
  .handleAction(
    [signin_with_apple.success], (state, action) => ({ ...state, profile: [], isLoading: false })
  )
  .handleAction(
    [signin_with_apple.failure], (state, action) => ({ ...state, isLoading: false })
  )
  .handleAction(
    [register_from_social_network.success], (state, _) => ({ ...state, isLoading: false })
  )
  .handleAction(
    [register_from_social_network.failure], (state, _) => ({ ...state, isLoading: false })
  )


export default socialNetworkReducer;
export type SignInSocialNetworkState = ReturnType<typeof socialNetworkReducer>;