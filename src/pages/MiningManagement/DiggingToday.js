
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, message, Input, Button, Modal, Table} from 'antd';
import TableView from '../../components/TableView'
import {
    digMineTotalList,
    digMineToYestodayTotal,
    digMineTodayAmount,
    digMineTotalListToday
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
import {Link} from 'react-router-dom'
export default class NodeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            isLoading: false,
            total: 0,
            pageNo: 1,
            toYestodayTotal: '',
            todayAmount: {},
            showModal: false,
            Mlist: [],
            MpageNo: 1,
            mUid: ''

        }

        this.uid = 0;
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
            title: '用户ID',
            dataIndex: 'userId',
            width: '100px',
            key: 'userId',
        }
        ,
        {
            title: '挖矿产生手续费折合(BTC)',
            dataIndex: 'poundageAmountBtc',
            key: 'poundageAmountBtc',
            width: '250px',
        }
        ,
        {
            title: '挖矿产生手续费折合(ETH)',
            dataIndex: 'poundageAmountEth',
            key: 'poundageAmountEth',
            width: '250px',
        }
        ,
        {
            title: '挖矿产生手续费折合(USDT)',
            dataIndex: 'poundageAmountUsdt',
            key: 'poundageAmountUsdt',
            width: '250px',
        }
        ,
        {
            title: '产生SZ数量',
            dataIndex: 'diggingAmount',
            key: 'diggingAmount',
        }
        ,
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
    
            width: 70,
            render: (text, record) => (
                <a onClick={this._showDetails.bind(this, record)}>详细</a>
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
            width: '100px',
            key: 'tradeHour',
        }
        ,
        {
            title: '挖矿产生手续费折合(BTC)',
            dataIndex: 'poundageAmountBtc',
            key: 'poundageAmountBtc',
            width: '250px',
        }
        ,
        {
            title: '挖矿产生手续费折合(ETH)',
            dataIndex: 'poundageAmountEth',
            key: 'poundageAmountEth',
            width: '250px',
        }
        ,
        {
            title: '挖矿产生手续费折合(USDT)',
            dataIndex: 'poundageAmountUsdt',
            key: 'poundageAmountUsdt',
            width: '250px',
        }
        ,
        {
            title: '产生SZ数量',
            dataIndex: 'diggingAmountLast',
            key: 'diggingAmountLast',
        }
    ];


    componentWillMount() {
        this.setState({isLoading: true})
    }

    componentDidMount() {
        this._digMineToYestodayTotal()
        this.getData()
        this._digMineTodayAmount()
    }

    _digMineToYestodayTotal() {
        digMineToYestodayTotal().then(res => {
            if(res.data.status == 200){
                this.setState({
                    toYestodayTotal: res.data.data.diggingOverTotal
                })
            }
            
        })
    }

    _digMineTodayAmount() {
        digMineTodayAmount().then(res => {
            if(res.data.status == 200) {
                this.setState({
                    todayAmount: res.data.data
                })
            }
        })
    }

    onChangePagintion = (e) => {
        this.state.pageNo = e
        this.getData()
    }
    
    renderLockDepotList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px', width: "800px"}}>
                <Spin spinning={this.state.isLoading}>
                    <TableView onChangePagintion={this.onChangePagintion} hiddenSelection
                               columns={this.columns} data={this.state.listData} pageNo={this.state.pageNo} pageSize={8}
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

    getData = () => {
        this.setState({isLoading: true})

        let req = {
            pageNo: this.state.pageNo,
            pageSize: 8,
        }

        if(this.uid) {
            req.userId = this.uid
        }

        digMineTotalList(req).then((res) => {
            let listData = []
            let total = 0
            if (res.status == 200) {
                let temArr = res.data.data.list
                total = res.data.data.total
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 8 + index + 1
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

    _changeHandler(e) {
       this.uid = e.target.value;
    }

    onCancel(){
        this.setState({
            showModal: false,
            Mlist: [],
            mUid: ''
        })
    }

    _digMineTotalListToday(r) {
        let req = {
            userId: r.userId
        }
        digMineTotalListToday(req).then(res => {
            let listData = []

            if(res.data.status == 200) {
                let temArr = res.data.data

                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 8 + index + 1
                    listData.push(item)
                })

                this.setState({
                    Mlist: listData,

                })
            }
        })
    }

    _showDetails(r) {
        this._digMineTotalListToday(r);
        this.setState({
            showModal: true,
            mUid: r.userId
        })
    }

    render() {
        let { todayAmount, mUid } = this.state;
        return (
            <div className='center-user-list'>
                <Modal title="详细"
                    visible={this.state.showModal}
                    closable={true}
                    width={1200}
                    onCancel={this.onCancel.bind(this)}
                    footer={null}>
                    <div>用户ID:  {mUid}</div>
                    <Table pagination={{
                        pageSize: 7
                    }}
                        columns={this.columns1} dataSource={this.state.Mlist} />
                </Modal>
                {this.renderBreadcrumb()}
                <div style={{display: 'flex'}}>
                    <label htmlFor="" style={{height: 32, lineHeight: '32px', marginLeft: 30}}>用户ID：</label>
                    <Input style={{width: 200}} onChange={this._changeHandler.bind(this)} onPressEnter={this.getData.bind(this)}/>
                    <Button onClick={this.getData.bind(this)} type="primary" icon="search" style={{marginLeft: '30px'}}>
                        查询
                    </Button>
                </div>
                <div style={{textAlign: 'right', paddingRight: 20, fontWeight: 600}}>截至昨日已挖出量：{this.state.toYestodayTotal} SZ</div>
                {this.renderLockDepotList()}
                <div style={{display: 'flex', fontWeight: 600}}>
                    <div style={{textAlign: 'right', width: 120, marginRight: 45}}>统计：</div>
                    <div style={{width: 250}}>{todayAmount && todayAmount.poundageAmountBtc}</div>
                    <div style={{width: 250}}>{todayAmount && todayAmount.poundageAmountEth}</div>
                    <div style={{width: 250}}>{todayAmount && todayAmount.poundageAmountUsdt}</div>
                    <div style={{width: 250}}>{ todayAmount && todayAmount.diggingAmount}</div>
                </div>
            </div>
        )
    }
}
