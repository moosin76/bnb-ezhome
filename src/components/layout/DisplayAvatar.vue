<template>
  <v-avatar color="accent" :size="size">
    <template v-if="member">
      <v-img
        v-if="hasImage"
        :src="memberPhoto"
        @error="imageError"
      ></v-img>
      <div v-else>{{ member.mb_name[0] }}</div>
    </template>
    <v-icon v-else>mdi-account</v-icon>
  </v-avatar>
</template>

<script>
export default {
  name: "DisplayAvatar",
	props : {
		member : {
			type: Object,
			default : null
		},
		size : {
			type : [String, Number],
			default : 32
		}
	},
	data() {
		return {
			hasImage : true,
		}
	},
	watch : {
		member() {	
			this.hasImage = true;
		}
	},
	computed : {
		memberPhoto() {
			if(this.member.mb_photo && !this.member.mb_photo.startsWith('/upload')) {
				return this.member.mb_photo;
			} else {
				// 경로.jpg?v=1&w=32&h=32
				// console.log(this.member.mb_photo);
				return this.member.mb_photo + `?w=${this.size}&h=${this.size}`;
			}
			// return this.member.mb_photo || `/upload/memberPhoto/${this.member.mb_id}.jpg?w=32&h=32`
		}
	},
	methods : {
		imageError(){
			this.hasImage = false;
		}
	}
};
</script>

<style>
</style>