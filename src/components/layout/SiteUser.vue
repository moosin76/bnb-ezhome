<template>
  <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
  <v-menu v-else offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-on="on" v-bind="attrs">
        <v-avatar color="accent" size="32">
          <template v-if="member">
            <v-img
              v-if="member.mb_image"
              :src="`/upload/memberPhoto/${member.mb_id}.jpg?w=32&h=32`"
            ></v-img>
            <div v-else>{{ member.mb_name[0] }}</div>
          </template>
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-switch
          label="Dark Theme"
          :input-value="darkMode"
          @change="setDarkMode($event)"
        ></v-switch>
      </v-card-text>
      <template v-if="member">
        <v-card-actions>
          <v-btn  color="primary" block>회원정보수정</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn  color="secondary" block>로그아웃</v-btn>
        </v-card-actions>
      </template>
      <template v-else>
        <v-card-actions>
          <v-btn to="/login" color="primary" block>로그인</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn to="join" color="secondary" block>회원가입</v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SiteUser",
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
    }),
    darkMode() {
      return this.$vuetify.theme.dark;
    },
  },
  mounted() {
    this.getDarkMode();
  },
  methods: {
    setDarkMode(mode) {
      localStorage.setItem("darkMode", mode ? "dark" : "light");
      this.$vuetify.theme.dark = mode;
    },
    getDarkMode() {
      const mode = localStorage.getItem("darkMode") === "dark" ? true : false;
      this.$vuetify.theme.dark = mode;
    },
  },
};
</script>

<style>
</style>