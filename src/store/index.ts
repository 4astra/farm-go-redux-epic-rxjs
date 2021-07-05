import { applyMiddleware, createStore, compose } from 'redux';
import { RootState, RootAction, Services } from 'typesafe-actions';
import { createEpicMiddleware } from 'redux-observable'
import { createLogger } from 'redux-logger'

import rootEpic from './root-epic';
import rootReducer from './root-reducer';
import service from '../sevices'

const loggerMiddleware = createLogger()
const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Services>
    ({
        dependencies: service
    });

// config middlewares
const middlewares = [loggerMiddleware, epicMiddleware];

// config enhances
const enhances = compose(applyMiddleware(...middlewares));

//rehydrate state
const initState = {}
const store = createStore(rootReducer, initState, enhances);

epicMiddleware.run(rootEpic);

export default store;
