import React from 'react';
import { Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { HomeOutlined, DownCircleOutlined } from '@ant-design/icons';
import { observable, action, runInAction } from 'mobx';
import { Constants } from '../App.constants';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Page, IPageConfig, pageDisplayNames } from '../pages/page.constants';

@observer
class Header extends React.Component<RouteComponentProps> {
  @observable
  private current = '';

  public componentDidMount() {
    const nameWithSlash = window.location.pathname;
    const name = nameWithSlash.slice(1);

    runInAction(() => {
      if (Page[name.toUpperCase() as keyof typeof Page]) {
        this.current = name.toUpperCase();
      } else {
        this.props.history.push('/');
      }
    });
  }

  @action
  private handleClick = ({ key }: MenuInfo) => {
    this.current = key.toString().toUpperCase();
    const page: Page = Page[this.current as keyof typeof Page];

    const route = Constants.pageConfigs
      .map((config: IPageConfig) => config.page)
      .includes(page)
      ? this.current.toLowerCase()
      : '';

    this.props.history.push(`/${route}`);
  };

  public render () {
    const routeOptions = Constants.pageConfigs.map(page => (
      <Menu.Item key={page.page}>{pageDisplayNames[page.page]}</Menu.Item>
    ));

    return (
      <Menu
        style={{textAlign: 'center'}}
        onClick={this.handleClick}
        selectedKeys={[this.current]}
        mode="horizontal"
        theme="dark"
      >
        <Menu.Item key="Home" style={{ float: 'left'}}>
          <HomeOutlined />
        </Menu.Item>
        <Menu.SubMenu
          style={{
            width: '150px'
          }}
          title={
            <div>
              <span style={{float: 'left'}}>
                <DownCircleOutlined />
              </span>
              <span>
                {pageDisplayNames[Page[this.current as keyof typeof Page]]}
              </span>
            </div>
          }
        >
          {routeOptions}
        </Menu.SubMenu>
      </Menu>
    );
  }
}

export const NavigationHeader = withRouter(Header);