import * as React from 'react';
import * as marked from 'marked';

const Viewer = (props: Props) => {
  const { text } = props;
  const html = marked(text);

  return (
    <article
      className="mkd-viewer-content"
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
};

type Props = {
  text: string
};

export default Viewer;
