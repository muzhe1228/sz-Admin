import React, {Component} from 'react';
import {Spin, message, Input} from 'antd';
import TableView from '../../components/TableView'
import {
    mineConfig,
    updateMineConfig
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
export default class Config extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            isLoading: false,
            pageNo: 0,
            changeValue: {}
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
            title: 'keyGroup',
            dataIndex: 'keyGroup',
            width: '120px',
            key: 'keyGroup',
        }
        ,
        {
            title: '配置名称',
            dataIndex: 'keyCode',
            key: 'keyCode',
            width: '200px',
        }
        , {
            title: '描述',
            dataIndex: 'keyDesc',
            key: 'keyDesc',
            width: '200px',
        }
        ,
        {
            title: '值',
            width: '100px',
            render: (text, record) => (
                <Input key={record.id} defaultValue={record.keyValue} onChange={this._changeHandler.bind(this, record)}></Input>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 70,
            render: (text, record) => (
                <a onClick={this._submit.bind(this, record)}>提交修改</a>
            )
        }
    ];


    componentWillMount() {
        this.setState({isLoading: true})
    }

    componentDidMount() {
        this.getData()
    }

    _changeHandler(record, e) {
        let obj = this.state.changeValue;
        obj[record.id] = e.target.value;
        this.setState({
            changeValue: obj,

        })
    }

    onChangePagintion = (e) => {
        this.setState({
            pageNo: e
        })
    }
    
    renderLockDepotList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px', width: "800px"}}>
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

    getData = () => {
        this.setState({isLoading: true})
       
        mineConfig().then((res) => {
            let listData = []
            if (res.status == 200) {
                let temArr = res.data.data
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                    listData.push(item)
                })
            }

            //添加key 没有计算
            this.setState({
                listData: listData,
                isLoading: false,
            })
        })
    }

    _submit(record) {
        let req = {
            id: record.id,
            keyValue: this.state.changeValue[record.id]?this.state.changeValue[record.id] : record.keyValue
        }
        updateMineConfig(req).then(res => {
            if(res.data.status == 200) {
                message.success('提交成功');
                this.getData();
            }
        }).catch(err => {
            message.error(err.data.msg);
        })

    }

    render() {
        return (
            <div className='center-user-list'>
                {this.renderBreadcrumb()}
                {this.renderLockDepotList()}
            </div>
        )
    }
}
