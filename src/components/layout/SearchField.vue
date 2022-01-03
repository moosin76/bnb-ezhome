<template>
  <div>
    <tooltip-btn :label="searchLabel" icon small @click="open">
      <v-icon>mdi-magnify</v-icon>
    </tooltip-btn>
    <tooltip-btn
			v-if="!!options.stf[0]"
      type="button"
      label="검색 초기화"
      icon
      color="error"
      @click="reset"
      small
    >
      <v-icon>mdi-magnify-close</v-icon>
    </tooltip-btn>
    <ez-dialog :label="label" ref="dialog" width="300">
      <v-form
        class="mt-4"
        v-model="valid"
        ref="form"
        lazy-validation
        @submit.prevent="searchGo"
      >
        <v-select
          label="검색 필드"
          :items="items"
          v-model="form.stf"
          :rules="[rules.require({ label: '검색 필드' })]"
        />
        <v-select label="비교방식" :items="compItems" v-model="form.stc" />
        <v-text-field
          label="검색어"
          v-model="form.stx"
          :rules="[rules.require({ label: '검색어' })]"
          :disabled="isNullComp"
        />
        <div class="d-flex">
          <tooltip-btn
            type="button"
            label="검색 초기화"
            icon
            color="error"
            @click="reset"
          >
            <v-icon>mdi-magnify-close</v-icon>
          </tooltip-btn>
          <v-spacer></v-spacer>
          <tooltip-btn type="submit" label="검색" icon color="primary">
            <v-icon>mdi-magnify</v-icon>
          </tooltip-btn>
        </div>
      </v-form>
    </ez-dialog>
  </div>
</template>

<script>
import EzDialog from "../etc/EzDialog.vue";
import TooltipBtn from "../etc/TooltipBtn.vue";
import validateRules from "../../../util/validateRules";
export default {
  components: { TooltipBtn, EzDialog },
  name: "SearchField",
  props: {
    label: {
      type: String,
      default: "검색",
    },
    items: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      form: {
        stf: "",
        stx: "",
        stc: "",
      },
      compItems: [
        { text: "포함", value: "like" },
        { text: "작은", value: "lt" },
        { text: "작거나 같은", value: "lte" },
        { text: "같은", value: "eq" },
        { text: "크거나 같은", value: "gte" },
        { text: "큰", value: "gt" },
        { text: "같지 않은", value: "ne" },
        { text: "NULL", value: "null" },
        { text: "NOT NULL", value: "not" },
      ],
      tempText: "",
    };
  },
  computed: {
    rules: () => validateRules,
    searchLabel() {
      const item = this.items.find((item) => item.value == this.options.stf[0]);
      if (item) {
        return `${item.text} : ${this.options.stx[0]}`;
      } else {
        return this.label;
      }
    },
    isNullComp() {
      if (this.form.stc == "null" || this.form.stc == "not") {
        if (!this.tempText) {
          this.tempText = this.form.stx;
          this.form.stx = "Null";
        }
        return true;
      } else {
        if (this.tempText) {
          this.form.stx = this.tempText;
          this.tempText = "";
        }
        return false;
      }
    },
  },
  methods: {
    open() {
      this.form.stf = this.options.stf[0] || this.items[0].value;
      this.form.stc = this.options.stc[0] || "like";
      this.form.stx = this.options.stx[0];
			if(this.$refs.form) {
				this.$refs.form.resetValidation();
			}
      this.$refs.dialog.open();
    },
    async searchGo() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      const options = {
        ...this.options,
        page: 1,
        stf: [this.form.stf],
        stc: [this.form.stc],
        stx: [this.form.stx],
      };
      this.$emit("update:options", options);
      this.$refs.dialog.close();
    },
    reset() {
      const options = {
        ...this.options,
        page: 1,
        stf: [""],
        stc: [""],
        stx: [""],
      };
      this.$emit("update:options", options);
      this.$refs.dialog.close();
    },
  },
};
</script>

<style>
</style>