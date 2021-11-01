<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>설정관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn fab small label="설정 추가" @click="addConfig">
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
    </v-toolbar>

    <v-row>
      <v-col>
        <v-tabs v-model="group" background-color="primary" dark>
          <v-tab v-for="item in groupItems" :key="item.cf_key">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <draggable tag="ul" :list="curItems" class="list-group" handle=".handle" @end="sortEnd">
      <config-item
        class="list-group-item"
        v-for="item in curItems"
        :key="item.cf_key"
        :item="item"
				@update="updateConfig"
      >
      </config-item>
    </draggable>

    <!-- 설정 다이얼로그 -->
    <ez-dialog
      label="설정 추가"
      ref="dialog"
      max-width="500"
      dark
      color="primary"
    >
      <config-form
        @save="save"
        :keyCheck="keyCheck"
        :groupItems="groupItems"
				:item="item"
      ></config-form>
    </ez-dialog>
    <!-- // 설정 다이얼로그 -->
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import ConfigForm from "./ConfigComponents/ConfigForm.vue";
import ConfigItem from "./ConfigComponents/ConfigItem.vue";
import draggable from "vuedraggable";

export default {
  components: { TooltipBtn, EzDialog, ConfigForm, ConfigItem, draggable },
  name: "admConfig",
  data() {
    return {
      items: [],
      group: -1,
      curItems: [],
			item : null,
    };
  },
  computed: {
    groupItems() {
      const sets = new Set();
      this.items.forEach((item) => {
        sets.add(item.cf_group);
      });
      return [...sets];
    },
    groupName() {
      return this.groupItems[this.group] || "";
    },
  },
  watch: {
    group() {
      this.curItems = this.items.filter((item) => {
        return item.cf_group == this.groupName;
      });
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["configDuplicateCheck", "configSave"]),
    addConfig() {
			this.item = null;
      this.$refs.dialog.open();
    },
		updateConfig(item) {
			this.item = item;
			this.$refs.dialog.open();
		},
    async save(form) {
      console.log(form);
      const data = await this.configSave(form);
      this.$refs.dialog.close();
    },
    async keyCheck(value) {
      const data = await this.configDuplicateCheck({ field: "cf_key", value });
      return data;
    },
    async fetchData() {
      this.items = await this.$axios.get("/api/config?all=true");
    },
		sortEnd() {
			// 현제 curItems 있는 정보로 cf_sort 업데이트 전체
			let i = 0;
			this.curItems.forEach((item)=>{
				item.cf_sort = i++;
			});
			this.$axios.put('/api/config', this.curItems);
		}
  },
};
</script>

<style>

</style>