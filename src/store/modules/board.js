import Vue from 'vue';
import axios from "axios";

export const state = () => ({
	config: null,
	list: [],
	totalItems: 0,
	read: null,
});

export const mutations = {
	SET_CONFIG(state, config) {
		state.config = config;
	},
	SET_LIST(state, { items, totalItems }) {
		state.list = items;
		state.totalItems = totalItems;
	},
	SET_READ(state, read) {
		state.read = read;
	}
}

let axiosToken = {
	axiosSource: null
};

export const actions = {
	async getBoardConfig({ commit }, table) {
		const { $axios } = Vue.prototype;
		const data = await $axios.get(`/api/board/config/${table}`);
		if (data) {
			commit('SET_CONFIG', data);
		}
	},
	async getBoardList({ commit }, { vm, query, headers }) {
		const { $axios } = Vue.prototype;
		const { table } = vm;
		if (axiosToken.axiosSource) {
			axiosToken.axiosSource.cancel("fetchData 취소");
		}
		axiosToken.axiosSource = axios.CancelToken.source();
		try {
			const data = await $axios.get(
				`/api/board/list/${table}?${query}`,
				{ headers, cancelToken: axiosToken.axiosSource.token }
			);
			if (data) {
				commit('SET_LIST', data);
				vm.pushState();
				vm.pageReady = true;
				vm.pageRouting = false;
			}
		} catch (e) {
			console.log("요청 취소 >", e.message);
		}
	},
	async getBoardRead({ commit }, { table, id, headers }) {
		const { $axios } = Vue.prototype;
		const data = await $axios.get(
			`/api/board/read/${table}/${id}`,
			{ headers }
		);
		if (data) {
			commit('SET_READ', data);
		}
	}
}