<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/adm/board/list" color="accent">목록</v-btn>
      <v-btn color="primary" class="ml-2" @click="save">{{ btnLabel }}</v-btn>
    </v-toolbar>
    <v-form v-if="form" ref="form" v-model="valid" lazy-validation>
      <v-text-field
        label="게시판 ID"
        v-model="form.bo_table"
        counter="30"
        :readonly="!!table"
        :rules="[rules.alphaNum(), rules.require({ label: '게시판 ID' })]"
      />
      <v-text-field
        label="게시판 제목"
        v-model="form.bo_subject"
        counter="100"
        :rules="[rules.require({ label: '게시판 제목' })]"
      />
      <v-select label="게시판 스킨" v-model="form.bo_skin" :items="skins" />
      <!-- 정렬 규칙 -->
      <board-sort :items="form.bo_sort" />

      <div class="d-flex">
        <v-switch label="카테고리 사용" v-model="form.bo_use_category" inset />
        <div style="flex: 1" class="ml-3">
          <v-combobox
            label="카테고리"
            v-model="form.bo_category"
            multiple
            chips
            :disabled="!form.bo_use_category"
            dense
            deletable-chips
            clearable
            append-icon=""
            hint="카테고리 입력 후 Enter로 구분 등록하세요."
          >
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-chip v-bind="attrs" :input-value="selected" label small>
                <span>{{ item }}</span>
                <v-icon small right @click="parent.selectItem(item)"
                  >mdi-close</v-icon
                >
              </v-chip>
            </template>
          </v-combobox>
        </div>
      </div>
      <board-slider label="목록 읽기 레벨" v-model="form.bo_list_level" />
      <board-slider label="게시물 읽기 레벨" v-model="form.bo_read_level" />
      <board-slider label="게시물 쓰기 레벨" v-model="form.bo_write_level" />
      <board-slider label="답변글 쓰기 레벨" v-model="form.bo_reply_level" />
      <board-slider label="덧글 쓰기 레벨" v-model="form.bo_comment_level" />
      <board-slider
        label="파일다운로드 레벨"
        v-model="form.bo_download_level"
      />
      <div class="d-flex">
        <v-slider
          :label="`파일 업로드 개수 : ${form.bo_upload_cnt}`"
          v-model="form.bo_upload_cnt"
          min="0"
          max="10"
          thumb-label
          ticks
        />
        <v-sheet width="200" class="ml-2" style="background: transparent">
          <v-text-field
            type="number"
            label="파일 업로드 용량"
            v-model="form.bo_upload_size"
            dense
            hide-details
            min="1"
            max="500"
            suffix="Mb"
          />
        </v-sheet>
      </div>

      <v-expansion-panels focusable>
        <v-expansion-panel>
          <v-expansion-panel-header>
            게시물 추가 필드 설정
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-for="(item, i) in form.wr_fields" :key="i" class="d-flex">
              <v-tooltip top color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <div v-on="on" v-bind="attrs" class="mt-2 mr-2">
                    <v-switch v-model="item.required" dense inset />
                  </div>
                </template>
                <span>필수 입력</span>
              </v-tooltip>
              <v-text-field
                :label="`추가 필드 제목 ${i + 1}`"
                v-model="item.title"
              />
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>게시판 여분 필드</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-text-field
              v-for="i in 10"
              :label="`여분 필드 ${i}`"
              v-model="form[`bo_${i}`]"
              :key="i"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <v-toolbar class="mt-4">
      <v-btn to="/adm/board/list" color="accent">목록</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="ml-2" @click="save">{{ btnLabel }}</v-btn>
    </v-toolbar>
  </v-container>
</template>

<script>
import { LV } from "../../../../util/level";
import TooltipBtn from "../../../components/etc/TooltipBtn.vue";
import BoardSlider from "./Components/BoardSlider.vue";
import BoardSort from "./Components/BoardSort.vue";
import validateRules from "../../../../util/validateRules";
export default {
  components: { TooltipBtn, BoardSlider, BoardSort },
  name: "AdmBoardForm",
  props: {
    table: String,
  },
  title() {
    return this.pageTitle;
  },
  data() {
    return {
      valid: true,
      form: null,
      skins: [],
    };
  },
  computed: {
    pageTitle() {
      return this.table ? `${this.table} 게시판 수정` : `게시판 생성`;
    },
    btnLabel() {
      return this.table ? "수정" : "생성";
    },
    rules: () => validateRules,
  },
  mounted() {
    this.init();
    this.fetchSkinList();
  },
  methods: {
    async init() {
      if (this.table) {
        // 수정 : 게시물 정보를 가지고 와서 넣주자
        const data = await this.$axios.get(`/api/adm/board/${this.table}`);
        data.bo_category = JSON.parse(data.bo_category);
        data.bo_sort = JSON.parse(data.bo_sort);
        data.wr_fields = JSON.parse(data.wr_fields);
        this.form = data;
      } else {
        // 신규
        const form = {
          bo_table: "",
          bo_subject: "",
          bo_skin: "basic",
          bo_list_level: LV.BLOCK,
          bo_read_level: LV.BLOCK,
          bo_write_level: LV.BLOCK,
          bo_reply_level: LV.BLOCK,
          bo_comment_level: LV.BLOCK,
          bo_download_level: LV.BLOCK,
          bo_upload_cnt: 2,
          bo_upload_size: 2,
          bo_category: [],
          bo_use_category: 0,
          bo_sort: [
            { by: "wr_grp", desc: 0 },
            { by: "wr_order", desc: 1 },
          ],
          wr_fields: [],
        };
        for (let i = 1; i <= 10; i++) {
          form[`bo_${i}`] = "";
          form.wr_fields.push({ title: "", required: 0 });
        }
        this.form = form;
      }
    },
    async fetchSkinList() {
      const data = await this.$axios.get("/api/adm/board/skinlist");
      this.skins = data;
    },
    async save() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      // console.log(this.form);

      let data = false;
      if (this.table) {// 수정
				data = await this.$axios.put(`/api/adm/board/${this.table}`, this.form);
      } else { // 생성
        data = await this.$axios.post("/api/adm/board", this.form);
      }
			
      if (data) {
        this.$toast.info(
          `${this.form.bo_subject} 게시판을 ${this.btnLabel}하였습니다.`
        );
        this.$router.push("/adm/board/list");
      }
    },
  },
};
</script>

<style>
</style>