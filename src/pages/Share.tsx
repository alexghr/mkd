import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

import { AppState, Slug } from '../store/state';
import { ClientAction } from '../store/action';
import { getText } from '../store/selectors';

import MkdViewer from '../Mkd/Viewer';

class SharePage extends React.Component<Props, State> {

  componentDidMount() {
    this.props.announce();
  }

  render() {
    const { text } = this.props;

    return (
      <div className="share-page">
        {text ? <MkdViewer text={text}/> : 'Unknown document ' + this.props.slug}
      </div>
    );
  }
}

type State = {};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {
  slug: Slug
};

type StateProps = {
  text: string
};

type DispatchProps = {
  announce: () => void
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  text: getText(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch, props) => ({
  announce: () => props ? dispatch(ClientAction.initServerConnection(props.slug)) : null,
});

export default connect(mapStateToProps, mapDispatchToProps)(SharePage);
