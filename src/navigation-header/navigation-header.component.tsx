import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, DownCircleOutlined } from '@ant-design/icons';
import { observable, action } from 'mobx';
import { ClickParam } from 'antd/lib/menu';
import { Constants, IPageConfig, Page, pageDisplayNames } from '../App.constants';
import { RouteComponentProps, withRouter } from 'react-router-dom';

class Header extends React.Component<RouteComponentProps> {
  @observable
  private current = '';

  @action
  private handleClick = (param: ClickParam) => {
    this.current = param.key;
    const page: Page = Page[this.current as keyof typeof Page];

    const route = Constants.pageConfigs
      .map((config: IPageConfig) => config.page)
      .includes(page)
      ? this.current
      : '';

    this.props.history.push(`/${route.toLowerCase()}`);
  };

  private capitalise = (str: string) => {
    if (!str || !str.length) return '';

    return str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase();
  }

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