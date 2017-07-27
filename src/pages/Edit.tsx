import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

import { AppState, Slug, Document } from '../store/state';
import { DocumentAction } from '../store/action';
import {  getDocument } from '../store/selectors';

import MkdEditor from '../Mkd/Editor';
import MkdViewer from '../Mkd/Viewer';

class EditPage extends React.Component<Props, State> {

  onChangeBound = this.onChange.bind(this);
  onShareBound = this.onShare.bind(this);

  componentDidMount() {
    this.props.loadDocument();
  }

  render() {
    const { document, slug } = this.props;
    const text = document ? document.text : '';
    const shared = document ? document.shared : false;

    return (
      <div className="edit-page">
        <h1>{slug}</h1>
        {shared ? null : <button onClick={this.onShareBound}>Share</button>}
        <div>
          <MkdEditor text={text} onChange={this.onChangeBound}/>
        </div>
        <div>
          <MkdViewer text={text}/>
        </div>
      </div>
    );
  }

  onShare() {
    this.props.share();
  }

  onChange(text: string): void {
    this.props.setText(text);
  }
}

type State = {};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {
  slug: Slug
};

type StateProps = {
  document: Document | null
};

type DispatchProps = {
  loadDocument: () => void,
  setText: (text: string) => void,
  share: () => void,
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  document: getDocument(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch, props) => ({
  loadDocument: () => props ? dispatch(DocumentAction.loadDocument(props.slug)) : null,

  setText: (text: string) => props
    ? dispatch(DocumentAction.updateDocument(props.slug, text))
    : null,

  share: () => props ? dispatch(DocumentAction.shareDocument(props.slug)) : null,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
