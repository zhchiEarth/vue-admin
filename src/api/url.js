// import config from './config';
// import API from './api';
// const api = new API();

// export const requestLogin = (params, that) => {
// // let that = this;
//     api.post(`/authorizations`, params)
//         .then(function (response) {
//             if (response.data.data.token) {
//                 const token = response.data.data.token
//                 window.localStorage.setItem('token', token)
//                 window.location.pathname = '/'
//                 that.$router.push({ path: '/' });
//             } else {
//                 api.reqFail(that, '用户名或密码错误');
//             }
//         })
//         .catch(function (error) {
//           api.reqFail(this, error);
//         });
// };

// api.post(params)
//     .then(function(res){
//       const token = response.data.token
//       window.localStorage.setItem('token', token)
//       window.location.pathname = '/'
//     this.$router.push({ path: '/' });
//       that.tableData = JSON.parse(res.data.data).sets[0].rows;
//       that.loading2 = false;
//     })
//     .catch(function(err){
//       console.log(err);
//       that.loading2 = false;
//       api.reqFail(that,"获取列表失败请刷新");
//     });