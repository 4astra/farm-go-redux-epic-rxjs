import * as signInSocialNetworkEpic from '../features/authens/epics';
import { combineEpics } from 'redux-observable'

export default combineEpics(...Object.values(signInSocialNetworkEpic))
