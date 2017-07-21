import * as React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import EditPage from './pages/Edit'

export default () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={EditPage}/>
      </div>
    </Router>
  )
}
