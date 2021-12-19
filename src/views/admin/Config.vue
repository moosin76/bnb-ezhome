<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>설정관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn
        fab
        small
        label="설정 추가"
        color="primary"
        @click="addConfig"
      >
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
      <tooltip-btn
        fab
        small
        label="서버 재시작"
        color="error"
        @click="restartServer"
        childClass="ml-2"
        :loading="restart"
      >
        <v-icon>mdi-power</v-icon>
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
import { mapActions, mapState } from "vuex";
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
      restart: false,
    };
  },
  computed: {
    ...mapState({
      online: (state) => state.socket.online,
    }),
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
    online() {
      if (this.online) {
        this.$toast.info("서버가 재시작 되었습니다.");
        this.restart = false;
      }
    },
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
        if (item.cf_client) {
          this.$socket.emit("config:remove", item.cf_key);
        }
        this.$toast.info(`[${item.cf_name}] 삭제 하였습니다.`);
        const idx = this.items.indexOf(item);
        this.items.splice(idx, 1);
        this.setCurItems();
      }
    },
    async save(form) {
      const data = await this.configSave(form);
      if (data.cf_client) {
        this.$socket.emit("config:update", {
          key: data.cf_key,
          value: data.cf_val,
        });
      } else if (this.item && this.item.cf_client) {
        this.$socket.emit("config:remove", data.cf_key);
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
      this.curItems = this.items
        .filter((item) => item.cf_group == this.groupName)
        .sort((a, b) => a.cf_sort - b.cf_sort);
    },
    async restartServer() {
      const result = await this.$ezNotify.confirm(
        "서버 재시작 요청을 하시겠습니까?",
        "서버 재시작",
        { icon: "mdi-power", iconColor: "red" }
      );

      if (!result) return;
      this.restart = true;
      const data = await this.$axios.get("/api/config/restart");
      if (data) {
        setTimeout(() => {
          if (this.restart) {
            this.$toast.error(
              "서버 재시작이 실패했습니다.\n잠시 후 다시 시도 하세요."
            );
            this.restart = false;
          }
        }, 20000);
      } else {
        this.restart = false;
      }
    },
  },
};
</script>

<style>
</style>