/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import CoinMoneyInfoSearch from '../../components/SearchView/CoinMoneyInfoSearch.js'
import {tradeDetailList, getDickey, drawDetail} from '../../requests/http-req.js'
import ConfigNet, {HandleTypeB} from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import Number from '../../utils/Number.js'
var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


const data = null

export default class CoinMoneyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
        }
    }

    componentDidMount() {
        //提现类型接口
        getDickey(ConfigNet.MONEY_TYPE).then((req) => {
            if (req.status == 200) {
                this.setState({
                    statusMap: req.data.data
                })
            }
        })
    }

    handleSearch = (values, id) => {//.slice(1, 11)
        if(!id) {
            message.warning('请选择要查询的用户')
            return false
        }
        this.state.pageNo = 0
        // console.log(moment.format(values.date[0]))
        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null
        if (beginTime) {
            beginTime = beginTime + ' 00:00:00'
        }
        if (endTime) {
            endTime = endTime + ' 23:59:059'
        }
        let tem = {
            tradeId: values.tradeId && values.tradeId.trim(),
            userId: id,
            coinCode: values.coinCode,
            handleType: values.handleType,
            beginTime: beginTime,
            endTime: endTime,
        }
        this.searchData = tem
        this.getData(tem)
    }
    searchData = null

    getData() {
        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            tradeId: this.searchData && this.searchData.tradeId && this.searchData.tradeId.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            handleType: this.searchData && this.searchData.handleType || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})
        tradeDetailList(temArr).then((req) => {
            if (req.status == 200) {
                let listData = []
                let temArr = req.data.data.list
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                } else {
                    temArr.forEach((item, index) => {

                        item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                        listData.push(item)
                    })
                }
                this.setState({
                    listData: listData,
                    total: req.data.data.total || 0
                })
            } else {
                message.info('网络异常')
            }
            this.setState({showLoading: false})
        })
    }


    onChangePagintion = (e) => {
        this.setState({pageNo: e}, () => {
            this.getData()
        })

    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               minWidth={1450}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }
    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }


    render() {
        return (
            <div className='center-user-list'>
                {this.renderBreadcrumb()}
                <CoinMoneyInfoSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}
const columns = [
    {
        width: 50,
        title: '序号',
        fixed: 'left',
        dataIndex: 'index',
    }
    ,
    {
        title: '单号',
        dataIndex: 'tradeId',
        key: 'tradeId',
        // sorter: (a, b) => a.mobie - b.mobie,
        sortOrder: null,
    }
    ,
    {
        title: '流水号',
        dataIndex: 'id',
        key: 'mobile',
    }
    ,
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
    }
    ,
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    }
    ,
    {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
    }
    ,
    {
        title: '币种',
        dataIndex: 'coinCode',
        key: 'coinCode',
    },
    {
        title: '资金类型',
        dataIndex: 'handleType',
        render: (text, r) => <div>{getHandleType(text)}</div>
    }
    ,

    {
        title: '金额',
        dataIndex: 'amount',
        key: 'money',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>

    }
    ,
    {
        title: '当前可用余额',
        dataIndex: 'aftAmount',
        key: 'aftAmount',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
    ,
    {
        title: '当前冻结金额',
        dataIndex: 'frozenAmount',
        key: 'tradePrice', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
    },
    {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },

    {
        title: '总资产',
        dataIndex: 'totalAsset',
        key: 'createTime',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
];
const getHandleType = (text) => {
    let tem = ''
    HandleTypeB.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}
