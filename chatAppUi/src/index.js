import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import thunk from 'redux-thunk';
import { compose, applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';

import userReducer from '../src/reducers/userReducers';
import productReducer from '../src/reducers/productReducers';
import documentReducer from '../src/reducers/documentReducers';

const rootReducer = combineReducers({
	products: productReducer,
	user: userReducer,
	document: documentReducer,
});

const allEnhancers = compose(
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
);

const store = createStore(
	rootReducer,
	{
		products: [{
			name: 'Samsung',
			type: 'TV'
		}]
	},
	allEnhancers
);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
