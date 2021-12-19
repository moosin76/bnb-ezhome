<template>
  <div v-if="fieldType == 'String'">
    <v-text-field
      label="Value"
      :value="value"
      @input="onInput"
      :readonly="readonly"
      :hide-details="readonly"
    />
  </div>
  <div v-else-if="fieldType == 'Number'">
    <v-text-field
      label="Value"
      type="number"
      :value="value"
      @input="onInput"
      :readonly="readonly"
      :hide-details="readonly"
    />
  </div>
  <div v-else-if="fieldType == 'CheckBox'">
    <v-checkbox
      label="Check value"
      :input-value="value"
      @change="onInput"
      :readonly="readonly"
      :hide-details="readonly"
			true-value="1"
			false-value="0"
    />
  </div>
  <div v-else-if="fieldType == 'Json'">
    <template v-if="readonly">
      <v-btn @click="jsonView" color="primary">JSON 보기</v-btn>
      <ez-dialog ref="dialog" label="JSON 값 보기" width="600">
        <pre class="mt-4">{{ stringify() }}</pre>
      </ez-dialog>
    </template>

    <v-textarea
      v-else
      label="Value"
      :value="value"
      @input="onInput"
      :readonly="readonly"
    ></v-textarea>
  </div>
  <div v-else-if="fieldType == 'Secret'">
    <input-password
      label="Secret Value"
      :value="value"
      @input="onInput"
      :readonly="readonly"
      :hide-details="readonly"
    />
  </div>
  <div v-else>
    <div>타입을 먼저 선택해 주세요.</div>
  </div>
</template>

<script>
import InputPassword from "../../../components/InputForms/InputPassword.vue";
import jsonStringify from "json-stable-stringify";
import EzDialog from "../../../components/etc/EzDialog.vue";

export default {
  components: { InputPassword, EzDialog },
  name: "TypeValue",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: {
      type: String,
    },
    fieldType: {
      type: String,
      default: "String",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onInput(val) {
      this.$emit("input", val);
    },
    stringify() {
      const obj = JSON.parse(this.value);
      const str = jsonStringify(obj, { space: "  " });
      // console.log(str);
      return str;
    },
    jsonView() {
      this.$refs.dialog.open();
    },
  },
};
</script>

<style>
</style>