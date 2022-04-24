<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
      <v-sheet v-if="config.bo_use_category == 1" width="150" class="ml-4">
        <cate-select :options.sync="options" />
      </v-sheet>
      <search-field :items="searchItems" :options.sync="options" class="ml-4" />

      <v-spacer />
      <v-btn :to="`/board/${table}?act=write`" color="primary">
        <v-icon left>mdi-pencil</v-icon>
        새글 작성
      </v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
      class="fixedTable"
    >
      <template v-slot:item.no="{ index }">
        {{ getNo(index) }}
      </template>

      <template v-slot:item.wr_title="{ item }">
        <v-btn
          :to="`/board/${table}/${item.wr_id}`"
          block
          plain
          class="text-none px-0 justify-start basic-title"
        >
          <div class="d-flex justify-start align-center">
            <v-icon
              v-if="item.wr_dep > 0"
              :style="{ 'padding-left': `${(item.wr_dep - 1) * 16}px` }"
            >
              mdi-subdirectory-arrow-right
            </v-icon>
            <div
              class="text-truncate"
              :style="{
                'max-width': `calc(100% - 20px - ${
                  item.wr_dep > 0 ? (item.wr_dep - 1) * 16 + 24 : 0
                }px)`,
              }"
            >
              {{ item.wr_title }}
            </div>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  v-on="on"
                  v-bind="attrs"
                  x-small
                  label
                  color="green"
                  class="px-1 ml-1"
                >
                  {{ item.replys }}
                </v-chip>
              </template>
              <span>댓글수 : {{ item.replys }}</span>
            </v-tooltip>
          </div>
        </v-btn>
      </template>

      <template #item.wr_createat="{ item }">
        <display-time :time="item.wr_createat" />
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import qs from "qs";
import { deepCopy } from "../../../../../util/lib";
import { mapActions, mapState } from "vuex";
import SearchField from "../../../../components/layout/SearchField.vue";
import CateSelect from "./component/CateSelect.vue";
import DisplayTime from "./component/DisplayTime.vue";

export default {
  components: { SearchField, CateSelect, DisplayTime },
  name: "BasicList",
  props: {
    config: Object,
    access: Object,
  },
  title() {
    return this.pageTitle;
  },
  data() {
    return {
      loading: false,
      options: {},
      pageRouting: false,
      pageReady: false,
    };
  },
  computed: {
    ...mapState({
      items: (state) => state.board.list,
      totalItems: (state) => state.board.totalItems,
    }),
    table() {
      return this.config.bo_table;
    },
    pageTitle() {
      return this.config.bo_subject + " 게시판";
    },
    headers() {
      const headers = [
        {
          text: "No",
          value: "no",
          align: "right",
          sortable: false,
          searchable: false,
          width: "80",
        },
        // {text: "ID",value : 'wr_id'},
        // {text: "GRP",value : 'wr_grp'},
        // {text: "ORD",value : 'wr_order'},
        // {text: "DEP",value : 'wr_dep'},
        // {text: "PR",value : 'wr_parent'},
        {
          text: "제목",
          value: "wr_title",
          align: "start",
          sortable: false,
          searchable: true,
          cellClass: "text-truncate",
        },
        {
          text: "작성자",
          value: "wr_name",
          align: "center",
          sortable: false,
          searchable: true,
          width: "100",
        },
        {
          text: "작성일",
          value: "wr_createat",
          align: "center",
          sortable: false,
          searchable: false,
          width: "123",
        },
        {
          text: "조회수",
          value: "wr_view",
          align: "center",
          sortable: false,
          searchable: false,
          width: "80",
        },
      ];
      if (this.config.bo_use_category) {
        headers.splice(1, 0, {
          text: "Cate",
          value: "wr_category",
          align: "center",
          sortable: false,
          searchable: false,
          width: "80",
        });
      }
      return headers;
    },
    searchItems() {
      const arr = this.headers.filter((item) => item.searchable);
      arr.push({
        text: "내용",
        value: "wr_content",
      });
      return arr;
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
    table() {
      this.fetchData();
    },
  },
  serverPrefetch() {
    return this.fetchData();
  },
  created() {
    this.options = this.initOptions();
  },
  mounted() {
    window.addEventListener("popstate", this.routeChange);
  },
  destroyed() {
    window.removeEventListener("popstate", this.routeChange);
  },
  methods: {
    ...mapActions("board", ["getBoardList"]),
    initOptions() {
      const { query } = this.$route;
      const options = {
        page: Number(query.page) || 1,
        itemsPerPage: Number(query.itemsPerPage) || 10,
        stf: [query.stf || "", "wr_category"],
        stx: [query.stx || "", ""],
        stc: [query.stc || "", "eq"],
      };
      return options;
    },
    pushState() {
      // console.log("PageRouting", this.pageRouting);
      if (!this.pageRouting) {
        const opt = {
          page: this.options.page,
          itemsPerPage: this.options.itemsPerPage,
          stf: this.options.stf[0] || undefined,
          stx: this.options.stx[0] || undefined,
          stc: this.options.stc[0] || undefined,
          ca: this.options.stx[1] || undefined,
        };
        const query = qs.stringify(opt);
        if (this.pageReady) {
          history.pushState(null, null, `${this.$route.path}?${query}`);
        } else {
          history.replaceState(null, null, `${this.$route.path}?${query}`);
        }
      }
    },
    routeChange() {
      this.pageRouting = true;
      this.options = this.initOptions();
    },
    getPayload() {
      const payload = deepCopy(this.options);
      // 리플이 아닌 목록 검색
      payload.stf.push("wr_reply");
      payload.stc.push("eq");
      payload.stx.push("0");
      // TODO : 카데고리 별로도 검색
      return payload;
    },
    async fetchData() {
      const payload = this.getPayload();
      const query = qs.stringify(payload);
      const headers = {};
      if (this.$ssrContext) {
        headers.token = this.$ssrContext.token;
      }
      await this.getBoardList({ vm: this, query, headers });
    },
    getNo(index) {
      const { page, itemsPerPage } = this.options;
      const { totalItems } = this;
      return totalItems - (page - 1) * itemsPerPage - index;
    },
  },
};
</script>
