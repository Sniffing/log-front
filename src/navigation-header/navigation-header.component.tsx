import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, DownCircleOutlined } from '@ant-design/icons';
import { observable, action } from 'mobx';
import { ClickParam } from 'antd/lib/menu';
import { Constants, IPageConfig, Page } from '../App.constants';
import { RouteComponentProps, withRouter } from 'react-router-dom';

class Header extends React.Component<RouteComponentProps> {
  @observable
  private current = 'home';

  @action
  private handleClick = (param: ClickParam) => {
    this.current = param.key === 'homeIcon' ? Page.HOME : param.key;
        
    const route = Constants.pageConfigs
      .map((config: IPageConfig) => config.page)
      .includes(this.current)
      ? this.current.toLowerCase()
      : '';
    
    this.props.history.push(`/${route}`);
  };

  private capitalise = (str: string) => {
    if (!str || !str.length) return '';

    return str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase();
  }

  public render () {
    const routeOptions = Constants.pageConfigs.map(page => (
      <Menu.Item key={page.page}>{this.capitalise(page.page)}</Menu.Item>
    ));

    return (
      <Menu
        style={{textAlign: 'center'}}
        onClick={this.handleClick}
        selectedKeys={[this.current]}
        mode="horizontal"
        theme="dark"
      >
        <Menu.Item key="homeIcon" style={{ float: 'left'}}>
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
                {this.capitalise(this.current)}
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