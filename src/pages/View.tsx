import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux'

import { AppState } from '../store/state';

import MkdViewer from '../Mkd/Viewer';

class ViewPage extends React.Component<Props, State> {

  state: State = {
    text: ''
  };

  render() {
    const { text } = this.state;

    return (
      <div className="edit-page">
        <MkdViewer text={text}/>
      </div>
    );
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
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPage);
