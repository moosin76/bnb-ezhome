import ezNotifyInterface from "./ezNotifyInterface.vue";

const defaultOption = {
	icon: "",
	iconColor: "orange",
	width: 300,
	text : "",
	formType : 'text',
};

export default {
	install(Vue, vuetify, options) {
		const Construct = Vue.extend(ezNotifyInterface);
		const Instance = new Construct({
			vuetify : vuetify,
			data: {
				options : Object.assign(defaultOption, options)
			}
		});
		Vue.prototype.$nextTick(()=> {
			Vue.prototype.$ezNotify = Instance.$mount();
			document.getElementById('app').appendChild(Instance.$el);
		})
	}
}