<template>
  <div>
    <v-divider />
    <v-list-item>
      <div>
        <v-icon
          v-if="item.wr_dep > 0"
          :style="{
            'padding-left': `${(item.wr_dep - 1) * 32 + 8}px`,
          }"
        >
          mdi-subdirectory-arrow-right
        </v-icon>
      </div>
      <v-list-item-content>
        <v-subheader>
          <v-avatar size="28" color="primary">{{ item.wr_name[0] }}</v-avatar>
          <div>
            {{ item.wr_name }}
            <i>{{ item.wr_email }}</i>
          </div>
          <v-spacer />
          <v-icon small>mdi-clock-outline</v-icon>
          <display-time :time="item.wr_createat" />
        </v-subheader>
				
				<commnet-form
					v-if="isModify"
					:item="item"
					:table="table"
					:wr_reply="item.wr_reply"
					:wr_parent="item.wr_parent"
					@onClose="isModify = false"
					@onUpdate="modifyComment"
        />
        <div v-else class="text-pre">{{ item.wr_content }}</div>

        <div class="d-flex">
          <board-button
            v-if="access.comment && !!member"
            label="답글쓰기"
            icon="mdi-pencil-outline"
            plain
						@click="isComment = !isComment"
          />
          <v-spacer />
          <board-button
            v-if="modifyGrant"
            label="수정"
            icon="mdi-pencil-outline"
            plain
						@click="isModify = !isModify"
          />
          <board-button
            v-if="modifyGrant"
            label="삭제"
            icon="mdi-delete-outline"
            plain
            color="red"
          />
        </div>
        <commnet-form
					v-if="isComment"
          :wr_parent="item.wr_id"
          :wr_reply="item.wr_reply"
          :table="table"
					@onClose="isComment = false"
					@onUpdate="inComment"
        />
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DisplayTime from "./DisplayTime.vue";
import BoardButton from "./boardButton.vue";
import CommnetForm from "./CommnetForm.vue";
import { LV } from "../../../../../../util/level";

export default {
  components: { DisplayTime, BoardButton, CommnetForm },
  name: "CommentItem",
  props: {
    item: { type: Object, required: true },
    table: { type: String, required: true },
    idx: { type: Number, required: true },
    access: { type: Object, required: true },
  },
	data() {
		return {
			isComment : false,
			isModify : false,
		}
	},
  computed: {
    ...mapState("user", ["member"]),
    ...mapGetters("user", ["GRANT"]),
    modifyGrant() {
      if (this.member) {
        if (this.member.mb_id == this.item.mb_id || this.GRANT >= LV.SUPER) {
          return true;
        }
      }
      return false;
    },
  },
  mounted() {
    // console.log("ITem mounted", this.member, this.modifyGrant);
  },
	methods: {
		inComment(child) {
			this.$emit('onInComment', this.item, child);
		},
		modifyComment(item) {
			this.$emit('onUpdate', item);
		}
	}
};
</script>

<style>
</style>