<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <input-duplicate-check
      ref="id"
      label="아이디"
      prepend-icon="mdi-account"
      v-model="form.mb_id"
			readonly
    />

    <v-text-field
      label="이름"
      v-model="form.mb_name"
      prepend-icon="mdi-card-account-details-outline"
      :rules="rules.name()"
    />

		<template v-if="!member.mb_provider">
			<input-password
				label="비밀번호"
				prepend-icon="mdi-lock"
				v-model="form.mb_password"
				:rules="rules.password({required : false})"
			/>

			<input-password
				label="비밀번호 확인"
				prepend-icon="mdi-lock-check"
				v-model="confimPw"
				:rules="[rules.matchValue(form.mb_password)]"
			/>
		</template>

    <input-duplicate-check
      ref="email"
      label="이메일"
      prepend-icon="mdi-email"
      v-model="form.mb_email"
      :rules="rules.email()"
      :cbCheck="cbCheckEmail"
			:readonly="!admMode"
			:origin="member.mb_email"
    />

    <input-date
      v-model="form.mb_birth"
      label="생년월일"
      prepend-icon="mdi-calendar"
      :rules="rules.date({ label: '생년월일' })"
    />

		<div class="d-flex align-center">
			<display-avatar :member="member"/>
			<v-file-input
				class="ml-2"
				label="회원이미지"
				v-model="form.mb_image"
				:prepend-icon="null"
				accept="image/jpg,image/png"
			/>
			<v-checkbox
				v-model="form.deleteImage"
				label="삭제"
			></v-checkbox>
		</div>


    <input-radio
      v-model="form.mb_gender"
      :items="genderItems"
      row
      prepend-icon="mdi-gender-male-female"
      :rules="[rules.require({ label: '성별' })]"
    />

    <input-phone
      v-model="form.mb_phone"
      label="전화번호"
      prepend-icon="mdi-phone"
      :rules="rules.phone()"
    />

    <input-post
      :zipcode.sync="form.mb_zip"
      :addr1.sync="form.mb_addr1"
      :addr2.sync="form.mb_addr2"
    />

    <v-btn type="submit" block color="primary" :loading="isLoading">
      회원수정
    </v-btn>

		<v-btn block class="mt-4" color="error" :loading="isLoading" @click="$emit('onLeave')">
      회원탈퇴
    </v-btn>
  </v-form>
</template>

<script>
import InputDuplicateCheck from "../InputForms/InputDuplicateCheck.vue";
import validateRules from "../../../util/validateRules";
import InputPassword from "../InputForms/InputPassword.vue";
import InputDate from "../InputForms/InputDate.vue";
import InputRadio from "../InputForms/InputRadio.vue";
import InputPhone from "../InputForms/InputPhone.vue";
import InputPost from "../InputForms/InputPost.vue";
import { deepCopy } from '../../../util/lib';
import DisplayAvatar from '../layout/DisplayAvatar.vue';

export default {
  components: {
    InputDuplicateCheck,
    InputPassword,
    InputDate,
    InputRadio,
    InputPhone,
    InputPost,
		DisplayAvatar,
  },
  name: "UserUpdateForm",
  props: {
		admMode : {
			type : Boolean,
			default : false,
		},
		member : {
			type : Object,
			required : true,
		},
    isLoading: {
      type: Boolean,
      required: true,
    },
    cbCheckEmail: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      form: null,
      genderItems: [
        { label: "남자", value: "M" },
        { label: "여자", value: "F" },
      ],
      confimPw: "",
    };
  },
  computed: {
    rules: () => validateRules,
  },
	created() {
		this.form = deepCopy(this.member);
		this.form.mb_password = "",
		this.form.admMode = this.admMode;
		this.form.deleteImage = false;
		delete this.form.mb_create_at;
		delete this.form.mb_create_ip;
		delete this.form.mb_update_at;
		delete this.form.mb_update_ip;
		delete this.form.mb_login_at;
		delete this.form.mb_login_ip;
		delete this.form.mb_leave_at;
	},

  methods: {
    async save() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      if (!this.$refs.email.validate()) return;
      // console.log(this.mb_image);
      // this.$emit("onSave", this.form);
      const formData = new FormData();
      const keys = Object.keys(this.form);
      for (const key of keys) {
        formData.append(key, this.form[key]);
      }
      this.$emit("onSave", formData);
    },
  },
};
</script>

<style>
</style>