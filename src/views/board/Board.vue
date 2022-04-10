<template>
  <component :is="curSkin" :config="config" :access="access" :id="wr_id" />
</template>

<script>
import upperFirst from "lodash/upperFirst";
import { mapGetters, mapMutations, mapState } from "vuex";
import SKINS from "./skins";
import BoardError from "./BoardError.vue";

export default {
  components: { ...SKINS, BoardError },
  name: "Board",
  data() {
    return {
      config: null,
    };
  },
  computed: {
    ...mapState({
      initData: (state) => state.initData,
    }),
    ...mapGetters({
      GRNAT: "user/GRANT",
    }),
    pathMatch() {
      return this.$route.params.pathMatch.split("/");
    },
    table() {
      return this.pathMatch[0];
    },
    wr_id() {
      return this.pathMatch[1];
    },
    action() {
      if (this.wr_id) {
        return this.$route.query.act || "read";
      } else {
        return this.$route.query.act || "list";
      }
    },
    access() {
      if (this.config) {
        return {
          list: this.GRNAT >= this.config.bo_list_level,
          read: this.GRNAT >= this.config.bo_read_level,
          write: this.GRNAT >= this.config.bo_write_level,
          reply: this.GRNAT >= this.config.bo_reply_level,
          comment: this.GRNAT >= this.config.bo_comment_level,
          download: this.GRNAT >= this.config.bo_download_level,
        };
      }
      return null;
    },
    curSkin() {
      if (this.config) {
        // console.log("action", this.action, this.access);
        const prefix = upperFirst(this.config.bo_skin);
        if (this.action == "list" && this.access.list) {
          return `${prefix}List`;
        } else if (this.access.write && this.action == "write" ) {
          return `${prefix}Form`;
        } else if (this.access.reply && this.action == "reply" ) {
          return `${prefix}Form`;
        } else if (this.wr_id && this.action == "read" && this.access.read) {
          return `${prefix}Read`;
        } else {
          return "BoardError";
        }
      }
      return "BoardError";
    },
  },
  watch: {
    table() {
      this.config = null;
      this.fetchConfig();
    },
  },
  mounted() {
    // console.log(this.pathMatch, this.table, this.wr_id, this.action);
    // this.fetchConfig();
    console.log("initData", this.initData);
  },
  syncData() {
    if (this.initData && this.initData.config) {
      return this.setConfig(this.initData.config);
    } else {
      return this.fetchConfig();
    }
  },
  methods: {
    ...mapMutations(["SET_INITDATA"]),
    async fetchConfig() {
      const data = await this.$axios.get(`/api/board/config/${this.table}`);
      if (this.$ssrContext) {
        // console.log("SET_INITDATA", data.bo_table);
        this.SET_INITDATA({ config: data });
      }
      this.setConfig(data);
    },
    setConfig(data) {
      if (data) {
        this.config = data;
      }
    },
  },
};
</script>

<style>
</style>