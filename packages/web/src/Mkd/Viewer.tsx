import * as React from 'react';
import { parse } from 'marked';

const Viewer = (props: Props) => {
  const { text } = props;
  const html = parse(text);

  return (
    <article
      className="mkd-viewer-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

type Props = {
  text: string
};

export default Viewer;
