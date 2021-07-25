<template>
	<v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
		<input-duplicate-check
			ref="id"
			label="아이디"
			prepend-icon="mdi-account"
			v-model="form.mb_id"
			:counter="30"
			:rules="rules.id()"
			:cbCheck="cbCheckId"
		/>
		<v-btn type="submit" block color="primary">회원가입</v-btn>
	</v-form>
</template>

<script>
import InputDuplicateCheck from '../InputForms/InputDuplicateCheck.vue';
import validateRules from "../../../util/validateRules";
export default {
  components: { InputDuplicateCheck },
  name: "SignUpForm",
	props : {
		cbCheckId: {
			type : Function,
			default : null,
		},
	},
  data() {
    return {
			valid : true,
      form: {
        mb_id: "",
        mb_password: "",
        mb_name: "",
        mb_birth: "",
        mb_gender: "",
        mb_email: "",
        mb_phone: "",
        mb_zip: "",
        mb_addr1: "",
        mb_addr2: "",
      },
    };
  },
	computed : {
		rules : () => validateRules,
	},
	
	methods : {
		async save() {
			this.$refs.form.validate();
			await this.$nextTick();
			if(!this.valid) return;
			console.log(this.$refs.id.validate());
			if(!this.$refs.id.validate()) return;
			console.log(this.form);
		}
	}
};
</script>

<style>
</style>