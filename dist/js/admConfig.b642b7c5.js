(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["admConfig"],{9415:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",{attrs:{fluid:""}},[n("v-toolbar",[n("v-toolbar-title",[e._v("설정관리")]),n("v-spacer"),n("tooltip-btn",{attrs:{fab:"",small:"",label:"설정 추가"},on:{click:e.addConfig}},[n("v-icon",[e._v("mdi-plus")])],1)],1),n("v-row",[n("v-col",[n("v-tabs",{attrs:{"background-color":"primary",dark:""},model:{value:e.group,callback:function(t){e.group=t},expression:"group"}},e._l(e.groupItems,(function(t){return n("v-tab",{key:t.cf_key},[e._v(" "+e._s(t)+" ")])})),1)],1)],1),n("draggable",{staticClass:"list-group",attrs:{tag:"ul",list:e.curItems,handle:".handle"},on:{end:e.sortEnd}},e._l(e.curItems,(function(t){return n("config-item",{key:t.cf_key,staticClass:"list-group-item",attrs:{item:t},on:{update:e.updateConfig,remove:e.removeConfig}})})),1),n("ez-dialog",{ref:"dialog",attrs:{label:"설정 추가","max-width":"500",dark:"",color:"primary",persistent:""}},[n("config-form",{ref:"configForm",attrs:{keyCheck:e.keyCheck,groupItems:e.groupItems,item:e.item},on:{save:e.save}})],1)],1)},a=[],i=n("1da1"),o=n("5530"),c=n("2909"),l=(n("96cf"),n("d3b7"),n("6062"),n("3ca3"),n("ddb0"),n("159b"),n("a434"),n("4de4"),n("2f62")),s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-dialog",e._b({model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},"v-dialog",e.$attrs,!1),[n("v-card",[n("v-toolbar",e._b({},"v-toolbar",e.$attrs,!1),[n("v-toolbar-title",[e._v(e._s(e.label))]),n("v-spacer"),n("v-btn",{attrs:{icon:""},on:{click:e.close}},[n("v-icon",[e._v("mdi-close")])],1)],1),n("v-card-text",[e._t("default")],2)],1)],1)},u=[],f={name:"ezDialog",props:{label:{type:String,required:!0}},data:function(){return{dialog:!1}},methods:{open:function(){this.dialog=!0},close:function(){this.dialog=!1}}},m=f,p=n("2877"),v=Object(p["a"])(m,s,u,!1,null,null,null),d=v.exports,_=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on,a=t.attrs;return[n("v-btn",e._g(e._b({on:{click:function(t){return e.$emit("click")}}},"v-btn",Object.assign({},e.$attrs,a),!1),r),[e._t("default")],2)]}}],null,!0)},[n("span",[e._v(e._s(e.label))])])},g=[],b={name:"TooltipBtn",props:{label:{type:String,required:!0}}},h=b,y=Object(p["a"])(h,_,g,!1,null,null,null),k=y.exports,x=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(t){return t.preventDefault(),e.save.apply(null,arguments)}},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[n("v-combobox",{attrs:{items:e.groupItems,label:"그룹",rules:[e.rules.require({label:"그룹"})]},model:{value:e.form.cf_group,callback:function(t){e.$set(e.form,"cf_group",t)},expression:"form.cf_group"}}),n("div",{staticClass:"d-flex"},[n("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on,a=t.attrs;return[n("span",e._g(e._b({staticClass:"mr-2"},"span",a,!1),r),[n("v-checkbox",{attrs:{color:"primary","true-value":"1","false-value":"0"},model:{value:e.form.cf_client,callback:function(t){e.$set(e.form,"cf_client",t)},expression:"form.cf_client"}})],1)]}}])},[n("span",[e._v("클라이언트")])]),n("input-duplicate-check",{ref:"cfKey",attrs:{label:"키",cbCheck:e.keyCheck,origin:e.originKey,readonly:!!e.item,rules:[e.rules.require({label:"키"}),e.rules.alphaNum()]},model:{value:e.form.cf_key,callback:function(t){e.$set(e.form,"cf_key",t)},expression:"form.cf_key"}})],1),n("v-text-field",{attrs:{label:"이름",rules:e.rules.name()},model:{value:e.form.cf_name,callback:function(t){e.$set(e.form,"cf_name",t)},expression:"form.cf_name"}}),n("v-select",{attrs:{label:"값 타입",items:e.typeItems},model:{value:e.form.cf_type,callback:function(t){e.$set(e.form,"cf_type",t)},expression:"form.cf_type"}}),n("type-value",{attrs:{fieldType:e.form.cf_type},model:{value:e.form.cf_val,callback:function(t){e.$set(e.form,"cf_val",t)},expression:"form.cf_val"}}),n("v-slider",{attrs:{label:"접근레벨 ("+e.form.cf_level+")",min:e.LV.ADMIN,max:e.LV.SUPER,"thumb-color":"primary","thumb-label":""},model:{value:e.form.cf_level,callback:function(t){e.$set(e.form,"cf_level",t)},expression:"form.cf_level"}}),n("v-textarea",{attrs:{label:"설명"},model:{value:e.form.cf_comment,callback:function(t){e.$set(e.form,"cf_comment",t)},expression:"form.cf_comment"}}),n("v-btn",{attrs:{type:"submit",block:""}},[e._v("저장")])],1)},$=[],C=n("50d8"),w=function(){var e=this,t=e.$createElement,n=e._self._c||t;return"String"==e.fieldType?n("div",[n("v-text-field",{attrs:{label:"Value",value:e.value,readonly:e.readonly,"hide-details":e.readonly},on:{input:e.onInput}})],1):"Number"==e.fieldType?n("div",[n("v-text-field",{attrs:{label:"Value",type:"number",value:e.value,readonly:e.readonly,"hide-details":e.readonly},on:{input:e.onInput}})],1):"Json"==e.fieldType?n("div",[e.readonly?[n("v-btn",{attrs:{color:"primary"},on:{click:e.jsonView}},[e._v("JSON 보기")]),n("ez-dialog",{ref:"dialog",attrs:{label:"JSON 값 보기",width:"600"}},[n("pre",{staticClass:"mt-4"},[e._v(e._s(e.stringify()))])])]:n("v-textarea",{attrs:{label:"Value",value:e.value,readonly:e.readonly},on:{input:e.onInput}})],2):"Secret"==e.fieldType?n("div",[n("input-password",{attrs:{label:"Secret Value",value:e.value,readonly:e.readonly,"hide-details":e.readonly},on:{input:e.onInput}})],1):n("div",[n("div",[e._v("타입을 먼저 선택해 주세요.")])])},I=[],O=n("445e"),S=n("ac4f"),j=n.n(S),V={components:{InputPassword:O["a"],EzDialog:d},name:"TypeValue",model:{prop:"value",event:"input"},props:{value:{type:String},fieldType:{type:String,default:"String"},readonly:{type:Boolean,default:!1}},methods:{onInput:function(e){this.$emit("input",e)},stringify:function(){var e=JSON.parse(this.value),t=j()(e,{space:"  "});return console.log(t),t},jsonView:function(){this.$refs.dialog.open()}}},E=V,N=Object(p["a"])(E,w,I,!1,null,null,null),T=N.exports,J=n("bb5e"),R=n("248f"),D=n.n(R),z=n("64f2"),F={components:{InputDuplicateCheck:C["a"],TypeValue:T},name:"ConfigForm",props:{keyCheck:{type:Function,default:null},groupItems:{type:Array,default:[]},item:{type:Object,default:null}},data:function(){return{valid:!0,form:null,typeItems:["String","Number","Json","Secret"],originKey:null}},computed:{LV:function(){return J["LV"]},rules:function(){return D.a}},created:function(){this.init()},watch:{item:function(){this.init()}},methods:{init:function(){if(this.item){if(this.form=Object(z["deepCopy"])(this.item),"Json"==this.form.cf_type){var e=JSON.parse(this.form.cf_val);this.form.cf_val=j()(e,{space:"  "})}this.originKey=this.item.cf_key}else this.form={cf_key:"",cf_val:"",cf_name:"",cf_group:"",cf_level:"",cf_type:"String",cf_comment:"",cf_client:0},this.originKey="";this.$refs.form&&this.$refs.form.resetValidation()},save:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var n,r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.$refs.form.validate(),t.next=3,e.$nextTick();case 3:if(e.valid){t.next=5;break}return t.abrupt("return");case 5:if(e.$refs.cfKey.validate()){t.next=7;break}return t.abrupt("return");case 7:e.item||(n=0,r=Object(z["findParentVm"])(e,"admConfig"),r.items.forEach((function(t){t.cf_group==e.form.cf_group&&n++})),e.form.cf_sort=n);try{"Json"==e.form.cf_type&&(a=JSON.parse(e.form.cf_val),e.form.cf_val=JSON.stringify(a)),e.$emit("save",e.form)}catch(i){e.$toast.error("JSON 형식이 올바르지 않습니다.")}case 9:case"end":return t.stop()}}),t)})))()}}},K=F,q=Object(p["a"])(K,x,$,!1,null,null,null),L=q.exports,P=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("li",[n("v-icon",{staticClass:"handle"},[e._v("mdi-drag")]),n("div",[n("div",[n("div",[n("b",[e._v(e._s(e.item.cf_name))])]),n("div",[n("pre",{staticClass:"comment",domProps:{innerHTML:e._s(e.item.cf_comment)}})]),n("div",[n("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on,a=t.attrs;return[n("v-avatar",e._g(e._b({attrs:{color:"primary",dark:"",size:"32"}},"v-avatar",a,!1),r),[n("span",{staticClass:"white--text"},[e._v(e._s(e.item.cf_level))])])]}}])},[n("span",[e._v("접근 레벨")])])],1),n("div",[n("v-btn",{attrs:{icon:""},on:{click:function(t){return e.$emit("update",e.item)}}},[n("v-icon",[e._v("mdi-pencil")])],1)],1)]),n("div",[n("div",[n("b",[e._v(e._s(e.item.cf_key))])]),n("div",[n("type-value",{attrs:{fieldType:e.item.cf_type,value:e.item.cf_val,readonly:!0}})],1),n("div",[n("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on,a=t.attrs;return[n("div",e._g(e._b({staticClass:"client"},"div",a,!1),r),[n("v-checkbox",{attrs:{readonly:"","hide-details":"",dense:""},model:{value:e.item.cf_client,callback:function(t){e.$set(e.item,"cf_client",t)},expression:"item.cf_client"}})],1)]}}])},[n("span",[e._v("클라이언트 접근유무")])])],1),n("div",[n("v-btn",{attrs:{icon:""},on:{click:function(t){return e.$emit("remove",e.item)}}},[n("v-icon",[e._v("mdi-delete")])],1)],1)])])],1)},B=[],A={components:{TypeValue:T},name:"ConfigItem",props:{item:{type:Object,required:!0}}},M=A,H=Object(p["a"])(M,P,B,!1,null,null,null),U=H.exports,G=n("b76a"),Q=n.n(G),W={components:{TooltipBtn:k,EzDialog:d,ConfigForm:L,ConfigItem:U,draggable:Q.a},name:"admConfig",data:function(){return{items:[],group:-1,curItems:[],item:null}},computed:{groupItems:function(){var e=new Set;return this.items.forEach((function(t){e.add(t.cf_group)})),Object(c["a"])(e)},groupName:function(){return this.groupItems[this.group]||""}},watch:{group:function(){this.setCurItems()}},mounted:function(){this.fetchData()},methods:Object(o["a"])(Object(o["a"])({},Object(l["b"])(["configDuplicateCheck","configSave"])),{},{addConfig:function(){this.item=null,this.$refs.configForm&&this.$refs.configForm.init(),this.$refs.dialog.open()},updateConfig:function(e){this.item=e,this.$refs.configForm&&this.$refs.configForm.init(),this.$refs.dialog.open()},removeConfig:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function n(){var r,a,i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.$ezNotify.confirm("<b>[".concat(e.cf_name,"]</b> 삭제 하시겠습니까?"),"설정항목 삭제",{icon:"mdi-delete",iconColor:"red"});case 2:if(r=n.sent,r){n.next=5;break}return n.abrupt("return");case 5:return n.next=7,t.$axios.delete("/api/config/".concat(e.cf_key));case 7:a=n.sent,a&&(t.$toast.info("[".concat(e.cf_name,"] 삭제 하였습니다.")),i=t.items.indexOf(e),t.items.splice(i,1),t.setCurItems());case 9:case"end":return n.stop()}}),n)})))()},save:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function n(){var r,a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.configSave(e);case 2:r=n.sent,t.item?(t.$toast.info("[".concat(e.cf_name,"] 수정 하였습니다.")),a=t.items.indexOf(t.item),t.items.splice(a,1,r)):(t.$toast.info("[".concat(e.cf_name,"] 추가 하였습니다.")),t.items.push(r)),t.setCurItems(),t.$refs.dialog.close();case 6:case"end":return n.stop()}}),n)})))()},keyCheck:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.configDuplicateCheck({field:"cf_key",value:e});case 2:return r=n.sent,n.abrupt("return",r);case 4:case"end":return n.stop()}}),n)})))()},fetchData:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$axios.get("/api/config?all=true");case 2:e.items=t.sent;case 3:case"end":return t.stop()}}),t)})))()},sortEnd:function(){var e=0;this.curItems.forEach((function(t){t.cf_sort=e++})),this.$axios.put("/api/config",this.curItems)},setCurItems:function(){var e=this;this.curItems=this.items.filter((function(t){return t.cf_group==e.groupName}))}})},X=W,Y=Object(p["a"])(X,r,a,!1,null,null,null);t["default"]=Y.exports}}]);
//# sourceMappingURL=admConfig.b642b7c5.js.map