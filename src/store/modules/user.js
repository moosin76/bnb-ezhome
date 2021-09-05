import Vue from "vue";
import VueCookies from 'vue-cookies';

export const state = () => ({
	member: null,
	token : null,
});

export const mutations = {
	SET_MEMBER(state, member) {
		state.member = member;
	},
	SET_TOKEN(state, token) {
		state.token = token;
	}
};

export const getters = {

};

export const actions = {
	async initUser({ commit }) {
		const { $axios } = Vue.prototype;
		const data = await $axios.get('/api/member/auth');
		if (data && data.member && data.token ) {
			commit('SET_MEMBER', data.member);
			commit('SET_TOKEN', data.token);
		}
	},
	async duplicateCheck(ctx, { field, value }) {
		const { $axios } = Vue.prototype;
		const data = await $axios.get(`/api/member/duplicateCheck/${field}/${value}`);
		return data;
	},
	async createMember(ctx, form) {
		const { $axios } = Vue.prototype;
		const data = await $axios.post(`/api/member`, form);
		return data;
	},
	async signInLocal({ commit }, form) {
		const { $axios } = Vue.prototype;
		const data = await $axios.post(`/api/member/loginLocal`, form);
		if (data && data.member && data.token) {
			commit('SET_MEMBER', data.member);
			commit('SET_TOKEN', data.token);
		}
		return !!data;
	},
	async signOut ({commit, state}) {
		const mb_name = state.member.mb_name;
		const {$axios} = Vue.prototype;
		await $axios.get('/api/member/signOut');
		// console.log('mb_name', mb_name);
		commit('SET_MEMBER', null);
		commit('SET_TOKEN', null);
		// VueCookies.remove('token');
		return mb_name;
	}
}