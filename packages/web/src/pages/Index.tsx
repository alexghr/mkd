import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AppState, Slug, MkdDocuments } from '../store/state';
import { DocumentAction } from '../store/action';
import { getSlug, getDocuments } from '../store/selectors';

class IndexPage extends React.Component<Props, State> {

  state = {
    redirect: false
  };

  onNewDocBound = this.onNewDoc.bind(this);

  render() {
    const { redirect } = this.state;
    const { slug } = this.props;

    if (redirect && slug) {
      return (<Redirect push={true} to={`/edit/${slug}`}/>);
    }

    return (
      <div className="index-page">
        <button onClick={this.onNewDocBound}>New document</button>
      </div>
    );
  }

  onNewDoc() {
    this.props.newDocument();
    this.setState({ redirect: true });
  }
}

type State = {
  redirect: boolean
};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
  slug: Slug | null,
  documents: MkdDocuments | null
};

type DispatchProps = {
  newDocument: () => void,
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  slug: getSlug(state),
  documents: getDocuments(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
  newDocument: () => dispatch(DocumentAction.newDocument('')),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
