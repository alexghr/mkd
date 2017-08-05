import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AppState, Slug } from '../store/state';
import { DocumentAction } from '../store/action';
import { getSlug } from '../store/selectors';

class IndexPage extends React.Component<Props, State> {

  onNewDocBound = this.onNewDoc.bind(this);

  render() {
    const { slug } = this.props;

    if (slug) {
      return (<Redirect to={`/edit/${slug}`}/>);
    }

    return (
      <div className="index-page">
        <button onClick={this.onNewDocBound}>New document</button>
      </div>
    );
  }

  onNewDoc() {
    this.props.newDocument();
  }
}

type State = {};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
  slug: Slug | null
};

type DispatchProps = {
  newDocument: () => void,
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  slug: getSlug(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
  newDocument: () => dispatch(DocumentAction.newDocument('')),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
