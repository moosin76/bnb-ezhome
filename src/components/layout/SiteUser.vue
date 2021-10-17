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
            @onLeave="leave"
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
    ...mapActions("user", [
      "duplicateCheck",
      "checkPassword",
      "updateMember",
      "signOut",
    ]),
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
      if (data) {
        this.$toast.info(
          `${this.$store.state.user.member.mb_name}님 정보 수정하였습니다.`
        );
        this.closeDialog();
      }
    },
    async leave() {
      const result = await this.$ezNotify.confirm(
        "정말로 탈퇴하시겠습니까?",
        "회원탈퇴",
        {
          icon: "mdi-alert",
        }
      );

      if (!result) return;

      this.isLoading = true;

      const form = {
        mb_id: this.member.mb_id,
        mb_leave_at: this.$moment().format("LT"),
      };
      const data = await this.updateMember(form);
      this.isLoading = false;
      if (data) {
        // this.$toast.info(`${this.$store.state.user.member.mb_name}님 탈퇴하였습니다.`);
        this.closeDialog();
        const mb_name = await this.signOut();
        this.$toast.info(`${mb_name}님 탈퇴 하였습니다.`);
       	if(this.$route.name != 'Home') {
					this.$router.push('/');
				}
      }
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