import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import { App } from './components/App';
import { Admin } from './components/Admin';
import { appReducers } from './reducers';
import { store, persistor } from './store';

import 'assets/pokemon-font.css';

import 'components/Shared/styles/base.styl';

import 'react-resizable/css/styles.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/table/lib/css/table.css';

// OfflinePluginRuntime.install({
//     onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
//     onUpdated: () => location.reload(),
// });

const mountNode = document.getElementById('app');
const history = createHistory();

window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
    // tslint:disable-next-line:prefer-template
    console.log(
        `Error: ${errorMsg}, Script: ${url}, Line: ${lineNumber}, Column: ${column}, StackTrace: ${errorObj}`,
    );
};

render(
    <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} onBeforeLift={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Route exact path='/' component={App} />
            </ConnectedRouter>
        </PersistGate>
    </Provider>,
    mountNode,
);

store.subscribe(() => {
    console.table(store.getState());
    if ((store.getState() as any).style.editorDarkMode) {
        document.body.style.background = '#111';
    } else {
        document.body.style.background = '#fff';
    }
});
