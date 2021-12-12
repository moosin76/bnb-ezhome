<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" :width="drawerWidth">
      <site-navi @close="toggleDrawer" />
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark hide-on-scroll>
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <site-title></site-title>
      <v-spacer></v-spacer>
      <site-user />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <site-footer />
    <vue-progress-bar></vue-progress-bar>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import SiteFooter from "./components/layout/SiteFooter.vue";
import SiteNavi from "./components/layout/SiteNavi.vue";
import SiteTitle from "./components/layout/SiteTitle.vue";
import SiteUser from "./components/layout/SiteUser.vue";

export default {
  components: { SiteTitle, SiteFooter, SiteNavi, SiteUser },
  name: "App",

  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    drawerWidth() {
      return this.$vuetify.breakpoint.xs ? "100%" : "360";
    },
  },
  socket() {
    return {
			"connect" :() =>{
				console.log("socket connect");
				this.SET_ONLINE(true);
				this.initRooms();
			},
			"disconnect": ()=> {
				console.log("socket disconnect")
				this.SET_ONLINE(false);
			},
      "config:update": (data) => {
        this.SET_CONFIG(data);
      },
      "config:remove": (key) => {
        this.SET_CONFIG({ key, value: null });
      },
    };
  },
  methods: {
    ...mapMutations(["SET_CONFIG"]),
		...mapMutations('socket', ['SET_ONLINE']),
		...mapActions('socket', ['initRooms']),
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>
