<template>
	<v-card flat v-if="item">
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>{{item.wr_title}}</v-toolbar-title>
				<v-spacer/>
				<v-btn :to="`/board/${table}`">목록</v-btn>
			</v-toolbar>
		</v-card-title>
		<v-card-text>
			<ez-tiptap :editable="false" v-model="item.wr_content" />
		</v-card-text>
	</v-card>
	<!-- <div>Basic Read
			<v-btn :to="`/board/${table}`">목록</v-btn>
		<v-btn :to="`/board/${table}?act=write`">쓰기</v-btn>
		<v-btn :to="`/board/${table}/11`">읽기</v-btn>
	</div> -->
</template>

<script>
export default {
	name : "BasicRead",
	props : {
		config : Object,
		access : Object,
		id : [String, Number],
	},
	data() {
		return {
			item : null,
		}
	},
	computed: {
		table() {
			return this.config.bo_table;
		}
	},
	mounted() {
		this.fetchData();
	},
	methods: {
		async fetchData() {
			console.log("FETCH", this.id);
			const data = await this.$axios.get(`/api/board/read/${this.table}/${this.id}`);
			this.setData(data);
		},
		setData(data) {
			this.item = data;
		}
	}
}
</script>

<style>

</style>