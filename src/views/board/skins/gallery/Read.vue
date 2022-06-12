<template>
  <v-container fluid>
    <v-card flat v-if="item">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>{{ item.wr_title }}</v-toolbar-title>
          <v-spacer />
          <v-subheader class="text-no-wrap">
            <v-icon class="mx-2" small>mdi-account</v-icon>
            {{ item.wr_name }}
            <v-icon class="mx-2" small>mdi-clock-outline</v-icon>
            <i><display-time :time="item.wr_createat" /></i>
            <v-icon class="mx-2" small>mdi-eye</v-icon>
            {{ item.wr_view }}
          </v-subheader>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <ssr-renderer>
          <template>
            <ez-tiptap :editable="false" v-model="item.wr_content" />
          </template>
          <template v-slot:server>
            <div v-html="item.wr_content"></div>
          </template>
        </ssr-renderer>
      </v-card-text>

      <v-card-text>
        <tag-view :tags="item.wrTags" />
      </v-card-text>

      <v-card-text>
        <display-good
          :table="table"
          :item="item"
          class="d-flex justify-center"
          :btnProps="{ tile: true, small: true }"
          good-only
        />
      </v-card-text>

      <v-card-text>
        <file-download :table="table" :item="item" :access="access" />
      </v-card-text>

      <v-card-actions>
        <v-col cols="4" class="text-no-wrap">
          <!-- 수정 -->
          <board-button
            v-if="isModify == 'MODIFY'"
            color="info"
            :to="`/board/${table}/${item.wr_id}?act=write`"
            label="수정"
            icon="mdi-pencil"
          />
          <!-- TODO: 비회원 계시물 수정 버튼 -->
          <modify-button
            v-if="isModify == 'NO_MEMBER'"
            color="info"
            :table="table"
            :wr_id="item.wr_id"
            label="수정"
            @onValid="modifyItem"
          >
            <v-icon left>mdi-pencil</v-icon>수정
          </modify-button>

          <!-- // 수정 -->

          <!-- 삭제 -->
          <board-button
            v-if="isModify == 'MODIFY'"
            color="error"
            class="ml-2"
            @click="deleteItem"
            label="삭제"
            icon="mdi-delete"
            :loading="delelteLoading"
          />
          <!-- TODO: 비회원 계시물 삭제 버튼 -->
          <modify-button
            v-if="isModify == 'NO_MEMBER'"
            class="ml-2"
            color="error"
            :table="table"
            :wr_id="item.wr_id"
            label="삭제"
            @onValid="deleteItem"
          >
            <v-icon left>mdi-delete</v-icon>삭제
          </modify-button>
          <!-- // 삭제 -->
        </v-col>

        <v-col cols="4" class="text-center text-no-wrap">
          <board-button
            :to="`/board/${table}`"
            color="accent"
            label="목록"
            icon="mdi-menu"
          />
        </v-col>

        <v-col cols="4" class="text-right text-no-wrap">
          <board-button
            v-if="access.reply"
            color="secondary"
            :to="`/board/${table}/${item.wr_id}?act=reply`"
            label="답글쓰기"
            icon="mdi-subdirectory-arrow-right"
          />

          <board-button
            v-if="access.write"
            color="primary"
            class="ml-2"
            :to="`/board/${table}?act=write`"
            label="글쓰기"
            icon="mdi-pencil"
          />
        </v-col>
      </v-card-actions>

      <comment-list :id="item.wr_id" :table="table" :access="access" />
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { LV } from "../../../../../util/level";
import SsrRenderer from "../../../../components/util/SsrRenderer.vue";
import DisplayTime from "./component/DisplayTime.vue";
import TagView from "./component/TagView.vue";
import FileDownload from "./component/FileDownload.vue";
import BoardButton from "./component/boardButton.vue";
import DisplayGood from "./component/DisplayGood.vue";
import ModifyButton from "./component/ModifyButton.vue";
import CommentList from "./component/CommentList.vue";

export default {
  components: {
    SsrRenderer,
    DisplayTime,
    TagView,
    FileDownload,
    BoardButton,
    DisplayGood,
    ModifyButton,
    CommentList,
  },
  name: "BasicRead",
  props: {
    config: Object,
    access: Object,
    id: [String, Number],
  },
  data() {
    return {
      delelteLoading: false,
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
      item: (state) => state.board.read,
    }),
    ...mapGetters("user", ["GRANT"]),
    table() {
      return this.config.bo_table;
    },
    isModify() {
      if (this.member) {
        if (this.member.mb_id == this.item.mb_id || this.GRANT >= LV.SUPER) {
          return "MODIFY";
        }
      } else if (this.item.mb_id == 0) {
        return "NO_MEMBER";
      }
      return "";
    },
  },
  watch: {
    id() {
      this.fetchData();
    },
  },
  serverPrefetch() {
    return this.fetchData();
  },
  mounted() {
    if (!this.item) {
      this.fetchData();
    } else {
      this.viewUp();
    }
    // console.log(this.$vuetify);
  },
  destroyed() {
    this.SET_READ(null);
  },
  methods: {
    ...mapMutations("board", ["SET_READ", "VIEW_UP"]),
    ...mapActions("board", ["getBoardRead"]),
    async fetchData() {
      // console.log("FETCH", this.id);
      const headers = {};
      if (this.$ssrContext) {
        headers.token = this.$ssrContext.token;
      }
      await this.getBoardRead({
        table: this.table,
        id: this.id,
        headers,
      });

      if (!this.$ssrContext) {
        this.viewUp();
      }
    },
    async viewUp() {
      const today = this.$moment().format("L");
      const view = JSON.parse(window.localStorage.getItem("view")) || {};
      const keys = Object.keys(view);
      for (const key of keys) {
        if (key != today) {
          //오늘이 아니면 제거
          delete view[key];
        }
      }
      if (!view[today]) {
        view[today] = {};
      }
      const curWrite = `${this.table}_${this.id}`;
      if (!view[today][curWrite]) {
        // 조회수를 증가
        view[today][curWrite] = true;
        // 서버에 증가하는 요청
        await this.$axios.put(`/api/board/view/${this.table}/${this.id}`);
        // Mutation view 증가
        this.VIEW_UP();

        window.localStorage.setItem("view", JSON.stringify(view));
      }
    },
    async deleteItem(token) {
      this.delelteLoading = true;

      const result = await this.$ezNotify.confirm(
        "게시물을 삭제 하시겠습니까?",
        "게시물 삭제",
        { icon: "mdi-alert" }
      );

      if (result) {
        const data = await this.$axios.delete(
          `/api/board/${this.table}/${this.item.wr_id}?token=${token}`
        );
        if (data) {
          this.$toast.info(`${data}개의 게시물을 삭제 하였습니다.`);
          this.$router.push(`/board/${this.table}`);
        }
      }

      this.delelteLoading = false;
    },
    modifyItem(token) {
      this.$router.push(
        `/board/${this.table}/${this.item.wr_id}?act=write&token=${token}`
      );
    },
  },
};
</script>

<style>
</style>