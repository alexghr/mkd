import * as React from 'react';

import Viewer from './Viewer';
import { Document } from '../store/state';

import './DocumentViewer.css';

export default class DocumentViewer extends React.Component<Props, State> {

  render(): JSX.Element {
    const { text, title } = this.props.document;

    return (
      <section className="mkd-document-viewer">
        <h1 className="mkd-document-viewer-title">{title}</h1>
        <Viewer text={text}/>
      </section>
    );
  }
}

type Props = {
  document: Document
};

type State = {};
