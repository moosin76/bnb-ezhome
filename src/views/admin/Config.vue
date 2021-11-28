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

    <draggable
      tag="ul"
      :list="curItems"
      class="list-group"
      handle=".handle"
      @end="sortEnd"
    >
      <config-item
        class="list-group-item"
        v-for="item in curItems"
        :key="item.cf_key"
        :item="item"
        @update="updateConfig"
        @remove="removeConfig"
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
      persistent
    >
      <config-form
        ref="configForm"
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
      item: null,
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
      this.setCurItems();
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["configDuplicateCheck", "configSave"]),
    addConfig() {
      this.item = null;
      if (this.$refs.configForm) {
        this.$refs.configForm.init();
      }
      this.$refs.dialog.open();
    },
    updateConfig(item) {
      this.item = item;
      if (this.$refs.configForm) {
        this.$refs.configForm.init();
      }
      this.$refs.dialog.open();
    },
    async removeConfig(item) {
      // 진짜 지울꺼야?
      const result = await this.$ezNotify.confirm(
        `<b>[${item.cf_name}]</b> 삭제 하시겠습니까?`,
        "설정항목 삭제",
        { icon: "mdi-delete", iconColor: "red" }
      );
      if (!result) return;
      // DB 지우고
      const data = await this.$axios.delete(`/api/config/${item.cf_key}`);
      // 목록 업데이트
      if (data) {
				if(item.cf_client) {
					this.$socket.emit('config:remove', item.cf_key);
				}
        this.$toast.info(`[${item.cf_name}] 삭제 하였습니다.`);
        const idx = this.items.indexOf(item);
        this.items.splice(idx, 1);
        this.setCurItems();
      }
    },
    async save(form) {
      const data = await this.configSave(form);
			if(data.cf_client) {
				this.$socket.emit('config:update', {
					key : data.cf_key, 
					value: data.cf_val
				});
			} else if(this.item && this.item.cf_client){
				this.$socket.emit('config:remove', data.cf_key);
			}

      if (this.item) {
        this.$toast.info(`[${form.cf_name}] 수정 하였습니다.`);
        const idx = this.items.indexOf(this.item);
        this.items.splice(idx, 1, data);
      } else {
        this.$toast.info(`[${form.cf_name}] 추가 하였습니다.`);
        this.items.push(data);
      }
			
      this.setCurItems();
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
      const payload = [];
      this.curItems.forEach((item) => {
        item.cf_sort = i++;
        payload.push({
          cf_key: item.cf_key,
          cf_sort: item.cf_sort,
        });
      });
      this.$axios.put("/api/config", payload);
    },
    setCurItems() {
      this.curItems = this.items.filter((item) => {
        return item.cf_group == this.groupName;
      });
    },
  },
};
</script>

<style>
</style>