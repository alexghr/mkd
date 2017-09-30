import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

import { AppState, Slug } from '../../store/state';
import { ClientAction } from '../../store/action';
import { getDocument, getConnectionStatus } from '../../store/selectors';

import Viewer from '../../Mkd/Viewer';
import PageHeader from '../../Mkd/PageHeader';

import './SharePage.css';

class SharePage extends React.Component<Props, State> {

  componentDidMount() {
    this.props.announce();
  }

  render() {
    return (
      <div className="mkd-page">
        <PageHeader>
          <span className="mkd-document-title">{document.title}</span>
        </PageHeader>
        <div className="mkd-page-content">
          <div className="mkd-share-page-document-text">
            {this.renderDocument()}
          </div>
        </div>
      </div>
    );
  }

  renderDocument(): JSX.Element | null {
    const { document, connectionStatus } = this.props;
    if (connectionStatus === 'open' && document) {
      return <Viewer text={document.text}/>
    } else if (connectionStatus === 'connecting') {
      return <div>Connecting...</div>;
    } else if (connectionStatus === 'error') {
      return <div>Couldn't connect to remote peer</div>
    } else {
      return null;
    }
  }
}

type State = {};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {
  slug: Slug
};

type StateProps = {
  document: AppState['document'],
  connectionStatus: AppState['connectionStatus']
};

type DispatchProps = {
  announce: () => void
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  document: getDocument(state),
  connectionStatus: getConnectionStatus(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch, props) => ({
  announce: () => props ? dispatch(ClientAction.initServerConnection(props.slug)) : null,
});

export default connect(mapStateToProps, mapDispatchToProps)(SharePage);
