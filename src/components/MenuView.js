/**
 * Created by Arbella on 2018/3/13.
 */
import React, {Component} from 'react';
import 'antd/dist/antd.css';
import menuDatas from '../resources/MenuData.json'
import {Layout, Menu, Breadcrumb, Icon, Image} from 'antd';
import icon from '../resources/imgs/coin_icon.png'

const pathSubmen = ['user', 'CoinManagement', 'PoundageManagement', 'MoneyManagement', 'MiningManagement', 'OrderManagement', 'ContentManagement', 'AdminManagement', 'LogMangement', 'SystemManagement']

const SubMenu = Menu.SubMenu;
var menuData = menuDatas.data.menuList;
export default class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            openKeys: [],
            showMenuData: []
        }
    }

    componentWillMount() {
        this.state.showMenuData = JSON.parse(window.localStorage.getItem('user')).menuData || []
        this.setCurrent()
    }

    setCurrent = () => {
        let path = window.location.pathname
        pathSubmen.forEach((item, index) => {
            if (path.indexOf(item) != -1) {
                console.log(this.rootSubmenuKeys[index])
                this.setState({
                    openKeys: [this.rootSubmenuKeys[index]]
                })
            }
        })
        console.log(this.state.showMenuData)
    }
    len = 66;
    rootSubmenuKeys = ['用户管理', '币种管理', '手续费管理', '资金管理', '挖矿分红管理', '订单管理', '内容管理', '管理员管理', '日志管理', '系统管理'];
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    onItemClick = (data) => {
        //onItemClick
        this.props.onItemClick(data)
    }

    renderSubMenu(data) {
        return (
            <SubMenu key={data.key}
                     title={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                         {/*<image src={icon}*/}
                         {/*style={{height: '16px', width: '16px'}}/>*/}
                         <span>{data.title}</span></div>}>
                {data.data.map((item) => {
                        return item.data ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    }
                )}
            </SubMenu>
        )
    }

    renderMenuItem(data) {
        this.len = this.len + 1

        // if (true) {
        if (this.checkMenu(data.path)) {

            return (<Menu.Item key={data.key ? data.key : this.len}>{data.title}</Menu.Item>)
        } else {
            return
        }
    }

    checkMenu = (text) => {
        if (this.state.showMenuData.length == 0) {
            return false
        }
        if (this.state.showMenuData.indexOf(text) != -1) {
            return true
        } else {
            // console.log('null ', text)

            return false
        }

    }


    render() {
        console.log('render', this.state.openKeys)
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.onItemClick}
                theme='dark'
                // inlineCollapsed={this.state.collapsed}
            >
                {menuData.map((item, index) => {
                    return item.data ? this.renderSubMenu(item) : this.renderMenuItem(item, index)
                })}
            </Menu>
        )
    }
}

