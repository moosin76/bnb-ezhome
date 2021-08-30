import Vue from "vue";
import VueCookies from 'vue-cookies';

export const state = () => ({
	member: null,

});

export const mutations = {
	SET_MEMBER(state, member) {
		state.member = member;
	}
};

export const getters = {

};

export const actions = {
	async initUser({ commit }) {
		const { $axios } = Vue.prototype;
		const member = await $axios.get('/api/member/auth');
		if (member) {
			commit('SET_MEMBER', member);
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
		if (data && data.member) {
			commit('SET_MEMBER', data.member);
			VueCookies.set('token', data.token);
		}
		return !!data;
	},
	async signOut ({commit, state}) {
		const mb_name = state.member.mb_name;
		// console.log('mb_name', mb_name);
		commit('SET_MEMBER', null);
		VueCookies.remove('token');
		return mb_name;
	}
}