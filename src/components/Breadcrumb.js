/**
 * Created by Arbella on 2018/3/13.
 */
import React, {Component} from 'react';
import {Breadcrumb} from 'antd';
import menuDatas from '../resources/MenuData.json'

import {breadcrumbNameMap} from '../../src/routes'

var menuData = menuDatas.data.menuList;

const BreadcrumbView = (url) => {
    // const menuData = getMenuData(url);
    //  console.log(url)
    const pathSnippets = url.data.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

        return (
            <Breadcrumb.Item key={url}>
                <text >
                    {breadcrumbNameMap[url]}
                </text>
            </Breadcrumb.Item>
        );
    });
    return (
        <Breadcrumb style={{padding: '20px'}}>
            {extraBreadcrumbItems}
        </Breadcrumb>
    )
}
//
const len = []
const getMenuData = (url) => {
    //
}

export default BreadcrumbView