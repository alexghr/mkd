import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

import { AppState, Slug } from '../../store/state';
import { ClientAction } from '../../store/action';
import { getDocument } from '../../store/selectors';

import DocumentViewer from '../../Mkd/DocumentViewer';

import './SharePage.css';

class SharePage extends React.Component<Props, State> {

  componentDidMount() {
    this.props.announce();
  }

  render() {
    const { document } = this.props;

    return (
      <div className="mkd-share-page">
        {document ? <DocumentViewer document={document}/> : 'Unknown document ' + this.props.slug}
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
  document: AppState['document']
};

type DispatchProps = {
  announce: () => void
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  document: getDocument(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch, props) => ({
  announce: () => props ? dispatch(ClientAction.initServerConnection(props.slug)) : null,
});

export default connect(mapStateToProps, mapDispatchToProps)(SharePage);
