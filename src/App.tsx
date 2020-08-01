import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import './App.scss';

import { Home } from './pages';
import { NavigationHeader } from './navigation-header';
import { allStores } from './stores';
import { Constants } from './App.constants';
import { IPageConfig } from './pages/page.constants';

@observer
class App extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Provider  {...allStores}>
        <div className="App">
          <NavigationHeader/>
          <div className="App-body">
            <Route exact path="/" component={Home} />
            {Constants.pageConfigs.map((page: IPageConfig) => (
              <Route
                key={page.page}
                path={page.path}
                component={page.component}
              />
            ))}
          </div>
        </div>
      </Provider>
    );
  }
}

export default withRouter(App);
