<template>
  <v-form
    @submit.prevent="save"
    v-if="form"
    v-model="valid"
    ref="form"
    lazy-validation
  >
    <v-btn
      plain
      href="https://materialdesignicons.com/"
      target="_blank"
      color="success"
      small
    >
      머터리얼 디자인 아이콘 검색
    </v-btn>

    <v-text-field
      label="아이콘"
      v-model="form.icon"
      :prepend-icon="form.icon"
    />
    <v-text-field
      label="이름"
      v-model="form.title"
      :rules="[rules.require({ label: '이름' })]"
    />
    <v-text-field label="링크" v-model="form.to" />
    <input-level label="접근 권한" v-model="form.grant" />
    <v-checkbox label="새창에서 열기" v-model="form.newTab" />
		<v-checkbox label="메뉴 숨김" v-model="form.isHide" />
    <v-btn block type="submit" color="primary"> 저장 </v-btn>
  </v-form>
</template>

<script>
import InputLevel from "../../../components/InputForms/InputLevel.vue";
import validateRules from "../../../../util/validateRules";
import { deepCopy } from '../../../../util/lib';
export default {
  components: { InputLevel },
  name: "MenuForm",
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      form: null,
    };
  },
  computed: {
    rules: () => validateRules,
  },
  watch: {
    item() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      if (this.item) {
				this.form = deepCopy(this.item);
      } else {
        this.form = {
          grant: 0,
          icon: "mdi-",
          newTab: false,
          subItems: [],
          title: "",
          to: "",
					isHide : false
        };
      }
      // console.log("menuForm", this.form);
    },
		async save() {
			this.$refs.form.validate();
			await this.$nextTick();
			if(!this.valid) return;
			this.$emit('save', this.form);
			this.init();
		}
  },
};
</script>

<style>
</style>