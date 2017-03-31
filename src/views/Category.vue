<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.category_name" placeholder="分类名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getCategories">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="categories" border style="width: 100%" v-loading="listLoading"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="category_id" label="编号" width="180"> </el-table-column>
            <el-table-column prop="category_name" label="分类名称" width="180"> </el-table-column>
            <el-table-column prop="category_code" label="分类编码" width="180"> </el-table-column>
            <el-table-column label="品牌logo" >
                <template scope="scope">
                    <img v-bind:src="scope.row.category_logo" width="50px" height="50px">
                </template>
            </el-table-column>
            <el-table-column prop="parent_id" label="父级" ></el-table-column>
            <el-table-column prop="level" label="分类级别"  width="180"> </el-table-column>
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

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" :rules="Rules" ref="addForm" label-width="100px">
                <el-form-item label="分类名称" prop="category_name">
                    <el-input v-model="addForm.category_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类编码" prop="category_code">
                    <el-input v-model="addForm.category_code" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="logo" prop="category_logo">
                    <el-input v-model="addForm.category_logo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级" prop="parent_id">
                    <el-input v-model="addForm.parent_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="级别" prop="level">
                <el-select v-model="addForm.level" placeholder="请选择">
                    <el-option
                      v-for="level in levels"
                      :label="level.label"
                      :value="level.value">
                    </el-option>
                  </el-select>
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
              <el-form-item>
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="新增" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="Rules" ref="editForm" label-width="100px">
                <el-form-item label="分类名称" prop="category_name">
                    <el-input v-model="editForm.category_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类编码" prop="category_code">
                    <el-input v-model="editForm.category_code" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="logo" prop="category_logo">
                    <el-input v-model="editForm.category_logo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级" prop="parent_id">
                    <el-input v-model="editForm.parent_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="级别" prop="level">
                <el-select v-model="editForm.level" placeholder="请选择">
                    <el-option
                      v-for="level in levels"
                      :label="level.label"
                      :value="level.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="weight">
                    <el-input v-model="editForm.weight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                     <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="0">禁用</el-radio>
                        <el-radio class="radio" :label="1">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
              <el-form-item>
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>

         <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
import api from '../api/api';
export default{
    data() {
        return {
            categories: [],
            filters: {
                name: ''
            },
            that: this,
            levels:[
                {
                    value: '1',
                    label: '一级分类'
                },
                {
                    value: '2',
                    label: '二级分类'
                }
            ],
            users: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列

            Rules: {
                category_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ],
                category_code: [
                    { required: true, message: '请输入分类编码', trigger: 'blur'}
                ],
                category_logo: [
                    { required: true, message: '请输入logo', trigger: 'blur' }
                ],
                parent_id: [
                    { required: true, message: '请选择上级分类', trigger: 'blur' }
                ],
                level: [
                    { required: true, message: '请选择级别', trigger: 'change' }
                ],
                status: [
                    { type: 'number', required: true, message: '状态必须为数字', trigger: 'change'}
                ],
                weight: [
                    { type: 'number', required: true, message: '排序必须为数字', trigger: 'blur'}
                ]
            },

            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            //编辑界面数据
            editForm: {
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            //新增界面数据
            addForm: {
                status: 0,
                weight: 0
            }
        }
    },
    mounted() {
        this.getCategories();
    },
    methods: {
        getCategories() {
            let para = {
                page: this.page,
                category_name: this.filters.category_name
            };
            this.listLoading = true;
                api.get(`/goodsCategories`, para)
                    .then((res) => {
                    this.total = res.data.meta.pagination.total;
                    this.categories = res.data.data;
                    this.listLoading = false;
                })
                .catch(function (error) {
                    api.reqFail(this.that, error);
                });
        },

        // 翻页
        handleCurrentChange(val) {
            this.page = val;
            this.getCategories();
        },

        //启用禁用
        statusChange(row) {
            let msg = row.status ? '启用' : '禁用';
            let status = row.status ? 1 : 0;
            this.$confirm('确定要'+msg+'吗', '提示', {type: 'warning'}).then(() => {
                let para = Object.assign({'status': status});
                    api.patch('/goodsCategories/' + row.category_id, para).then((res) => {
                            api.reqSuccess(this.that, '提交成功');
                            this.getCategories();
                        })
                    .catch(function(error) {
                        api.reqFail(this.that, '提交成功');
                        console.log(error);
                    });
            })
            .catch(() => {
                this.getCategories();
            });
        },

        //显示新增界面
        handleAdd: function () {
            this.addFormVisible = true;
        },

        //添加
         addSubmit() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        api.post('/goodsCategories', para).then((res) => {
                                this.editLoading = false;
                                this.$notify({ });
                                this.$refs.addForm.resetFields();
                                this.addFormVisible = false;
                                this.getCategories();
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
        },

        //编辑
        editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {

                    });
                }
            });
        },

        // 删除
        handleDel() {
            this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
            }).then(() => {
                this.listLoading = true;
            }).catch(() => {

            });
        },

        handleSelectionChange(sels) {
            this.sels = sels;
        },

        //批量删除
        batchRemove() {

        },
    }
}
</script>