import * as React from 'react';
import {renderToString} from 'react-dom/server';
import  App  from '../../lib/components/App'
import {StaticRouter} from 'react-router'
import {store} from '../../lib/app/store'
import { Provider } from 'react-redux';
console.log('what the fuck is going on')
console.log(App)
let serverRenderer = function () {

  return ({
    initialContent: renderToString(
      <StaticRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </StaticRouter>,
    ),
  }
  );
}
export default serverRenderer
