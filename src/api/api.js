import axios from 'axios';
import config from './config';

// axios(config);
class API {
    //获取已授权列表
    get (api, param) {
        config.params = param;
        return axios.get(api,config);
    }
    delete (api, param) {
        config.params = param;
        return axios.delete(api,config);
    }
    head (api, param) {
        config.params = param;
        return axios.head(api,config);
    }
    //添加授权
    post (api, param) {
        config.params = param;
        return axios.post(api,param, config);
    }
    //更新
    put(api, param) {
        config.params = param;
        return axios.put(api,param, config);
    }
    //部分更新
    patch(api, param) {
        config.params = param;
        return axios.patch(api,param, config);
    }
    reqSuccess(obj,msg){
            obj.$notify({
                title: '成功',
                message: msg,
                type: 'success'
            });
    }
    reqFail(obj,msg){
            obj.$message({
                title: '失败',
                message: msg,
                type: 'error'
            });
    }
}
export default new API();;

//请求前
axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

//响应数据
axios.interceptors.response.use(function (response) {
    if (response.status === 401) {
      del('token')
      window.location.pathname = '/login'
    }
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });