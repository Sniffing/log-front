import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import './App.less';

import { Home } from './pages';
import { allStores } from './stores';
import { Layout } from 'antd';

const { Header, Content } = Layout;

@observer
class App extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Provider  {...allStores}>
        <Layout className="App">
          <Header>Header here</Header>
          <Layout>
            <Content>
              <Route exact path="/" component={Home} />
              {/* {Constants.pageConfigs.map((page: IPageConfig) => (
                <Route
                  key={page.page}
                  path={page.path}
                  component={page.component}
                />
              ))} */}
            </Content>
          </Layout>
        </Layout>
      </Provider>
    );
  }
}

export default withRouter(App);
