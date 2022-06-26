<template>
  <div class="pop-wrap elevation-9" :style="wrapStyle">
    <v-btn v-bind="linkAttrs" text block height="auto">
      <img :src="popImg" :alt="item.title" :width="width" :height="height" />
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
import { getImage } from "../../../../../../util/lib";
export default {
  name: "PopupView",
  props: {
    table: { type: String, required: true },
    item: { type: Object, required: true },
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
      return {
        left: this.left + "px",
        top: this.top + "px",
        width: this.width + "px",
        height: this.height + 30 + "px",
      };
    },
    imgStyle() {
      return {
        width: "100%",
      };
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
    console.log(this.item);
    console.log(this.popImg);
  },
  methods: {
    close() {
      this.$emit("onClose");
    },
  },
};
</script>

<style>
.pop-wrap {
  position: fixed;
  background: #333;
  overflow: hidden;
}
</style>