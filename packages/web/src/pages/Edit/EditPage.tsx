import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

import { AppState, Slug, MkdDocument } from '../../store/state';
import { DocumentAction } from '../../store/action';
import {  getDocument } from '../../store/selectors';

import MkdEditor from '../../Mkd/Editor';
import MkdViewer from '../../Mkd/Viewer';
import PageHeader from '../../Mkd/PageHeader';

import './EditPage.css';

class EditPage extends React.Component<Props, State> {

  onChangeBound = this.onChange.bind(this);
  onShareBound = this.onShare.bind(this);
  onShareLinkClickBound = this.onShareLinkClick.bind(this);
  onTitleChangeBound = this.onTitleChange.bind(this);

  componentDidMount(): void {
    this.props.loadDocument();
  }

  render(): JSX.Element {
    const { document } = this.props;
    const text = document ? document.text : '';
    const title = document && document.title ? document.title : 'Untitled';

    return (
      <section className="mkd-edit-page">
        <PageHeader>
          <div className="mkd-edit-page-header">
            <div className="mkd-edit-page-title-container">
              <span className="mkd-edit-page-title-dummy">{title}</span>
              <input className="mkd-edit-page-title" onChange={this.onTitleChangeBound} value={title}/>
            </div>
            {this.renderShare(document)}
          </div>
        </PageHeader>
        <div className="mkd-edit-page-content">
          <div className="mkd-edit-page-editor">
            <MkdEditor text={text} onChange={this.onChangeBound}/>
          </div>
          <div className="mkd-edit-page-separator"/>
          <div className="mkd-edit-page-renderer">
            <MkdViewer text={text}/>
          </div>
        </div>
      </section>
    );
  }

  renderShare(document: MkdDocument | null): JSX.Element | null {
    if (!document) {
      return null;
    }

    const { shared, slug } = document;

    return (
      <div className="mkd-edit-page-share-container">
        {shared
          ? <span className="mkd-edit-page-share-msg">
              Share link
                <span className="mkd-edit-page-share-link" onClick={this.onShareLinkClickBound}>
                  {shareLink(slug)}
                </span>
            </span>
          : <button className="mkd-edit-page-share-btn" onClick={this.onShareBound}>
              Share
            </button>
        }
      </div>
    );
  }

  onShare(): void {
    this.props.share();
  }

  onChange(text: string): void {
    this.props.setText(text);
  }

  onShareLinkClick(evt: React.MouseEvent<HTMLSpanElement>): void {
    getSelection().selectAllChildren(evt.currentTarget);
  }

  onTitleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
    this.props.setTitle(evt.currentTarget.value);
  }
}

function shareLink(slug: Slug): string {
  return window.location.origin + '/share/' + slug;
}

type State = {};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {
  slug: Slug
};

type StateProps = {
  document: MkdDocument | null
};

type DispatchProps = {
  loadDocument: () => void,
  setText: (text: string) => void,
  setTitle: (title: string | null) => void,
  share: () => void,
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  document: getDocument(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch, props) => ({
  loadDocument: () => props ? dispatch(DocumentAction.loadDocument(props.slug)) : null,

  setText: (text: string) => props
    ? dispatch(DocumentAction.updateDocument(props.slug, { text }))
    : null,

  setTitle: (title: string) => props
    ? dispatch(DocumentAction.updateDocument(props.slug, { title }))
    : null,

  share: () => props ? dispatch(DocumentAction.shareDocument(props.slug)) : null,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
