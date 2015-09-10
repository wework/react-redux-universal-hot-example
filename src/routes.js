import React from 'react';
import {Route} from 'react-router';
import {
    App,
    Home,
    About,
    NotFound
  } from 'containers';

export default function(store) {
  return (
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
