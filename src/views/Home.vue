<template>
  <div>
    <h1>토스트 테스트</h1>
    <div>
      <v-btn @click="toastTest1">토스트 Info</v-btn>
      <v-btn @click="toastTest2">토스트 Success</v-btn>
      <v-btn @click="toastTest3">토스트 Error</v-btn>
      <v-btn @click="toastTest4">토스트 Warning</v-btn>
      <v-btn @click="toastTest5">전역 에러</v-btn>
    </div>
    <h1>프로그레스바 테스트</h1>
    <div>
      <v-btn @click="progressTest1">Start</v-btn>
      <v-btn @click="progressTest2">Finish</v-btn>
      <v-btn @click="progressTest3">Fail</v-btn>
    </div>
    <h1>Notify 테스트</h1>
    <div>
      <v-btn @click="notifyTest1">Alert</v-btn>
      <v-btn @click="notifyTest2">Confirm</v-btn>
      <v-btn @click="notifyTest3">Prompt</v-btn>
    </div>
    <h1>Axios 테스트</h1>
    <div>
      <v-btn @click="axiosTest1">Test</v-btn>
      <v-btn @click="axiosTest2">Error Test</v-btn>
    </div>
    <h1>Socket 테스트</h1>
    <div>
      <v-btn @click="joinRoom">방 입장</v-btn>
      <v-btn @click="leaveRoom">방 퇴장</v-btn>
      <v-btn @click="sendMsg">메세지 보내기</v-btn>
			<div>{{$store.state.config.test1}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  title() {
    return this.title;
  },
  data() {
    return {
      title: "My Home",
    };
  },
  mounted() {
    this.$socket.on("room:msg", (data) => {
      console.log("room:msg", data);
    });
  },
  destroyed() {
    this.$socket.off("room:msg");
  },
  methods: {
    toastTest1() {
      this.$toast.info("안내 입니다.");
    },
    toastTest2() {
      this.$toast.success("success");
    },
    toastTest3() {
      this.$toast.error("error.");
    },
    toastTest4() {
      this.$toast.warning("warning.");
    },
    toastTest5() {
      throw new Error("에러가 발생");
    },
    progressTest1() {
      this.$Progress.start();
    },
    progressTest2() {
      this.$Progress.finish();
    },
    progressTest3() {
      this.$Progress.fail();
    },
    async notifyTest1() {
      const res = await this.$ezNotify.alert("경고", "안내", {
        icon: "mdi-forum",
        iconColor: "yellow",
      });
      console.log(res);
    },
    async notifyTest2() {
      const res = await this.$ezNotify.confirm("질문에 응답하세요.");
      console.log(res);
    },
    async notifyTest3() {
      const res = await this.$ezNotify.prompt(
        "좋아하는 과일은?",
        "머가 좋아?",
        { icon: "mdi-alert", text: "기본 문자" }
      );
      console.log(res);
    },
    async axiosTest1() {
      const result = await this.$axios.get("/api/member/test");
      console.log(result);
    },
    async axiosTest2() {
      const result = await this.$axios.get("/api/errrrr/test");
      console.log(result);
    },
    joinRoom() {
			this.$socket.emit('room:join', 'roomtest');
			console.log('join room')
		},
    leaveRoom() {
			this.$socket.emit('room:leave', 'roomtest');
			console.log('leave room')
		},
    sendMsg() {
			this.$socket.emit('room:send', {msg : '센드 메세지'});
		},
  },
};
</script>
