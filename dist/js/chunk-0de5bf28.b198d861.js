(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0de5bf28"],{"00af":function(e,t,a){},"89f6":function(e,t,a){"use strict";var i=a("00af"),n=a.n(i);n.a},c80f:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"pa-md"},[a("div",{staticClass:"card-grid"},e._l(e.classes,function(t,i){return a("div",{key:i},[a("div",{staticClass:"card"},[a("div",{staticClass:"card-header"},[a("EditableText",{attrs:{placeholder:"Nome do tipo"},model:{value:t.name,callback:function(a){e.$set(t,"name",a)},expression:"type.name"}}),a("Button",{staticClass:"minimal"},[a("i",{staticClass:"fas fa-times icon"})])],1),a("div",{staticClass:"divider vertical"}),a("div",{staticClass:"card-content"},e._l(t.fields,function(t,i){return a("div",{key:"field-"+i,staticClass:"field-container"},[a("EditableText",{attrs:{placeholder:"Nome do campo"},model:{value:t.name,callback:function(a){e.$set(t,"name",a)},expression:"field.name"}}),a("span",[e._v(":")])],1)}),0)])])}),0)])},n=[],s=(a("a1e5"),a("7778"),a("d49f")),c=a("2ccd"),l={name:"home",props:{type:{type:String,default:"pessoa"}},components:{TextArea:s["a"],QRCodeScanner:c["a"]},computed:{classes:function(){return this.types.filter(function(e){return!e.primitive})}},methods:{},data:function(){return{types:[{name:"Integer",primitive:!0},{name:"String",primitive:!0},{name:"Teste",fields:[{id:"nome",name:"Nome",type:"Diego"}]}]}}},r=l,o=(a("89f6"),a("2877")),d=Object(o["a"])(r,i,n,!1,null,null,null);t["default"]=d.exports}}]);
//# sourceMappingURL=chunk-0de5bf28.b198d861.js.map