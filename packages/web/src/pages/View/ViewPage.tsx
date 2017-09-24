import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

import { AppState, Slug } from '../../store/state';
import { DocumentAction } from '../../store/action';
import { getText } from '../../store/selectors';

import MkdViewer from '../../Mkd/Viewer';

import './ViewPage.css';

class ViewPage extends React.Component<Props, State> {

  componentDidMount() {
    this.props.loadDocument(this.props.slug);
  }

  render() {
    const { text } = this.props;

    return (
      <section className="mkd-view-page">
        {text ? <MkdViewer text={text}/> : 'Unknown document ' + this.props.slug}
      </section>
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
  loadDocument: (slug: Slug) => void
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  text: getText(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
  loadDocument: (slug: Slug) => dispatch(DocumentAction.loadDocument(slug))
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPage);
