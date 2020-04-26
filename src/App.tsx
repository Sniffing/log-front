import React from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { Provider, observer } from "mobx-react";
import "./App.css";

import rootStore from "./stores/rootStore";
import { Home } from "./pages";
import { IPageConfig, Constants } from "./App.constants";
import { NavigationHeader } from './navigation-header';

@observer
class App extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Provider rootStore={rootStore}>
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
