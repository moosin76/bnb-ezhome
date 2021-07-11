import Vue from "vue";
import vuetify from "../plugins/vuetify";
import ezNotify from "./ezNotifyPlugin";

const option = {
	icon: "",
	type: "alert",
	width: 400,
	text : "",
};

Vue.use(ezNotify, vuetify, option);