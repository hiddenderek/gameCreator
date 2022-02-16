import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../../lib/components/App';
import {BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from '../../lib/app/store'


ReactDOM.hydrate(
  <Router>
    <Provider store = {store}>
    <App/>
    </Provider>
  </Router>,
  document.getElementById('root'),
);
