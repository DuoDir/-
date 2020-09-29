<template>
    <div>
        <el-upload
            class="pictureCard"
            action="#"
            list-type="picture-card"
            :on-change="uploadImgchange"
            :on-remove="removeImgchange"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeUpload"
            :http-request="uploadrequest"
            :on-exceed="exceed"
            :file-list="echoFile"
            :multiple="ifmultiple"
            :limit="limitNum"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- 放大图片模态框 -->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        limitNum: { // 上传张数
            type: Number,
            default: 100
        },
        ifmultiple: { // 是否支持多选
            type: Boolean,
            default: true
        },
        echoImg: { // 要回显的图片
            type: Array,
            default: function() {
                return [];
            }
        },
        intoFormName: { // 将上传好的图片 存到父组件data中 - 参数叫 intoFormName 的里面  2.用来判断是哪个图片入口
            type: String,
            default: ''
        },
        removeEchoName: { // 用来判断删除哪个图片入口的回显数组
            type: String,
            default: ''
        }
    },
    data(){
        return {
            SuccessFileList: [], // 已上传文件list
            echoFile: [], // 回显的list
            dialogImageUrl: '', // 放大图片地址
            dialogVisible: false //放大图片模态框
        }
    },
    watch: {
        SuccessFileList(val) { // 已上传文件list
            this.$emit('getImgInfo',{fileList: val,intoFormName: this.intoFormName}) // 将图片信息传给父组件
        },
        echoImg(val) { // 回显的图片
            if (val.length > 0) {
                this.echoFile = []
                val.forEach( item => {
                    this.echoFile.push({
                        url: item,
                        name: '1' // 1代表是 回显的图片
                    })
                })
            }
        }
    },
    mounted() {
        // console.log(this.intoFormName)
    },
    methods: {
        // 上传文件
        uploadImgchange(file, fileList) {
            this.SuccessFileList = fileList.map( ele => {
                return ele
            })
        },
        // 删除文件
        removeImgchange(file, fileList) {
            this.SuccessFileList = fileList.map( ele => {
                return ele
            })
            if (!file.raw) {  // 如果删除的是 回显的图片  就调用父组件removeImgUrl方法
                this.$emit('removeImgUrl',{url: file.url, removeEchoName: this.removeEchoName})
            }
        },
        // 覆盖默认上传  自定义上传
        uploadrequest() {
            // console.log("uploadrequest")
        },
        // 上传前限制
        beforeUpload(file) {
            console.log(file.type)
            let isJPG = ['image/jpeg','image/jpg','image/png']
            if (isJPG.indexOf(file.type) == -1) {
                this.$message.error('上传头像图片只能是 jpg,jpeg,png 格式!')
                return false
            }
            console.log(isJPG.indexOf(file.type))
            // const isLt2M = file.size / s1024 / 1024 < 2;
            // if (!isLt2M) {
            // this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            // return isJPG;
        },
        // 放大图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 超出限制
        exceed() {
            this.errorMsg(`最多可上传${this.limitNum}个文件`)
        },
        // 错误提醒	
        errorMsg(msg) {this.$alert(msg, '提示', {confirmButtonText: '确定',type:'warning',})},
        // 成功提醒	
        successMsg(msg) {this.$message({message:msg, type:'success'})}
    }
}
</script>