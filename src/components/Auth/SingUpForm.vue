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

    <v-text-field
      label="이름"
      v-model="form.mb_name"
      prepend-icon="mdi-card-account-details-outline"
      :rules="rules.name()"
    />

    <input-password
      label="비밀번호"
      prepend-icon="mdi-lock"
      v-model="form.mb_password"
      :rules="rules.password()"
    />

    <input-password
      label="비밀번호 확인"
      prepend-icon="mdi-lock-check"
      v-model="confimPw"
      :rules="[rules.matchValue(form.mb_password)]"
    />

    <input-duplicate-check
      ref="email"
      label="이메일"
      prepend-icon="mdi-email"
      v-model="form.mb_email"
      :rules="rules.email()"
      :cbCheck="cbCheckEmail"
    />

    <input-date
      v-model="form.mb_birth"
      label="생년월일"
      prepend-icon="mdi-calendar"
      :rules="rules.date({ label: '생년월일' })"
    />

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

    <v-btn type="submit" block color="primary">회원가입</v-btn>
  </v-form>
</template>

<script>
import InputDuplicateCheck from "../InputForms/InputDuplicateCheck.vue";
import validateRules from "../../../util/validateRules";
import InputPassword from "../InputForms/InputPassword.vue";
import InputDate from "../InputForms/InputDate.vue";
import InputRadio from "../InputForms/InputRadio.vue";
import InputPhone from "../InputForms/InputPhone.vue";

export default {
  components: {
    InputDuplicateCheck,
    InputPassword,
    InputDate,
    InputRadio,
    InputPhone,
  },
  name: "SignUpForm",
  props: {
    cbCheckId: {
      type: Function,
      default: null,
    },
    cbCheckEmail: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      form: {
        mb_id: "test",
        mb_password: "abcd1234",
        mb_name: "테스트",
        mb_birth: "2020-08-03",
        mb_gender: "M",
        mb_email: "test@test.com",
        mb_phone: "010-1111-1111",
        mb_zip: "",
        mb_addr1: "",
        mb_addr2: "",
      },
      genderItems: [
        { label: "남자", value: "M" },
        { label: "여자", value: "F" },
      ],
      confimPw: "abcd1234",
    };
  },
  computed: {
    rules: () => validateRules,
  },

  methods: {
    async save() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      if (!this.$refs.id.validate()) return;
      if (!this.$refs.email.validate()) return;
      console.log(this.form);
    },
  },
};
</script>

<style>
</style>