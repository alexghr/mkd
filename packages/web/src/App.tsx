import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';

import { AppState, Config } from './store/state';
import { getConfig } from './store/selectors';
import { AppAction } from './store/action';

import Router from './Router';
import './App.css';

class App extends React.Component<Props, object> {

  onBrowserCloseBound = this.onBrowserClose.bind(this);

  componentDidMount(): void {
    this.props.init();
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
    this.props.close();
  }
}

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
  config: Config | null
};

type DispatchProps = {
  init: () => void,
  close: () => void
};

const stateToProps: MapStateToProps<StateProps, OwnProps> =
  (state: AppState, props) => ({
    config: getConfig(state)
  });

const dispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> =
  (dispatch) => ({
    init: () => dispatch(AppAction.init()),
    close: () => dispatch(AppAction.close())
  });

export default connect(stateToProps, dispatchToProps)(App);
