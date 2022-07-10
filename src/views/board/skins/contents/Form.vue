<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
      <v-spacer />
      <v-btn @click="save" color="primary" :loading="loading">
        <v-icon left>mdi-pencil</v-icon>
        저장
      </v-btn>
    </v-toolbar>

    <v-form v-if="form" ref="form" v-model="valid" lazy-validation>
      <input-duplicate-check
        ref="id"
        label="ID"
        v-model="form.wr_1"
        :rules="[rules.require({ label: 'ID' }), rules.alphaNum()]"
        :cbCheck="checkId"
        :origin="id ? form.wr_1 : ''"
        :readonly="!!id"
      />

      <v-select label="스킨" v-model="form.wr_2" :items="skins" />

      <v-text-field
        label="제목"
        v-model="form.wr_title"
        counter="120"
        :rules="[rules.require({ label: '제목' })]"
      />

      <ez-tiptap
        :editable="true"
        v-model="form.wr_content"
        @uploadImage="uploadImage"
      />
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import validateRules from "../../../../../util/validateRules";
import InputDuplicateCheck from "../../../../components/InputForms/InputDuplicateCheck.vue";

export default {
  components: { InputDuplicateCheck },
  name: "BasicForm",
  title() {
    return this.pageTitle;
  },
  props: {
    config: Object,
    access: Object,
    id: [String, Number],
  },
  data() {
    return {
      form: null,
      valid: true,
      confimPw: "",
      uploadFiles: Array(this.config.bo_upload_cnt).fill(null),
      tags: [], // TODO : 서버에서 태그 목록을 가져온다.
      loading: false,
      upImages: [],
      isWrite: false, // 작성을 했는지 여부
      parentItem: null, // 부모글
      skins: [],
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
    }),
    table() {
      return this.config.bo_table;
    },
    pid() {
      if (this.$route.query.act == "reply") {
        return this.id;
      } else {
        return 0;
      }
    },
    pageTitle() {
      return (
        this.config.bo_subject + (this.id ? " 게시물 수정" : " 게시물 작성")
      );
    },
    rules: () => validateRules,
  },
  mounted() {
    this.init();
    this.fetchSkinList();
  },
  destroyed() {
    // 작성을 완료하지 않고 에디터에서 업로드한 이미지가 있으면 삭제를 요청함
    if (!this.isWrite && this.upImages.length) {
      this.$axios.put(`/api/board/imgCancle/${this.table}`, this.upImages);
    }
  },
  methods: {
    async checkId() {
      const data = await this.$axios.get(
        `/api/contents/duplicateCheck?wr_1=${this.form.wr_1}`
      );
      return data;
    },
    async fetchSkinList() {
      const data = await this.$axios.get("/api/contents/skinlist");
      this.skins = data;
    },
    async init() {
      if (this.id) {
        const data = await this.$axios.get(
          `/api/board/read/${this.table}/${this.id}`
        );
        if (this.pid) {
          // 부모글의 답글
          this.initForm();
          this.form.wr_category = data.wr_category; // 부모글의 카데고리를 따라감
          this.parentItem = data;
        } else {
          // 수정
          this.form = data;
        }
        this.form.wr_password = "";
      } else {
        // 새글
        this.initForm();
      }
    },
    initForm() {
      const form = {
        wr_reply: 0,
        wr_parent: this.pid, //  답글 작성할때 부모글 아이들 넣음
        mb_id: this.member ? this.member.mb_id : 0, // 0이면 비회원 글 작성임
        wr_email: this.member ? this.member.mb_email : "",
        wr_name: this.member ? this.member.mb_name : "",
        wr_password: "",
        wr_category: this.$route.query.ca || this.config.bo_category[0] || "", // TODO: 링크할때 카데고리 정보를 넘긴다
        wr_title: "",
        wr_content: "",
        wrTags: [],
        // wrImgs: [],
        // wrFiles: [],
      };
      for (let i = 1; i <= 10; i++) {
        form[`wr_${i}`] = "";
      }
      form.wr_2 = "basic";
      this.form = form;
    },
    fileTitle(i) {
      //  TODO : 수정 할때 올렷던 파일 이름 요기서 사용할꺼에요
      if (this.form.wrFiles) {
        const wrFile = this.form.wrFiles[i - 1];
        return wrFile && !wrFile.remove ? wrFile.bf_name : `첨부파일 ${i}`;
      } else {
        return `첨부파일 ${i}`;
      }
    },
    async uploadImage({ file, desc, callback }) {
      const formData = new FormData();
      formData.append("upFile", file);
      formData.append("bf_desc", desc);
      const data = await this.$axios.post(
        `/api/board/imageUpload/${this.table}`,
        formData
      );
      this.upImages.push(data);
      callback(`/upload/${this.table}/${data.bf_src}`);
    },
    async save() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      if (!this.$refs.id.validate()) return;

      this.loading = true;

      const formData = new FormData();
      const keys = Object.keys(this.form);

      for (const key of keys) {
        if (typeof this.form[key] == "object") {
          formData.append(key, JSON.stringify(this.form[key]));
        } else {
          formData.append(key, this.form[key]);
        }
      }

      // 작성시 토큰있는경우 토큰을 삽입
      if (this.$route.query.token) {
        formData.append("token", this.$route.query.token);
      }

      let cnt = 0;
      for (let i = 0; i < this.config.bo_upload_cnt; i++) {
        if (this.uploadFiles[i] != null) {
          formData.append(`upFiles[${cnt}]`, this.uploadFiles[i]);
          cnt++;
        }
      }

      // 에디터에서 업로드한 이미지
      formData.append("upImages", JSON.stringify(this.upImages));

      let wr_id;
      if (this.id && !this.pid) {
        wr_id = await this.update(formData);
      } else {
        wr_id = await this.insert(formData);
      }

      // 글작성이 잘 끝났으면
      if (wr_id) {
        this.isWrite = true;
        this.$router.push(`/board/${this.table}`);
      }

      this.loading = false;
    },
    async insert(formData) {
      const data = await this.$axios.post(
        `/api/board/write/${this.table}`,
        formData
      );
      return data.wr_id;
    },
    async update(formData) {
      const data = await this.$axios.put(
        `/api/board/write/${this.table}/${this.id}`,
        formData
      );
      return data.wr_id;
    },
  },
};
</script>

<style>
</style>