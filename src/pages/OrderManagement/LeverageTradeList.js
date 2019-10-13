/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import LeverageTradeListSearch from '../../components/SearchView/LeverageTradeListSearch.js'
import {leverageTradeList} from '../../requests/http-req.js'
import {leverageTradeState} from '../../networking/ConfigNet.js'
import Number from '../../utils/Number.js'

var {MonthPicker, RangePicker} = DatePicker;

const getEntrusStateText = (text) => {
    let tem = ''
    leverageTradeState.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}

export default class LeverageTradeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            data: []
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getData()
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
                    <TableView minWidth={2100} columns={columns} data={this.state.data} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }

    handleSearch = (values, id) => {
        console.log(values)
        this.state.pageNo = 0
        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null
        values.beginTime = beginTime
        values.endTime = endTime
        this.searchData = values
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})

        leverageTradeList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            orderNo: this.searchData && this.searchData.orderNo && this.searchData.orderNo.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coin: this.searchData && this.searchData.coinCode || null,
            position: this.searchData && this.searchData.position || null,
            tradeType: this.searchData && this.searchData.tradeStatus || null,
            startTime: this.searchData && this.searchData.beginTime || null,
            endTime: this.searchData && this.searchData.endTime || null,
        }).then((req) => {
            console.log(req)
            if (req.status == 200) {
                req.data.data.list.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    showLoading: false,
                    total: req.data.data.total,
                    data: req.data.data.list
                }, () => {
                    console.log(this.state.data)
                })
            }
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })

    }


    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                <LeverageTradeListSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}
const columns = [
    {
        width: 70,
        title: '序号',
        fixed: 'left',
        dataIndex: 'index',
    }
    ,
    {
        title: '币对',
        dataIndex: 'tradeCode',
        key: 'tradeCode',
        render: (text, r) => {
            return <div>{text.toUpperCase()}</div>
        }
    },
    {
        title: '开仓单号',
        dataIndex: 'orderNo',
        key: 'orderNo',

    },
    {
        title: '类型',
        dataIndex: 'tradeType',
        render: (text, r) => {
            return <div>{text == 1 ? '限价' : '市价'}</div>
        }
    }
    ,
    {
        title: '方向',
        dataIndex: 'position',
        key: 'position',
        render: (text, r) => {
            return <div>{text == 1 ? '卖出' : '买入'}</div>
        }
    }
    ,
    {
        title: '状态',
        dataIndex: 'status',
        render: (text, r) => {
            return <div>{getEntrusStateText(text)}</div>
        }
    }
    ,
    {
        title: '委托价格',
        dataIndex: 'tradePrice',
        key: 'tradePrice',
    },
    {
        title: '委托量', //
        dataIndex: 'tradeAmount',
        key: 'tradeAmount',
    },
    {
        title: '委托总额', //价格*数量
        key: 'bwithdrawCash',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(r.tradeAmount * r.tradePrice)}</div>
        }
    },
    {
        title: '保证金',
        dataIndex: 'dealAmount',
        key: 'dealAmount',
    },
    {
        title: '止盈',//交易总量-成交量
        dataIndex: 'stopProfit',
        key: 'stopProfit',

    }
    ,
    {
        title: '止损',
        dataIndex: 'stopLoss',
        key: 'stopLoss',
    },
    {
        title: '手续费', //dealAmount * 成交均价
        dataIndex: 'poundageAmount',
        key: 'poundageAmount', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
    }
    ,
    {
        title: '已成交',
        dataIndex: 'dealAmount',
        key: 'dealAmount',
    },
    {
        title: '成交均价',
        dataIndex: 'dealPrice',
        key: 'dealPrice',
    },
    {
        title: '成交总额',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, r) => <div>{(r.dealPrice * r.dealAmount)}</div>
    }
    ,
    {
        title: '委托时间',
        dataIndex: 'createTime',
        key: 'createTime',
    }
];
