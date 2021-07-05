import { combineReducers } from 'redux';
import socialNetworkReducer  from '../features/authens/reducer'

export default combineReducers({
  socialNetwork: socialNetworkReducer
})
