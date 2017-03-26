<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
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
            <el-table-column prop="brand_name" label="品牌名称" sortable  width="180"> </el-table-column>
            <el-table-column prop="telephone" label="联系电话"  width="180"> </el-table-column>
            <el-table-column prop="brand_web" label="品牌网站" ></el-table-column>
            <el-table-column prop="brand_logo" label="品牌logo" ></el-table-column>
            <el-table-column prop="brand_desc" label="品牌描述" ></el-table-column>
            <el-table-column prop="status" label="状态" ></el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="品牌名称">
                    <el-input v-model="editForm.brand_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="editForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌网站">
                    <el-input v-model="editForm.brand_web" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌logo">
                    <el-input v-model="editForm.brand_logo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌描述" prop="brand_name">
                    <el-input v-model="editForm.brand_desc" auto-complete="off"></el-input>
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

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>

import {getGoodsBrands, updateBrands} from '../api/api';

export default{
    data() {
        return {
            brandsList: [],
            filters: {
                name: ''
            },
            users: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列

            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ]
            },
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                sex: -1,
                age: 0,
                birth: '',
                addr: ''
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ]
            },
            //新增界面数据
            addForm: {
                name: '',
                sex: -1,
                age: 0,
                birth: '',
                addr: ''
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
                    name: this.filters.name
                };
                this.listLoading = true;
                getGoodsBrands(para).then((res) => {
                    this.total = res.data.meta.pagination.total;
                    this.brandsList = res.data.data;
                    this.listLoading = false;
                });
        },

        // 翻页
        handleCurrentChange(val) {
            this.page = val;
            this.getBrands();
        },

        //显示新增界面
        handleAdd: function () {
            this.addFormVisible = true;
            this.addForm = {
                name: '',
                sex: -1,
                age: 0,
                birth: '',
                addr: ''
            };
        },

        batchRemove() {

        },

        handleSelectionChange(sels) {
            this.sels = sels;
        },

        //显示编辑界面
        handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },

        handleDel() {
            this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
            }).then(() => {
                this.listLoading = true;
            }).catch(() => {

            });
        },

        addSubmit() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;

                    });
                }
            });
        },
        //编辑
        editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {

                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editForm.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbHVtZW4uYXBwL2FwaS9hdXRob3JpemF0aW9ucyIsImlhdCI6MTQ5MDQ2NDU1NSwiZXhwIjoxNDkwNDY4MTU1LCJuYmYiOjE0OTA0NjQ1NTUsImp0aSI6InZMZ2hjUnBxZDRXVG85b0IiLCJzdWIiOm51bGx9.I4xEbAuIJtVAGAD2rJ1xk6GdqaH4rREYlBDYMg-ULmg';
                        let para = Object.assign({}, this.editForm);
                        console.log(para);
                        updateBrands(para).then((res) => {
                                this.editLoading = false;
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getBrands();
                            });
                    });
                }
            });
        }
    }
}
</script>