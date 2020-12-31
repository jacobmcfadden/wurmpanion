import React from 'react';
import routes from './routing/routes';

import './App.scss';

const App = (props) => {
  return (
    <div className="App">
      {routes}
    </div>
  );
}

export default App;
