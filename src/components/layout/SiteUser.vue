<template>
  <div>
    <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
    <v-menu v-else offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs">
          <display-avatar :member="member" />
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
        <member-menu v-if="member" @open="openDialog" />
        <no-member-menu v-else />
      </v-card>
    </v-menu>
    <v-dialog v-if="member" v-model="dialog" persistent max-width="500">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>회원정보수정</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <user-update-form
            :member="member"
            :isLoading="isLoading"
            :cbCheckEmail="checkEmail"
            @onSave="save"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import UserUpdateForm from "../Auth/UserUpdateForm.vue";
import DisplayAvatar from "./DisplayAvatar.vue";
import MemberMenu from "./MemberMenu.vue";
import NoMemberMenu from "./NoMemberMenu.vue";

export default {
  components: { DisplayAvatar, MemberMenu, NoMemberMenu, UserUpdateForm },
  name: "SiteUser",
  data() {
    return {
      isLoading: false,
      dialog: false,
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
    ...mapActions("user", ["duplicateCheck", "checkPassword", 'updateMember']),
    setDarkMode(mode) {
      localStorage.setItem("darkMode", mode ? "dark" : "light");
      this.$vuetify.theme.dark = mode;
    },
    getDarkMode() {
      const mode = localStorage.getItem("darkMode") === "dark" ? true : false;
      this.$vuetify.theme.dark = mode;
    },
    async openDialog() {
			this.dialog = true;
      // if (!this.member.mb_provider) {
      //   const mb_password = await this.$ezNotify.prompt(
      //     "비밀번호를 입력하세요",
      //     "회원정보 수정",
      //     { icon: "mdi-alert", formType: "password" }
      //   );

      //   if (mb_password) {
      //     this.dialog = await this.checkPassword({ mb_password });
      //   }
      // } else {
      //   this.dialog = true;
      // }
    },
    closeDialog() {
      this.dialog = false;
    },
    async save(form) {
      this.isLoading = true;
			const data = await this.updateMember(form);
			this.isLoading = false;
			// if(data) {
			// 	const mb_name = form.get('mb_name');
			// 	this.$toast.info(`${mb_name}님 회원가입 하셧습니다.`);
			// 	this.$router.push('/login');
			// }
    },
    async checkEmail(email) {
      const data = await this.duplicateCheck({
        field: "mb_email",
        value: email,
      });
      return data;
    },
  },
};
</script>

<style>
</style>