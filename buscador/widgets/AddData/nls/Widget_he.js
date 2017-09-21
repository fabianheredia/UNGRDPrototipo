// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define({"widgets/AddData/nls/strings":{_widgetLabel:"\u05d4\u05d5\u05e1\u05e3 \u05de\u05d9\u05d3\u05e2",search:{featureLayerTitlePattern:"{serviceName} - {layerName}",layerInaccessible:"\u05d4\u05e9\u05db\u05d1\u05d4 \u05dc\u05d0 \u05e0\u05d2\u05d9\u05e9\u05d4.",online:"ArcGIS Online",url:"\u05d4\u05d6\u05df URL",loadError:"AddData, \u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05d8\u05e2\u05d5\u05df:",searchBox:{search:"\u05d7\u05e4\u05e9",placeholder:"\u05d7\u05e4\u05e9..."},bboxOption:{bbox:"\u05d1\u05ea\u05d5\u05da \u05e9\u05d8\u05d7 \u05d4\u05de\u05e4\u05d4"},
scopeOptions:{anonymousContent:"\u05ea\u05d5\u05db\u05df",myContent:"\u05d4\u05ea\u05d5\u05db\u05df \u05e9\u05dc\u05d9",myOrganization:"\u05d4\u05d0\u05e8\u05d2\u05d5\u05df \u05e9\u05dc\u05d9",curated:"\u05d0\u05e6\u05d5\u05e8",ArcGISOnline:"ArcGIS Online"},sortOptions:{prompt:"\u05de\u05d9\u05d9\u05df \u05dc\u05e4\u05d9:",relevance:"\u05e8\u05dc\u05d5\u05d5\u05e0\u05d8\u05d9\u05d5\u05ea",title:"\u05db\u05d5\u05ea\u05e8\u05ea",owner:"\u05d1\u05e2\u05dc\u05d9\u05dd",rating:"\u05d3\u05d9\u05e8\u05d5\u05d2",
views:"\u05ea\u05e6\u05d5\u05d2\u05d5\u05ea",date:"\u05ea\u05d0\u05e8\u05d9\u05da",switchOrder:"\u05d4\u05d7\u05dc\u05e3"},typeOptions:{prompt:"\u05e1\u05d5\u05d2",mapService:"\u05e9\u05d9\u05e8\u05d5\u05ea \u05de\u05e4\u05d4",featureService:"\u05e9\u05d9\u05e8\u05d5\u05ea\u05d9 \u05d9\u05e9\u05d5\u05d9\u05d5\u05ea",imageService:"\u05e9\u05d9\u05e8\u05d5\u05ea \u05ea\u05de\u05d5\u05e0\u05d4",vectorTileService:"\u05e9\u05d9\u05e8\u05d5\u05ea \u05d0\u05e8\u05d9\u05d7\u05d9\u05dd \u05e9\u05dc \u05d5\u05e7\u05d8\u05d5\u05e8",
kml:"KML",wms:"WMS"},resultsPane:{noMatch:"\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea."},paging:{first:"\x3c\x3c",firstTip:"\u05e8\u05d0\u05e9\u05d5\u05df",previous:"\x3c",previousTip:"\u05d4\u05e7\u05d5\u05d3\u05dd",next:"\x3e",nextTip:"\u05d4\u05d1\u05d0",pagePattern:"{page}"},resultCount:{countPattern:"{count} {type}",itemSingular:"\u05e4\u05e8\u05d9\u05d8",itemPlural:"\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd"},item:{actions:{add:"\u05d4\u05d5\u05e1\u05e3",close:"\u05e1\u05d2\u05d5\u05e8",
remove:"\u05d4\u05e1\u05e8",details:"\u05e4\u05e8\u05d8\u05d9\u05dd",done:"\u05d1\u05d5\u05e6\u05e2",editName:"\u05e2\u05e8\u05d5\u05da \u05e9\u05dd"},messages:{adding:"\u05de\u05d5\u05e1\u05d9\u05e3...",removing:"\u05de\u05e1\u05d9\u05e8...",added:"\u05e0\u05d5\u05e1\u05e3",addFailed:"\u05d4\u05d4\u05d5\u05e1\u05e4\u05d4 \u05e0\u05db\u05e9\u05dc\u05d4",unsupported:"\u05dc\u05d0 \u05e0\u05ea\u05de\u05da"},typeByOwnerPattern:"{type} \u05dc\u05e4\u05d9 {owner}",dateFormat:"d, MMMM ,yyyy",datePattern:"{date}",
ratingsCommentsViewsPattern:"{ratings} {ratingsIcon} {comments} {commentsIcon} {views} {viewsIcon}",ratingsCommentsViewsLabels:{ratings:'ratings", "comments": "comments", "views": "views'},types:{"Map Service":"\u05e9\u05d9\u05e8\u05d5\u05ea \u05de\u05e4\u05d4","Feature Service":"\u05e9\u05d9\u05e8\u05d5\u05ea\u05d9 \u05d9\u05e9\u05d5\u05d9\u05d5\u05ea","Image Service":"\u05e9\u05d9\u05e8\u05d5\u05ea \u05ea\u05de\u05d5\u05e0\u05d4","Vector Tile Service":"\u05e9\u05d9\u05e8\u05d5\u05ea \u05d0\u05e8\u05d9\u05d7\u05d9\u05dd \u05e9\u05dc \u05d5\u05e7\u05d8\u05d5\u05e8",
WMS:"WMS",KML:"KML"}}},addFromUrl:{donw:"\u05d1\u05d5\u05e6\u05e2",editName:"\u05e2\u05e8\u05d5\u05da \u05e9\u05dd",buttonLabel:"URL...",caption:"\u05d4\u05d5\u05e1\u05e3 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd - \u05d4\u05d6\u05df URL",type:"\u05e1\u05d5\u05d2",url:"URL",types:{ArcGIS:"\u05e9\u05d9\u05e8\u05d5\u05ea Web \u05e9\u05dc \u05e9\u05e8\u05ea ArcGIS",WMS:"\u05e9\u05d9\u05e8\u05d5\u05ea WMS OGC Web",WMTS:"\u05e9\u05d9\u05e8\u05d5\u05ea WMTS OGC Web",WFS:"\u05e9\u05d9\u05e8\u05d5\u05ea WFS OGC Web",
KML:"\u05e7\u05d5\u05d1\u05e5 KML",GeoRSS:"\u05e7\u05d5\u05d1\u05e5 GeoRSS",CSV:"\u05e7\u05d5\u05d1\u05e5 CSV"},samplesHint:"\u05db\u05ea\u05d5\u05d1\u05d5\u05ea URL \u05dc\u05d3\u05d5\u05d2\u05de\u05d4"},_localized:{}}});