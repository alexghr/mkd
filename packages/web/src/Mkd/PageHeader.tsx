import * as React from 'react';
import { Link } from 'react-router-dom';

import './PageHeader.css';

const PageHeader = (props: React.Props<void>): JSX.Element => {
  return (
    <header className="mkd-page-header">
      <Link to="/" className="mkd-page-title">
        mkd
      </Link>

      <div className="mkd-page-header-content">
        {props.children}
      </div>
    </header>
  );
};

export  default PageHeader;
