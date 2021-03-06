import * as React from 'react';

import './Editor.css';

export default class Editor extends React.Component<Props, State> {
  onChangeBound = this.onChange.bind(this);

  render(): JSX.Element {
    return (
      <textarea className="mkd-editor" value={this.props.text} onChange={this.onChangeBound}/>
    );
  }

  onChange(evt: React.FormEvent<HTMLTextAreaElement>) {
    const text = evt.currentTarget.value;

    if (this.props.onChange) {
      this.props.onChange(text);
    }
  }
}

type Props = {
  onChange?: (text: string) => void,
  text: string
};

type State = {};
