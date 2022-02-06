<template>
  <li v-if="member">
    <v-icon class="handle">mdi-drag</v-icon>
    <div>
      <div>
        <div>
          <b>{{ item.cf_name }}</b>
        </div>
        <div><pre class="comment" v-html="item.cf_comment"></pre></div>
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-avatar v-on="on" v-bind="attrs" color="primary" dark size="32">
                <span class="white--text">{{ item.cf_level }}</span>
              </v-avatar>
            </template>
            <span>접근 레벨</span>
          </v-tooltip>
        </div>
        <div>
          <v-btn icon :disabled="isGrant" @click="$emit('update', item)"><v-icon>mdi-pencil</v-icon></v-btn>
        </div>
      </div>
      <div>
        <div>
          <b>{{ item.cf_key }}</b>
        </div>
        <div>
					<type-value :fieldType="item.cf_type" :value="item.cf_val" :readonly="true"/>
				</div>
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div class="client" v-on="on" v-bind="attrs">
                <v-checkbox
                  v-model="item.cf_client"
                  readonly
                  hide-details
                  dense
                ></v-checkbox>
              </div>
            </template>
            <span>클라이언트 접근유무</span>
          </v-tooltip>
        </div>
        <div>
          <v-btn icon :disabled="isGrant" @click="$emit('remove',item)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { mapState } from 'vuex';
import TypeValue from './TypeValue.vue';
export default {
  components: { TypeValue },
  name: "ConfigItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
	computed : {
		...mapState({
			member : state=> state.user.member,
		}),
		isGrant() {
			return this.item.cf_level > this.member.mb_level
		}
	},
};
</script>

<style>
</style>