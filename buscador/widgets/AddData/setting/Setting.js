// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

require({cache:{"widgets/AddData/setting/_build-generate_module":function(){define(["dojo/text!./Setting.html","dojo/text!./css/style.css","dojo/i18n!./nls/strings"],function(){})},"url:widgets/AddData/setting/Setting.html":'\x3cdiv\x3e\r\n\r\n\t\x3cdiv class\x3d"row"\x3e\r\n\t  \x3cdiv class\x3d"left-cell"\x3e\r\n\t\t  \x3cinput id\x3d"${id}_MyContent" type\x3d"checkbox"\r\n\t\t    data-dojo-attach-point\x3d"MyContentCheckBox"\r\n\t\t    data-dojo-type\x3d"dijit/form/CheckBox"/\x3e\r\n\t\t  \x3clabel for\x3d"${id}_MyContent" class\x3d"fixedlen"\x3e${nls.scopeOptions.MyContent}\x3c/label\x3e\r\n\t  \x3c/div\x3e\r\n\t  \x3cinput type\x3d"text" placeholder\x3d"${nls.scopeOptions.labelPlaceholder}"\r\n\t    data-dojo-attach-point\x3d"MyContentTextBox"\r\n\t    data-dojo-type\x3d"dijit/form/ValidationTextBox"\r\n\t    data-dojo-props\x3d"maxLength: 24" /\x3e\r\n\t\x3c/div\x3e\r\n\r\n  \x3cdiv class\x3d"row"\x3e\r\n    \x3cdiv class\x3d"left-cell"\x3e\r\n\t    \x3cinput id\x3d"${id}_MyOrganization" type\x3d"checkbox"\r\n\t      data-dojo-attach-point\x3d"MyOrganizationCheckBox"\r\n\t      data-dojo-type\x3d"dijit/form/CheckBox"/\x3e\r\n\t    \x3clabel for\x3d"${id}_MyOrganization" class\x3d"fixedlen"\x3e${nls.scopeOptions.MyOrganization}\x3c/label\x3e\r\n\t  \x3c/div\x3e\r\n    \x3cinput type\x3d"text" placeholder\x3d"${nls.scopeOptions.labelPlaceholder}"\r\n      data-dojo-attach-point\x3d"MyOrganizationTextBox"\r\n      data-dojo-type\x3d"dijit/form/ValidationTextBox"\r\n      data-dojo-props\x3d"maxLength: 24" /\x3e\r\n  \x3c/div\x3e\r\n\r\n  \x3cdiv class\x3d"row"\x3e\r\n    \x3cdiv class\x3d"left-cell"\x3e\r\n\t    \x3cinput id\x3d"${id}_ArcGISOnline" type\x3d"checkbox"\r\n\t      data-dojo-attach-point\x3d"ArcGISOnlineCheckBox"\r\n\t      data-dojo-type\x3d"dijit/form/CheckBox"/\x3e\r\n\t    \x3clabel for\x3d"${id}_ArcGISOnline" class\x3d"fixedlen"\x3e${nls.scopeOptions.ArcGISOnline}\x3c/label\x3e\r\n    \x3c/div\x3e\r\n    \x3cinput type\x3d"text" placeholder\x3d"${nls.scopeOptions.labelPlaceholder}"\r\n      data-dojo-attach-point\x3d"ArcGISOnlineTextBox"\r\n      data-dojo-type\x3d"dijit/form/ValidationTextBox"\r\n      data-dojo-props\x3d"maxLength: 24" /\x3e\r\n  \x3c/div\x3e\r\n\r\n\t\x3c!-- \x3cdiv class\x3d"row"\x3e\r\n\t  \x3cdiv class\x3d"left-cell"\x3e\r\n\t\t  \x3cinput id\x3d"${id}_FromUrl" type\x3d"checkbox"\r\n\t\t    data-dojo-attach-point\x3d"FromUrlCheckBox"\r\n\t\t    data-dojo-type\x3d"dijit/form/CheckBox"/\x3e\r\n\t\t  \x3clabel for\x3d"${id}_FromUrl"\x3e${nls.scopeOptions.FromUrl}\x3c/label\x3e\r\n\t\t\x3c/div\x3e\r\n  \x3c/div\x3e --\x3e\r\n\r\n  \x3cdiv class\x3d"row"\x3e\r\n    \x3cdiv class\x3d"left-cell"\x3e\r\n      \x3clabel for\x3d"${id}_numPerPage"\x3e${nls.numPerPage}\x3c/label\x3e\r\n    \x3c/div\x3e\r\n    \x3cinput id\x3d"${id}_numPerPage" type\x3d"text" class\x3d"numbox"\r\n      data-dojo-attach-point\x3d"numPerBageBox"\r\n      data-dojo-type\x3d"dijit/form/NumberTextBox"\r\n      data-dojo-props\x3d"constraints:{min:1,max:100,places:0}" /\x3e\r\n  \x3c/div\x3e\r\n\r\n\x3c/div\x3e\r\n',
"url:widgets/AddData/setting/css/style.css":".jimu-widget-add-data-setting .row {margin-top: 20px;}.jimu-widget-add-data-setting .row .left-cell {display: inline-block; width: 240px;}.jimu-widget-add-data-setting .row .numbox {width: 80px;}","*now":function(d){d(['dojo/i18n!*preload*widgets/AddData/setting/nls/Setting*["ar","cs","da","de","en","el","es","et","fi","fr","he","hr","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]'])}}});
define("dojo/_base/declare dojo/_base/lang jimu/BaseWidgetSetting dijit/_WidgetsInTemplateMixin dijit/form/CheckBox dijit/form/NumberTextBox dijit/form/ValidationTextBox".split(" "),function(d,f,g,h){return d([g,h],{baseClass:"jimu-widget-add-data-setting",postCreate:function(){this.inherited(arguments)},startup:function(){this._started||(this.inherited(arguments),this.setConfig(this.config))},getConfig:function(){this.config=this.config;var a=this.numPerBageBox.get("value");"number"===typeof a&&
!isNaN(a)&&(a=Math.floor(a),1<=a&&100>=a&&(this.config.numPerPage=a));var d=this.config.scopeOptions,a=function(a,c,e){a=d[a];a.allow=!!c.get("checked");e&&(a.label=null,c=e.get("value"),"string"===typeof c&&(c=f.trim(c),0<c.length&&(a.label=c)))};a("MyContent",this.MyContentCheckBox,this.MyContentTextBox);a("MyOrganization",this.MyOrganizationCheckBox,this.MyOrganizationTextBox);a("ArcGISOnline",this.ArcGISOnlineCheckBox,this.ArcGISOnlineTextBox);return this.config},setConfig:function(a){this.config=
a||{};var d=this.config.numPerPage;try{var b=Number(d);"number"===typeof b&&!isNaN(b)&&(b=Math.floor(b),1<=b&&100>=b&&this.numPerBageBox.set("value",b))}catch(c){console.warn("Error setting number:"),console.warn(c)}a.scopeOptions||(a.scopeOptions={});var e=a.scopeOptions;a=function(a,c,d){var b=e[a];b||(b=e[a]={allow:!0,label:null});"boolean"!==typeof b.allow&&(b.allow=!0);c.set("checked",b.allow);d&&"string"===typeof b.label&&(a=f.trim(b.label),0<a.length&&d.set("value",a))};a("MyContent",this.MyContentCheckBox,
this.MyContentTextBox);a("MyOrganization",this.MyOrganizationCheckBox,this.MyOrganizationTextBox);a("ArcGISOnline",this.ArcGISOnlineCheckBox,this.ArcGISOnlineTextBox)}})});