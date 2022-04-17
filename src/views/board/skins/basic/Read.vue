<template>
  <v-container fluid>
    <v-card flat v-if="item">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>{{ item.wr_title }}</v-toolbar-title>
          <v-spacer />
          {{ item.wr_name }}
          <v-btn :to="`/board/${table}`">목록</v-btn>
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
      <v-card-actions>
        <v-btn
          v-if="isModify == 'MODIFY'"
          color="info"
          :to="`/board/${table}/${item.wr_id}?act=write`"
        >
          <v-icon left>mdi-pencil</v-icon>수정
        </v-btn>
        <v-btn
          v-if="access.reply"
          color="secondary"
          :to="`/board/${table}/${item.wr_id}?act=reply`"
        >
          <v-icon left>mdi-subdirectory-arrow-right</v-icon>
          답글쓰기
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- <div>Basic Read
			<v-btn :to="`/board/${table}`">목록</v-btn>
		<v-btn :to="`/board/${table}?act=write`">쓰기</v-btn>
		<v-btn :to="`/board/${table}/11`">읽기</v-btn>
	</div>-->
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { LV } from "../../../../../util/level";
import SsrRenderer from "../../../../components/util/SsrRenderer.vue";

export default {
  components: { SsrRenderer },
  name: "BasicRead",
  props: {
    config: Object,
    access: Object,
    id: [String, Number],
  },
  data() {
    return {
      //
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
    }
  },
  destroyed() {
    this.SET_READ(null);
  },
  methods: {
    ...mapMutations("board", ["SET_READ"]),
    ...mapActions("board", ["getBoardRead"]),
    async fetchData() {
      console.log("FETCH", this.id);
      const headers = {};
      if (this.$ssrContext) {
        headers.token = this.$ssrContext.token;
      }
      await this.getBoardRead({
        table: this.table,
        id: this.id,
        headers,
      });
    },
  },
};
</script>

<style>
</style>