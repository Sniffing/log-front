import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import './App.scss';

import { Home } from './pages';
import { allStores } from './stores';
import { Constants } from './App.constants';
import { IPageConfig } from './pages/page.constants';
import { Layout } from 'antd';
import { CalorieList } from './calorie-list';

import './tailwind.output.css';

const { Sider, Content } = Layout;

@observer
class App extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Provider  {...allStores}>
        <Layout className="App">
          <Sider className="sideBar">
            <CalorieList/>
          </Sider>
          <Layout>
            <Content>
              <Route exact path="/" component={Home} />
              {Constants.pageConfigs.map((page: IPageConfig) => (
                <Route
                  key={page.page}
                  path={page.path}
                  component={page.component}
                />
              ))}
            </Content>
          </Layout>
        </Layout>
      </Provider>
    );
  }
}

export default withRouter(App);
