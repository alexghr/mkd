import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux'

import { AppState, Slug } from '../store/state';
import { DocumentAction } from '../store/action';
import { getText, getSlug } from '../store/selectors';

import MkdEditor from '../Mkd/Editor';
import MkdViewer from '../Mkd/Viewer';

class EditPage extends React.Component<Props, State> {

  onChangeBound = this.onChange.bind(this);

  render() {
    const { text } = this.props;

    return (
      <div className="edit-page">
        <div>
          <MkdEditor text={text} onChange={this.onChangeBound}/>
        </div>
        <div>
          <MkdViewer text={text}/>
        </div>
      </div>
    );
  }

  onChange(text: string): void {
    if (typeof this.props.slug === 'string') {
      this.props.setText(this.props.slug, text);
    } else {
      this.props.newDocument(text);
    }
  }
}

type State = {};

type Props = OwnProps & StateProps & DispatchProps;

type OwnProps = {};

type StateProps = {
  text: string,
  slug: Slug | null
};

type DispatchProps = {
  setText: (slug: string, text: string) => void,
  newDocument: (text: string) => void
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps) => ({
  text: getText(state),
  slug: getSlug(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => ({
  setText: (slug: string, text: string) =>
    dispatch(DocumentAction.updateDocument(slug, text)),

  newDocument: (text: string) => dispatch(DocumentAction.newDocument(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
