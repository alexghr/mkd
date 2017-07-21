import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux'

import { AppState } from '../store/state';
import { ShareAction } from '../store/action';
import { isMaster } from '../store/selectors';

import MkdEditor from '../Mkd/Editor';
import MkdViewer from '../Mkd/Viewer';

class EditPage extends React.Component<Props, State> {

  onChangeBound = this.onChange.bind(this);

  state: State = {
    text: ''
  };

  render() {
    const { text } = this.state;

    return (
      <div className="edit-page">
        <div>
          <MkdEditor text={text} onChange={this.onChangeBound}/>
        </div>
        <div>
          <MkdViewer text={text}/>
        </div>
      </div>
    );
  }

  onChange(text: string): void {
    this.setState({text});
  }
}

type State = {
  text: string
};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
