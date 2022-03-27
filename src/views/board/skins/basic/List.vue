<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
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
    >
      <template v-slot:item.wr_title="{ item }">
        <v-btn
          :to="`/board/${table}/${item.wr_id}`"
          block
          plain
          class="justify-start pl-0"
        >
          <div>{{ item.wr_title }}</div>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import qs from "qs";
import { deepCopy } from "../../../../../util/lib";
export default {
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
      items: [],
      totalItems: 0,
      options: {
        itemsPerPage: 10,
        page: 1,
        stf: [""],
        stc: [""],
        stx: [""],
      },
    };
  },
  computed: {
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
          align: "start",
          sortable: false,
          searchable: false,
					width : "60"
        },
        {
          text: "제목",
          value: "wr_title",
          align: "start",
          sortable: false,
          searchable: true,
        },
        {
          text: "작성자",
          value: "wr_name",
          align: "center",
          sortable: false,
          searchable: true,
        },
        {
          text: "작성일",
          value: "wr_createat",
          align: "center",
          sortable: false,
          searchable: true,
        },
        {
          text: "조회수",
          value: "wr_view",
          align: "center",
          sortable: false,
          searchable: true,
        },
      ];
      if (this.config.bo_use_category) {
        headers.splice(1, 0, {
          text: "Cate",
          value: "wr_category",
          align: "center",
          sortable: false,
          searchable: false,
        });
      }
      return headers;
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
  },
  methods: {
    getPayload() {
      const payload = deepCopy(this.options);
      // 정렬을 설정값에 있는 정렬로 하자
      for (const sort of this.config.bo_sort) {
        payload.sortBy.push(sort.by);
        payload.sortDesc.push(sort.desc == 1);
      }

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
      const data = await this.$axios.get(
        `/api/board/list/${this.table}?${query}`
      );
      this.setData(data);
    },
    setData(data) {
      this.items = data.items;
      this.totalItems = data.totalItems;
    },
  },
};
</script>

<style>
</style>