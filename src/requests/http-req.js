import axios from 'axios';
import simpleUrl from 'simple-url';
import appStore, {logoutClearPairs} from '../appStore';
import history from '../history';
import {message} from 'antd';
import ENV from '../config/appConfig';


axios.defaults.retry = 1;
axios.defaults.retryDelay = 100;
axios.defaults.headers['Content-Type'] = 'application/json;UTF-8'

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // console.log('axios request', config);
    return config;
}, function (error) {
    // Do something with request error
    // console.log('axios request error', error);
    return Promise.reject(error);
});

//const header = {'Content-Type': 'application/json', 'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token}


axios.interceptors.response.use(function (response) {

    return response;
}, function (err) {
    var config = err.config,
        status = err.response && err.response.data && err.response.data.status || null;
    // If the status code is 401, jump to login
    if (status === 401) {
        window.localStorage.setItem('user', null)
        // Object.keys(logoutClearPairs).forEach(key => {
        //     appStore.set(key, logoutClearPairs[key]);
        // });
        message.warning('登陆失效，请重新登陆！')
        history.push('/');
    }
    if (status === 403) {
        message.warning('没访问权限')
    }
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err.response);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function () {
        return axios(config);
    });
    // Do something with response error
    // console.log('axios response error', error);
    // return Promise.reject(error);
});

//http://192.168.100.100:8080/article/list?pageNo=1&pageSize=10 ///swagger-ui.html
function createUrl(path, query, hash) { // 用户接口
    return simpleUrl.create({
        protocol: ENV.getENV().name == 'tests' ? 'https' : 'http',
        host: ENV.getENV().httpApi,  // 测试
        pathname: path,
        query: query,
        hash: hash
    });
}

// JSON.parse(window.localStorage.getItem('user')).token
/**
 * 用户列表
 * **/
export function userInfoList(req) {
    console.log(JSON.parse(window.localStorage.getItem('user')).token)
    // appStore.get(['user', 'token'])
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user/userList', req),
        method: 'get'
    });
}


/**
 * 钱包地址
 * **/
export function walletAddress(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/walletAddress', req),
        method: 'get'
    });
}

/**
 * 登录黑名单
 * **/
export function blackList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/blackList', req),
        method: 'get'
    });
}

/**
 * 提现黑名单
 * **/
export function withdrawBlacklist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/withdrawBlacklist', req),
        method: 'get'
    });
}

/**
 * 交易黑名单
 * **/
export function tradeBlacklist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/tradeBlacklist', req),
        method: 'get'
    });
}

/**
 * 禁止提币
 * **/
export function lockWithdrawCash(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/lockWithdrawCash', req),
        method: 'get'
    });
}

/**
 * 启动提币
 * **/
export function unlockWithdrawCash(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/unlockWithdrawCash', req),
        method: 'get'
    });
}

/**
 * 禁止交易
 * **/
export function lockTrade(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/lockTrade', req),
        method: 'get'
    });
}

/**
 * 解锁交易
 * **/
export function unlockTrade(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/unlockTrade', req),
        method: 'get'
    });
}

/**
 * 修改用户信息
 * **/
export function editUserInfo(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/editUserInfo', req),
        method: 'get'
    });
}

/**
 * 手机重置密码
 * **/
export function resetLoginPwdForMobile(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetLoginPwdForMobile', req),
        method: 'get'
    });
}

/**
 * 谷歌重置密码
 * **/
export function resetGoogle(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user/reset_google'),
        data: req,
        method: 'put'
    });
}

/**
 * 邮箱重置登录密码
 * **/
export function resetLoginPwdForEmail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetLoginPwdForEmail', req),
        method: 'get'
    });
}

/**
 * 手机重置资金密码
 * **/
export function resetTradePwdForMobile(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetTradePwdForMobile', req),
        method: 'get'
    });
}

/**
 * 邮件重置资金密码
 * **/
export function resetTradePwdForEmail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetTradePwdForEmail', req),
        method: 'get'
    });
}


/**
 *
 查询用户信息
 * **/
export function queryUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/queryUser', req),
        method: 'get'
    });
}

/**
 *
 查询登录黑名单
 * **/
export function queryLoginBlackUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/queryLoginBlackUser', req),
        method: 'get'
    });
}


/**
 *文章列表
 * **/
export function articleList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/article/list', req),
        method: 'get'
    });
}

/**
 *查询文章列表
 * **/
export function articleInfo(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/article/info/', req),
        method: 'get'
    });
}

/**
 *新增文章
 * **/
export function articleSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/article/save'),
        data: req,
        method: 'post'
    });
}

/**
 *  修改文章状态///v1/article/status/{id}/{status}
 * 删除 服用 状态0 启动 1：停用 文章状态: 1停用 0 启用
 * **/
export function articleStatus(id) {
    let newPath = '/v1/article/status/' + id + '/1'
    return axios({
        // headers:{'Content-Type': 'application/json', 'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token},
        url: createUrl(newPath),
        method: 'get'
    });
}


/**
 v1/article/update
 更新文章信息
 **/
export function articleUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/article/update'),
        data: req,
        method: 'post'
    });
}

/**
 获取全部文章类型列表
 **/
export function articleTypeGetAll(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },

        url: createUrl('/v1/articletype/getall', req),
        method: 'get'
    });
}

/**
 文章类型列表
 查询文章列表
 **/
export function articleTypeList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/articletype/list', req),
        method: 'get'
    });
}

/**
 文章类型删除
 /v1/articletype/remote/{}
 **/
export function articleRemote(id) {
    let newPath = '/v1/articletype/remote/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}


/**
 * 新增
 /v1/articletype/remote/{}
 **/
export function articleTypeSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/articletype/save'),
        data: req,
        method: 'post'
    });
}


/**
 * 修改
 /v1/articletype/remote/{}
 **/
export function articleTypeUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/articletype/update'),
        data: req,
        method: 'post'
    });
}


/**
 *交易明细查询
 **/
export function tradeEntrustDetailList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/tradeEntrustHis/detail/list', req),
        method: 'get'
    });
}


/**
 *v1/tradeEntrust/list
 币币委托单列表
 */
export function tradeEntrustList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/tradeOrder/list', req),
        method: 'get'
    });
}

//交易详情列表  彬彬  交易标的
/**
 *v1/tradeInfo/getById/{id}
 * */
export function tradeInfoById(id) {
    let newPath = '/v1/tradeInfo/getById' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

/**
 *v1/tradeInfo/list  分页加载列表 关键字查询
 * */
export function tradeInfoList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/tradeInfo/list', req),
        method: 'get'
    });
}


/**
 *v1/tradeInfo/save 生成交易标的
 * */
export function tradeInfoSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/tradeInfo/save'),
        data: req,
        method: 'post'
    });
}


/**
 *v1/tradeInfo/update 修改交易标的
 * */
export function tradeInfoUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/tradeInfo/update'),
        data: req,
        method: 'post'
    });
}

///v1/tradeInfo/updateStatus/{id}/{status}
//修改币币交易标的状态
export function tradeInfoupdateStatus(id, status) {
    let newPath = '/v1/tradeInfo/updateStatus/' + id + `/` + status

    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}

//v1/coindraw/list
//状态查前4位
//查询列表8位
//v1/coindraw/list coinDrawStatus：//1003 0005:待初审;10030010:待复审;10030015:待出币;10030020:已出币;10030025:已驳回;10030030:未成功
//查询
export function coindrawList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coindraw/list', req),
        method: 'get'
    });
}

/**
 * 状态字典 ///v1/dictionary/getdickey/{dicNo}
 * */
export function getDickey(id) {
    let newPath = '/v1/dictionary/getdickey/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

/**
 * 对应状态列表 /v1/dictionary/list
 * */
export function dickeyList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/dictionary/list', req),
        method: 'get'
    });
}

/**
 * 获取币种类型
 * */
export function getCodeType() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coininfo/getcode'),
        method: 'get'
    });
}

/**
 * 交易流水 审核页面中 币币资金明细
 * */
export function drawDetail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/trade/detail/draw', req),
        method: 'get'
    });
}

/**
 *新增加币种
 * */
export function coininfoSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coininfo/save'),
        data: req,
        method: 'post'
    });
}

/**
 *新增加币种
 * */
export function coininfoList(req) {
    console.log(appStore.get(['token']))
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },

        url: createUrl('/v1/coininfo/list', req),
        data: req,
        method: 'get'
    });
}

/**
 *踢下线 /v1/user/kick_down_line/{userId}
 * */
export function kickDown(id) {
    let newPath = '/v1/user/kick_down_line/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}

/**
 *重置登录密码
 * */
export function resetLoginPwd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user/reset_login_pwd'),
        data: req,
        method: 'put'
    });
}

/**
 *重置交易密码
 * */
export function resetTradePwd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user/reset_trade_pwd'),
        data: req,
        method: 'put'
    });
}

/**
 *根基手机号和邮箱搜索用户
 * */
export function searchUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user/search_user', req),
        method: 'get'
    });
}

/**
 *黑名单 loginStatus tradeStatus withdrawStatus userIds 白名单
 * */
export function prohibitStatusList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user_status/user_status_list', req),
        // url: createUrl('/v1/user/prohibit_status_list', req),
        method: 'get'
    });
}

/**
 *用户详情钱包列表
 * */

export function userDetail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user/userDetail', req),
        method: 'get'
    });
}

/**
 *设置用户登录状态
 * */

export function loginStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/user_status/update_login_status'),
        method: 'put'
    });
}

/**
 *设设置用户交易状态
 * */

export function tradeStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/user_status/update_trade_status'),
        method: 'put'
    });
}

/**
 *设置用户提现状态
 * */

export function withdrawStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/user_status/update_withdraw_status'),
        method: 'put'
    });
}


/**
 *出币未通过
 * */

export function cashNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coindraw/cash_pass/no'),
        method: 'post'
    });
}


/**
 *出币通过
 * */

export function cashPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coindraw/cash_pass/yes'),
        method: 'post'
    });
}

/**
 *初审未通过
 * */

export function exaNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coindraw/pass_first/no'),
        method: 'post'
    });
}

/**
 *初审通过
 * */

export function exaPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coindraw/pass_first/yes'),
        method: 'post'
    });
}

/**
 *复审未通过
 * */

export function verNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coindraw/pass_second/no'),
        method: 'post'
    });
}

/**
 *复审通过
 * */

export function verPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coindraw/pass_second/yes'),
        method: 'post'
    });
}

/**
 *登录日志
 * */
export function loginLogList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/user/login_log_list', req),
        method: 'get'
    });
}

//币币资金明细
export function tradeDetailList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/trade/detail/list', req),
        method: 'get'
    });
}

//币种信息
export function coinOtcList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/otc/list', req),
        method: 'get'
    });
}

//用户资产
export function tradeDetailAll(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        // url: createUrl('/v1/trade/detail/all', req),
        url: createUrl('/v1/position/all', req),
        method: 'get'
    });
}


//法币资金明细
export function detailOtcList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/trade/detail/otc/list', req),
        method: 'get'
    });
}

//权限列表
export function getPermissionsList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('v1/resources/get', req),
        method: 'get'
    });
}

//查询权限列表
export function getByDescribe(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl(' /v1/resources/get_by_describe'),
        method: 'post'
    });
}

//更新
export function updateResources(id, req) {
    let newPath = ' /v1/resources/update/' + id

    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl(newPath),
        method: 'put'
    });
}

//新增
export function creatResources(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl(' /v1/resources/create'),
        method: 'post'
    });
}

//权限删除  /v1/resources/delete/{id}
export function delResources(id) {
    let newPath = ' /v1/resources/delete/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'delete'
    });
}

//角色删除  /v1/role/delete/{id}
export function deleteRole(id) {
    let newPath = '/v1/role/delete/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),


        method: 'delete'
    });
}

//角色创建
export function roleCreate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/role/create'),
        data: req,
        method: 'post'
    });
}

//角色修改   /v1/role/update/{id}
export function roleUpdate(id, req) {
    let newPath = '/v1/role/update/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put',
        data: req
    });
}

//角色查询  /v1/role/get_role_resources
export function getByName(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/role/get_by_name', req),
        method: 'get'
    });
}

//角色列表  /v1/role/get
export function roleList(req) {

    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/role/get', req),
        method: 'get'
    });
}

// 分页查询杠杆资金流水
export function hlList(req) {

    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/trade/detail/hl/list', req),
        method: 'get'
    });
}

/**
 * 加减币相关
 *
 */
//列表 && 查询

export function mHList(req) {

    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coin/mh/list', req),
        method: 'get'
    });
}

//新增币
export function mhSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/mh/save'),
        method: 'post'
    });
}

//初审 不通过
export function auditeNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/mh/audite/nopass'),
        method: 'post'
    });
}

//初审 通过
export function auditePass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/mh/audite/pass'),
        method: 'post'
    });
}

//发放 通过
export function cashPassCoin(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/mh/cash/pass'),
        method: 'post'
    });
}

//发放 不通过
export function cashNoPassCoin(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/mh/cash/nopass'),
        method: 'post'
    });
}

//发放 不通过
export function mhDelete(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/mh/delete'),
        method: 'post'
    });
}

//高级认证
export function seniorUserist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },

        url: createUrl('/v1/senior/senior_user_List', req),
        method: 'get'
    });
}

//高级认证审核
export function updateSeniorStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/senior/update_senior_status'),
        method: 'put'
    });
}

//法币广告列表
export function advertisingPages(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/advertising/pages', req),
        method: 'get'
    });
}


//上传图片
export function upLoad(req, onUploadProgress) {
    return axios({
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        onUploadProgress: onUploadProgress,
        data: req,
        url: `https://${ENV.getENV().uploadAPI}/v1/upload`, // 地址栏之后换成配置
        method: 'post'
    });
}


//更新币种信息 启动 禁用 更新
export function coininfoUpload(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coininfo/update'),
        method: 'post'
    });
}

//法币广告关联  后台管理订单接口
export function tradeOrderPage(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/trade_order/pages', req),
        method: 'get'
    });
}

//法币申诉 列表
export function orderAppealPages(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/order_appeal/pages', req),
        method: 'get'
    });
}

//下架 /v1/advertising/down/{id}
export function advertisingDown(id) {
    let newPath = '/v1/advertising/down/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}

//上架 /v1/advertising/down/{id}
export function advertisingUp(id) {
    let newPath = '/v1/advertising/up/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}


//上架 /v1/advertising/down/{id}
export function orderAppealOperation(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/order_appeal/operation'),
        method: 'put'
    });
}

//上架 /v1/advertising/down/{id}
export function coArticleCategoryetAll() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('v1/coArticleCategory/getAll'),
        method: 'get'
    });
}

//添加中心目录
//v1/coArticleCategory/add
export function coArticleCategoryetAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coArticleCategory/add'),
        method: 'post'
    });
}

//删除中心目录
///v1/coArticleCategory/remove/{id}
export function coArticleCategoryetRemove(id) {
    let newPath = '/v1/coArticleCategory/remove/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

//新建文章
export function coArticleAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coArticle/add'),
        method: 'post'
    });
}

//更新文章
export function coArticleUpdata(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coArticle/update'),
        method: 'post'
    });
}

//删除文章 /v1/coArticle/remove/{id}
export function coArticleRemove(id) {
    let newPath = '/v1/coArticle/remove/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

//提现手续费
export function withDrawRate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/withDrawRate/list', req),
        method: 'get'
    });
}

//创建提现手续费
export function withDrawRateSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/withDrawRate/save'),
        method: 'post'
    });
}

//创建提现手续费
export function withDrawRateUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/withDrawRate/update'),
        method: 'post'
    });
}

///v1/user/update_cash_fee_status 0白名单 1 ：收取手续费 //
// 设置用户提现手续费状态

export function cashFeeStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/user_status/update_cash_fee_status'),
        method: 'put'
    });
}

// 设置用户交易手续费状态

export function tradeFeeStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/user_status/update_trade_fee_status'),
        method: 'put'
    });
}

// 设置全部状态 5+ id

export function updatUeserStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/user/update_user_status'),
        method: 'put'
    });
}


//app版本列表

export function appVerisonList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/app/version/list', req),
        method: 'get'
    });
}


//新增
export function saveAppVerison(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/app/version/save'),
        data: req,
        method: 'post'
    });
}

//修改状态
export function versionStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/app/version/status'),
        data: req,
        method: 'post'
    });
}

//获取图形验证码
export function getImageCode(req) {
    return axios({
        //47.97.118.31 18779
        // url: 'http://47.97.118.31:18779/auth/imageCode?width=80&height=30',
        url: createUrl('/auth/imageCode', req),
        method: 'get'
    });
}

//用户登录
export function userLogin(req) {
    console.log(window.localStorage.getItem('user'))
    return axios({
        url: createUrl('/auth/authorize'),
        data: req,
        method: 'put'
    });
}


//检查更新版本
export function checkVersion(req) {
    console.log(appStore.get(['token']))
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },

        url: createUrl('v1/app/version/check', req),
        method: 'get'
    });
}

///v1/banner/pages
//轮播图
export function bannerPages(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/banner/pages', req),
        method: 'get'
    });
}

// 充值明细列表
export function rechargeDetail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/trade/detail/recharge', req),
        method: 'get'
    });
}

// 添加新的轮播图
export function bannerSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/banner/'),
        data: req,
        method: 'post'
    });
}

// 更新轮播图
export function bannerUpdata(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/banner/'),
        data: req,
        method: 'put'
    });
}


// 删除轮播图
export function bannerDelete(id) {
    let newPath = '/v1/banner/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        //DELETE
        method: 'delete'
    });
}

// 法币交易币种
export function coinOtcSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coin/otc/save'),
        data: req,
        method: 'post'

    });
}


// 委托单列表
export function tradeOrderList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/tradeOrder/list', req),
        method: 'get'
    });
}


/**
 *v1/tradeEntrustHis/list
 历史委托单列表
 */
export function tradeEntrustHisList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/tradeEntrustHis/list', req),
        method: 'get'
    });
}

/**
 *v1/coin/otc/update
 */
export function otcUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/coin/otc/update'),
        method: 'post'
    });
}

/**
 *v1/coin/otc/update
 */
export function levelRateList() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/rate/level_rate_list'),
        method: 'get'
    });
}

/**
 *交易对推荐 非推荐
 */
export function updateRecommend(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/tradeInfo/updateRecommend'),
        method: 'post'
    });
}

/**
 *修改手续费
 */
export function updateLevelRate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/rate/update_level_rate'),
        method: 'put'
    });
}

// 资金平衡表
export function balanceList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/balance/coin/list', req),
        method: 'get'
    });
}

// 资金平衡表
export function totalBalanceList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/balance/total/list', req),
        method: 'get'
    });
}

// 资金平衡表
export function balanceRecordlist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/balance/total/recordlist', req),
        method: 'get'
    });
}

// 资金平衡表个人记录
export function coinBalanceRecordlist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/balance/coin/recordlist', req),
        method: 'get'
    });
}

// 更改资金平衡表
export function balanceCorrect(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/balance/total/correct'),
        data: req,
        method: 'post'
    });
}

// 更改个人资金平衡表
export function coinBalanceCorrect(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/balance/coin/correct'),
        data: req,
        method: 'post'
    });
}

// 更改app版本
export function versionUpdata(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/app/version/update'),
        data: req,
        method: 'post'
    });
}

export function roleResourcesAll() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/role/resources'),
        method: 'get'
    });
}

// 全部的权限 用户编辑用户权限
export function resourcesAll() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/resources/all'),
        method: 'get'
    });
}

// 全部的权限 用户编辑用户权限
export function roleDelete() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/role/delete/'),
        method: 'get'
    });
}

// 全部的权限 用户编辑用户权限
export function resourcesById(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/role/resources_by_id', req),
        method: 'get'
    });
}

// 全部的权限 用户编辑用户权限
export function addResources(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/role/add_resources'),
        method: 'post'
    });
}

// 全部的管理员
export function getAdministrators(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/administrators/get', req),
        method: 'get'
    });
}

// 全部的管理员
export function roleAll(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/role/role_all', req),
        method: 'get'
    });
}

// 新建管理员
export function administratorsAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/administrators/add'),
        method: 'post'
    });
}

// 更新管理员的秘密
export function updatePwd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/administrators/update_pwd'),
        method: 'put'
    });
}

// 更新管理员的角色
export function updateRole(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/administrators/update_role'),
        method: 'put'
    });
}

// 杠杆历史订单
export function leverageTradeHisList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/leverageTradeHis/list', req),
        method: 'get'
    });
}

// 杠杆历史订单
export function leverageTradeList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/leverageTrade/list', req),
        method: 'get'
    });
}

// 杠杆历史订单
export function leverageHoldList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/leverageTrade/holdList', req),
        method: 'get'
    });
}

// 删除管理员 /v1/administrators/delete/{id}

export function administratorsDelete(id) {
    let newPath = '/v1/administrators/delete/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'delete'
    });
}

// 删除管理员 /v1/administrators/delete/{id}

export function leverageEveningUp(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/leverage/eveningUp', req),
        method: 'get'
    });
}

//待初审列表
export function passFirst(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coindraw/pass_first/list', req),
        method: 'get'
    });
}


//待复审列表
export function passSecond(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coindraw/pass_second/list', req),
        method: 'get'
    });
}


//待出币列表
export function cashPassList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/coindraw/cash_pass/list', req),
        method: 'get'
    });
}

//出币驳回
export function coinDrawNo(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: JSON.stringify(req),
        url: createUrl('/v1/coindraw/error/no'),
        method: 'post'
    });
}

//重新出币
export function coinDrawYes(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: JSON.stringify(req),
        url: createUrl('/v1/coindraw/error/yes'),
        method: 'post'
    });
}

//待出币列表
export function getCoinStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/balance/total/getCoinStatus', req),
        method: 'get'
    });
}

//添加邀请注册信息
export function inviteAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/invite/add', req),
        method: 'post'
    });
}

//修改邀请注册信息
export function inviteUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/invite/update', req),
        method: 'post'
    });
}

//公告列表
export function inviteList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/invite/list', req),
        method: 'get'
    });
}

//保存
export function announcementSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/announcement/save'),
        method: 'post'
    });
}

//删除
export function announcementRemove(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/announcement/remove', req),
        method: 'get'
    });

}

//列表
export function announcementList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/announcement/list', req),
        method: 'get'
    });
}

//v1/announcement/update


//更新
export function announcementUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/announcement/update'),
        method: 'post'
    });
}

//adminapi-eoe2.ichainsoft.com/v1/tradeEntrustHis/aboveOrderList?pageNo=1&pageSize=10


//上游报单
export function aboveOrderList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('v1/tradeEntrustHis/aboveOrderList', req),
        method: 'get'
    });
}

//添加量化接口
export function addQuanUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/quantizationAuth/addQuanUser'),
        method: 'post'
    });
}

//添加量化列表
export function quanUserList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/quantizationAuth/list', req),
        method: 'get'
    });
}

//添加量化列表
export function quanUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/quantizationAuth/update'),
        method: 'post'
    });
}
//设置为最新版本
export function newestVersion(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/app/version/newestVersion'),
        method: 'post'
    });
}
//设置为最新版本
export function logList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/log/list',req),
        method: 'get'
    });
}

// 结算任务列表
export function settleTaskList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/settle_task/get_all_tasks',req),
        method: 'get'
    });
}

// 结算任务提交
export function settleTaskSubmit(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/settle_task/subtmit_task',req),
        method: 'get'
    });
}

// 分红设置列表
export function dividendSetList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/dividend_detail/statlist',req),
        method: 'get'
    });
}

// 分红记录
export function dividendRecords(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/dividend_detail/adminlist',req),
        method: 'get'
    });
}

// 分红设置提交
export function dividendSetUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/dividend_detail/dividend_confirm'),
        method: 'post'
    });
}

// 锁仓管理，列表
export function lockDepotList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/freeze_total/list_lock',req),
        method: 'get'
    });
}

// 锁仓详细
export function freezeLockList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/freeze_lock/lock_list',req),
        method: 'get'
    });
}

// 锁仓流水
export function freezeLockFlow(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/freeze_lock/lock_flow',req),
        method: 'get'
    });
}

// 数字节点列表
export function freezeListNode(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/freeze_total/list_node',req),
        method: 'get'
    });
}

// 数字节点详细
export function freezeNodeList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/freeze_node/node_list',req),
        method: 'get'
    });
}

// 数字节点流水
export function freezeNodeFlow(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/freeze_node/node_flow',req),
        method: 'get'
    });
}

// 今日手续费明细
export function poundageTotalList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/poundage_total/page_today',req),
        method: 'get'
    });
}

// 历史手续费明细
export function hisPoundageTotalList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/poundage_change/list',req),
        method: 'get'
    });
}

// 历史手续费详情
export function hisPoundageDetailsList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/poundage_change/list_day',req),
        method: 'get'
    });
}

// 今日挖矿明细
export function digMineTotalList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/digging_user/page_today',req),
        method: 'get'
    });
}

// 今日挖矿详细
export function digMineTotalListToday(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/digging_user/list_today',req),
        method: 'get'
    });
}

// 今日挖矿汇总
export function digMineTodayAmount(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/digging_user/today_total',req),
        method: 'get'
    });
}

// 截止昨日已挖出
export function digMineToYestodayTotal(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/sz_total/get_exchage_total',req),
        method: 'get'
    });
}

// 历史挖矿明细
export function hisDigMineTotalList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/digging_user/page_his',req),
        method: 'get'
    });
}

// 历史挖矿详细
export function digMineTotalHisDetails(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/digging_user/his_day',req),
        method: 'get'
    });
}

// 参数列表
export function mineConfig(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/config/list_all',req),
        method: 'get'
    });
}

// 跟新参数列表
export function updateMineConfig(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/config/update'),
        method: 'post'
    });
}

// 邀请管理
export function userRecommendDetail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user_recommend/list',req),
        method: 'get'
    });
}

// 返佣管理
export function userCommissionDetailList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user_commission_detail/adminList',req),
        method: 'get'
    });
}

// 撤单
export function tradeOrderCancel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl('/v1/tradeOrder/cancel'),
        method: 'post'
    });
}
