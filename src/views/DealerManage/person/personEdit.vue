<template>
    <el-container class="personAdd" v-loading="loading">
        <el-header class="header">
            <span>人员编辑</span>
        </el-header>
        <el-main style="overflow:auto">
            <div class="main-content" style="margin:20px">
                <!-- 基本信息 -->
                <el-row class="secondTitle"> 基本信息</el-row>
                <el-row class="el_row">
                    <el-col class="el-col-test" :span="2"><span class="red">*</span>所在单位:</el-col>
                    <el-col :span="4">
                        <el-input v-model="form.organizationName" maxlength="30" disabled autocomplete="off" size="mini"/>
                    </el-col>
                    <el-col class="el-col-test" :span="2"><span class="red">*</span>姓名:</el-col>
                    <el-col :span="4">
                        <el-input v-model="form.userName" maxlength="30" autocomplete="off" size="mini" placeholder="本单位不可重复"/>
                    </el-col>
                    <el-col class="el-col-test" :span="2"><span class="red">*</span>手机号:</el-col>
                    <el-col :span="4">
                        <el-input v-model="form.mobile" maxlength="11" autocomplete="off" @input="handlemoney($event,'mobile')" size="mini" placeholder="请输入手机号"/>                    
                    </el-col>
                    <el-col class="el-col-test" :span="2"><span class="red">*</span>身份证号:</el-col>
                    <el-col :span="4">
                        <el-input v-model="form.idCard" maxlength="18" autocomplete="off" @input="handlemoney($event,'idCard',3)" size="mini" placeholder="请输入身份证号"/>
                    </el-col>
                </el-row>
                <el-row class="el_row">
                    <el-col class="el-col-test" :span="2">性别:</el-col>
                    <el-col :span="4">
                        <el-select v-model="form.sex" size="mini" placeholder="请选择">
                            <el-option label="男" :value="1"/>
                            <el-option label="女" :value="2"/>
                        </el-select>
                    </el-col>
                    <el-col class="el-col-test" :span="2">出生日期:</el-col>
                    <el-col :span="4">
                        <el-date-picker v-model="form.dateBirth" size="mini" type="date" placeholder="选择日期" style="width:100%"/>
                    </el-col>
                    <el-col class="el-col-test" :span="2">学历:</el-col>
                    <el-col :span="4">
                        <el-select v-model="form.educationBackground" size="mini" placeholder="请选择">
                            <el-option label="初中" value="初中"/>
                            <el-option label="高中" value="高中"/>
                            <el-option label="中专" value="中专"/>
                            <el-option label="大专" value="大专"/>
                            <el-option label="本科" value="本科"/>
                            <el-option label="硕士及以上" value="硕士及以上"/>
                        </el-select>
                        <!-- <el-input v-model="form.educationBackground" maxlength="30" autocomplete="off" size="mini" placeholder="请输入学历"/>                     -->
                    </el-col>
                    <el-col class="el-col-test" :span="2">工作年限:</el-col>
                    <el-col :span="4">
                        <el-input v-model="form.yearsWork" maxlength="2" autocomplete="off" @input="handlemoney($event,'yearsWork')" size="mini" placeholder="请输入工作年限"/>
                    </el-col>
                </el-row>
                <el-row class="el_row">
                    <el-col class="el-col-test" :span="2">入职时间:</el-col>
                    <el-col :span="4">
                        <el-date-picker v-model="form.entryTime" size="mini" type="date" placeholder="选择日期" style="width:100%"/>
                    </el-col>
                    <el-col class="el-col-test" :span="2"><span class="red">*</span>工号:</el-col>
                    <el-col :span="4">
                        <el-input v-model="form.jobNumber" maxlength="30" autocomplete="off" size="mini" placeholder="请输入工号"/>
                    </el-col>
                    <el-col class="el-col-test" :span="2">当前岗位:</el-col>
                    <el-col :span="4">
                        <el-select v-model="form.postId" size="mini" placeholder="请选择">
                            <el-option v-for="item in jobList" :label="item.name" :value="item.id" :key="item.id"/>
                        </el-select>                  
                    </el-col>
                </el-row>
                <el-row class="el_row">
                    <el-col class="el-col-test" :span="2">证件照:</el-col>
                    <el-col :span='20'>
                        <Uploadfile :echoImg="echopersonImage" intoFormName='personPhoto' removeEchoName="echopersonImage" @getImgInfo="getImgInfo" @removeImgUrl="removeImgUrl"/>
                    </el-col>
                </el-row>
                <!-- 工作经历 -->
                <el-row class="secondTitle">
                    工作经历
                    <el-button type='primary' style='margin-left:20px' @click="addDialog=true">添加</el-button>
                </el-row>
                <div class="jobStyle">
                    <el-row  v-for="(item,index) in workList" :key='index' :gutter='20'>
                        <el-col :span="6">
                            <span v-text="item.wrokTimeStr"/>
                        </el-col>
                        <el-col :span="8">
                            <span v-text='item.compan'></span>
                        </el-col>
                        <el-col :span="5">
                            <span v-text="item.jobName"></span>(
                            <span v-if='item.remark' v-text="item.remark"></span>)
                        </el-col>
                        <el-col :span="5" class="right">
                            <span @click="item.open=!item.open" class="togoleIcon">
                                <i :class="item.open?'el-icon-arrow-right':'el-icon-arrow-down'" ></i>
                            </span>
                            <el-button type='primary' @click="editDialog=true,editIndex=index">编辑</el-button>
                            <el-button type='primary' @click="jobDel(index)">删除</el-button>
                        </el-col>
                        <el-col :span="24" v-show="item.open">
                            <span>工作内容:</span>
                            <span v-text="item.jobContent"></span>
                        </el-col>
                    </el-row>
                </div>
                <!-- 资质证书 -->
                <el-row class="secondTitle">
                    资质证书
                </el-row>
                <div class='selectStyle'>
                    <el-row>
                        <el-col class="el-col-test" :span="3">厂家资质证书:</el-col>
                            <Uploadfile :echoImg="echofactoryImage" intoFormName='factoryPhoto' removeEchoName="echofactoryImage" @getImgInfo="getImgInfo" @removeImgUrl="removeImgUrl"/>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px;">
                        <el-col class="el-col-test" :span="3">第三方资质证书:</el-col>
                        <el-col :span='20'>
                            <Uploadfile :echoImg="echothreeImage" intoFormName='threePhoto' removeEchoName="echothreeImage" @getImgInfo="getImgInfo" @removeImgUrl="removeImgUrl"/>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px;">
                        <el-col class="el-col-test" :span="3">其他证书:</el-col>
                        <el-col :span='20'>
                            <Uploadfile :echoImg="echootherImage" intoFormName='otherPhoto' removeEchoName="echootherImage" @getImgInfo="getImgInfo" @removeImgUrl="removeImgUrl"/>
                        </el-col>
                    </el-row>
                </div>
                <!-- 提交保存 -->
                <div class='page-box'>
                    <el-row>
                        <el-button type="primary" @click="saveCheck">提交</el-button>
                        <el-button @click="close">关闭</el-button>
                    </el-row>
                </div>
            </div>
            <!-- 添加工作经历 -->
            <el-dialog title='添加工作经历' :visible.sync='addDialog' width="40%">
                <el-form>
                    <el-form-item  label="开始时间:" label-width="120px" :required="true">
                        <el-date-picker class="w9" type='date' size='small' v-model='addjobLog.startTime' placeholder="请选择开始时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item  label="结束时间:" label-width="120px" :required="true">
                        <el-date-picker type='date' :disabled="addjobLog.toToday" size='small' v-model='addjobLog.endTime' style="width:70%" placeholder="请选择结束时间"></el-date-picker>
                        <el-checkbox v-model='addjobLog.toToday'>至今</el-checkbox>
                    </el-form-item>
                    <el-form-item  label="单位名称:" label-width="120px" :required="true">
                        <el-input class="w9" size='small' v-model='addjobLog.compan' placeholder="请输入单位名称"></el-input>
                    </el-form-item>
                    <el-form-item  label="岗位:" label-width="120px" :required="true">
                        <el-select class="w9" v-model="addjobLog.job" size="small" placeholder="请选择">
                            <el-option v-for="item in jobList" :label="item.name" :value="item.id" :key="item.id"/>
                        </el-select> 
                    </el-form-item>
                    <el-form-item  label="岗位备注:" label-width="120px" :required="true">
                        <el-input class="w9" size='small' v-model='addjobLog.remark' placeholder="请输入岗位备注"></el-input>
                    </el-form-item>
                    <el-form-item  label="工作内容:" label-width="120px">
                        <el-input class="w9" type="textarea" size='small' v-model='addjobLog.jobContent' placeholder="请输入工作内容"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type='primary' @click="joblogSave">保存</el-button>
                    <el-button @click='addDialog=false'>取消</el-button>
                </div>
            </el-dialog>
            <!-- 编辑工作经历 -->
            <el-dialog title='编辑工作经历' :visible.sync='editDialog' width="40%">
                <el-form>
                    <el-form-item  label="开始时间:" label-width="120px" :required="true">
                        <el-date-picker class="w9" type='date' size='small' v-model='editjobLog.startTime' placeholder="请选择开始时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item  label="结束时间:" label-width="120px" :required="true">
                        <el-date-picker type='date' :disabled="editjobLog.toToday" size='small' v-model='editjobLog.endTime' style="width:70%" placeholder="请选择结束时间"></el-date-picker>
                        <el-checkbox v-model='editjobLog.toToday'>至今</el-checkbox>
                    </el-form-item>
                    <el-form-item  label="单位名称:" label-width="120px" :required="true">
                        <el-input class="w9" size='small' v-model='editjobLog.compan' placeholder="请输入单位名称"></el-input>
                    </el-form-item>
                    <el-form-item  label="岗位:" label-width="120px" :required="true">
                        <el-select class="w9" v-model="editjobLog.job" size="small" placeholder="请选择">
                            <el-option v-for="item in jobList" :label="item.name" :value="item.id" :key="item.id"/>
                        </el-select> 
                    </el-form-item>
                    <el-form-item  label="岗位备注:" label-width="120px" :required="true">
                        <el-input class="w9" size='small' v-model='editjobLog.remark' placeholder="请输入岗位备注"></el-input>
                    </el-form-item>
                    <el-form-item  label="工作内容:" label-width="120px">
                        <el-input class="w9" type="textarea" size='small' v-model='editjobLog.jobContent' placeholder="请输入工作内容"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type='primary' @click="jobEditSave">保存</el-button>
                    <el-button @click='editDialog=false'>取消</el-button>
                </div>
            </el-dialog>
            
        </el-main>
    </el-container>
</template>
<script>
import Vue from 'vue';
import Uploadfile from '@/components/person/personUpload'
export default {
    components: { Uploadfile },
    data(){
        return {
            id: '',
            editIndex: 0, //编辑的工作经历Index
            form: {
                organizationId: '',
                organizationName: '',
                userName: '',
                mobile: '',
                idCard: '',
                sex: '',
                dateBirth: '',
                educationBackground: '',
                yearsWork: '',
                entryTime: '',
                jobNumber: '',
                postId: '',
                postName: '',
                identificationPhoto: '',
                manufacturerQualificationCertificate: '',
                thirdPartyQualificationCertificate: '',
                otherCertificates: '',
                file: {},
                account: '',
                roleIdList: [],
                workExperience: ''
            },
            // 添加工作经历
            addjobLog: {
                wrokTimeStr: '', // 开始时间-结束时间  时间段
                startTime: '', // 开始时间
                endTime: '', // 结束时间
                toToday: false, // 至今
                compan: '', // 单位名称
                job: '', // 岗位
                remark: '', // 岗位备注
                jobContent: '', // 工作内容
                open: false // 展开状态
            },
            // 编辑工作经历
            editjobLog: {
                wrokTimeStr: '', // 开始时间-结束时间  时间段
                startTime: '', // 开始时间
                endTime: '', // 结束时间
                toToday: false, // 至今
                compan: '', // 单位名称
                job: '', // 岗位
                remark: '', // 岗位备注
                jobContent: '', // 工作内容
                open: false // 展开状态
            },
            dialogVisible: false,//大图显隐
            dialogImageUrl: '',//大图
            personPhoto: [],//证件照
            factoryPhoto: [],//厂家资质证书
            threePhoto: [],//第三方资质证书
            otherPhoto: [],//其他证书
            echopersonImage: [],// 证件照回显
            echofactoryImage: [],// 厂家资质证书回显
            echothreeImage: [],// 第三方资质证书回显
            echootherImage: [],// 其他证书回显
            jobList: [], // 岗位下拉
            roleOptions: [], //角色下拉
            // 工作经历
            workList: [],
            // dialog
            loading: false,
            addDialog: false, // 新增工作经历
            editDialog: false, //编辑工作经历
            toToday: false,//至今
        }
    },
    watch: {
        addDialog(val) { // 添加工作经历
            if (val == false) {
                this.addjobLog = {
                    wrokTimeStr: '', // 开始时间-结束时间  时间段
                    startTime: '', // 开始时间
                    endTime: '', // 结束时间
                    toToday: false, // 至今
                    compan: '', // 单位名称
                    job: '', // 岗位
                    remark: '', // 岗位备注
                    jobContent: '', // 工作内容
                    open: false
                }
            }
        },
        editDialog(val) { // 编辑工作经历
            if (val) {
                let data = this.workList[this.editIndex]
                this.editjobLog = {
                    wrokTimeStr: '', // 开始时间-结束时间  时间段
                    startTime: data.startTime, // 开始时间
                    endTime: data.endTime, // 结束时间
                    toToday: data.toToday, // 至今
                    compan: data.compan, // 单位名称
                    job: data.job, // 岗位
                    remark: data.remark, // 岗位备注
                    jobContent: data.jobContent, // 工作内容
                    open: false
                }
            } else {
                this.editjobLog = {
                    wrokTimeStr: '', // 开始时间-结束时间  时间段
                    startTime: '', // 开始时间
                    endTime: '', // 结束时间
                    toToday: false, // 至今
                    compan: '', // 单位名称
                    job: '', // 岗位
                    remark: '', // 岗位备注
                    jobContent: '', // 工作内容
                    open: false
                }
            }
        },
        "addjobLog.toToday"(val) {
            if (val==true) {
                this.addjobLog.endTime = ''
            }
        },
        "editjobLog.toToday"(val) {
            if (val==true) {
                this.editjobLog.endTime = ''
            }
        }
    },
    created() {
        this.id = this.$route.query.id
    },
    mounted() {
        this.getQuserySystemPostDealersList() // 获取岗位下拉
        this.querySystemRoleDealersList() // 角色下拉
        this.echo() // 回显
    },
    methods:{
        // 回显
        echo() {
            this.loading = true
            this.$axios.post(this.pathItem.queryDealerUserInById,{
                id: this.id
            })
            .then(res=>{
                this.loading = false
                if(res.code == 0){
                    this.form.organizationId = res.result.organizationId?res.result.organizationId:''
                    this.form.organizationName = res.result.thisCompany?res.result.thisCompany:''
                    this.form.userName = res.result.userName?res.result.userName:''
                    this.form.mobile = res.result.mobile?res.result.mobile:''
                    this.form.idCard = res.result.idCard?res.result.idCard:''
                    this.form.sex = res.result.sex?res.result.sex:''
                    this.form.dateBirth = res.result.dateBirth?res.result.dateBirth:''
                    this.form.educationBackground = res.result.educationBackground?res.result.educationBackground:''
                    this.form.yearsWork = res.result.yearsWork?res.result.yearsWork:''
                    this.form.entryTime = res.result.entryTime?res.result.entryTime:''
                    this.form.jobNumber = res.result.jobNumber?res.result.jobNumber:''
                    this.form.postId = res.result.postId?res.result.postId:''
                    this.form.account = res.result.account?res.result.account:''
                    this.workList = res.result.workExperience?JSON.parse(res.result.workExperience):[]
                    if (res.result.identificationPhoto) {
                        this.echopersonImage = (res.result.identificationPhoto).split(',') //证件照
                    }
                    if (res.result.manufacturerQualificationCertificate) {
                        this.echofactoryImage = (res.result.manufacturerQualificationCertificate).split(',') //厂家资质证书
                    }
                    if (res.result.thirdPartyQualificationCertificate) {
                        this.echothreeImage = (res.result.thirdPartyQualificationCertificate).split(',') //第三方资质证书
                    }
                    if (res.result.otherCertificates) {
                        this.echootherImage = (res.result.otherCertificates).split(',') //其他证书
                    }
                }else{
                    this.errorMsg(res.message)
                }
            })
        },
        // 获取岗位
        getQuserySystemPostDealersList() {
            this.$axios.post(this.pathItem.quserySystemPostDealersList,{})
            .then(res=>{
                if(res.code == 0){
                    this.jobList = res.result.systemPostDealersList
                }else{
                    this.errorMsg(res.message)
                }
            })
        },
        // 角色下拉
        querySystemRoleDealersList() {
            this.$axios.post(this.pathItem.querySystemRoleDealersList,{})
            .then(res=>{
                if(res.code == 0){
                    this.roleOptions = res.result.systemRoleDealersList
                }else{
                    this.errorMsg(res.message)
                }
            })
        },
        uploadImgchange(file, fileList) {
            this.form.file = []
            fileList.forEach(ele => {
            this.form.file.push( ele )
            })
        },
        removeImgchange(file, fileList) {
            this.form.file = []
            fileList.forEach(ele => {
            this.form.file.push( ele )
            })
        },
        uploadrequest() {
            console.log(12)
        },
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 工作经历保存
        joblogSave() {
            if (
                this.addjobLog.startTime == ''||
                (this.addjobLog.endTime == '' && this.addjobLog.toToday == false) ||
                this.addjobLog.job == ''||
                this.addjobLog.remark == ''
            ) {
                this.errorMsg("请填写必填项")
                return;
            }
            let wrokTimeStr = ''
            let jobName = ''
            // 工作日期
            if (this.addjobLog.toToday) {
                wrokTimeStr = this.timestampToTime(this.addjobLog.startTime) +'--至今'
            } else {
                wrokTimeStr = this.timestampToTime(this.addjobLog.startTime) +'--'+ this.timestampToTime(this.addjobLog.endTime)
            }
            // 岗位名称
            this.jobList.forEach( item => {
                if (item.id == this.addjobLog.job) {
                    jobName = item.name
                }
            })
            this.workList.push({
                wrokTimeStr: wrokTimeStr, // 开始时间-结束时间  时间段
                startTime: this.timestampToTime(this.addjobLog.startTime), // 开始时间
                endTime: this.timestampToTime(this.addjobLog.endTime), // 结束时间
                toToday: this.addjobLog.toToday, // 至今
                compan: this.addjobLog.compan, // 单位名称
                job: this.addjobLog.job, // 岗位
                jobName: jobName, // 岗位名称
                remark: this.addjobLog.remark, // 岗位备注
                jobContent: this.addjobLog.jobContent, // 工作内容
                open: false
            })
            this.addDialog = false
        },
        // 编辑保存工作经历
        jobEditSave(){
            if (
                this.editjobLog.startTime == ''||
                (this.editjobLog.endTime == '' && this.editjobLog.toToday == false) ||
                this.editjobLog.job == ''||
                this.editjobLog.remark == ''
            ) {
                this.errorMsg("请填写必填项")
                return;
            }
            let wrokTimeStr = ''
            let jobName = ''
            // 工作日期
            if (this.editjobLog.toToday) {
                wrokTimeStr = this.timestampToTime(this.editjobLog.startTime) +'--至今'
            } else {
                wrokTimeStr = this.timestampToTime(this.editjobLog.startTime) +'--'+ this.timestampToTime(this.editjobLog.endTime)
            }
            // 岗位名称
            this.jobList.forEach( item => {
                if (item.id == this.editjobLog.job) {
                    jobName = item.name
                }
            })
            this.workList[this.editIndex].wrokTimeStr = wrokTimeStr
            this.workList[this.editIndex].startTime = this.timestampToTime(this.editjobLog.startTime)
            this.workList[this.editIndex].endTime = this.timestampToTime(this.editjobLog.endTime)
            this.workList[this.editIndex].toToday = this.editjobLog.toToday
            this.workList[this.editIndex].compan = this.editjobLog.compan
            this.workList[this.editIndex].job = this.editjobLog.job
            this.workList[this.editIndex].jobName = jobName
            this.workList[this.editIndex].remark = this.editjobLog.remark
            this.workList[this.editIndex].jobContent = this.editjobLog.jobContent
            this.workList[this.editIndex].open = false
            this.editDialog = false
        },
        // 删除工作经历
        jobDel(index){
            this.workList.splice(index,1)
        },
        // 获取上传的图片信息
        getImgInfo(obj) {
            let name = obj.intoFormName // 将上传的图片file 存到 name里
            let Fileinfo = obj.fileList // 上传的图片fileList
            if (Fileinfo.length > 0){
                this[name] = []
                Fileinfo.forEach( item=> {
                    if (item.name != '1') { //将新添加的图片 添加到 this[name]里
                    this[name].push( item.raw )
                    }
                })
            }
        },
        // 如果删除回显照片
        removeImgUrl(obj) {
            let removeUrl = obj.url // 要删除的url
            let removeEchoName = obj.removeEchoName // 要删除 叫removeEchoName 的 数组里的url
            let removeIndex = this[removeEchoName].indexOf(removeUrl)
            this[removeEchoName].splice(removeIndex,1)
        },
        // 上传图片
        async imagesUpload(name,params) { // name 区分上传的是哪类图片  params 保存时要传给后台的参数名字
            this.loading = true
            let formData = new FormData()
            this[name].forEach( item => {
                formData.append('multipartFiles',item)
            })
            let isSuccess = false // 接口是否已成功返回
            await this.$axios.post(this.pathItem.imagesUpload, formData).then((res) => {
                if (res.code == 0) {
                    isSuccess = true
                    let urlList = res.result.map( item => {
                        return item.objectUrl
                    })
                    if (name == 'personPhoto') { // 证件照
                        if (this.echopersonImage.length > 0) { // 将回显的图片 与 上传的图片 合并
                            urlList = urlList.concat(this.echopersonImage) 
                        }
                    }
                    if (name == 'factoryPhoto') { // 厂家资质证书
                        if (this.echofactoryImage.length > 0) { // 将回显的图片 与 上传的图片 合并
                            urlList = urlList.concat(this.echofactoryImage) 
                        }
                    }
                    if (name == 'threePhoto') { // 第三方资质证书
                        if (this.echothreeImage.length > 0) { // 将回显的图片 与 上传的图片 合并
                            urlList = urlList.concat(this.echothreeImage) 
                        }
                    }
                    if (name == 'otherPhoto') { // 其他证书
                        if (this.echootherImage.length > 0) { // 将回显的图片 与 上传的图片 合并
                            urlList = urlList.concat(this.echootherImage) 
                        }
                    }
                    this.form[params] = urlList.join()
                } else {
                    this.loading = false
                    this.errorMsg(res.message)
                }
                }).catch( res => {
                    this.loading = false
                    this.errorMsg('上传失败')
                })
                return isSuccess;
        },
        // 添加检查
        saveCheck() {
            if (
                this.form.organizationName == ''||
                this.form.userName == ''||
                this.form.mobile == ''||
                this.form.idCard == ''||
                this.form.jobNumber == ''
            ) {
                this.errorMsg("请填写必填项")
                return;
            }
            if (this.form.idCard.length < 18) {
                this.errorMsg("身份证请输入18位")
                return;
            }
            this.imagesUpload('personPhoto','identificationPhoto').then(res1 => { // 证件照
                if (res1) {
                    this.imagesUpload('factoryPhoto','manufacturerQualificationCertificate').then(res2 => { // 厂家资质证书
                        if (res2) {
                            this.imagesUpload('threePhoto','thirdPartyQualificationCertificate').then(res3 => { // 第三方资质证书
                                if (res3) {
                                    this.imagesUpload('otherPhoto','otherCertificates').then(res4 => { // 其他证书
                                        if (res4) {
                                            this.save()
                                        }
                                    })
                                }
                            })
                        }
                    }) 
                }
            }) 
        },
        // 保存
        save() {
            if (this.form.dateBirth != '') {
                this.form.dateBirth = this.timestampToTime(this.form.dateBirth)
            }
            if (this.form.entryTime != '') {
                this.form.entryTime = this.timestampToTime(this.form.entryTime)
            }   
            if (this.workList.length>0) {
                this.form.workExperience = JSON.stringify(this.workList)
            }
            this.jobList.forEach( item => {
                if (item.id == this.form.postId) {
                    this.form.postName = item.name
                }
            })
            this.form.thisCompany = this.form.organizationName
            this.form.idCard = ( this.form.idCard ).toUpperCase() // 大写
            this.form.id = this.id
            this.loading = true
            this.$axios.post(this.pathItem.updateupDealerUserInfo,this.form).then(res => {
                this.loading = false
                if (res.code == 0) {
                    this.successMsg("编辑成功")
                    let personEdit = {
                        name: "personEdit",
                    };
                    this.$store.dispatch("delVisitedViews", personEdit).then(() => {
                        this.$router.back();
                    });
                } else {
                    this.errorMsg(res.message)
                }   
            })
        },
        // 限制数字
        handlemoney(eve, name, type) {
            let neweve = eve.replace(/[^\d.]/g, "") //电话号 (只能数字) 
            if (type == 3) { neweve = eve.replace(/[^\w]/g,'') } // 身份证号  (只能输入字母与数字) 
            if (type==1 && neweve>100) { this.form[name] = '100'; return; }
            if (type==2 && neweve>100000000) { this.form[name] = '100000000'; return; }
            this.form[name] = neweve
        },
        // 时间戳转换时间
        timestampToTime(t) {
            if (t == null || t == '') {
            return ''
            }
            var date = new Date(t) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + "-"
            var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
            var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
            // var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours() + ":"
            // var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() + ":"
            // var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
            return Y + M + D;
        },
        // 关闭
        close() {
            let personEdit = {
                name: "personEdit",
            };
            this.$store.dispatch("delVisitedViews", personEdit).then(() => {
                this.$router.back();
            });
        },
        // 错误提醒	
        errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
        // 成功提醒	
        successMsg(msg) {this.$message({message:msg, type:'success'})}}
}
</script>
<style lang="scss" scoped>
.personAdd{
  background: #fff;
  & /deep/ textarea{
    resize: none !important;
  }
  & /deep/  .el-input.is-disabled .el-input__inner {
    color: #000000;
  }
  .main-content {
    padding: 15px 30px;
    margin-bottom: 10px;
    font-size: 13px;
    .el-col-test {
      padding-right: 10px;
      text-align: right;
    }
  }
}
.el_row{
    line-height: 30px;
    margin-bottom: 10px;
}
.inlineB{
    display: inline-block;
    vertical-align: top;
    font-size: 0;
}
/* 工作经历样式 */
.jobStyle{
    padding: 10px;
}
.jobStyle .el-row{
    padding: 10px 0 20px 20px;
}
.jobStyle span{
    line-height: 40px;
}
.jobStyle .el-button{
    margin-left:12px;
}
.jobStyle .togoleIcon{
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
}
.jobStyle .right{
    text-align: right;
}
/* 弹出框样式 */
.dialogStyle .el-row{
    display: flex;
    justify-content:center;
    flex-wrap: wrap;
    padding: 10px;
}
.roleDialog .el-row{
    flex-wrap: wrap;
    padding: 10px;
}
.roleDialog.el-row span,
.dialogStyle .el-row span{
    display: inline-block;
    width: 100px;
}
.dialogStyle .el-input,   
.dialogStyle .el-select{
    width:240px;
}
.roleDialog .el-button
.dialogStyle .el-button{
    margin: 10px 20px 0;
}
.roleDialog .el-checkbox{
    width: 120px;
    margin: 10px 20px;
}
/* 图片下备注样式 */
.imgbak >>> .el-upload-list--picture-card .el-upload-list__item{
    overflow: visible;
}
.imgbak >>> .el-upload-list__item{
    margin-bottom: 40px;
}
.imgbak >>> .inputBak{
	margin-left: -1px;
    width: 145px;
}
.red {
    color: red;
}
.w9{
  width: 90%;
}
</style>