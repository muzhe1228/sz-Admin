import React, {Component} from 'react';
import {Spin, Button, Modal, message, Table} from 'antd';
// import './UserList/user-list.css';
import TableView from '../../components/TableView'
import {
    hisPoundageTotalList,
    hisPoundageDetailsList
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
import NewHistoryPoundageSearch from '../../components/SearchView/HistoryPoundageSearch.js'
export default class PoundageToday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showModal: false,
            isLoading: false,
            total: 0,
            pageNo: 1,
            showModal: false,
            Mlist: [],
        }
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '60px',
            key: 'index',
        }
        ,
        {
            title: '日期',
            dataIndex: 'tradeDate',
            width: '200px',
            key: 'tradeDate',
        }
        ,
        {
            title: '手续费折合( BTC )',
            dataIndex: 'poundageAmountBtc',
            key: 'poundageAmountBtc',
        }
        ,
        {
            title: '手续费折合( ETH )',
            dataIndex: 'poundageAmountEth',
            key: 'poundageAmountEth',
        }
        ,
        {
            title: '手续费折合( USDT )',
            dataIndex: 'poundageAmountUsdt',
            key: 'poundageAmountUsdt',
        }
        ,
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
    
            width: 70,
            render: (text, record) => (
                <a onClick={() => this._Detail(record)}>详细</a>
            )
        }
    ];
    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '60px',
            key: 'index',
        }
        ,
        {
            title: '时段',
            dataIndex: 'tradeHour',
            width: '200px',
            key: 'tradeHour',
        }
        ,
        {
            title: '手续费折合( BTC )',
            dataIndex: 'poundageAmountBtc',
            key: 'poundageAmountBtc',
        }
        ,
        {
            title: '手续费折合( ETH )',
            dataIndex: 'poundageAmountEth',
            key: 'poundageAmountEth',
        }
        ,
        {
            title: '手续费折合( USDT )',
            dataIndex: 'poundageAmountUsdt',
            key: 'poundageAmountUsdt',
        }
    ];

    componentWillMount() {
        this.setState({isLoading: true})
    }

    componentDidMount() {
        this.getData({pageNo: 0, pageSize: 10})
    }

    onChangePagintion = (e) => {
        this.state.pageNo = e
        this.getData({pageNo: e, pageSize: 10})
    }
    
    todayPoudageList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                <Spin spinning={this.state.isLoading}>
                    <TableView onChangePagintion={this.onChangePagintion} hiddenSelection
                               columns={this.columns} data={this.state.listData} pageNo={this.state.pageNo}
                               minWidth={800}
                               total={this.state.total}/>
                </Spin>
            </div>
        )
    }
    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }
   
    handleSearch = (e, id) => {
        this.state.pageNo = 1
        //拼装请求格式
        this.searchData = e
        this.getData()
    }

    getData = () => {
        let data = this.searchData || []
        this.setState({isLoading: true})

        let startTime = data.date && data.date[0] ? JSON.stringify(data.date[0]).slice(1, 11) : null
        let endTime = data.date && data.date[1] ? JSON.stringify(data.date[1]).slice(1, 11) : null

        hisPoundageTotalList({
            pageNo: this.state.pageNo,
            pageSize: 10,
            startDate: startTime,
            endDate: endTime
        }).then((res) => {
            let listData = []
            let total = 0
            if (res.status == 200) {
                let temArr = res.data.data.list
                total = res.data.data.total
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    //TODO 是否登录 提现
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1

                    listData.push(item)
                })
            }

            //添加key 没有计算
            this.setState({
                listData: listData,
                isLoading: false,
                total: total
            })
        })
    }

    onCancel() {
        this.setState({
            showModal: false,
            Mlist: [],
        })
    }

    _Detail(r) {
        this._getMDate(r);
        this.setState({
            showModal: true,
            tradeDate: r.tradeDate
        })
    }

    _getMDate(r) {
        let req = {
            tradeDate: r? r.tradeDate : this.state.tradeDate
        }
        hisPoundageDetailsList(req).then(res => {
            if(res.data.status == 200) {
                let temArr = res.data.data
                let listData = []
                temArr.forEach((item, index) => {
                    //TODO 是否登录 提现
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1

                    listData.push(item)
                })
                this.setState({
                    Mlist: listData
                })
            }
        })

    }

    render() {
        return (
            <div className='center-user-list'>
                <Modal title="详细"
                    visible={this.state.showModal}
                    closable={true}
                    width={1200}
                    onCancel={this.onCancel.bind(this)}
                    footer={null}>
                    <Table pagination={{
                        pageSize: 7
                    }}
                        columns={this.columns1} dataSource={this.state.Mlist} />
                </Modal>
                {this.renderBreadcrumb()}
                <NewHistoryPoundageSearch handleSearch={this.handleSearch}/>
                {this.todayPoudageList()}
            </div>
        )
    }
}
