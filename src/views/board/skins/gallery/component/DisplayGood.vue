<template>
  <div v-bind="$attrs">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="{ ...attrs, ...btnProps }"
          :color="goodColor"
          @click.stop="goodUpdate(1)"
        >
          <v-icon left>{{ icon.good }}</v-icon>
          {{ good }}
        </v-btn>
      </template>
      <span>좋아요</span>
    </v-tooltip>
    <v-tooltip v-if="!goodOnly" top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="{ ...attrs, ...btnProps }"
          :color="badColor"
          @click.stop="goodUpdate(2)"
        >
          <v-icon left>{{ icon.bad }}</v-icon>
          {{ bad }}
        </v-btn>
      </template>
      <span>싫어요</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DisplayGood",
  props: {
    item: {
      type: Object,
      required: true,
    },
    table: {
      type: String,
      required: true,
    },
    btnProps: {
      type: Object,
      default: null,
    },
    icon: {
      type: Object,
      default: () => ({
        good: "mdi-heart-outline",
        bad: "mdi-heart-broken-outline",
      }),
    },
    goodOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      goodFlag: this.item.goodFlag,
      good: this.item.good,
      bad: this.item.bad,
    };
  },
  computed: {
    ...mapState("user", ["member"]),
    goodColor() {
      return this.goodFlag == 1 ? "primary" : "";
    },
    badColor() {
      return this.goodFlag == 2 ? "error" : "";
    },
  },
  methods: {
    async goodUpdate(bg_flag) {
      if (!this.member) {
        this.$toast.error("회원만 사용할 수 있습니다.");
        return;
      }
      let data;
      if (bg_flag == this.goodFlag) {
        data = await this.$axios.delete(
          `/api/good/${this.table}/${this.item.wr_id}`
        );
      } else {
        data = await this.$axios.post(
          `/api/good/${this.table}/${this.item.wr_id}`,
          { bg_flag }
        );
      }
      if (data) {
        this.goodFlag = data.goodFlag;
        this.good = data.good;
        this.bad = data.bad;
      }
    },
  },
};
</script>

<style>
</style>