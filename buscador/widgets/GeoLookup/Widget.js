// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
require({cache:{"dojox/data/CsvStore":function(){define("dojo/_base/lang dojo/_base/declare dojo/_base/xhr dojo/_base/kernel dojo/data/util/filter dojo/data/util/simpleFetch".split(" "),function(t,l,p,h,r,y){l=l("dojox.data.CsvStore",null,{constructor:function(a){this._attributes=[];this._attributeIndexes={};this._dataArray=[];this._arrayOfAllItems=[];this._loadFinished=!1;a.url&&(this.url=a.url);this._csvData=a.data;a.label?this.label=a.label:""===this.label&&(this.label=void 0);this._storeProp=
"_csvStore";this._idProp="_csvId";this._features={"dojo.data.api.Read":!0,"dojo.data.api.Identity":!0};this._loadInProgress=!1;this._queuedFetches=[];this.identifier=a.identifier;""===this.identifier?delete this.identifier:this._idMap={};"separator"in a&&(this.separator=a.separator);"urlPreventCache"in a&&(this.urlPreventCache=a.urlPreventCache?!0:!1)},url:"",label:"",identifier:"",separator:",",urlPreventCache:!1,_assertIsItem:function(a){if(!this.isItem(a))throw Error(this.declaredClass+": a function was passed an item argument that was not an item");
},_getIndex:function(a){a=this.getIdentity(a);this.identifier&&(a=this._idMap[a]);return a},getValue:function(a,b,d){this._assertIsItem(a);var e=d;if("string"===typeof b)b=this._attributeIndexes[b],null!=b&&(e=this._dataArray[this._getIndex(a)][b]||d);else throw Error(this.declaredClass+": a function was passed an attribute argument that was not a string");return e},getValues:function(a,b){var d=this.getValue(a,b);return d?[d]:[]},getAttributes:function(a){this._assertIsItem(a);var b=[];a=this._dataArray[this._getIndex(a)];
for(var d=0;d<a.length;d++)""!==a[d]&&b.push(this._attributes[d]);return b},hasAttribute:function(a,b){this._assertIsItem(a);if("string"===typeof b){var d=this._attributeIndexes[b],e=this._dataArray[this._getIndex(a)];return"undefined"!==typeof d&&d<e.length&&""!==e[d]}throw Error(this.declaredClass+": a function was passed an attribute argument that was not a string");},containsValue:function(a,b,d){var e=void 0;"string"===typeof d&&(e=r.patternToRegExp(d,!1));return this._containsValue(a,b,d,e)},
_containsValue:function(a,b,d,e){a=this.getValues(a,b);for(b=0;b<a.length;++b){var c=a[b];if("string"===typeof c&&e)return null!==c.match(e);if(d===c)return!0}return!1},isItem:function(a){if(a&&a[this._storeProp]===this)if(a=a[this._idProp],this.identifier){if(this._dataArray[this._idMap[a]])return!0}else if(0<=a&&a<this._dataArray.length)return!0;return!1},isItemLoaded:function(a){return this.isItem(a)},loadItem:function(a){},getFeatures:function(){return this._features},getLabel:function(a){if(this.label&&
this.isItem(a))return this.getValue(a,this.label)},getLabelAttributes:function(a){return this.label?[this.label]:null},_fetchItems:function(a,b,d){var e=this,c=function(a,d){var c=null;if(a.query){var f,g,c=[],k=a.queryOptions?a.queryOptions.ignoreCase:!1,l={};for(f in a.query)g=a.query[f],"string"===typeof g&&(l[f]=r.patternToRegExp(g,k));for(k=0;k<d.length;++k){var p=!0,h=d[k];for(f in a.query)g=a.query[f],e._containsValue(h,f,g,l[f])||(p=!1);p&&c.push(h)}}else c=d.slice(0,d.length);b(c,a)};if(this._loadFinished)c(a,
this._arrayOfAllItems);else if(""!==this.url)if(this._loadInProgress)this._queuedFetches.push({args:a,filter:c});else{this._loadInProgress=!0;var g=p.get({url:e.url,handleAs:"text",preventCache:e.urlPreventCache});g.addCallback(function(b){try{e._processData(b),c(a,e._arrayOfAllItems),e._handleQueuedFetches()}catch(f){d(f,a)}});g.addErrback(function(b){e._loadInProgress=!1;if(d)d(b,a);else throw b;});var f=null;a.abort&&(f=a.abort);a.abort=function(){g&&-1===g.fired&&g.cancel();f&&f.call(a)}}else if(this._csvData)try{this._processData(this._csvData),
this._csvData=null,c(a,this._arrayOfAllItems)}catch(k){d(k,a)}else{var l=Error(this.declaredClass+": No CSV source data was provided as either URL or String data input.");if(d)d(l,a);else throw l;}},close:function(a){},_getArrayOfArraysFromCsvFileContents:function(a){if(t.isString(a)){var b=RegExp("^\\s+","g"),d=RegExp("\\s+$","g"),e=RegExp('""',"g"),c=[],g=this._splitLines(a);for(a=0;a<g.length;++a){var f=g[a];if(0<f.length){for(var f=f.split(this.separator),k=0;k<f.length;){var l=f[k].replace(b,
""),n=l.replace(d,""),p=n.charAt(0),h=n.charAt(n.length-1),r=n.charAt(n.length-2),y=n.charAt(n.length-3);if(2===n.length&&'""'==n)f[k]="";else if('"'==p&&('"'!=h||'"'==h&&'"'==r&&'"'!=y)){if(k+1===f.length)return;f[k]=l+this.separator+f[k+1];f.splice(k+1,1)}else'"'==p&&'"'==h&&(n=n.slice(1,n.length-1),n=n.replace(e,'"')),f[k]=n,k+=1}c.push(f)}}this._attributes=c.shift();for(a=0;a<this._attributes.length;a++)this._attributeIndexes[this._attributes[a]]=a;this._dataArray=c}},_splitLines:function(a){var b=
[],d,e="",c=!1;for(d=0;d<a.length;d++){var g=a.charAt(d);switch(g){case '"':c=!c;e+=g;break;case "\r":c?e+=g:(b.push(e),e="",d<a.length-1&&"\n"==a.charAt(d+1)&&d++);break;case "\n":c?e+=g:(b.push(e),e="");break;default:e+=g}}""!==e&&b.push(e);return b},_processData:function(a){this._getArrayOfArraysFromCsvFileContents(a);this._arrayOfAllItems=[];if(this.identifier&&void 0===this._attributeIndexes[this.identifier])throw Error(this.declaredClass+": Identity specified is not a column header in the data set.");
for(a=0;a<this._dataArray.length;a++){var b=a;this.identifier&&(b=this._dataArray[a][this._attributeIndexes[this.identifier]],this._idMap[b]=a);this._arrayOfAllItems.push(this._createItemFromIdentity(b))}this._loadFinished=!0;this._loadInProgress=!1},_createItemFromIdentity:function(a){var b={};b[this._storeProp]=this;b[this._idProp]=a;return b},getIdentity:function(a){return this.isItem(a)?a[this._idProp]:null},fetchItemByIdentity:function(a){var b,d=a.scope?a.scope:h.global;if(this._loadFinished)b=
this._createItemFromIdentity(a.identity),this.isItem(b)||(b=null),a.onItem&&a.onItem.call(d,b);else{var e=this;if(""!==this.url)this._loadInProgress?this._queuedFetches.push({args:a}):(this._loadInProgress=!0,b=p.get({url:e.url,handleAs:"text"}),b.addCallback(function(b){try{e._processData(b);var c=e._createItemFromIdentity(a.identity);e.isItem(c)||(c=null);a.onItem&&a.onItem.call(d,c);e._handleQueuedFetches()}catch(k){a.onError&&a.onError.call(d,k)}}),b.addErrback(function(b){this._loadInProgress=
!1;a.onError&&a.onError.call(d,b)}));else if(this._csvData)try{e._processData(e._csvData),e._csvData=null,b=e._createItemFromIdentity(a.identity),e.isItem(b)||(b=null),a.onItem&&a.onItem.call(d,b)}catch(c){a.onError&&a.onError.call(d,c)}}},getIdentityAttributes:function(a){return this.identifier?[this.identifier]:null},_handleQueuedFetches:function(){if(0<this._queuedFetches.length){for(var a=0;a<this._queuedFetches.length;a++){var b=this._queuedFetches[a],d=b.filter,e=b.args;d?d(e,this._arrayOfAllItems):
this.fetchItemByIdentity(b.args)}this._queuedFetches=[]}}});t.extend(l,y);return l})},"widgets/GeoLookup/layerQueryDetails":function(){define(["dojo/Evented","dojo/_base/declare","dojo/_base/lang","dojo/_base/array","esri/geometry/geometryEngine"],function(t,l,p,h,r){return l([t],{declaredClass:"layerQueryDetails",layer:null,fields:null,intersectField:null,valueIn:null,valueOut:null,numberOfRequest:0,requestComplete:0,numberOfHits:0,totalRecords:0,currentNumber:0,deferreds:[],complete:!1,hasError:!1,
constructor:function(h){l.safeMixin(this,h)},addDeferred:function(l,a){l.then(p.hitch(this,function(b){b&&h.forEach(a,p.hitch(this,function(a){h.forEach(b.features,p.hitch(this,function(b){r.intersects(a.geometry,b.geometry)&&(h.forEach(this.fields,function(c){b.attributes[c]&&(a.attributes[this.layer.label+"_"+c]=b.attributes[c])},this),a.attributes[this.intersectField]=this.valueIn,a.symbol=this.valueInSym,this.numberOfHits++)}));this.currentNumber++;this.requestComplete++}));this.currentNumber=
this.currentNumber;this.requestComplete=this.requestComplete;this.numberOfHits=this.numberOfHits;this.emit("requestComplete",{layerID:this.layer.id,currentNumber:this.currentNumber,totalRecords:this.totalRecords,intesected:this.numberOfHits,name:this.layer.label});this.isComplete()&&this.emit("complete",{layerID:this.layer.id})}),p.hitch(this,function(a){this.hasError=!0;console.log("error: "+a);this.emit("error",{layerID:this.layer.id});return a}));this.deferreds.push(l)},isComplete:function(){return this.complete=
this.numberOfRequest===this.requestComplete?!0:!1}})})},"widgets/GeoLookup/_build-generate_module":function(){define(["dojo/text!./Widget.html","dojo/text!./css/style.css","dojo/i18n!./nls/strings"],function(){})},"url:widgets/GeoLookup/Widget.html":'\x3cdiv style\x3d"width:100%;height:100%;overflow-y:auto;"\x3e\r\n\r\n   \x3c!-- \x3cdiv data-dojo-type\x3d"dijit/layout/ContentPane" style\x3d"height:100%;width:100%"\x3e --\x3e\r\n        \x3cdiv class\x3d"widgetDescription" data-dojo-attach-point\x3d"widgetDescription"\x3e\x3c/div\x3e\r\n        \x3cform data-dojo-attach-point\x3d"inputForm"\x3e\r\n        \x3cdiv class\x3d"divCheckPlot"\x3e\r\n        \t\x3ctable\x3e\r\n        \t\t\x3ctr\x3e\r\n        \t\t\t\x3ctd class\x3d"optionStyle"\x3e\x3cinput type\x3d"checkbox" id\x3d"chkboxPlotOnly" data-dojo-attach-point\x3d"chkboxPlotOnly"\x3e\x3clabel\x3e${nls.plotOnly}\x3c/label\x3e\x3c/td\x3e\r\n        \t\t\x3c/tr\x3e\r\n        \t\t\x3ctr\x3e\r\n        \t\t\t\x3ctd class\x3d"optionStyle"\x3e\r\n\t\t        \t\t\x3clabel class\x3d"labelPad"\x3e${nls.projectionChoice}\x3c/label\x3e\r\n\t\t        \t\t\x3cinput type\x3d"radio" name\x3d"rdProjection" id\x3d"rdProjectionLat" data-dojo-attach-point\x3d"rdProjection" value\x3d"latlon" checked\x3e\x3clabel class\x3d"labelPad"\x3e${nls.projectionLat}\x3c/label\x3e\r\n\t\t        \t\t\x3cinput type\x3d"radio" name\x3d"rdProjection" id\x3d"rdProjectionMap" data-dojo-attach-point\x3d"rdProjection" value\x3d"map"\x3e\x3clabel\x3e${nls.projectionMap}\x3c/label\x3e\r\n        \t\t\t\x3c/td\x3e\r\n        \t\t\x3c/tr\x3e\r\n\t\t\t\t\x3ctr\x3e\r\n\t\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\t\x3ctable width\x3d"50%" border\x3d0\x3e\r\n\t\t\t\t\t\t\t\x3ctr\x3e\r\n\t\t\t\t\t\t\t\t\x3ctd width\x3d"50%" class\x3d"tdClearButton"\x3e\x3cdiv class\x3d"clear-CSVresult" data-dojo-attach-point\x3d"clearResultsBtn" data-dojo-attach-event\x3d"click:clearCSVResults"\x3e${nls.clearResults}\x3c/div\x3e\x3c/td\x3e\r\n\t\t\t\t\t        \t\x3ctd width\x3d"50%" class\x3d"tdDownloadButton"\x3e\x3cdiv class\x3d"download-CSVresult" data-dojo-attach-point\x3d"downloadResultsBtn" data-dojo-attach-event\x3d"click:downloadCSVResults"\x3e${nls.downloadResults}\x3c/div\x3e\x3c/td\x3e\r\n\t\t\t\t\t\t\t\x3c/tr\x3e\r\n\t\t\t\t\t\t\x3c/table\x3e\r\n\t\t\t\t\t\x3c/td\x3e\r\n\r\n\t\t        \x3c/tr\x3e\r\n        \t\x3c/table\x3e\r\n\x3c!--\r\n        \t\x3cdiv class\x3d"plotChoice"\x3e\x3cinput type\x3d"checkbox" id\x3d"chkboxPlotOnly" data-dojo-attach-point\x3d"chkboxPlotOnly"\x3e\x3clabel\x3e${nls.plotOnly}\x3c/label\x3e\x3c/div\x3e\r\n        \t\x3cdiv class\x3d"projectionChoice"\x3e\r\n        \t\t\x3clabel class\x3d"labelPad"\x3e${nls.projectionChoice}\x3c/label\x3e\r\n        \t\t\x3cinput type\x3d"radio" name\x3d"rdProjection" id\x3d"rdProjectionLat" data-dojo-attach-point\x3d"rdProjection" value\x3d"latlon" checked\x3e\x3clabel class\x3d"labelPad"\x3e${nls.projectionLat}\x3c/label\x3e\r\n        \t\t\x3cinput type\x3d"radio" name\x3d"rdProjection" id\x3d"rdProjectionMap" data-dojo-attach-point\x3d"rdProjection" value\x3d"map"\x3e\x3clabel\x3e${nls.projectionMap}\x3c/label\x3e\r\n        \t\x3c/div\x3e\r\n--\x3e\r\n        \x3c/div\x3e\r\n        \x3ctable data-dojo-attach-point\x3d"actionButtonsContainer" cellspacing\x3d"0" class\x3d"tblActionContainer"\x3e\r\n        \x3ctr\x3e\r\n        \t\x3ctd width\x3d"100%" class\x3d"tdCSVButton"\x3e\r\n        \t\t\x3cinput type\x3d"file" id\x3d"csvFileInput" data-dojo-attach-point\x3d"csvFileInput" data-dojo-attach-event\x3d"change:fileSelected" accept\x3d".csv"\x3e\r\n\t\t\t\t\x3cdiv class\x3d"jimu-btn hide" data-dojo-attach-point\x3d"showFileDialogBtn" data-dojo-attach-event\x3d"click:showFileDialog"\x3e${nls.selectCSV}\x3c/div\x3e\r\n\t\t\t\x3c/td\x3e\r\n\t\t\x3c/tr\x3e\r\n        \x3c/table\x3e\r\n        \x3c/form\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"results" class\x3d"hide"\x3e\r\n        \t\x3cdiv class\x3d"results-header"\x3e${nls.messages}\x3c/div\x3e\r\n            \x3ctable class\x3d"widgets-results-table" data-dojo-attach-point\x3d"widgetsResultsTable" cellspacing\x3d"0"\x3e\r\n                \x3ctbody data-dojo-attach-point\x3d"widgetsResultsTableBody"\x3e\r\n\r\n                    \x3ctr class\x3d"controls"\x3e\r\n\r\n                        \x3ctd class\x3d"tdProcessing"\x3e\r\n                            \x3cdiv data-dojo-attach-point\x3d"resultsLoadingImage" id\x3d"resultsLoadingImage" class\x3d"status processing" /\x3e\r\n                        \x3c/td\x3e\r\n                        \x3ctd\x3e\r\n                            \x3cdiv class\x3d"result-text" data-dojo-attach-point\x3d"resultsLoading"\x3e${nls.loadingCSV}\x3c/div\x3e\r\n                        \x3c/td\x3e\r\n                    \x3c/tr\x3e\r\n\r\n                    \x3ctr class\x3d"controls"\x3e\r\n\r\n                        \x3ctd class\x3d"tdProcessing"\x3e\r\n                            \x3cdiv data-dojo-attach-point\x3d"resultsPlottingImage" id\x3d"resultsPlottingImage" class\x3d"status processing" /\x3e\r\n\r\n                        \x3c/td\x3e\r\n                        \x3ctd\x3e\r\n                            \x3cdiv class\x3d"result-text" data-dojo-attach-point\x3d"resultsPlotting"\x3e${nls.plottingRows}\x3c/div\x3e\r\n                        \x3c/td\x3e\r\n                    \x3c/tr\x3e\r\n\r\n                \x3c/tbody\x3e\r\n\r\n            \x3c/table\x3e\r\n            \x3cdiv class\x3d"errorLink" data-dojo-attach-point\x3d"enrichErrors" data-dojo-attach-event\x3d"click:showErrorTable"\x3e\x3c/div\x3e\r\n            \x3cdiv class\x3d"hide errorList" id\x3d"enrichErrorsList" data-dojo-attach-point\x3d"enrichErrorsList"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3c!--  \x3c/div\x3e--\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"loading" data-dojo-type\x3d"jimu/dijit/LoadingIndicator" data-dojo-props\x3d\'hidden:true\'\x3e\x3c/div\x3e\r\n   \x3c!-- \x3c/div\x3e --\x3e\r\n\x3c/div\x3e',
"url:widgets/GeoLookup/css/style.css":'.solutions-widget-geolookup .widgetDescription {text-align: left; color: #66696C; font-family: proxima-nova; font-style: normal; margin: 0px 0px 20px 0px; font-size: 14px;}.solutions-widget-geolookup .uploadBox {margin: 30px 0 15px 0; float: left;}.solutions-widget-geolookup .hide {display: none;}.solutions-widget-geolookup .fileInputNonHTML5 {position: fixed;}.solutions-widget-geolookup .fileInputHTML5 {position: fixed; width: 0px; height: 0px;}.solutions-widget-geolookup .divCheckPlot {color: #686868; font-family: proxima-nova; font-style: normal; font-size: 12px; padding-bottom: 10px; width: 100%; position: relative;}.solutions-widget-geolookup .plotChoice {position: absolute; left: 0px; top: 0px; width: 35%;}.solutions-widget-geolookup .projectionChoice {text-align: right; width: 65%; position: absolute; right: 0px; top: 0px;}.solutions-widget-geolookup .labelPad {padding-right: 5px;}.solutions-widget-geolookup .widgets-results-table {margin: 1px;}.solutions-widget-geolookup .tblActionContainer {width: 100%; padding-bottom: 15px;}.solutions-widget-geolookup .optionStyle {padding-bottom: 5px;}.solutions-widget-geolookup .tdCSVButton {width: 100%;}.solutions-widget-geolookup .tdDownloadButton {width: 25%;}.solutions-widget-geolookup .tdClearButton {width: 25%;}.solutions-widget-geolookup .clear-CSVresult {color: #51b1fe; font-family: proxima-nova; font-style: normal; margin: 0px 0px 0px 0px; font-size: 14px; cursor:pointer;}.solutions-widget-geolookup .download-CSVresult {color: #51b1fe; font-family: proxima-nova; font-style: normal; margin: 0px 15px 0px 15px; font-size: 14px; cursor:pointer;} .solutions-widget-geolookup .controls {width: 100%; height: 42px; vertical-align: middle; padding-top: 0px; padding-bottom: 0px; margin-bottom: 0px; margin-top: 0px; font-size:12px;}.solutions-widget-geolookup .status {background-repeat: no-repeat; background-position: left; width: 20px;}.solutions-widget-geolookup .processing {content: url("./images/processing.gif");}.solutions-widget-geolookup .processing:before {content: url("./images/processing.gif");}.solutions-widget-geolookup .tdProcessing {width: 30px; text-align: left;}.solutions-widget-geolookup .complete {content: url("./images/complete.png");}.solutions-widget-geolookup .complete:before {content: url("./images/complete.png");}.solutions-widget-geolookup .error {content: url("./images/x_symbol_red.png");}.solutions-widget-geolookup .error:before {content: url("./images/x_symbol_red.png");}.solutions-widget-geolookup .bypass {content: url("");}.solutions-widget-geolookup .results-header {color: #66696C; font-family: proxima-nova; font-style: Semibold; font-size: 14px; padding-bottom: 0px;}.solutions-widget-geolookup .result-text {color: #686868; font-family: proxima-nova; font-style: normal; font-size: 12px;}.solutions-widget-geolookup .errorLink {color: #0000FF; cursor:pointer; font-family: proxima-nova; font-style: normal; font-size: 12px;}.solutions-widget-geolookup .errorList {color: #686868; font-family: proxima-nova; font-style: normal; font-size: 12px;}',
"*now":function(t){t(['dojo/i18n!*preload*widgets/GeoLookup/nls/Widget*["ar","cs","da","de","en","el","es","et","fi","fr","he","hr","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]'])}}});
define("dojo/_base/declare dijit/_WidgetsInTemplateMixin jimu/BaseWidget dojo/dom dojo/on dojo/sniff dojo/_base/html dojo/_base/lang dojo/_base/array dojo/string dojo/dom-class dojo/dom-construct dojo/dom-style dojox/data/CsvStore esri/geometry/webMercatorUtils esri/layers/FeatureLayer esri/geometry/Multipoint esri/geometry/Point esri/InfoTemplate esri/tasks/query esri/tasks/QueryTask esri/SpatialReference esri/symbols/jsonUtils esri/renderers/UniqueValueRenderer jimu/dijit/Message jimu/exportUtils jimu/utils ./layerQueryDetails".split(" "),function(t,
l,p,h,r,y,a,b,d,e,c,g,f,k,K,n,B,C,G,D,H,I,E,J,w,z,u,L){return t([p,l],{baseClass:"solutions-widget-geolookup",csvStore:null,layerLoaded:!1,lookupLayersFieldNames:[],lookupLayersFields:[],combinedFields:[],latField:null,longField:null,renderer:null,srWebMerc:null,syncLayers:null,enrichFilter:null,enrichResultsProg:{},enrichResultsText:{},errorList:null,postCreate:function(){this.inherited(arguments);c.add(this.downloadResultsBtn,"hide")},startup:function(){this.inherited(arguments);this.loading.show();
a.place(a.toDom(this.nls.description),this.widgetDescription);this._buildRenderer();if(u.file.supportHTML5()){var q=h.byId(this.id);this.own(r(q,"dragover",function(a){a.preventDefault()}));this.own(r(q,"dragenter",function(a){a.preventDefault()}));this.own(r(q,"drop",b.hitch(this,this._handleCSVDrop)))}this.srWebMerc=new I({wkid:102100});!u.file.supportHTML5()&&!y("safari")&&u.file.isEnabledFlash()?u.file.loadFileAPI().then(b.hitch(this,function(){console.log("loading FileAPI");c.add(this.csvFileInput,
"fileInputNonHTML5, js-fileapi-wrapper")})):(c.add(this.csvFileInput,"fileInputHTML5"),c.remove(this.showFileDialogBtn,"hide"));this._initalizeLookupLayers();d.forEach(this.config.enrichLayers,function(a){var b=a.id,q=a.id+"_prog",d=g.toDom("\x3ctr class\x3d'controls'\x3e\x3ctd\x3e\x3cdiv id\x3d'"+q+"' class\x3d'status processing' /\x3e\x3c/td\x3e\x3ctd\x3e\x3cdiv id\x3d'"+b+"' class\x3d'result-text' \x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e");g.place(d,this.widgetsResultsTableBody);this.enrichResultsProg[b]=
h.byId(q);this.enrichResultsText[b]=h.byId(b);this.enrichResultsText[b].innerHTML=e.substitute(this.nls.results.recordsEnriched,{"0":0,1:0,2:0,3:a.label})},this);c.add(this.clearResultsBtn,"jimu-state-disabled");this.loading.hide()},_buildRenderer:function(){this.symIn=E.fromJson(this.config.SymbolWithin);this.symOut=E.fromJson(this.config.SymbolOutside);this.renderer=new J(this.symOut,this.config.intersectField);this.renderer.addValue(this.config.valueIn,this.symIn);this.renderer.addValue(this.config.valueOut,
this.symOut)},_initalizeLookupLayers:function(){this.lookupLayersField=[];this.lookupLayersFieldNames=[];var a,b;d.forEach(this.config.enrichLayers,function(c){a=d.map(c.fields,function(a){return a.fieldName});b=d.map(c.fields,function(a){return a.label});d.forEach(a,function(d){var e=a.indexOf(d),x={name:null,alias:null,type:"esriFieldTypeString",editable:!0,domain:null};x.name=c.label+"_"+d;x.alias=c.label+"_"+b[e];this.lookupLayersFieldNames.push(x.name);this.lookupLayersFields.push(x)},this)},
this)},fileSelected:function(){u.file.supportHTML5()?this._processFiles(this.csvFileInput.files):u.file.supportFileAPI()?this._processFiles(window.FileAPI.getFiles(this.csvFileInput)):console.log("no file handler support !");this.csvFileInput.value=null;c.add(this.downloadResultsBtn,"hide")},_handleCSVDrop:function(a){a.preventDefault();a=a.dataTransfer;c.contains(this.showFileDialogBtn,"jimu-state-disabled")||(c.add(this.downloadResultsBtn,"hide"),this._processFiles(a.files))},_processFiles:function(a){c.add(this.showFileDialogBtn,
"jimu-state-disabled");this._resetResults();0<a.length&&(a=a[0],-1!==a.name.indexOf(".csv")?a?this.handleCSV(a):(w({message:this.nls.error.fileIssue}),c.remove(this.showFileDialogBtn,"jimu-state-disabled"),this.clearCSVResults()):(new w({message:this.nls.error.notCSVFile}),c.remove(this.showFileDialogBtn,"jimu-state-disabled"),this.clearCSVResults()))},showFileDialog:function(){c.contains(this.showFileDialogBtn,"jimu-state-disabled")||this.csvFileInput.click()},handleCSV:function(a){if(u.file.supportHTML5()){var d=
new FileReader;d.onload=b.hitch(this,function(){this._processCSVData(d.result)});d.readAsText(a)}else window.FileAPI.readAsText(a,b.hitch(this,function(a){"load"===a.type&&this._processCSVData(a.result)}))},_processCSVData:function(a){if(2<a.length){var d=a.indexOf("\n"),v=b.trim(a.substr(0,d)),f=a.replace(v,"");""!==v&&2<f.length?(console.log(d),d=this._getSeparator(v),this.csvStore=new k({data:a,separator:d}),this.csvStore.fetch({onComplete:b.hitch(this,this._csvReadComplete),onError:b.hitch(this,
function(a){c.remove(this.showFileDialogBtn,"jimu-state-disabled");var b=e.substitute(this.nls.error.fetchingCSV,{"0":a.message});w({message:b});console.error(b,a)})})):(new w({message:this.nls.error.CSVNoRecords}),c.remove(this.showFileDialogBtn,"jimu-state-disabled"),this.clearCSVResults())}else new w({message:this.nls.error.CSVEmptyFile}),c.remove(this.showFileDialogBtn,"jimu-state-disabled"),this.clearCSVResults()},_csvReadComplete:function(a){if(a.length<=parseInt(this.config.maxRowCount,10)){var F=
a.length.toString();c.remove(this.results,"hide");this.resultsLoading.innerHTML=e.substitute(this.nls.results.csvLoaded,{"0":F});c.replace(this.resultsLoadingImage,"complete","processing");var v=1,A=this._generateFeatureCollectionTemplateCSV(this.csvStore,a),m=this._generateDefaultPopupInfo(A),m=new G(this._buildInfoTemplate(m)),x="latlon";d.forEach(this.inputForm.rdProjection,b.hitch(this,function(a){a.checked&&(x=a.value)}));this.longField=this.latField=null;d.some(this.csvFields,function(a){var b;
b=d.indexOf(this.config.latFields,a.toLowerCase());-1!==b&&(this.latField=a);b=d.indexOf(this.config.longFields,a.toLowerCase());-1!==b&&(this.longField=a);return this.latField&&this.longField?!0:!1},this);if(null===this.latField||null===this.longField)w({message:this.nls.error.invalidCoord}),this.clearCSVResults();else{var g=0;this.errorList=[];d.forEach(a,function(a,b){var c=!1,q={};d.forEach(this.combinedFields,function(b){var d=Number(this.csvStore.getValue(a,b));q[b]=isNaN(d)?this.csvStore.getValue(a,
b):d},this);q.__OBJECTID=v;q[this.config.intersectField]=this.config.valueOut;v++;var f=0,m=0;isNaN(q[this.latField])||isNaN(q[this.longField])?(c=!0,g+=1,this.errorList.push(parseInt(a._csvId,10)+2),this.enrichErrors.innerHTML=e.substitute(this.nls.results.recordsError,{"0":g})):(f=parseFloat(q[this.latField]),m=parseFloat(q[this.longField]));c||(c={geometry:("latlon"===x?new C(K.lngLatToXY(m,f),this.srWebMerc):new C(m,f,this.srWebMerc)).toJson(),attributes:q},A.featureSet.features.push(c),this.resultsPlotting.innerHTML=
e.substitute(this.nls.results.recordsPlotted,{"0":(b-g+1).toString(),1:F}))},this);this.layerLoaded&&this.map.removeLayer(this.featureLayer);this.featureLayer=new n(A,{infoTemplate:m,id:"csvLayer",name:"CSV Layer"});this.featureLayer.setRenderer(this.renderer);c.replace(this.resultsPlottingImage,"complete","processing");c.remove(this.clearResultsBtn,"jimu-state-disabled");this._zoomToData(this.featureLayer);var s;if(this.chkboxPlotOnly.checked){for(s in this.enrichResultsText)this.enrichResultsText.hasOwnProperty(s)&&
(this.enrichResultsText[s].innerHTML="");for(s in this.enrichResultsProg)this.enrichResultsProg.hasOwnProperty(s)&&f.set(this.enrichResultsProg[s],"display","none")}else for(s in this._enrichData(this.featureLayer,this.config.enrichLayers),this.enrichResultsProg)this.enrichResultsProg.hasOwnProperty(s)&&f.set(this.enrichResultsProg[s],"display","block")}}else new w({message:e.substitute(this.nls.error.tooManyRecords,{"0":this.config.maxRowCount})}),this.clearCSVResults()},_enrichData:function(a,c){this.syncLayers=
[];var e=0,f=1,m=[];m[e]=[];d.forEach(a.graphics,b.hitch(this,function(b){f>=parseInt(this.config.cacheNumber,10)?(m[e].push(b),a.graphics.length>(e+1)*parseInt(this.config.cacheNumber,10)&&(e++,f=1,m[e]=[])):(m[e].push(b),f++)}));d.forEach(c,function(c){var e=d.map(c.fields,function(a){return a.fieldName}),f=new L({layer:c,numberOfRequest:a.graphics.length,totalRecords:a.graphics.length,numberOfHits:0,fields:e,intersectField:this.config.intersectField,valueIn:this.config.valueIn,valueOut:this.config.valueOut,
valueInSym:this.symIn,valueOutSym:this.symOut});this.own(r(f,"complete",b.hitch(this,this._syncComplete)));this.own(r(f,"requestComplete",b.hitch(this,this._requestComplete)));this.own(r(f,"error",b.hitch(this,this._deferredErrorCallback)));this.syncLayers.push(f);this.queryCallback(m,0,c,e,f)},this)},queryCallback:function(a,c,e,f,m){var g,k=new B(this.map.spatialReference);d.forEach(a[c],function(a){(a=a.geometry)&&k.addPoint({x:a.x,y:a.y})});var l=new H(e.url);if(0===c){var h=new D;h.returnGeometry=
!0;h.outFields=["*"];h.geometry=k;g=l.execute(h,b.hitch(this,this.queryCallback(a,c+1,e,f,m)),b.hitch(this,this.queryErrorback(e)));m.addDeferred(g,a[c]);this.featureLayer.redraw()}else return function(d){if(a.length>c){var h=new D;h.returnGeometry=!0;h.outFields=["*"];h.geometry=k;g=l.execute(h,b.hitch(this,this.queryCallback(a,c+1,e,f,m)),b.hitch(this,this.queryErrorback(e)));m.addDeferred(g,a[c]);this.featureLayer.redraw()}return{results:d}}},queryErrorback:function(a){return b.hitch(this,function(b){this.enrichResultsProg.hasOwnProperty(a.id)&&
(c.replace(this.enrichResultsProg[a.id],"error","complete"),c.replace(this.enrichResultsProg[a.id],"error","processing"));console.log(b);return b})},_deferredErrorCallback:function(a){this.enrichResultsProg.hasOwnProperty(a.layerID)&&(c.replace(this.enrichResultsProg[a.layerID],"error","complete"),c.replace(this.enrichResultsProg[a.layerID],"error","processing"))},_syncComplete:function(a){c.replace(this.enrichResultsProg[a.layerID],"complete","processing");d.some(this.syncLayers,function(a){return!a.isComplete()},
this)||(this.featureLayer.redraw(),c.remove(this.showFileDialogBtn,"jimu-state-disabled"),c.remove(this.downloadResultsBtn,"hide"))},_requestComplete:function(a){this.enrichResultsText[a.layerID].innerHTML=e.substitute(this.nls.results.recordsEnriched,{"0":a.currentNumber,1:a.totalRecords,2:a.intesected,3:a.name});this.featureLayer.redraw()},_resetResults:function(){c.replace(this.resultsLoadingImage,"processing","complete");c.replace(this.resultsPlottingImage,"processing","complete");var a,f="";
for(a in this.enrichResultsProg)this.enrichResultsProg.hasOwnProperty(a)&&(c.replace(this.enrichResultsProg[a],"processing","error"),c.replace(this.enrichResultsProg[a],"processing","complete"));var v=b.hitch(this,function(b){b.id===a&&(g=b)});for(a in this.enrichResultsProg)if(this.enrichResultsText.hasOwnProperty(a)){var g;d.forEach(this.config.enrichLayers,v);g&&(f=g.label);this.enrichResultsText[a].innerHTML=e.substitute(this.nls.results.recordsEnriched,{"0":0,1:0,2:0,3:f})}this.resultsLoading.innerHTML=
e.substitute(this.nls.results.csvLoaded,{"0":0});this.enrichErrors.innerHTML="";this.resultsPlotting.innerHTML=e.substitute(this.nls.results.recordsPlotted,{"0":0,1:0})},downloadCSVResults:function(){console.log(this.featureLayer);var a=z.createDataSource({type:z.TYPE_FEATURESET,filename:this.nls.savingCSV,data:u.toFeatureSet(this.featureLayer.graphics)});a.setFormat(z.FORMAT_CSV);a.download()},clearCSVResults:function(){this.layerLoaded&&this.map.removeLayer(this.featureLayer);this._resetResults();
c.add(this.downloadResultsBtn,"hide");c.add(this.results,"hide");f.set(this.enrichErrorsList,"display","none");c.remove(this.showFileDialogBtn,"jimu-state-disabled");c.add(this.clearResultsBtn,"jimu-state-disabled")},destroy:function(){this.layerLoaded&&this.map.removeLayer(this.featureLayer);this.inherited(arguments)},_getSeparator:function(a){var b=0,c="";d.forEach([",","      ",";","|"],function(d){var e=a.split(d).length;e>b&&(b=e,c=d)});return c},_generateFeatureCollectionTemplateCSV:function(a,
c){var e={layerDefinition:null,featureSet:{features:[],geometryType:"esriGeometryPoint",spatialReference:{wkid:102100}},layerDefinition:{geometryType:"esriGeometryPoint",objectIdField:"__OBJECTID",type:"Feature Layer",typeIdField:"",fields:[{name:"__OBJECTID",alias:"Row Number",type:"esriFieldTypeOID",editable:!1,domain:null}],types:[],capabilities:"Query"}};this.csvFields=a.getAttributes(c[0]);this.combinedFields=b.clone(this.csvFields);this.combinedFields.push(this.config.intersectField);d.forEach(this.combinedFields,
function(b){var d=a.getValue(c[0],b);isNaN(Number(d))||b===this.config.intersectField?e.layerDefinition.fields.push({name:b,alias:b,type:"esriFieldTypeString",editable:!0,domain:null}):e.layerDefinition.fields.push({name:b,alias:b,type:"esriFieldTypeDouble",editable:!0,domain:null})},this);e.layerDefinition.fields.push({name:"Out",alias:"GLProcessed",type:"esriFieldTypeString",editable:!1,visible:!1,domain:null});this.combinedFields=this.combinedFields.concat(this.lookupLayersFieldNames);e.layerDefinition.fields=
e.layerDefinition.fields.concat(this.lookupLayersFields);return e},_generateDefaultPopupInfo:function(a){var c={esriFieldTypeDouble:1,esriFieldTypeSingle:1},e={esriFieldTypeInteger:1,esriFieldTypeSmallInteger:1},f={esriFieldTypeDate:1},g=null;a=d.map(a.layerDefinition.fields,b.hitch(this,function(a){"NAME"===a.name.toUpperCase()&&(g=a.name);var d="esriFieldTypeGlobalID"!==a.type&&"esriFieldTypeGeometry"!==a.type;"GLProcessed"===a.alias&&(d=!1);var h=null;if(d){var k=a.name.toLowerCase();if(-1<",stretched value,fnode_,tnode_,lpoly_,rpoly_,poly_,subclass,subclass_,rings_ok,rings_nok,".indexOf(","+
k+",")||k.indexOf("_i")===k.length-2)d=!1;a.type in e?h={places:0,digitSeparator:!0}:a.type in c?h={places:4,digitSeparator:!0}:a.type in f&&(h={dateFormat:"shortDateShortTime"})}return b.mixin({},{fieldName:a.name,label:a.alias,isEditable:!1,tooltip:"",visible:d,format:h,stringFieldOption:"textbox"})}));return{title:g?"{"+g+"}":"",fieldInfos:a,description:null,showAttachments:!1,mediaInfos:[]}},_buildInfoTemplate:function(a){var b='\x3cdiv style\x3d"font-weight:bold;"\x3e'+this.nls.results.label+
"\x3c/div\x3e",c={content:b+'\x3cdiv style\x3d"border:none;border-top: 1px solid #333333;margin-top: 6px;margin-bottom: 6px;"\x3e\x3c/div\x3e\x3ctable\x3e'};d.forEach(a.fieldInfos,function(a){a.visible&&(c.content+='\x3ctr\x3e\x3ctd valign\x3d"top" style\x3d"color:#888888;padding-right:5px;"\x3e',c.content+=a.label+": \x3c/td\x3e",c.content+='\x3ctd valign\x3d"top" style\x3d"padding:2px;padding-bottom:5px;"\x3e${',c.content+=a.fieldName+"}\x3c/td\x3e\x3c/tr\x3e")});c.content+="\x3c/table\x3e";return c},
_zoomToData:function(a){var b=new B(this.map.spatialReference);d.forEach(a.graphics,function(a){(a=a.geometry)&&b.addPoint({x:a.x,y:a.y})});a.name="CSV Layer";this.map.addLayer(this.featureLayer);this.layerLoaded=!0;0<b.points.length&&(this.map.setExtent(b.getExtent().expand(1.05),!0),this.chkboxPlotOnly.checked&&c.remove(this.showFileDialogBtn,"jimu-state-disabled"))},showErrorTable:function(){if("none"===f.get(this.enrichErrorsList,"display")){var a="";d.forEach(this.errorList,b.hitch(this,function(b){a=
a+e.substitute(this.nls.results.recordsErrorList,{"0":b})+"\x3cbr\x3e"}));this.enrichErrorsList.innerHTML=a;f.set(this.enrichErrorsList,"display","block")}else f.set(this.enrichErrorsList,"display","none")}})});