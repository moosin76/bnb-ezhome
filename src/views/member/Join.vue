<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <v-card max-width="400" width="100%" elevation="10" class="ma-4">
      <v-toolbar>
        <v-toolbar-title>회원가입</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <sing-up-form
          :cbCheckId="checkId"
          :cbCheckEmail="checkEmail"
          @onSave="save"
					:isLoading="isLoading"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SingUpForm from "../../components/Auth/SingUpForm.vue";
export default {
  components: { SingUpForm },
  name: "Join",
  title: "회원가입",
	data() {
		return {
			isLoading: false,
		}
	},
  methods: {
    ...mapActions("user", ["duplicateCheck"]),
    async checkId(id) {
      const data = await this.duplicateCheck({ field: "mb_id", value: id });
      return data;
    },
    async checkEmail(email) {
      const data = await this.duplicateCheck({
        field: "mb_email",
        value: email,
      });
      return data;
    },
    async save(form) {
      this.isLoading = true;
			
			setTimeout(()=>{
				this.isLoading = false;
			}, 1000)
    },
  },
};
</script>

<style>
</style>