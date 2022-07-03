<template>
  <div class="pop-wrap elevation-9" :style="wrapStyle">
    <v-btn v-bind="linkAttrs" text block height="auto" style="padding: 0px">
      <img
        :src="popImg"
        :alt="item.title"
        :width="width"
        :height="height"
        :style="imgStyle"
      />
    </v-btn>
    <div class="d-flex px-2 align-center">
      <v-checkbox
        v-model="isCheck"
        :label="`${expire}일간 보지 않기`"
        dense
        dark
        hide-details
        style="position: relative; top: -4px"
      ></v-checkbox>
      <v-spacer></v-spacer>
      <v-btn
        x-small
        icon
        color="white"
        @click="close"
        style="position: relative"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import { getImage } from "../../../../../../util/lib";
export default {
  name: "PopupView",
  props: {
    table: { type: String, required: true },
    item: { type: Object, required: true },
    idx: { type: Number, default: 0 },
  },
  data() {
    return {
      isCheck: false,
    };
  },
  computed: {
    top() {
      return parseInt(this.item.wr_5);
    },
    left() {
      return parseInt(this.item.wr_6);
    },
    width() {
      return parseInt(this.item.wr_7);
    },
    height() {
      return parseInt(this.item.wr_8);
    },
    link() {
      return this.item.wr_4;
    },
    expire() {
      return this.item.wr_1;
    },
    wrapStyle() {
      let st;
      if (this.$vuetify.breakpoint.xs) {
        st = {left: "0px",top: (60 + this.idx * 16) + "px",width: "80%",marginLeft: "10%",};
      } else {
        st = {
          left: this.left + "px",
          top: this.top + "px",
          width: this.width + "px",
          height: this.height + 30+ "px",
        };
      }
      st = {
        ...st,
        position: "fixed",
        background: "#333",
        overflow: "hidden",
        zIndex: 1000,
      };
			return st;
    },
    imgStyle() {
      if (this.$vuetify.breakpoint.xs) {
        return {
          width: "100%",
          height: "auto",
        };
      }
    },
    popImg() {
      return getImage(this.table, this.item, { w: this.width, h: this.height });
    },
    linkAttrs() {
      if (this.link.startsWith("http")) {
        return {
          href: this.link,
          target: "_blank",
        };
      } else {
        return {
          to: this.link,
        };
      }
    },
  },
  mounted() {
    // console.log(this.item);
    // console.log(this.popImg);
    // console.log(this.$vuetify);
  },
  methods: {
    close() {
      // console.log(this.$moment('2022-07-03T05:15:30.244Z').format("LT"));
      if (this.isCheck) {
        const expire = this.expire * 86400;
        // const expire = 5 * 60; // 테스트 5분
        // console.log(expire);
        VueCookies.set(`pop-${this.item.wr_id}`, this.item.wr_id, expire);
      }
      this.$emit("onClose", this.item);
    },
  },
};
</script>

<style>

</style>