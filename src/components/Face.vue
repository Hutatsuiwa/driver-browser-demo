<template>
  <div class="page">
    <!-- 摄像头区域 -->
    <video :src="captureSrc" ref="capture" class="bg-black" height="395" autoplay></video>
    <h3>{{msg}}</h3>
    <input v-model="userId" placeholder="输入userId" />
    <div class="mb20">
      <button @click="invokingCamera()">开启摄像头</button>
      <button @click="registerFace()">注册人脸</button>
      <button @click="checkFace()">检测人脸</button>
      <button @click="closedCamera()">关闭摄像头</button>
    </div>
    <!-- 视频流截图 -->
    <canvas id="canvas" width="531" height="395"></canvas>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Face',
   data() {
    return {
      captureSrc: "123456",
      userId: "",
      msg: "请把脸伸过来，我瞅瞅(*^▽^*)"
    };
  },
  methods: {
    // 开启摄像头
    invokingCamera() {
      window.navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          {
            video: true,
            audio: false
          },
          this.getVideoStream,
          this.failToGet
        );
      } else {
        alert("您的浏览器不支持调用摄像头");
      }
    },
    // 关闭摄像头
    closedCamera() {
      this.$refs.capture.srcObject.getTracks()[0].stop();
    },
    getVideoStream(stream) {
      try {
        // chrome 新版本写法
        this.$refs.capture.srcObject = stream;
      } catch (error) {
        // chrome 旧版本写法
        this.captureSrc = window.URL && window.URL.createObjectURL(stream);
      }
    },
    failToGet(err) {
      console.log("error：", err);
    },
    checkText(){
      if(!this.userId){
        alert("请输入id")
        return false;
      }else{
        return true;
      }
    },
    registerFace() {
      // 创建画布绘制上下文
      if(!this.checkText()){
        return;
      }
      let canvas = document.getElementById('canvas');
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this.$refs.capture, 0, 0, 531, 395);
      //把当前canvas转化为base64
      const basePath = canvas.toDataURL();
      // 发送到服务端人脸识别校验
      axios.post('http://localhost:3000/baidu/register',{
          image:basePath,
          imageType:'BASE64',
          groupId:1,
          userId:this.userId
      }).then((response)=>{
        this.msg = "注册成功";
        console.log(response);
      }).catch((err)=>{
        console.log(err.response);
        this.msg = err.response.data.error_msg;
      });
    },
    checkFace() {
      if(!this.checkText()){
        return;
      }
      // 创建画布绘制上下文
      let canvas = document.getElementById('canvas');
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this.$refs.capture, 0, 0, 531, 395);
      //把当前canvas转化为base64
      const basePath = canvas.toDataURL();
      // 发送到服务端人脸识别校验
      axios.post('http://localhost:3000/baidu/match',{
          image:basePath,
          imageType:'BASE64',
          groupId:1,
          userId:this.userId
      }).then((res)=>{
        console.log(res);
        this.msg = "相似度:" + res.data.result.score;
      })
      .catch((err)=>{
        this.msg = err.response.data.error_msg;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
