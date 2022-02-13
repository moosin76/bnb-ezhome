<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>메뉴 관리</v-toolbar-title>
      <v-spacer />
      <tooltip-btn
        label="새 메뉴 추가"
        icon
        small
        fab
        color="secodary"
        @click="addMenu"
      >
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
      <tooltip-btn
        label="저장"
        icon
        small
        fab
        color="primary"
        @click="updateMenu"
      >
        <v-icon>mdi-content-save-outline</v-icon>
      </tooltip-btn>
      <tooltip-btn label="초기화" icon small fab color="error" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </tooltip-btn>
    </v-toolbar>
    <nested-drag-menu :items="items" class="mt-4" />
    <ez-dialog ref="dialog" width="500" label="메뉴" persistent>
      <menu-form :item="curItem" class="mt-4" @save="save" />
    </ez-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { deepCopy } from "../../../util/lib";
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import MenuForm from "./MenuComponents/MenuForm.vue";
import NestedDragMenu from "./MenuComponents/NestedDragMenu.vue";
export default {
  components: { TooltipBtn, NestedDragMenu, EzDialog, MenuForm },
  name: "AdmMenu",
	title : "메뉴관리",
  data() {
    return {
      items: [],
      curItem: null,
      parent: null,
    };
  },
  computed: {
    ...mapState({
      menu: (state) => state.config.menu,
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["configSave"]),
    init() {
      const items = deepCopy(this.menu);
      for (const item of items) {
        this.$set(item, "show", false);
      }
      this.items = items;
      // console.log(items);
    },
    addMenu() {
      this.curItem = null;
      this.$refs.dialog.open();
    },
    modifyMenu(item, parent) {
      console.log(item, parent);
      this.curItem = item;
      this.parent = parent;
      this.$refs.dialog.open();
    },
    save(form) {
      if (this.curItem) {
        const idx = this.parent.indexOf(this.curItem);
        this.parent.splice(idx, 1, form);
      } else {
        form.show = false;
        this.items.push(form);
      }
      this.$refs.dialog.close();
    },
    async refresh() {
      const result = await this.$ezNotify.confirm(
        "메뉴를 초기화 하시겠습니까?",
        "메뉴 초기화",
        { icon: "mdi-refresh" }
      );
      if (!result) return;
      this.init();
    },
    async updateMenu() {
			const result = await this.$ezNotify.confirm(
        "메뉴를 저장 하시겠습니까?",
        "메뉴저장",
        { icon: "mdi-content-save-outline" }
      );
      if (!result) return;
      const data = await this.configSave({
        cf_client: 1,
        cf_comment: "메뉴는 메뉴관리자에서 수정하세요.",
        cf_group: "기본환경",
        cf_key: "menu",
        cf_level: 6,
        cf_name: "메뉴",
        cf_type: "Json",
        cf_val: JSON.stringify(this.items),
      });
      if (data) {
				this.$toast.info('메뉴를 업데이트 하였습니다.');
        // console.log(data);
        this.$socket.emit("config:update", {
          key: data.cf_key,
          value: data.cf_val,
        });
      }
    },
  },
};
</script>

<style>
</style>