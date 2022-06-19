<template>
  <div>
		<board-latest table="gallery" skin="slider" :limit="3" />
    <board-latest table="test" skin="basic" :limit="4" />
		<!-- <board-latest table="gallery" skin="gallery" :limit="6" /> -->
		
  </div>
</template>
<script>
import { mapState } from "vuex";
import BoardLatest from "../components/Latest/BoardLatest.vue";

export default {
  components: { BoardLatest },
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
