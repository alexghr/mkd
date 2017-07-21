import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux'

import { AppState } from './store/state';
import { ShareAction } from './store/action';
import { isMaster } from './store/selectors';

import MkdEditor from './Mkd/Editor';
import MkdViewer from './Mkd/Viewer';

import './App.css';

class App extends React.Component<Props, State> {

  onChangeBound = this.onChange.bind(this);
  onShareBound = this.onShare.bind(this);

  state: State = {
    text: '',
    showShareBtn: true
  };

  componentDidMount() {
    this.props.watch();
  }

  render() {
    const watchMode = this.props.isMaster === false;

    return (
      <div className="App">
        { watchMode ? this.renderWatchMode() : this.renderWriteMode() }
      </div>
    );
  }

  renderWriteMode(): JSX.Element {
    const { text, showShareBtn } = this.state;

    return (
      <div>
        { showShareBtn ? (
          <div>
            <button onClick={this.onShareBound}>share</button>
          </div>
        ) : null}
        <div>
          <MkdEditor text={text} onChange={this.onChangeBound}/>
        </div>
        <div>
          <MkdViewer text={text}/>
        </div>
      </div>
    );
  }
  renderWatchMode(): JSX.Element {
    return (
      <div>
        <button onClick={() => window.location.href='/'}>go back</button>
        <MkdViewer text={this.state.text}/>
      </div>
    );
  }

  onChange(text: string): void {
    this.setState({text});
  }

  onShare(): void {
    this.props.share();
  }
}

type State = {
  text: string,
  showShareBtn: boolean,
  broadcast?: Function
};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
  isMaster: boolean
};

type DispatchProps = {
  share: () => void,
  watch: () => void
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  isMaster: isMaster(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
  share: () => dispatch(ShareAction.share()),
  watch: () => dispatch(ShareAction.watch())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
