// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred jimu/utils esri/tasks/query esri/tasks/QueryTask esri/layers/FeatureLayer esri/tasks/RelationshipQuery".split(" "),function(n,e,f,h,p,m,l,r,s){function q(){return{queryTr:null,config:null,layerInfo:null,relationshipLayerInfos:null,relationshipPopupTemplates:null,queryType:-1,query:{maxRecordCount:1E3,resultLayer:null,where:"",geometry:null,relationship:null,nextIndex:0,allCount:0,objectIds:[]}}}n=n(null,{tempResultLayer:null,
map:null,currentAttrs:null,constructor:function(a,b){this.map=a;this.currentAttrs=b;0<this.currentAttrs.layerInfo.maxRecordCount&&(this.currentAttrs.query.maxRecordCount=this.currentAttrs.layerInfo.maxRecordCount)},resetCurrentAttrs:function(){this.currentAttrs=q()},getCurrentAttrs:function(){return this.currentAttrs},executeQueryForFirstTime:function(){var a=null,a=this.currentAttrs.query.where,b=this.currentAttrs.query.geometry;return a=1===this.currentAttrs.queryType?this.doQuery_SupportOrderByAndPagination(a,
b):2===this.currentAttrs.queryType?this.doQuery_SupportObjectIds(a,b):this.doQuery_NotSupportObjectIds(a,b)},executeQueryWhenScrollToBottom:function(){var a=null;1===this.currentAttrs.queryType?a=this.onResultsScroll_SupportOrderByAndPagination():2===this.currentAttrs.queryType&&(a=this.onResultsScroll_SupportObjectIds());return a},_isServiceSupportsOrderBy:function(a){var b=!1;a.advancedQueryCapabilities&&a.advancedQueryCapabilities.supportsOrderBy&&(b=!0);return b},_isServiceSupportsPagination:function(a){var b=
!1;a.advancedQueryCapabilities&&a.advancedQueryCapabilities.supportsPagination&&(b=!0);return b},_tryLocaleNumber:function(a){var b=p.localizeNumber(a);if(null===b||void 0===b)b=a;return b},_tryLocaleDate:function(a){var b=p.localizeDate(a);b||(b=a.toLocaleDateString());return b},_getLayerIndexByLayerUrl:function(a){var b=a.lastIndexOf("/");a=a.slice(b+1,a.length);return parseInt(a,10)},_getServiceUrlByLayerUrl:function(a){var b=a.lastIndexOf("/");return a.slice(0,b)},_isSupportObjectIds:function(a){var b=
0;a.currentVersion&&(b=parseFloat(a.currentVersion));return 10<=b||a.hasOwnProperty("typeIdField")},_isImageServiceLayer:function(a){return-1<a.indexOf("/ImageServer")},_isTable:function(a){return"Table"===a.type},_getBestQueryName:function(a){for(var b=a=a?a+(" _"+this.nls.queryResult):a+this.nls.queryResult,c=f.map(this.map.graphicsLayerIds,e.hitch(this,function(a){return this.map.getLayer(a).name})),d=2;0<=f.indexOf(c,b);)b=a+"_"+d,d++;return b},doQuery_SupportOrderByAndPagination:function(a,b){var c=
new h,d=e.hitch(this,function(a){console.error(a);c.reject(a)}),k=this.currentAttrs.query.relationship;this._queryCount(a,b,k).then(e.hitch(this,function(g){this.currentAttrs.query.allCount=g;0===g?c.resolve([]):(this.currentAttrs.query.nextIndex=0,this._queryWithPaginationAndOrder(a,b,0,this.currentAttrs.query.maxRecordCount,k).then(e.hitch(this,function(a){a=a.features;this.currentAttrs.query.nextIndex+=a.length;c.resolve(a)}),d))}),d);return c},onResultsScroll_SupportOrderByAndPagination:function(){var a=
new h,b=this.currentAttrs.query.nextIndex;if(b>=this.currentAttrs.query.allCount)return a.resolve([]),a;var c=e.hitch(this,function(b){console.error(b);a.reject(b)});this._queryWithPaginationAndOrder(this.currentAttrs.query.where,this.currentAttrs.query.geometry,b,this.currentAttrs.query.maxRecordCount,this.currentAttrs.query.relationship).then(e.hitch(this,function(b){b=b.features;this.currentAttrs.query.nextIndex+=b.length;a.resolve(b)}),c);return a},doQuery_SupportObjectIds:function(a,b){var c=
new h,d=e.hitch(this,function(a){console.error(a);c.reject(a)}),k=this.currentAttrs.query.relationship;this._queryIds(a,b,k).then(e.hitch(this,function(a){if(a&&0<a.length){var b=this.currentAttrs.query.allCount=a.length;this.currentAttrs.query.objectIds=a;this.currentAttrs.query.nextIndex=0;var f=this.currentAttrs.query.maxRecordCount,h=[],h=b>f?a.slice(0,f):a;this._queryByObjectIds(h,!0,k).then(e.hitch(this,function(a){a=a.features;this.currentAttrs.query.nextIndex+=a.length;c.resolve(a)}),e.hitch(this,
function(a){d(a)}))}else this.currentAttrs.query.allCount=0,c.resolve([])}),d);return c},onResultsScroll_SupportObjectIds:function(){var a=new h,b=this.currentAttrs.query.objectIds,c=this.currentAttrs.query.nextIndex;if(c>=this.currentAttrs.query.allCount)a.resolve([]);else{var d=Math.min(b.length-c,this.currentAttrs.query.maxRecordCount),b=b.slice(c,c+d);if(0===b.length)a.resolve([]);else return this._queryByObjectIds(b,!0,this.currentAttrs.query.relationship).then(e.hitch(this,function(b){b=b.features;
this.currentAttrs.query.nextIndex+=b.length;a.resolve(b)}),e.hitch(this,function(b){a.reject(b)})),a}},doQuery_NotSupportObjectIds:function(a,b){var c=new h;this._query(a,b,!0,this.currentAttrs.query.relationship).then(e.hitch(this,function(a){a=a.features;this.currentAttrs.query.allCount=a.length;c.resolve(a)}),e.hitch(this,function(a){console.error(a);c.reject(a)}));return c},_getObjectIdField:function(){return this.currentAttrs.config.objectIdField},getOutputFields:function(){var a=[],b=[];b.push(this.currentAttrs.config.objectIdField);
var c=this._getRequiredFieldNames(),b=b.concat(c),c=this._getPopupInfoFieldNames(),b=b.concat(c);f.forEach(b,e.hitch(this,function(b){0>a.indexOf(b)&&a.push(b)}));return a},_getRequiredFieldNames:function(){var a=e.clone(this.currentAttrs.layerInfo);return(new r({layerDefinition:a,featureSet:null})).getOutFields()},_getPopupInfoFieldNames:function(){var a=[],b=[],c=f.filter(this.currentAttrs.layerInfo.fields,e.hitch(this,function(a){return"esriFieldTypeGeometry"!==a.type})),d=this.currentAttrs.config.popupInfo,
b=b.concat(this._getPlaceholderFieldNames(c,d.title));d.description?b=b.concat(this._getPlaceholderFieldNames(c,d.description)):d.fieldInfos&&0<d.fieldInfos.length&&f.forEach(d.fieldInfos,e.hitch(this,function(a){a.visible&&b.push(a.fieldName)}));d.mediaInfos&&0<d.mediaInfos.length&&f.forEach(d.mediaInfos,e.hitch(this,function(a){b=b.concat(this._getPlaceholderFieldNames(c,a.title));b=b.concat(this._getPlaceholderFieldNames(c,a.caption));if(a=a.value){var d=a.fields;d&&0<d.length&&f.forEach(d,e.hitch(this,
function(a){b.push(a)}));a.normalizeField&&b.push(a.normalizeField);a.tooltipField&&b.push(a.tooltipField);a.sourceURL&&(b=b.concat(this._getPlaceholderFieldNames(c,a.sourceURL)));a.linkURL&&(b=b.concat(this._getPlaceholderFieldNames(c,a.linkURL)))}}));f.forEach(b,e.hitch(this,function(b){0>a.indexOf(b)&&a.push(b)}));return a},_getPlaceholderFieldNames:function(a,b){var c=[];if(b){var d=[];f.forEach(a,e.hitch(this,function(a){a=a.name;0<=b.indexOf("{"+a+"}")&&d.push(a)}));f.forEach(d,e.hitch(this,
function(a){0>c.indexOf(a)&&c.push(a)}))}return c},_query:function(a,b,c,d){var e=new m;e.where=a;b&&(e.geometry=b);e.outSpatialReference=this.map.spatialReference;e.returnGeometry=!!c;e.spatialRelationship=d;e.outFields=this.getOutputFields();return(new l(this.currentAttrs.config.url)).execute(e)},_queryIds:function(a,b,c){var d=new m;d.where=a;b&&(d.geometry=b);d.returnGeometry=!1;d.spatialRelationship=c;d.outSpatialReference=this.map.spatialReference;return(new l(this.currentAttrs.config.url)).executeForIds(d)},
_queryByObjectIds:function(a,b,c){var d=new h,k=new m;k.returnGeometry=!!b;k.outSpatialReference=this.map.spatialReference;k.outFields=this.getOutputFields();k.objectIds=a;k.spatialRelationship=c;(new l(this.currentAttrs.config.url)).execute(k).then(e.hitch(this,function(a){d.resolve(a)}),e.hitch(this,function(g){if(400===g.code){var k=this._getObjectIdField(),h="",l=a.length;f.forEach(a,e.hitch(this,function(a,b){h+=k+" \x3d "+a;b!==l-1&&(h+=" OR ")}));this._query(h,null,b,c).then(e.hitch(this,function(a){d.resolve(a)}),
e.hitch(this,function(a){d.reject(a)}))}else d.reject(g)}));return d},_queryCount:function(a,b,c){var d=new m;d.where=a;b&&(d.geometry=b);d.returnGeometry=!1;d.outSpatialReference=this.map.spatialReference;d.spatialRelationship=c;return(new l(this.currentAttrs.config.url)).executeForCount(d)},_queryWithPaginationAndOrder:function(a,b,c,d,k){var g=new m;g.where=a;b&&(g.geometry=b);g.outSpatialReference=this.map.spatialReference;g.returnGeometry=!0;g.spatialRelationship=k;g.outFields=this.getOutputFields();
g.start=c;g.num=d;if((a=this.currentAttrs.config.orderByFields)&&0<a.length)g.orderByFields=a,a=f.map(a,e.hitch(this,function(a){return a.split(" ")[0]})),f.forEach(a,e.hitch(this,function(a){0>g.outFields.indexOf(a)&&g.outFields.push(a)}));return(new l(this.currentAttrs.config.url)).execute(g)},_getCurrentRelationships:function(){return this.currentAttrs.layerInfo.relationships||[]},_queryRelatedFeaturesById:function(a){var b=[],c=this._getCurrentRelationships();if(c&&0<c.length){var d=new l(this.currentAttrs.config.url);
f.forEach(c,e.hitch(this,function(c){var e=new s;e.objectIds=a;e.relationshipId=c.id;var h=f.map(c.fields,function(a){return a.name});e.outFields=h;e.returnGeometry=!1;e=d.executeRelationshipQuery(e);b.push({relationshipId:c.id,promise:e})}))}return b},_findRelationshipInfo:function(a){for(var b=this._getCurrentRelationships(),c=0;c<b.length;c++)if(b[c].id===a)return b[c];return null},_findRelationshipFields:function(a){var b=[];if(a=this._findRelationshipInfo(a))b=a.fields;return b}});n.getCleanCurrentAttrsTemplate=
q;return n});