/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import WithdrwaInfoSearch from '../../components/SearchView/WithdrwaInfoSearch.js'
import {coindrawList, getDickey, getCodeType, coinDrawNo, coinDrawYes} from '../../requests/http-req.js'
import ConfigNet, {StatusMap, CoinDrawStatus} from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import Number from '../../utils/Number.js'

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


export default class WithdrawMoneyInfo extends Component {
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

    columns = [
        {
            width: 50,
            title: '序号',
            fixed: 'left',
            dataIndex: 'index',
        }
        ,
        {
            title: '提现单号',
            dataIndex: 'drawId',
            key: 'drawId',
    
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
            width: 70,
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
            title: '提现类型',
            dataIndex: 'drawType',
            key: 'drawType',
            render: (text, record) => {
                return <div>{getCoinDrawStatus(text)}</div>
            }
        }
        ,
    
        {
            title: '提现状态',
            dataIndex: 'coinDrawStatus',
            key: 'coinDrawStatus',
            render: (text, record) => {
                return <div>{getDrawType(text)}</div>
            }
        }
        ,
        {
            title: '金额',
            dataIndex: 'drawAmount',
            key: 'drawAmount', render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
        }
        ,
        {
            title: '手续费',
            dataIndex: 'poundageAmount',
            key: 'poundageAmount', render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
        },
    
        {
            title: '申请时间',
            dataIndex: 'drawTime',
            key: 'drawTime',
            // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
        }
        ,
    
        {
            title: '提现地址',
            dataIndex: 'drawAdd',
            key: 'drawAdd',
            // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
        },
        {
            title: 'tag',
            dataIndex: 'tag',
            key: 'tag',
            width: 150
        },
    
        {
            title: '操作',
            fixed: 'right',
            render: (record) => (
                record.coinDrawStatus == 10030020 || record.coinDrawStatus == 10030030 ?
                <div>
                    <Link to={{ pathname: '/index/MoneyManagement/ReviewPage', state: { data: record, selectStep: 1 } }}>查看</Link>
                    <a style={{marginLeft: 10, marginRight: 10}} onClick={this._coindrawNo.bind(this, record)}>驳回</a>
                    <a onClick={this._coindrawYes.bind(this, record)}>出币成功</a>
                </div>
                :
                <Link to={{ pathname: '/index/MoneyManagement/ReviewPage', state: { data: record, selectStep: 1 } }}>查看</Link>
            )
        }
    ];

    componentDidMount() {

        this.getData()
    }

    _coindrawNo(r) {
        coinDrawNo(r).then(res => {
            if(res.data.status == 200) {
                message.success('驳回成功')
                this.getData();
            }
        }).catch(err => {
            message.error(err.data.message)
        })
    }
    _coindrawYes(r) {
        coinDrawYes(r).then(res => {
            if(res.data.status == 200) {
                message.success('出币成功')
                this.getData();
            }
        }).catch(err => {
            message.error(err.data.message)
        })
    }

    handleSearch = (values, id) => {//.slice(1, 11)
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
            drawId: values.drawId,
            userId: id,
            coinCode: values.coinCode,
            drawType: values.drawType,
            beginTime: beginTime,
            endTime: endTime,
            coinDrawStatus: values.coinDrawStatus
        }
        this.searchData = tem

        this.state.pageNo = 0
        this.getData(tem)

    }

    getData() {
        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            drawId: this.searchData && this.searchData.drawId || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            drawType: this.searchData && this.searchData.drawType || null,
            coinDrawStatus: this.searchData && this.searchData.coinDrawStatus || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})
        coindrawList(temArr).then((req) => {
            let tem = []
            if (req.status == 200) {
                req.data.data.list.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    listData: req.data.data.list,
                    total: req.data.data.total
                })
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
                    <TableView columns={this.columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               minWidth={1700}
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
                <WithdrwaInfoSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}



const getDrawType = (text) => {
    let tem = ''
    StatusMap.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}
const getCoinDrawStatus = (text) => {
    let tem = '00'
    CoinDrawStatus.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}
