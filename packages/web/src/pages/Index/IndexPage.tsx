import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { AppState, Slug, MkdDocument } from '../../store/state';
import { DocumentAction } from '../../store/action';
import { getSlug, getOrderedDocuments } from '../../store/selectors';

import PageHeader from '../../Mkd/PageHeader';

import './IndexPage.css';

class IndexPage extends React.Component<Props, State> {

  state = {
    redirect: false,
    now: new Date()
  };

  timer: number | undefined;

  onNewDocBound = this.onNewDoc.bind(this);

  componentDidMount(): void {
    this.timer = window.setInterval(() => this.setState({ now: new Date() }), 15000);
  }

  componentWillUnmount(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  render(): JSX.Element {
    const { redirect } = this.state;
    const { slug } = this.props;

    if (redirect && slug) {
      return (<Redirect push={true} to={`/edit/${slug}`}/>);
    }

    return (
      <section className="index-page mkd-page">
        <PageHeader>
          <button className="index-page-new-doc-btn" onClick={this.onNewDocBound}>
            New document
          </button>
        </PageHeader>

        <div className="mkd-page-content">
          <div className="index-page-document-list-block">
            {this.renderDocumentList()}
          </div>
        </div>
      </section>
    );
  }

  renderDocumentList(): JSX.Element {
    const { documents } = this.props;

    if (!documents || documents.length === 0) {
      return (
        <span>Nothing</span>
      );
    }

    return (
      <ol className="index-page-document-list">
        { documents.map(d => (
          <li className="index-page-document-list-item" key={d.slug}>
            {this.renderDocumentItem(d)}
          </li>
        ))}
      </ol>
    );
  }

  renderDocumentItem(doc: MkdDocument): JSX.Element {
    return (
      <Link to={`/view/${doc.slug}`} className="index-page-document">
        <div className="index-page-document-title">
          {doc.title}
        </div>
        <div className="index-page-document-updated-date">
          Last changed {this.renderRelativeDate(doc.updatedAt)}
        </div>
      </Link>
    );
  }

  renderRelativeDate(date: Date): string {
    const diffMs = this.state.now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDays = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return 'less than minute ago';
    } else if (diffMin < 60) {
      return `${diffMin} ${pluralize(diffMin, 'minute')} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} ${pluralize(diffHour, 'hour')} ago`;
    } else if (diffDays < 2) {
      return `yesterday`;
    } else {
      return `${diffDays} ${pluralize(diffDays, 'day')} ago`;
    }
  }

  onNewDoc() {
    this.props.newDocument();
    this.setState({ redirect: true });
  }
}

function pluralize(num: number, singular: string, plural?: string): string {
  return num === 1 ? singular : (plural ? plural : `${singular}s`);
}

type State = {
  redirect: boolean,
  now: Date
};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
  slug: Slug | null,
  documents: Array<MkdDocument> | null
};

type DispatchProps = {
  newDocument: () => void,
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  slug: getSlug(state),
  documents: getOrderedDocuments(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
  newDocument: () => dispatch(DocumentAction.newDocument('')),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
