import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';

import { AppState, Config } from './store/state';
import { getConfig } from './store/selectors';
import { ConfigAction, BrowserAction } from './store/action';

import Router from './Router';
import './App.css';

class App extends React.Component<Props, object> {

  onBrowserCloseBound = this.onBrowserClose.bind(this);

  componentDidMount(): void {
    if (!this.props.config) {
      this.props.loadConfig();
    }

    window.addEventListener('beforeunload', this.onBrowserCloseBound);
  }

  componentWillUnmount(): void {
    window.removeEventListener('beforeunload', this.onBrowserCloseBound);
  }

  render(): JSX.Element {
    const { config } = this.props;

    if (!config) {
      return (<div>Loading...</div>);
    }

    return (
      <Router/>
    );
  }

  onBrowserClose(): void {
    this.props.onBrowserClose();
  }
}

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
  config: Config | null
};

type DispatchProps = {
  loadConfig: () => void,
  onBrowserClose: () => void
};

const stateToProps: MapStateToProps<StateProps, OwnProps> =
  (state: AppState, props) => ({
    config: getConfig(state)
  });

const dispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> =
  (dispatch) => ({
    loadConfig: () => dispatch(ConfigAction.loadConfig()),
    onBrowserClose: () => dispatch(BrowserAction.closing())
  });

export default connect(stateToProps, dispatchToProps)(App);
