<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>설정관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn fab small label="설정 추가" @click="addConfig">
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
    </v-toolbar>

		<!-- 설정 다이얼로그 -->
		<ez-dialog label="설정 추가" ref="dialog" max-width="500" dark color="primary">
			<config-form @save="save" :keyCheck="keyCheck"></config-form>
		</ez-dialog>
		<!-- // 설정 다이얼로그 -->
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import EzDialog from '../../components/etc/EzDialog.vue';
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import ConfigForm from './ConfigComponents/ConfigForm.vue';

export default {
  components: { TooltipBtn, EzDialog, ConfigForm },
  name: "admConfig",
	data() {
		return {
			
		}
	},
  methods: {
		...mapActions(['configDuplicateCheck', 'configSave']),
    addConfig() {
      this.$refs.dialog.open();
    },
		async save(form) {
			console.log(form)
			const data = await this.configSave(form);
			this.$refs.dialog.close();
		},
		async keyCheck(value) {
      const data = await this.configDuplicateCheck({field: 'cf_key', value});
      return data;
    },
  },
};
</script>

<style>
</style>