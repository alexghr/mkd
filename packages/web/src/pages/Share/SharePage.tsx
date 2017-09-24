import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

import { AppState, Slug } from '../../store/state';
import { ClientAction } from '../../store/action';
import { getDocument } from '../../store/selectors';

// import DocumentViewer from '../../Mkd/DocumentViewer';
import Viewer from '../../Mkd/Viewer';
import PageHeader from '../../Mkd/PageHeader';

import './SharePage.css';

class SharePage extends React.Component<Props, State> {

  componentDidMount() {
    this.props.announce();
  }

  render() {
    const { document } = this.props;

    if (!document) {
      return null;
    }

    return (
      <div className="mkd-page">
        <PageHeader>
          <span className="mkd-document-title">{document.title}</span>
        </PageHeader>
        <div className="mkd-page-content">
          <div className="mkd-share-page-document-text">
            <Viewer text={document.text}/>
          </div>
        </div>
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
