import React from 'react';
import {LaunchPage, PromiseNotUntil} from 'react-hymn';
import {Router, Route} from 'react-router-dom';
import history from './history';
import appStore from './appStore';
//路由页面管理
import {routes_start} from './routes'; // 路由页面管理
import Index from './pages/Index'; // exact首页，默认指定首页
import {listen403} from './networking/FetchManager';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import 'ant-design-pro/dist/ant-design-pro.css';
import './App.css';
import {Layout, LocaleProvider, DatePicker, message} from 'antd';
import GlobalUtilsWrapper from './components/global-utils-wrapper/GlobalUtilsWrapper';
import Login from '../src/pages/Login.js'

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './RewriteMethods.js'

moment.locale('zh-cn');
const {Sider, Footer, Content} = Layout;

// var heightTop = document.documentElement.scrollTop || document.body.scrollTop;
class App extends LaunchPage {
    constructor(props) {
        super(props);
        this.state = {
            showInitialError: false
        };
        this.startTime = Date.now();
    }

    atVeryBeginning() {
    }

    atVeryBeginning() {
    }

    cacheLoaded() {
        return void 0;
    }

    checkCache(cache) {
        console.log('try main checkCache');
    }

    tryMainServer() {
        console.log('try main server');
        return Promise.resolve();
    }

    tryBackServer() {
        return Promise.resolve();
    }

    updateCriticalData() { // 默认启动缓存的数据
        //return [symbol, banner, tradeTime, getAppId];
    }

    _getRouter() {
        console.log(document.querySelector('body'))

        return (
            <Router history={history}>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
                    <switch>
                        <Route exact path='/' component={Login}/>

                        {
                            routes_start.map((item) => {
                                console.log(item.path)
                                return <Route path={item.path} component={item.component}/>
                            })
                        }

                    </switch>
                </div>
            </Router>
        );
    }

    _getRouterNew() {
        return (
            <GlobalUtilsWrapper history={history} routes={routes_start} InitPage={Index}/>
        );
    }


    _getLaunchView() { // 启动页
        return null;
    }

    async criticalDataDidLoad() {
        //this._renderPage();
    }

    _detectViewportSize() {
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            width = w.innerWidth || e.clientWidth || g.clientWidth,
            height = w.innerHeight || e.clientHeight || g.clientHeight;
        appStore.set('viewport', {width: width, height: height});
    }

    componentDidMount() {
        this._detectViewportSize();
        window.addEventListener('resize', () => {
            this._detectViewportSize();
        });
        listen403();
        // this.launch(appStore);
    }

    render() {
        return (
            <div className="App" style={{display: 'flex', flexDirection: 'row'}}>
                {/*{this._getRouter()}*/}
                {this._getRouterNew()}
            </div>
        );
    }
}

export default App;
