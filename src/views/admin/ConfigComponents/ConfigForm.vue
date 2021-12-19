<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <v-combobox
      v-model="form.cf_group"
      :items="groupItems"
      label="그룹"
      :rules="[rules.require({ label: '그룹' })]"
    ></v-combobox>

    <div class="d-flex">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs" class="mr-2">
            <v-checkbox
              v-model="form.cf_client"
              color="primary"
              :true-value="1"
              :false-value="0"
            ></v-checkbox>
          </span>
        </template>
        <span>클라이언트</span>
      </v-tooltip>

      <input-duplicate-check
        ref="cfKey"
        label="키"
        v-model="form.cf_key"
        :cbCheck="keyCheck"
        :origin="originKey"
        :readonly="!!item"
        :rules="[rules.require({ label: '키' }), rules.alphaNum()]"
      />
    </div>
    <v-text-field
      label="이름"
      v-model="form.cf_name"
      :rules="rules.name()"
    ></v-text-field>

    <v-select label="값 타입" v-model="form.cf_type" :items="typeItems" />

    <type-value v-model="form.cf_val" :fieldType="form.cf_type" />

    <v-slider
      :label="`접근레벨 (${form.cf_level})`"
      v-model="form.cf_level"
      :min="LV.ADMIN"
      :max="LV.SUPER"
      thumb-color="primary"
      thumb-label
    />

    <v-textarea label="설명" v-model="form.cf_comment"></v-textarea>
    <v-btn type="submit" block>저장</v-btn>
  </v-form>
</template>

<script>
import InputDuplicateCheck from "../../../components/InputForms/InputDuplicateCheck.vue";
import TypeValue from "./TypeValue.vue";
import { LV } from "../../../../util/level";
import validateRules from "../../../../util/validateRules";
import { deepCopy, findParentVm } from "../../../../util/lib";
import jsonStringify from "json-stable-stringify";

export default {
  components: { InputDuplicateCheck, TypeValue },
  name: "ConfigForm",
  props: {
    keyCheck: {
      type: Function,
      default: null,
    },
    groupItems: {
      type: Array,
      default: [],
    },
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      form: null,
      typeItems: ["String", "Number", "CheckBox", "Json", "Secret"],
			originKey: null,
    };
  },
  computed: {
    LV: () => LV,
    rules: () => validateRules,
  },
  created() {
    this.init();
  },
  watch: {
    item() {
      this.init();
    },
  },
  methods: {
    init() {
      if (this.item) {
        this.form = deepCopy(this.item);
				if(this.form.cf_type == 'Json') {
					const obj = JSON.parse(this.form.cf_val);
					this.form.cf_val = jsonStringify(obj, {space : '  '});
				}
				this.originKey = this.item.cf_key;
      } else {
        this.form = {
          cf_key: "", // 중복
          cf_val: "", // 타입에 따라서
          cf_name: "", //
          cf_group: "", //
          cf_level: "", // 접근
          cf_type: "String", // 저장형식
          cf_comment: "", // 설명
          cf_client: 0,
        };
				this.originKey = '';
      }
			if(this.$refs.form) {
				this.$refs.form.resetValidation();
			}
    },
    async save() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      if (!this.$refs.cfKey.validate()) return;
      if (!this.item) {
        let i = 0;
        const parent = findParentVm(this, "admConfig");
        parent.items.forEach((item) => {
          if (item.cf_group == this.form.cf_group) {
            i++;
          }
        });
        this.form.cf_sort = i;
      }
			// JSON 처리
			try {
				if(this.form.cf_type == 'Json') {
					const obj = JSON.parse(this.form.cf_val);
					this.form.cf_val = JSON.stringify(obj);
				}
				this.$emit("save", this.form);
			} catch(e) {
				this.$toast.error('JSON 형식이 올바르지 않습니다.');
			}
      
    },
  },
};
</script>

<style>
</style>