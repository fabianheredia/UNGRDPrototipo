// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

require({cache:{"url:widgets/NearMe/item-list.html":'\x3cdiv class\x3d"esriCTItemlList"\x3e\r\n    \x3cdiv class\x3d"esriCTBackButton"\x3e\r\n        \x3cdiv class\x3d"esriCTItemLeftArrow"\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTItemRightArrow"\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTItemCount esriCTLoadingIcon"\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriCTItemName"\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n'}});
define("dojo/_base/declare dijit/_WidgetBase dojo/dom-construct dojo/query dojo/_base/array dojo/_base/lang dijit/layout/ContentPane dojo/dom-attr dojo/dom-style dojo/dom-class dojo/on dojo/Deferred dojo/Evented dojo/promise/all jimu/dijit/Message jimu/dijit/TabContainer dojo/text!./item-list.html esri/Color esri/dijit/Directions esri/dijit/PopupTemplate esri/graphic esri/geometry/Point esri/geometry/Polyline esri/geometry/Polygon esri/SpatialReference esri/geometry/geometryEngine esri/layers/FeatureLayer esri/layers/GraphicsLayer esri/symbols/SimpleFillSymbol esri/symbols/SimpleLineSymbol esri/symbols/SimpleMarkerSymbol esri/tasks/query esri/tasks/RelationshipQuery esri/units dojo/_base/fx dojo/number dijit/registry".split(" "),function(D,
E,l,m,r,h,t,q,e,k,p,u,F,x,G,H,I,s,J,y,v,K,z,L,w,M,N,O,A,n,B,P,Q,R,S,C,f){return D([E,F],{_itemListTemplate:I,_serviceArea:null,_operationalLayers:null,_selectedPoint:null,_panels:{},_currentPanel:null,map:null,config:null,folderUrl:null,loading:null,nls:null,parentDiv:null,outerContainer:null,_featureListContent:null,_featureInfoPanel:null,_directionInfoPanel:null,_tabContainer:null,_isNoFeature:null,_isSlide:!0,_loadAttachmentTimer:null,_failedLayers:[],_routeCalculated:!1,_selectedLayer:null,_selectedItem:null,
_selectedFeature:null,_selectedFeatureItem:null,_featureGraphicsLayer:null,_directionsWidget:null,_layerCount:null,_tables:[],postCreate:function(){this._tables=[];this._panels={};this._failedLayers=[];this._operationalLayers=null;this.domNode=l.create("div",{"class":"esriCTItemListMainContainer"},this.outerContainer);this._createPanels();this._loadFeatureLayers();this._featureGraphicsLayer=new O;this.map.addLayer(this._featureGraphicsLayer)},_createPanels:function(){var a;this._panels.layerListPanel=
l.create("div",{"class":"esriCTLayerList"},this.domNode);this._panels.featureListPanel=l.create("div",{"class":"esriCTFeatureList"},this.domNode);a=l.toDom(this._itemListTemplate).childNodes[0];k.add(a,"esriCTPanelHeader");this._panels.featureListPanel.appendChild(a);this._featureListContent=l.create("div",{"class":"esriCTFeatureListContent"},null);e.set(this._featureListContent,"color",this.config.fontColor);this._panels.featureListPanel.appendChild(this._featureListContent);this._attachEventOnBackButton(this._panels.featureListPanel);
this._panels.infoPanel=l.create("div",{"class":"esriCTDirectionInfoPanel"},this.domNode);a=l.toDom(this._itemListTemplate).childNodes[0];k.add(a,"esriCTPanelHeader");this._panels.infoPanel.appendChild(a);this._attachEventOnBackButton(this._panels.infoPanel);this._featureInfoPanel=new t({id:"divFeatureInfoContent"},null);this._featureInfoPanel.startup();this.map.webMapResponse.itemInfo.itemData.applicationProperties&&this.map.webMapResponse.itemInfo.itemData.applicationProperties.viewing.routing.enabled?
(this._directionInfoPanel=new t({id:"divDirectionInfoContent"},null),this._directionInfoPanel.startup(),this._tabContainer=new H({tabs:[{title:this.nls.informationTabTitle,content:this._featureInfoPanel},{title:this.nls.directionTabTitle,content:this._directionInfoPanel}]},l.create("div",{"class":"esriCTTabContainer"},this._panels.infoPanel)),this._tabContainer.startup(),this.own(this._tabContainer.on("tabChanged",h.hitch(this,function(a){this.emit("tab-change",a);a===this.nls.directionTabTitle&&
!this._routeCalculated&&this._initializeDirectionWidget();this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize()})))):(this._panels.infoPanel.appendChild(this._featureInfoPanel.domNode),k.add(this._featureInfoPanel.domNode,"esriCTFeatureInfo"),(a=m(".esriCTItemListMainContainer .esriCTDirectionInfoPanel .esriCTPanelHeader"))&&k.add(a[0],"esriCTBorderBottom"));this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize()},
_attachEventOnBackButton:function(a){var b,c;b=m(".esriCTItemlList",a)[0];c=m(".esriCTBackButton",a)[0];b&&c&&this.own(p(b,"click",h.hitch(this,function(a){a.stopPropagation();"none"!==e.get(c,"display")&&this._isSlide&&(this._isSlide=!1,this._selectedItem=null,this._clearGrahics(),this._clearDirections(),this._isFeatureList?(this._isFeatureList=!1,this._showPanel("featureListPanel",!0)):(this.loading.hide(),this._clearContent(this._featureListContent),this.config.selectedSearchLayerOnly&&this.showAllLayers(),
this._resetFilter(this._selectedLayer.layerIndex),this._selectedLayer=null,this._isFeatureList=!1,this._showPanel("layerListPanel",!0)))})))},_loadFeatureLayers:function(){var a,b;this._operationalLayers=[];this._tables=this.map.webMapResponse.itemInfo.itemData.tables;for(b=0;b<this.config.searchLayers.length;b++)this.config.searchLayers[b].popupInfo&&(a=new N(this.config.searchLayers[b].url,{infoTemplate:new y(this.config.searchLayers[b].popupInfo)}),this.config.searchLayers[b].id&&(a.id=this.config.searchLayers[b].id),
a.title=this.config.searchLayers[b].title,this.config.searchLayers[b].definitionExpression&&a.setDefinitionExpression(this.config.searchLayers[b].definitionExpression),this.config.searchLayers[b].renderer&&a.setRenderer(this.config.searchLayers[b].renderer),a.index=b,a.layerIndex=this._operationalLayers.length,a.isMapServer=this.config.searchLayers[b].isMapServer,a.showAttachments=this.config.searchLayers[b].popupInfo.showAttachments,this._operationalLayers.push(a),this._onLayerLoad(a))},_onLayerLoad:function(a){a.loaded?
a.tableInfos=this._getRelatedTableInfo(a.index):this.own(a.on("load",h.hitch(this,function(){a.tableInfos=this._getRelatedTableInfo(a.index)})))},_getRelatedTableInfo:function(a){var b,c=[];(b=this._operationalLayers[a])&&r.forEach(b.relationships,h.hitch(this,function(a){r.forEach(this._tables,h.hitch(this,function(g,e){g.url.replace(/.*?:\/\//g,"")===(this.config.searchLayers[e].baseURL+a.relatedTableId).replace(/.*?:\/\//g,"")&&g.popupInfo&&(g.relationshipIds||(g.relationshipIds={}),g.relationshipIds[b.id]=
a.id,c.push(e))}))}));return c},hasValidLayers:function(){return this._operationalLayers&&0<this._operationalLayers.length?!0:!1},_clearContent:function(a){a&&l.empty(a)},displayLayerList:function(a,b){var c=[];this.loading.hide();this._layerCount=0;this._isSlide=this._isNoFeature=!0;this.clearResultPanel();this.config.selectedSearchLayerOnly&&this.showAllLayers();this._setSeachedLocation(a);this._setServiceArea(b);this._failedLayers=[];this._filterConfiguredLayer(c);x(c).then(h.hitch(this,function(){this._onFeatureCountComplete()}))},
_filterConfiguredLayer:function(a){if(1<this._operationalLayers.length){this._currentPanel=this._panels.layerListPanel;e.set(this._currentPanel,"display","block");e.set(this._currentPanel,"left","0px");for(var b=0;b<this._operationalLayers.length;b++)this._resetFilter(this._operationalLayers[b].layerIndex),this._createItemTemplate(this._operationalLayers[b],a)}else this._layerCount=1,this._resetFilter(this._operationalLayers[0].layerIndex),this._onSingleLayerFound(a,this._operationalLayers[0])},_onSingleLayerFound:function(a,
b){var c,d;a&&(d=new u,a.push(d));(c=m(".esriCTBackButton",this._panels.featureListPanel)[0])&&e.set(c,"display","none");this._currentPanel=this._panels.featureListPanel;e.set(this._currentPanel,"display","block");e.set(this._currentPanel,"left","0px");b&&this._displayFeatureList(b,d)},_onSingleFeatureFound:function(a){this._displayFilteredFeatures(a.features[0].attributes[this._selectedLayer.objectIdField]);this._showFeatureDetails(null,a.features[0]);if(a=m(".esriCTBackButton",this._panels.infoPanel)[0])e.set(a,
"display","block"),1===this._layerCount&&(e.set(a,"display","none"),e.set(this._panels.featureListPanel,"display","none"))},_createItemTemplate:function(a,b){var c;c=l.toDom(this._itemListTemplate).childNodes[0];k.add(c,"esriCTDisabled");e.set(c,"color",this.config.fontColor);this._currentPanel.appendChild(c);this._setItemName(c,a.title);this._queryForCountOnly(c,a,b);this._attachClickEvent(c,a,!0)},_setItemName:function(a,b){var c=m(".esriCTItemName",a)[0];c&&(q.set(c,"innerHTML",b),q.set(c,"title",
b))},_attachClickEvent:function(a,b){this.own(p(a,"click",h.hitch(this,function(c){!k.contains(a,"esriCTDisabled")&&this._isSlide&&(c.stopPropagation(),this._isSlide=!1,this._selectedItem=a,(c=m(".esriCTBackButton",this._panels.featureListPanel)[0])&&e.set(c,"display","block"),this._displayFeatureList(b,null))})))},_displayFeatureList:function(a,b){this._clearContent(this._featureListContent);this._selectedLayer=a;if(this.map.webMapResponse.itemInfo.itemData.applicationProperties&&this.map.webMapResponse.itemInfo.itemData.applicationProperties.viewing.routing.enabled){var c,
d,g;c=m(".jimu-tab",this._panels.infoPanel);d=m(".jimu-tab .control",this._panels.infoPanel);g=m(".esriCTItemListMainContainer .esriCTDirectionInfoPanel .esriCTPanelHeader");d&&(d[0]&&c&&c[0]&&g&&g[0])&&("esriGeometryPolygon"===a.geometryType&&this.config.intersectSearchedLocation?(k.add(c[0],"esriCTOverrideHeight"),k.add(d[0],"esriCTHidden"),k.add(g[0],"esriCTBorderBottom")):(k.remove(c[0],"esriCTOverrideHeight"),k.remove(d[0],"esriCTHidden"),k.remove(g[0],"esriCTBorderBottom")))}this._setItemName(this._panels.featureListPanel,
this._selectedLayer.title);this._queryForFeatureList(b)},_getQueryParams:function(){var a=new P;a.geometry=this._serviceArea||this.map.extent;a.spatialRelationship="esriSpatialRelIntersects";a.outFields=["*"];return a},_queryForCountOnly:function(a,b,c){var d,g;g=this._getQueryParams();this.config.intersectSearchedLocation&&"esriGeometryPolygon"===b.geometryType&&(g.geometry=this._selectedPoint.geometry);d=new u;b.queryCount(g,h.hitch(this,function(c){0<c?(this._selectedLayer=b,this._layerCount++,
this._setItemCount(a,c,!0)):e.set(a,"display","none");d.resolve()}),h.hitch(this,function(){a&&e.set(a,"display","none");this._failedLayers.push(b.title);d.resolve()}));c.push(d)},_onFeatureCountComplete:function(){this._isNoFeature?(this.clearResultPanel(),e.set(this._panels.layerListPanel,"display","block"),e.set(this._panels.layerListPanel,"left","0px"),l.create("div",{"class":"esriCTNoFeatureFound",innerHTML:this.nls.noFeatureFoundText},this._panels.layerListPanel)):1===this._layerCount&&1!==
this._operationalLayers.length&&(e.set(this._panels.layerListPanel,"display","none"),this._onSingleLayerFound(null,this._selectedLayer));if(this._failedLayers.length){var a=this.nls.unableToFetchResults+"\n\x3c/t\x3e\x3cul\x3e\x3cli\x3e"+this._failedLayers.join("\n \x3c/li\x3e\x3cli\x3e")+"\x3c/li\x3e\x3c/ul\x3e";this._showMessage(a)}this.loading.hide();this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize()},_queryForFeatureList:function(a){this.loading.show();
var b=this._getQueryParams();this.config.intersectSearchedLocation&&(this._selectedLayer&&"esriGeometryPolygon"===this._selectedLayer.geometryType)&&(b.geometry=this._selectedPoint.geometry);this._selectedLayer&&(this._hideAllLayers(),this._selectedLayer.queryFeatures(b,h.hitch(this,function(b){0<b.features.length&&(this._isNoFeature=!1,1!==b.features.length?this._creatFeatureList(b.features):this._onSingleFeatureFound(b));this.loading.hide();a&&a.resolve()}),h.hitch(this,function(){this.loading.hide();
this._failedLayers.push(this._selectedLayer.title);a&&a.resolve()})))},resetAllFilters:function(){for(var a=0;a<this._operationalLayers.length;a++)this._resetFilter(this._operationalLayers[a].layerIndex)},_setItemCount:function(a,b,c){var d=m(".esriCTItemCount",a)[0];d&&(k.remove(d,"esriCTLoadingIcon"),c?(q.set(d,"innerHTML","("+C.format(b)+")"),b&&(this._isNoFeature=!1,k.remove(a,"esriCTDisabled"))):q.set(d,"innerHTML",C.format(b.toFixed(2))+" "+this.config.bufferDistanceUnit.acronym))},_creatFeatureList:function(a){var b,
c,d="",g;a=this._getSortedFeatureList(a);for(b=0;b<a.length;b++)d&&(d+=","),d+=a[b].attributes[this._selectedLayer.objectIdField],c=l.toDom(this._itemListTemplate).childNodes[0],k.add(c,"esriCTFeatureListItem"),this._featureListContent.appendChild(c),this._setItemName(c,a[b].getTitle()),"polygon"===a[b].geometry.type&&this.config.intersectSearchedLocation?(g=m(".esriCTItemCount",c)[0])&&k.remove(g,"esriCTLoadingIcon"):this._setItemCount(c,a[b].distanceToLocation,!1),this._attachEventOnFeatureDiv(c,
a[b]);this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize();this._displayFilteredFeatures(d);this._showPanel("featureListPanel");this.loading.hide()},_displayFilteredFeatures:function(a){this.config.selectedSearchLayerOnly&&(this._showHideOperationalLayer(this._selectedLayer.url,this._selectedLayer.id,!0),a=this._selectedLayer.objectIdField+" in ("+a+")",this._selectedLayer.setDefinitionExpression(a),this._setFilterOnMapLayer(a,this._selectedLayer.id,
this._selectedLayer.url,this._selectedLayer.isMapServer))},_setFilterOnMapLayer:function(a,b,c,d){var g=[];if(b)if(d){if(g=b.substring(0,b.lastIndexOf("_")),b=this.map.getLayer(g))g=[],c=c[c.length-1],g[c]=a,b.setLayerDefinitions(g)}else(b=this.map.getLayer(b))&&b.setDefinitionExpression(a)},_resetFilter:function(a){var b,c;if(b=this.config.searchLayers[this._operationalLayers[a].index])c=this._operationalLayers[a].getDefinitionExpression(),c!==b.definitionExpression&&(this._operationalLayers[a].setDefinitionExpression(b.definitionExpression),
this._setFilterOnMapLayer(b.definitionExpression,this._operationalLayers[a].id,this._operationalLayers[a].url,this._operationalLayers[a].isMapServer))},_getSortedFeatureList:function(a){var b;for(b=0;b<a.length;b++)a[b].distanceToLocation=M.distance(this._selectedPoint.geometry,a[b].geometry,this.config.bufferDistanceUnit.distanceUnit);a.sort(function(a,b){return a.distanceToLocation-b.distanceToLocation});return a},_attachEventOnFeatureDiv:function(a,b){this.own(p(a,"click",h.hitch(this,function(){this._isFeatureList=
!0;var c=m(".esriCTBackButton",this._panels.infoPanel)[0];c&&e.set(c,"display","block");this._showFeatureDetails(a,b)})))},_showFeatureDetails:function(a,b){this._setItemName(this._panels.infoPanel,this._selectedLayer.title);this._showPanel("infoPanel");this._tabContainer&&this._tabContainer.selectTab(this.nls.informationTabTitle);this._selectedFeatureItem=a;this._selectedFeature=b;this._clearDirections();this._highlightFeatureOnMap();this._displayFeatureInfo(b);this.parentDivId&&(f.byId(this.parentDivId)&&
f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize()},_displayFeatureInfo:function(a){var b,c;this._loadAttachmentTimer&&clearTimeout(this._loadAttachmentTimer);this._featureInfoPanel&&(this._featureInfoPanel.set("content",""),this._showPopupInfo(a),this._checkAttachments());this.config.zoomToFeature&&("point"===a.geometry.type?(b=a.geometry,c=this._selectedPoint.geometry,b={paths:[[[b.x,b.y],[c.x,c.y]]],spatialReference:this.map.spatialReference},b=new z(b),this.map.setExtent(b.getExtent().expand(1.5))):
this.map.setExtent(a.geometry.getExtent().expand(1.5)));this._getRelatedRecords(a)},_getRelatedRecords:function(a){r.forEach(this._selectedLayer.tableInfos,h.hitch(this,function(b){this._queryRelatedRecords(this._tables[b],a.attributes[this._selectedLayer.objectIdField])}))},_queryRelatedRecords:function(a,b){if(this._selectedLayer&&a){var c=new Q;c.objectIds=[parseInt(b,10)];c.outFields=["*"];c.relationshipId=a.relationshipIds[this._selectedLayer.id];a.layerDefinition&&a.layerDefinition.definitionExpression&&
(c.definitionExpression=a.layerDefinition.definitionExpression);this._selectedLayer.queryRelatedFeatures(c,h.hitch(this,function(c){c=c[b];r.forEach(c?c.features:[],h.hitch(this,function(b){b.setInfoTemplate(new y(a.popupInfo));this._showPopupInfo(b)}));this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize()}))}},_showPopupInfo:function(a){if(this._featureInfoPanel&&a){var b=new t({"class":"esriCTPopupInfo"});b.set("content",a.getContent());
this._featureInfoPanel.addChild(b)}},_checkAttachments:function(){if(this._selectedLayer.hasAttachments&&this._selectedLayer.showAttachments){this.loading.show();var a=m(".attachmentsSection",this._featureInfoPanel.domNode)[0];l.empty(a);k.remove(a,"hidden");this._loadAttachmentTimer=setTimeout(h.hitch(this,function(){this._showAttachments(this._selectedFeature,a,this._selectedLayer)}),500)}},_showAttachments:function(a,b,c){var d,g,e,m,n,q=[],p;a=a.attributes[c.objectIdField];l.empty(b);c.queryAttachmentInfos(a,
h.hitch(this,function(a){if(a&&0<a.length){l.create("div",{innerHTML:this.nls.attachmentHeader,"class":"esriCTAttachmentHeader"},b);d=l.create("div",{"class":"esriCTThumbnailContainer"},b);for(n=0;n<a.length;n++)p=new u,m=this.folderUrl+"images/no-attachment.png",-1<a[n].contentType.indexOf("image")&&(m=a[n].url),e=l.create("span",{"class":"esriCTAttachmentHolder col"},d),k.add(e,"esriCTImageLoader"),g=l.create("img",{alt:a[n].url,"class":"esriCTAttachmentImg esriCTAutoHeight",src:m},e),this._attachEventOnImage(g,
p),q.push(p)}x(q).then(h.hitch(this,this._onAllAttachmentLoad));this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize()}))},_attachEventOnImage:function(a,b){this.own(p(a,"load",h.hitch(this,function(a){this._onImageLoad(a);b.resolve()})));this.own(p(a,"click",h.hitch(this,this._displayImageAttachments)));this.own(p(a,"error",h.hitch(this,function(a){this._onError(a);b.resolve()})))},_displayImageAttachments:function(a){window.open(a.target.alt)},
_onImageLoad:function(a){k.remove(a.target.parentNode,"esriCTImageLoader");this._setImageDimensions(a.target)},_setImageDimensions:function(a){var b,c;c=a.parentElement;if(a&&0<a.offsetHeight&&(q.set(a,"originalHeight",a.offsetHeight),e.set(a,"maxHeight",a.offsetHeight+"px"),e.set(a,"maxWidth",a.offsetWidth+"px"),b=parseFloat(q.get(a,"originalHeight")),c.offsetHeight<a.offsetHeight||b>c.offsetHeight))b=a.offsetWidth/a.offsetHeight,c=c.offsetHeight-2,b=Math.floor(c*b),k.remove(a,"esriCTAutoHeight"),
e.set(a,"width",b+"px"),e.set(a,"height",c+"px")},_onError:function(a){k.remove(a.target.parentNode,"esriCTImageLoader")},_onAllAttachmentLoad:function(){this.loading.hide()},_setSeachedLocation:function(a){this._selectedPoint=a},_setServiceArea:function(a){this._serviceArea=a},clearResultPanel:function(){this._isFeatureList=!1;this._clearContent(this._panels.layerListPanel);e.set(this._panels.layerListPanel,"display","none");e.set(this._panels.featureListPanel,"display","none");e.set(this._panels.infoPanel,
"display","none");this._clearContent(this._featureListContent);this._clearDirections();this._clearGrahics()},removeGraphicsLayer:function(){this._featureGraphicsLayer&&(this.map.removeLayer(this._featureGraphicsLayer),this._featureGraphicsLayer=null)},_clearGrahics:function(){this._featureGraphicsLayer&&this._featureGraphicsLayer.clear()},_showPanel:function(a,b){e.set(this._panels[a],{display:"block",left:"-100%"});b?(this._slide(this._panels[a],-100,0),this._slide(this._currentPanel,0,100)):(this._slide(this._currentPanel,
0,-100),this._slide(this._panels[a],100,0));this._currentPanelName=a;this._currentPanel=this._panels[a];this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize()},_slide:function(a,b,c){e.set(a,"display","block");e.set(a,"left",b+"%");S.animateProperty({node:a,properties:{left:{start:b,end:c,units:"%"}},duration:300,onEnd:h.hitch(this,function(){e.set(a,"left",c);0===c?e.set(a,"display","block"):e.set(a,"display","none");this._isSlide=!0})}).play()},
_showMessage:function(a){(new G({message:a})).message=a},_initializeDirectionWidget:function(){var a;this._directionsWidget||(f.byId("directionDijit")&&f.byId("directionDijit").destroy(),a={id:"directionDijit",map:this.map,directionsLengthUnits:R[this.config.directionLengthUnit.routeUnit],showTrafficOption:!1,dragging:!1,routeTaskUrl:this.config.routeService,routeSymbol:new n(this.config.symbols.routeSymbol)},this._directionsWidget=new J(a,l.create("div",{},null)),this._directionsWidget.startup(),
this.own(this._directionsWidget.on("directions-finish",h.hitch(this,function(){this._directionsWidget.zoomToFullRoute();this.parentDivId&&(f.byId(this.parentDivId)&&f.byId(this.parentDivId).resize)&&f.byId(this.parentDivId).resize();this.loading.hide()}))),this._directionInfoPanel.set("content",this._directionsWidget.domNode));this._routeSelectedLocations()},_clearDirections:function(){this._routeCalculated=!1;this._directionsWidget&&this._directionsWidget.clearDirections()},_routeSelectedLocations:function(){var a=
[];this._clearDirections();this._selectedPoint&&this._selectedFeature&&(this.loading.show(),a.push(this._selectedPoint),"point"===this._selectedFeature.geometry.type?a.push(this._selectedFeature):"polygon"===this._selectedFeature.geometry.type?a.push(this._selectedFeature.geometry.getCentroid()):a.push(this._selectedFeature.geometry.getPoint(0,0)),this._directionsWidget.updateStops(a).then(h.hitch(this,function(){this._directionsWidget.getDirections();this._routeCalculated=!0}),h.hitch(this,function(){this.loading.hide();
this._showMessage(this.nls.failedToGenerateRouteMsg)})))},_highlightFeatureOnMap:function(){var a;this._clearGrahics();a=this._getHighLightSymbol(this._selectedFeature,this._selectedLayer);this._featureGraphicsLayer.add(a)},_getHighLightSymbol:function(a,b){switch(a.geometry.type){case "point":return this._getPointSymbol(a,b);case "polyline":return this._getPolyLineSymbol(a,b);case "polygon":return this._getPolygonSymbol(a)}},_getPointSymbol:function(a,b){var c,d,g,e,f;d=!1;c=new B(B.STYLE_SQUARE,
null,new n(n.STYLE_SOLID,new s([0,255,255,1]),3));c.setColor(null);c.size=30;if(b&&b.renderer)if(b.renderer.symbol)c=this._updatePointSymbolProperties(c,b.renderer.symbol);else if(b.renderer.infos&&0<b.renderer.infos.length){for(f=0;f<b.renderer.infos.length;f++)b.typeIdField?g=a.attributes[b.typeIdField]:b.renderer.attributeField&&(g=a.attributes[b.renderer.attributeField]),e=b.renderer.infos[f].value,void 0!==g&&(null!==g&&""!==g&&void 0!==e&&null!==e&&""!==e)&&g.toString()===e.toString()&&(d=!0,
c=this._updatePointSymbolProperties(c,b.renderer.infos[f].symbol));d||b.renderer.defaultSymbol&&(c=this._updatePointSymbolProperties(c,b.renderer.defaultSymbol))}d=new K(a.geometry.x,a.geometry.y,new w({wkid:a.geometry.spatialReference.wkid}));return new v(d,c,a.attributes)},_updatePointSymbolProperties:function(a,b){var c,d;b.hasOwnProperty("height")&&b.hasOwnProperty("width")&&(c=b.height,d=b.width,c=(c>d?c:d)+10,a.size=c);if(b.hasOwnProperty("size")&&(!c||c<b.size))a.size=b.size+10;b.hasOwnProperty("xoffset")&&
(a.xoffset=b.xoffset);b.hasOwnProperty("yoffset")&&(a.yoffset=b.yoffset);return a},_getPolyLineSymbol:function(a,b){var c,d,g,e;c=5;if(b&&b.renderer)if(b.renderer.symbol&&b.renderer.symbol.hasOwnProperty("width"))c=b.renderer.symbol.width;else if(b.renderer.infos&&0<b.renderer.infos.length)for(e=0;e<b.renderer.infos.length;e++)b.typeIdField?d=a.attributes[b.typeIdField]:b.renderer.attributeField&&(d=a.attributes[b.renderer.attributeField]),g=b.renderer.infos[e].value,void 0!==d&&(null!==d&&""!==d&&
void 0!==g&&null!==g&&""!==g)&&(d.toString()===g.toString()&&b.renderer.infos[e].symbol.hasOwnProperty("width"))&&(c=b.renderer.infos[e].symbol.width);else b.renderer.defaultSymbol&&b.renderer.defaultSymbol.hasOwnProperty("width")&&(c=b.renderer.defaultSymbol.width);c=new n(n.STYLE_SOLID,new s([0,255,255,1]),c);d=new z(new w({wkid:a.geometry.spatialReference.wkid}));a.geometry.paths&&0<a.geometry.paths.length&&d.addPath(a.geometry.paths[0]);return new v(d,c,a.attributes)},_getPolygonSymbol:function(a){var b,
c;b=new A(A.STYLE_SOLID,new n(n.STYLE_SOLID,new s([0,255,255,1]),4),new s([0,0,0,0]));c=new L(new w({wkid:a.geometry.spatialReference.wkid}));a.geometry.rings&&(c.rings=h.clone(a.geometry.rings));return new v(c,b,a.attributes)},_hideAllLayers:function(){if(this.config.selectedSearchLayerOnly){var a;for(a=0;a<this.config.searchLayers.length;a++)this._showHideOperationalLayer(this.config.searchLayers[a].url,this.config.searchLayers[a].id,!1)}},showAllLayers:function(){var a;for(a=0;a<this.config.searchLayers.length;a++)this._showHideOperationalLayer(this.config.searchLayers[a].url,
this.config.searchLayers[a].id,!0)},_showHideOperationalLayer:function(a,b,c){var d,e,f,h;f=a.split("/");f=f[f.length-1];for(d in this.map._layers)this.map._layers.hasOwnProperty(d)&&(b&&this.map._layers[d].url===a&&this.map._layers[d].id===b?this.map._layers[d].setVisibility(c):this.map._layers[d].visibleLayers&&(b&&this.map._layers[d].id===b.substring(0,b.lastIndexOf("_")))&&(e=this.map._layers[d].url[this.map._layers[d].url.length-1],e="/"===e?this.map._layers[d].url+f:this.map._layers[d].url+
"/"+f,e===a&&(e=this.map._layers[d].visibleLayers,h=r.indexOf(e,parseInt(f,10)),c?-1===h&&e.push(parseInt(f,10)):-1!==h&&e.splice(h,1),this.map._layers[d].setVisibleLayers(e))))}})});