/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message, Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import LeverageTradeListSearch from '../../components/SearchView/LeverageTradeListSearch.js'
import {leverageHoldList, leverageEveningUp} from '../../requests/http-req.js'
import {leverageTradeState} from '../../networking/ConfigNet.js'

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

export default class LeveragePosition extends Component {
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
    //平仓
    eveningUp = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个目标')
        }
        //判断选择
        leverageEveningUp({orderNo: this.state.data[this.selectedRowKeys[0]].orderNo}).then(res => {
            if (res.status == 200) {

            }
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })
    }
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={this.eveningUp} style={{marginRight: '5px', marginLeft: '5px'}}>平仓</Button>
                    <Button onClick={this.onKickDown} style={{marginRight: '5px', marginLeft: '5px'}}>全部平仓</Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView minWidth={2100} columns={columns} data={this.state.data} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onSelectedRowKeys={this.onSelectedRowKeys}
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
        values.userId = id
        this.searchData = values
        console.log(values)
        //  this.getData()
    }

    getData() {
        this.setState({showLoading: true})

        leverageHoldList({
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
        title: '开仓均价',
        dataIndex: 'tradePrice',
        key: 'tradePrice',
    },
    {
        title: '开仓数量', //
        dataIndex: 'tradeAmount',
        key: 'tradeAmount',
    },
    {
        title: '开仓均价',
        key: 'bwithdrawCash',
        render: (text, r) => {
            return <div>{r.tradeAmount * r.tradePrice}</div>
        }
    },
    {
        title: '开仓数量',
        key: 'bwithdrawCash',
        render: (text, r) => {
            return <div>{r.tradeAmount * r.tradePrice}</div>
        }
    },
    {
        title: '开仓总额',
        key: 'bwithdrawCash',
        render: (text, r) => {
            return <div>{r.tradeAmount * r.tradePrice}</div>
        }
    },
    {
        title: '保证金',
        dataIndex: 'dealAmount',
        key: 'dealAmount',
    },
    {
        title: '手续费',
        dataIndex: 'poundageAmount',
        key: 'poundageAmount',  render: (text, r) => {
        return <div>{scientificToNumber(text)}</div>
    }
    },
    {
        title: '浮动盈亏',
        dataIndex: 'stopProfit',
        key: 'stopProfit',
    }
    ,
    {
        title: '平仓时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },

    {
        title: '操作',
        fixed: 'right',
        key: 'createTime',
        render: (text, r) => <div>详情</div>

    },

];

function scientificToNumber(num) {
    var str = num.toString();
    var reg = /^(\d+)(e)([\-]?\d+)$/;
    var arr, len,
        zero = '';

    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
        return num;
    } else {
        /*6e-7 需要手动转换*/
        arr = reg.exec(str);
        len = Math.abs(arr[3]) - 1;
        for (var i = 0; i < len; i++) {
            zero += '0';
        }
        return '0.' + zero + arr[1];
    }
}