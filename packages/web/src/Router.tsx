import * as React from 'react';

import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';

import IndexPage from './pages/Index';
import EditPage from './pages/Edit';
import ViewPage from './pages/View';
import SharePage from './pages/Share';

import { Slug } from './store/state';

const renderPage = (
  component: React.ComponentClass<SlugParam>,
  params: RouteComponentProps<SlugParam>
): JSX.Element => React.createElement(component, {
  slug: params.match.params.slug
});

const renderEditPage = renderPage.bind(null, EditPage);
const renderViewPage = renderPage.bind(null, ViewPage);
const renderSharePage = renderPage.bind(null, SharePage);

type SlugParam = {
  slug: Slug
};

export default () => {
  return (
    <Router>
      <div>
        <Route exact={true} path="/" component={IndexPage} />
        <Route path="/edit/:slug" component={renderEditPage} />
        <Route path="/view/:slug" render={renderViewPage} />
        <Route path="/share/:slug" render={renderSharePage} />
      </div>
    </Router>
  );
};