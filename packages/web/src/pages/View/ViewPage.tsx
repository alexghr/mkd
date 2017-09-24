import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AppState, Slug, MkdDocument } from '../../store/state';
import { DocumentAction } from '../../store/action';
import { getDocument } from '../../store/selectors';

import MkdViewer from '../../Mkd/Viewer';
import PageHeader from '../../Mkd/PageHeader';

import './ViewPage.css';

class ViewPage extends React.Component<Props, State> {

  onEditClickBound = this.onEditClick.bind(this);

  state = {
    redirectToEdit: false
  };

  componentDidMount() {
    this.props.loadDocument(this.props.slug);
  }

  render() {
    const { document, slug } = this.props;

    if (this.state.redirectToEdit) {
      return <Redirect to={`/edit/${slug}`}/>
    }

    if (!document) {
      return <span>Unknown</span>
    }

    return (
      <section className="mkd-page">
        <PageHeader>
          <span className="mkd-document-title">{document.title}</span>
          <button className="mkd-view-page-edit-btn" onClick={this.onEditClickBound}>
            Edit
          </button>
        </PageHeader>
        <div className="mkd-page-content">
          <div className="mkd-view-page-document">
            <MkdViewer text={document.text}/>
          </div>
        </div>
      </section>
    );
  }

  onEditClick(): void {
    this.setState({ redirectToEdit: true });
  }
}

type State = {
  redirectToEdit: boolean;
};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {
  slug: Slug
};

type StateProps = {
  document: MkdDocument | null
};

type DispatchProps = {
  loadDocument: (slug: Slug) => void
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  document: getDocument(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
  loadDocument: (slug: Slug) => dispatch(DocumentAction.loadDocument(slug))
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPage);
