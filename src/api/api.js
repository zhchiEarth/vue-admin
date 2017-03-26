import axios from 'axios';

let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbHVtZW4uYXBwL2FwaS9hdXRob3JpemF0aW9ucyIsImlhdCI6MTQ5MDQ2NDU1NSwiZXhwIjoxNDkwNDY4MTU1LCJuYmYiOjE0OTA0NjQ1NTUsImp0aSI6InZMZ2hjUnBxZDRXVG85b0IiLCJzdWIiOm51bGx9.I4xEbAuIJtVAGAD2rJ1xk6GdqaH4rREYlBDYMg-ULmg';
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let base = 'http://lumen.app/api/';


export const getGoodsBrands = params => { return axios.get(`${base}goodsBrands`, { params: params }); };

export const updateBrands = params => { return axios.put(`${base}goodsBrands/1`, { params: params }); };

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };