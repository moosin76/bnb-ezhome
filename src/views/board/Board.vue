<template>
  <component :is="curSkin" :config="config" :access="access" :id="wr_id" />
</template>

<script>
import upperFirst from "lodash/upperFirst";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import SKINS from "./skins";
import BoardError from "./BoardError.vue";

export default {
  components: { ...SKINS, BoardError },
  name: "Board",
  data() {
    return {
      // config: null,
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.board.config,
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
        console.log("action", this.action, this.access);
        const prefix = upperFirst(this.config.bo_skin);
        if (this.action == "list" && this.access.list) {
          return `${prefix}List`;
        } else if (this.access.write && this.action == "write") {
          return `${prefix}Form`;
        } else if (this.access.reply && this.action == "reply") {
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
      // this.config = null;
			console.log("watch table ", this.table);
      this.getBoardConfig(this.table);
    },
  },
	serverPrefetch() {
		return this.getBoardConfig(this.table);
	},
  mounted() {
    // console.log(this.pathMatch, this.table, this.wr_id, this.action);
    // this.fetchConfig();
    if (!this.config) { 
      this.getBoardConfig(this.table);
    }
  },
	destroyed() {
		this.SET_CONFIG(null);
		this.SET_LIST({items:[], totalItems:0});
		this.SET_READ(null);
	},
  methods: {
		...mapMutations("board", ['SET_CONFIG', 'SET_LIST', 'SET_READ']),
    ...mapActions("board", ["getBoardConfig"]),
  },
};
</script>

<style>
</style>