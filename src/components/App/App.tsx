import * as React from 'react';
import { connect } from 'react-redux';

import './app.css';
import { State } from 'state';
import { updateEditorHistory } from 'actions';
import { feature } from 'utils';
import { omit } from 'ramda';
import { History } from 'reducers/editorHistory';
import { ErrorBoundary } from 'components';
import { Drawer } from '@blueprintjs/core';

const isEqual = require('lodash/isEqual');


export interface AppProps {
    style: State['style'];
    view: State['view'];
}

function Loading() {
    return <div>Loading...</div>;
}

const Editor = React.lazy(() =>
    import('components/Editor').then((res) => ({ default: res.Editor })),
);

const Result = React.lazy(() =>
    import('components/Result/Result').then((res) => ({ default: res.Result })),
);

const ImagesDrawer = React.lazy(() =>
    import('components/Shared/ImagesDrawer').then((res) => ({ default: res.ImagesDrawer })),
);

const BugReporter = React.lazy(() =>
    import('components/BugReporter').then((res) => ({ default: res.BugReporter })),
);

const Hotkeys = React.lazy(() =>
    import('components/Hotkeys').then((res) => ({ default: res.Hotkeys })),
);


export class UpdaterBase extends React.Component<{
    present: Omit<State, 'editorHistory'>;
    updateEditorHistory: updateEditorHistory;
    lrt: History<any>['lastRevisionType'];
}> {
    public componentDidMount() {
        console.log('Called component did mount');
        // initial history record
        this.props.updateEditorHistory(this.props.present);
    }

    // eslint-disable-next-line camelcase
    public UNSAFE_componentWillReceiveProps(prev) {
        if (
            (prev.lrt === 'update') &&
            this.props.present != null &&
            this.props.present != null &&
            !isEqual(this.props.present, prev.present)
        ) {
            const t0 = performance.now();
            this.props.updateEditorHistory(prev.present);
            const t1 = performance.now();
            console.log(`Updated history in ${t1 - t0}ms`);
        }
    }

    public render() {
        return <div />;
    }
}

export const Updater = connect(
    (state: State) => ({
        present: omit(['editorHistory'], state),
        lrt: state?.editorHistory?.lastRevisionType,
    }),
    { updateEditorHistory },
    null,
    { pure: false },
)(UpdaterBase);

export class AppBase extends React.PureComponent<AppProps, {result2?: boolean}> {
    public constructor(props: AppProps) {
        super(props);
        this.state = {result2: false};
    }

    public componentDidMount() {
        if (feature.resultv2) {
            // TOP SECRET
            if (this.props.style.customCSS.includes('resultv2')) {
                this.setState({result2: true});
            } else {
                this.setState({result2: false});
            }
        }
    }

    public render() {
        const {style, view} = this.props;
        console.log('features', feature);

        return (
            <ErrorBoundary errorMessage={<div className='p-6 center-text'>
                <h2>There was a problem retrieving your nuzlocke data.</h2>
                <p>Please consider submitting a bug report.</p>

                <React.Suspense fallback={'Loading Bug Reporter...'}>
                    <BugReporter defaultOpen />
                </React.Suspense>
            </div>}>
                <div
                    className="app"
                    role="main"
                    style={{
                        background: this.props.style.editorDarkMode ? '#111' : '#fff',
                    }}>
                    <Updater />
                    <ErrorBoundary>
                        <React.Suspense fallback={'Loading Hotkeys...'}>
                            <Hotkeys />
                        </React.Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <React.Suspense fallback={'Loading Editor...'}>
                            <Editor />
                        </React.Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <React.Suspense fallback={'Loading Result...'}>
                            <Result />
                        </React.Suspense>
                    </ErrorBoundary>
                    <Drawer
                        isOpen={view?.dialogs?.imageUploader}
                        size={Drawer.SIZE_STANDARD}
                    >
                        <React.Suspense fallback={'Loading Drawer...'}>\
                            <ImagesDrawer />
                        </React.Suspense>
                    </Drawer>
                </div>
            </ErrorBoundary>
        );
    }
}

export const App = connect(
    (state: Pick<State, keyof State>) => ({
        style: state.style,
        view: state.view,
    })
)(AppBase);
