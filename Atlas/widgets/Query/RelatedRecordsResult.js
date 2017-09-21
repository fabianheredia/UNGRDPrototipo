// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
require({cache:{"url:widgets/Query/RelatedRecordsResult.html":'\x3cdiv\x3e\r\n  \x3cdiv class\x3d"popup-menu-button related-records-action-button not-visible" data-dojo-attach-point\x3d"btnAction" data-dojo-attach-event\x3d"click:_onBtnMenuClicked"\x3e\x3c/div\x3e\r\n  \x3cdiv class\x3d"noresult-tip not-visible" data-dojo-attach-point\x3d"noResultTip"\x3e${nls.noResult}\x3c/div\x3e\r\n  \x3cdiv class\x3d"content not-visible" data-dojo-attach-point\x3d"content" data-dojo-attach-event\x3d"click:_onContentClicked"\x3e\x3c/div\x3e\r\n\x3c/div\x3e'}});
define("dojo/query dojo/Evented dojo/_base/html dojo/_base/lang dojo/_base/array dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./RelatedRecordsResult.html esri/dijit/PopupRenderer esri/layers/FeatureLayer esri/renderers/SimpleRenderer jimu/utils jimu/symbolUtils jimu/BaseFeatureAction jimu/dijit/Popup jimu/dijit/FeatureActionPopupMenu jimu/dijit/SymbolChooser jimu/FeatureActionManager".split(" "),function(k,n,c,d,e,p,q,r,t,u,v,w,l,g,h,x,y,z,A,B){return p([q,
r,t,n],{baseClass:"related-records-result",templateString:u,popupMenu:null,featureActionManager:null,featureSet:null,layer:null,map:null,layerDefinition:null,nls:null,config:null,postCreate:function(){this.inherited(arguments);this.popupMenu=z.getInstance();this.featureActionManager=B.getInstance();if("Table"!==this.layerDefinition.type){this.layer=new w({layerDefinition:{geometryType:this.layerDefinition.geometryType,fields:this.layerDefinition.fields}});var a=g.getTypeByGeometryType(this.layerDefinition.geometryType),
b=null;"point"===a?b=h.getDefaultMarkerSymbol():"polyline"===a?b=h.getDefaultLineSymbol():"polygon"===a&&(b=h.getDefaultFillSymbol());b&&(a=new l(b),this.layer.setRenderer(a));this.map.addLayer(this.layer)}},destroy:function(){this.layer&&this.map.removeLayer(this.layer);this.layer=null;this.inherited(arguments)},setResult:function(a,b){this.layer&&this.layer.clear();this.featureSet=b;0<b.features.length?(e.forEach(b.features,d.hitch(this,function(b){this._createItem(a,b);this.layer&&this.layer.add(b)})),
c.removeClass(this.btnAction,"not-visible"),c.addClass(this.noResultTip,"not-visible"),c.removeClass(this.content,"not-visible"),g.featureAction.zoomTo(this.map,b.features)):(c.addClass(this.btnAction,"not-visible"),c.removeClass(this.noResultTip,"not-visible"),c.addClass(this.content,"not-visible"))},getLayer:function(){return this.layer},showLayer:function(){this.layer&&this.layer.show()},hideLayer:function(){this.layer&&this.layer.hide()},_createItem:function(a,b){var f=a.getTitle(b)||"",f=c.toDom('\x3cdiv class\x3d"item"\x3e\x3cdiv class\x3d"item-title"\x3e'+
f+'\x3c/div\x3e\x3cdiv class\x3d"item-content"\x3e\x3c/div\x3e\x3c/div\x3e'),d=k(".item-content",f)[0],m=new v({template:a,graphic:b,chartTheme:a.chartTheme});c.place(m.domNode,d);m.startup();c.place(f,this.content)},_onContentClicked:function(a){a=a.target||a.srcElement;var b=null;if(b=c.hasClass(a,"item-title")?a:g.getAncestorDom(a,function(a){return c.hasClass(a,"item-title")},this.content))a=b.parentNode,c.toggleClass(a,"selected"),b=c.hasClass(a,"selected"),k(".item",this.content).removeClass("selected"),
b&&c.addClass(a,"selected")},_onBtnBackClicked:function(){this.emit("back")},_onBtnMenuClicked:function(a){if(this.featureSet){var b=c.position(a.target||a.srcElement);this.featureActionManager.getSupportedActions(this.featureSet).then(d.hitch(this,function(a){e.forEach(a,d.hitch(this,function(a){a.data=this.featureSet}));if(!this.config.enableExport){var c=["ExportToCSV","ExportToFeatureCollection","ExportToGeoJSON","SaveToMyContent"];a=e.filter(a,d.hitch(this,function(a){return 0>c.indexOf(a.name)}))}a=
e.filter(a,d.hitch(this,function(a){return"CreateLayer"!==a.name}));var f=this._getSymbolAction();f&&a.push(f);this.popupMenu.setActions(a);this.popupMenu.show(b)}))}},_getSymbolAction:function(){var a=null;"Table"!==this.layerDefinition.type&&this.layer&&this.layer.renderer&&this.config.canModifySymbol&&((a=this.featureSet&&this.featureSet.features)||(a=[]),a=new x({name:"ChangeSymbol",label:this.nls.changeSymbol,data:a,iconClass:"icon-edit-symbol",iconFormat:"svg",map:this.map,onExecute:d.hitch(this,
this._showSymbolChooser)}));return a},_showSymbolChooser:function(){if(this.layer){var a=this.layer.renderer,b={};(a=a.defaultSymbol||a.symbol)?b.symbol=a:(a=g.getSymbolTypeByGeometryType(this.layer.geometryType),b.type=a);var c=new A(b),e=new y({width:380,autoHeight:!0,titleLabel:this.nls.changeSymbol,content:c,onClose:d.hitch(this,function(){c.destroy();e=c=null}),buttons:[{label:window.jimuNls.common.ok,onClick:d.hitch(this,function(){var a=c.getSymbol(),a=new l(a);this.layer.setRenderer(a);this.layer.redraw();
e.close()})},{label:window.jimuNls.common.cancel,onClick:d.hitch(this,function(){e.close()})}]})}}})});