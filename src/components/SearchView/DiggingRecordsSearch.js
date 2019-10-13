import {Form, Input, Button, Radio, Select, DatePicker, Col, Row} from 'antd';
import React, {Component} from 'react';
import 'moment/locale/zh-cn';
import {FormItemPhone, FormItemEmail} from '../Form-Item.js'

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;

const Option = Select.Option;

class DiggingRecordsSearch extends React.Component {
    state = {
        seniorAuth: '0',
        primaryAuth: '0',

    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (this.props && this.props.handleSearch) {
                this.props.handleSearch(values)
            }
        });
    }

    componentWillMount() {

    }

    primaryAuthSelectChange = (value) => {
        this.setState({
            primaryAuth: value
        })
    }


    seniorAuthSelectChange = (value) => {
        this.setState({
            seniorAuth: value,
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    height: '120px',
                    minHeight: '120px',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{display: 'flex', width: '100%', flex: 1, alignItems: 'center'}}>
                    <Row gutter={24}>
                        <Col span={6} key={222}>
                            <FormItem style={{ margin: 'auto'}} label={`用户ID`}>
                                {getFieldDecorator('userId')(
                                    <Input placeholder="用户ID"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} key={4}>
                            <FormItem style={{margin: 'auto'}} label={`分红类型`}>
                                {getFieldDecorator(`dividendType`, {})(
                                    <Select
                                        // value={this.state.primaryAuth}
                                        placeholder="请选择"
                                        onChange={this.primaryAuthSelectChange}
                                    >
                                        <Option key={1232} value={null}>全部</Option>
                                        <Option value="1">持仓</Option>
                                        <Option value="2">节点</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10} key={6}>
                            <FormItem style={{margin: 'auto'}} label={`时间`}>
                                {getFieldDecorator('date')(
                                    <RangePicker format="YYYY-MM-DD"/>
                                )}
                            </FormItem>
                        </Col>
                        <div style={{ height: '100%', display: 'flex', }}>
                            <Button htmlType="submit" type="primary" icon="search" style={{
                                    marginLeft: '10px', marginTop: 5
                            }}>
                                    搜索
                            </Button>
                        </div>
                    </Row>
                </div>
                

            </Form>
        );
    }
}

const NewDiggingRecordsSearch = Form.create()(DiggingRecordsSearch);
export default NewDiggingRecordsSearch;
