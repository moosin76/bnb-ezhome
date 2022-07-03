<template>
  <div>
    <board-latest table="gallery" skin="slider" :limit="3" />
    <board-latest table="test" skin="basic" :limit="4" />
    <!-- <board-latest table="gallery" skin="gallery" :limit="6" /> -->
		<popup-opener />
  </div>
</template>
<script>
import { mapState } from "vuex";
import BoardLatest from "../components/Latest/BoardLatest.vue";
import PopupOpener from "./board/skins/popup/component/PopupOpener.vue";

export default {
  components: { BoardLatest, PopupOpener },
  name: "Home",
  title() {
    return this.title;
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      title: (state) => state.config.title || "타이틀설정하세요!",
    }),
  },
  methods: {},
};
</script>
