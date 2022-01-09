<template>
	<div>
		<display-avatar :member="member" :size="size"/>
		<span class="ml-2">{{member.mb_name}}</span>
	</div>
</template>

<script>
import DisplayAvatar from './DisplayAvatar.vue'
export default {
  components: { DisplayAvatar },
	name : "DisplayName",
	props : {
		member: {
			type : Object,
			required: true,
		},
		size : {
			type : [String, Number],
			default : 24
		}
	}
}
</script>

<style>

</style>