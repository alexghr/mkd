import * as React from 'react';
import MkdEditor from './Mkd/Editor';
import MkdViewer from './Mkd/Viewer';

import * as hub from './rtc';

import './App.css';

class App extends React.Component<{}, State> {

  onChangeBound = this.onChange.bind(this);
  onShareBound = this.onShare.bind(this);
  state: State = {
    text: '',
    showShareBtn: true,
    watchMode: false
  };

  componentDidMount() {
    if (hub.shouldWatch()) {
      hub.subscribe((text: string) => {
        this.setState({text});
      });
      this.setState({
        watchMode: true
      });
    }
  }

  render() {
    const { watchMode } = this.state;

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
    const { broadcast } = this.state;
    this.setState({text});
    if (broadcast) {
      broadcast(text);
    }
  }

  onShare(): void {
    const broadcast = hub.publish();
    broadcast(this.state.text);
    this.setState({ broadcast });
  }
}

type State = {
  text: string,
  showShareBtn: boolean,
  broadcast?: Function,
  watchMode: boolean
};

export default App;
