import * as React from 'react'

import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom'

import EditPage from './pages/Edit';
import ViewPage from './pages/View';

export default () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={EditPage}/>
        <Route path="/:slug" render={renderViewPage}/>
      </div>
    </Router>
  )
}

const renderViewPage = (params: RouteComponentProps<{slug: string}>): JSX.Element => {
  return (<ViewPage slug={params.match.params.slug}/>);
}
