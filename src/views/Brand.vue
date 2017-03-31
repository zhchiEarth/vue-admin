<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.brand_name" placeholder="品牌名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getBrands">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="brandsList" border style="width: 100%" v-loading="listLoading"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="brand_id" label="编号" width="180"> </el-table-column>
            <el-table-column prop="brand_name" label="品牌名称" sortable  width="180"> </el-table-column>
            <el-table-column prop="telephone" label="联系电话"  width="180"> </el-table-column>
            <el-table-column prop="brand_web" label="品牌网站" ></el-table-column>
            <el-table-column label="品牌logo" >
                <template scope="scope">
                    <img v-bind:src="scope.row.brand_logo" width="50px" height="50px">
                </template>
            </el-table-column>
            <el-table-column prop="brand_desc" label="品牌描述" ></el-table-column>
            <el-table-column label="状态" >
                <template scope="scope">
                    <el-switch @change="statusChange(scope.row)" v-model="scope.row.status" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="禁用"></el-switch>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" >
            <el-form :model="editForm" :rules="Rules" ref="editForm" label-width="100px">
                <el-form-item label="品牌名称" prop="brand_name">
                    <el-input v-model="editForm.brand_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="telephone">
                    <el-input v-model="editForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌网站" prop="brand_web">
                    <el-input v-model="editForm.brand_web" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌logo" prop="brand_logo">
                    <el-input v-model="editForm.brand_logo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="weight">
                    <el-input v-model="editForm.weight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述">
                        <el-input type="textarea" v-model="editForm.brand_desc"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editSubmit" :loading="editLoading">提交</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" :rules="Rules" ref="addForm" label-width="100px">
                <el-form-item label="品牌名称" prop="brand_name">
                    <el-input v-model="addForm.brand_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="telephone">
                    <el-input v-model="addForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌网站" prop="brand_web">
                    <el-input v-model="addForm.brand_web" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌logo" prop="brand_logo">
                    <el-input v-model="addForm.brand_logo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="weight">
                    <el-input v-model="addForm.weight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                     <el-radio-group v-model="addForm.status">
                     <el-radio class="radio" :label="0">禁用</el-radio>
                    <el-radio class="radio" :label="1">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" prop="brand_desc">
                        <el-input type="textarea" v-model="addForm.brand_desc"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>

import api from '../api/api';

export default{
    data() {
        return {
            brandsList: [],
            filters: {
                brand_name: ''
            },
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            //编辑界面数据
            editForm: {},

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            Rules: {
                brand_name: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' }
                ],
                brand_web: [
                    { required: true, message: '请输入品牌网址', trigger: 'blur' }
                ],
                brand_logo: [
                    { required: true, message: '请输入品牌logo', trigger: 'blur' }
                ],
                brand_desc: [
                    { required: true, message: '请输入品牌简介', trigger: 'blur' }
                ],
                status: [
                    { type: 'number', required: true, message: '品牌状态必须为数字', trigger: 'change'}
                ],
                weight: [
                    { type: 'number', required: true, message: '排序必须为数字', trigger: 'blur'}

                ],
            },
            //新增界面数据
            addForm: {
                status: 0,
                weight: 0
            }
        }
    },
    mounted() {
        this.getBrands();
    },
    methods: {
        getBrands() {
            let para = {
                    page: this.page,
                    brand_name: this.filters.brand_name
                };
            this.listLoading = true;
            api.get(`/goodsBrands`, para)
                .then((res) => {
                this.total = res.data.meta.pagination.total;
                this.brandsList = res.data.data;
                this.listLoading = false;
            })
            .catch(function (error) {
                api.reqFail(that, error);
            });
        },

        // 翻页
        handleCurrentChange(val) {
            this.page = val;
            this.getBrands();
        },

        //启用禁用
        statusChange(row) {
            let msg = row.status ? '启用' : '禁用';
            let status = row.status ? 1 : 0;
            this.$confirm('确定要'+msg+'吗', '提示', {type: 'warning'}).then(() => {
                let para = Object.assign({'status': status});
                    api.patch('/goodsBrands/' + row.brand_id, para).then((res) => {
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.getBrands();
                        })
                    .catch(function(error) {
                        console.log(error);
                    });
            })
            .catch(() => {
                this.getBrands();
            });
        },

        //显示新增界面
        handleAdd: function () {
            this.addFormVisible = true;
        },
        addSubmit() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        api.post('/goodsBrands', para).then((res) => {
                                this.editLoading = false;
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs.addForm.resetFields();
                                this.addFormVisible = false;
                                this.getBrands();
                            })
                        .catch(function(error) {
                            this.addLoading = false;
                            console.log(error);
                        });
                    });
                }
            });
        },
        //显示编辑界面
        handleEdit: function (row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            this.editForm.status = row.status ? 1 : 0;
        },
        //编辑
        editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        let para = Object.assign({}, this.editForm);
                        api.put('/goodsBrands/' + this.editForm.brand_id, para).then((res) => {
                                this.editLoading = false;
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getBrands();
                            })
                            .catch(function(error) {
                                api.reqFail(that, error);
                                console.log(error);
                            });
                    });
                }
            });
        },
        handleDel(row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
            }).then(() => {
                this.listLoading = true;
                api.delete('/goodsBrands/' + row.brand_id).then((res) => {
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getBrands();
                })
                .catch(function(error) {
                    console.log(error);
                });
            }).catch(() => {

            });
        },
        //批量删除
        batchRemove() {

        },
        //选择
        handleSelectionChange(sels) {
            this.sels = sels;
        },
    }
}
</script>