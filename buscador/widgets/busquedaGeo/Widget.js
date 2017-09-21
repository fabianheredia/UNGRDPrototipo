define(['dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/toolbars/draw',
  'esri/graphic',
  'esri/graphicsUtils',
  'esri/request',
  'esri/layers/FeatureLayer',
  'esri/layers/GraphicsLayer',
  'jimu/LayerInfos/LayerInfos',
  'jimu/CSVUtils',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/Color',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/tasks/GeometryService',
  'esri/tasks/BufferParameters',
  'esri/geometry/normalizeUtils',
  'dojo',
  'dojo/dom',
  'dojo/query',
  'dojo/on',
  'dojo/request',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/xhr',
  'dojo/promise/all',
  'esri/config',
  'dijit/Menu',
  'dijit/MenuItem',
  'dijit/Dialog',
  'dijit/form/HorizontalSlider',
  'dijit/registry',
  'dijit/layout/AccordionContainer',
  'dijit/layout/ContentPane',
  'libs/cbtree/Tree',
  'libs/cbtree/store/Hierarchy',
  'libs/cbtree/model/TreeStoreModel',
  'libs/cbtree/model/ForestStoreModel'
],
  function (declare,
    BaseWidget,
    Draw,
    Graphic,
    graphicsUtils,
    esriRequest,
    FeatureLayer,
    GraphicsLayer,
    LayerInfos,
    CSVUtils,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Color,
    Query,
    QueryTask,
    GeometryService,
    BufferParameters,
    normalizeUtils,
    dojo,
    dom,
    dojoQuery,
    on,
    request,
    lang,
    array,
    xhr,
    all,
    esriConfig,
    Menu,
    MenuItem,
    Dialog,
    HorizontalSlider,
    registry,
    AccordionContainer,
    ContentPane,
    Tree,
    Hierarchy,
    TreeStoreModel,
    ForestStoreModel) {

    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here
      RUTA_UPLOADER_EXCEL: "uploader/exportxls.php",
      name: "Consulta con Buffer",
      baseClass: 'jimu-widget-identifybuffer',
      drawTb: new Draw(this.map),
      SIMBOLO: new SimpleFillSymbol().setColor([0, 0, 128, 0.5]),
      buffer: null,
      dialogoResultado: new Dialog({ title: "Resultados", content: "<div id='tab_container' style='width: 680px; height: 400px;'><div id='tabs-identifybuffer'></div></div>", class: "noModal" }),
      accContainer: null,
      slider: null,
      unidadActual: "UNIT_METER",
      listadoServicios: [],
      modeloTreeServicios: [],
      selectedfeatureSet: [],
      capasSeleccionadas: [],
      signal: undefined,
      zoomSignal: undefined,
      capaActual: null,
      capaFeatureSelected: null,
      graphicsSelectedFeature: new GraphicsLayer(),


      //postCreate: function() {
      //this.inherited(arguments);
      //alert('postCreate');
      //},

      startup: function () {
        this.inherited(arguments);
        esriConfig.defaults.io.timeout = 120000; //Define el timeout de las peticiones ajax en 120000 ms = 120 seg
        this.drawTb = new Draw(this.map);
        this.drawTb.on("draw-end", lang.hitch(this, this._consultar));
        this.slider = new HorizontalSlider({ name: "slider", value: 1, minimum: 1, maximum: 20000, style: "width: 120px;", onChange: function (value) { dom.byId("buffer-size").value = Math.round(value) } }, "slider_buffer");
        dom.byId("buffer-size").value = 1;
        this.accContainer = new AccordionContainer({ style: "height: auto" }, "resultados-identify");
        this.accContainer.startup();
        on(dom.byId("opciones"), "click", lang.hitch(this, function (evt) {
          if (evt.target.id === "opciones") {
            return;
          }
          this.map.graphics.clear();
          var opcion = evt.target.id.toLowerCase();
          this.map.disableMapNavigation();
          this.drawTb.activate(opcion);
        }));

        on(this.dialogoResultado, "hide", lang.hitch(this, function (e) {
          this.accContainer.destroyDescendants(false);
          this.map.graphics.clear();
        }));

        on(dom.byId("btn_clear"), "click", lang.hitch(this, function (evt) {
          this._clearWidget();
        }));

        on(dom.byId("buffer-unit"), "change", lang.hitch(this, function (evt) {
          this._convertirDistanciaBuffer(evt.target.value);
        }));

        this.modeloTreeServicios.push({ name: "Servicios", type: "root", parent: null });
        this._cargarListadoServicios();

        LayerInfos.getInstance(this.map, this.map.itemInfo).then(lang.hitch(this, function (layerInfosObj) {
          this.own(layerInfosObj.on(
            'layerInfosChanged',
            lang.hitch(this, this.onLayerInfosChanged)));
        }));
        this.map.addLayer(this.graphicsSelectedFeature);
      },

      onLayerInfosChanged: function (layerInfo, changeType, layerInfoSelf) {
        if (!layerInfoSelf || !layerInfo) {
          return;
        }
        if (this._tituloCapa) {
          layerInfoSelf.title = this._tituloCapa;
        }
        if ('added' === changeType) {
          layerInfoSelf.getSupportTableInfo().then(lang.hitch(this, function (supportTableInfo) {
            if (supportTableInfo.isSupportedLayer && layerInfoSelf.id.indexOf("_ATTR_") != -1) {
              this.publishData({
                'target': 'AttributeTable',
                'layer': layerInfoSelf
              });
            }
          }));
        } else if ('removed' === changeType) {
          // do something
        }
      },

      _cargarListadoServicios: function () {
        var urlBase = this.config.layerService;
        var layerRequest = esriRequest({
          url: urlBase,
          content: { f: "json" },
          handleAs: "json"
        });
        layerRequest.then(lang.hitch(this, function (response) {
          if (response) {
            array.forEach(response.layers, lang.hitch(this, function (layer, i) {
              this.listadoServicios.push({ id: layer.id, nombre: layer.name, url: urlBase + "/" + layer.id, atributos: ["*"] });
            }));
            this._filtrarResultados();
          }
        }));

        dojoQuery("#loading").style("display", "none");
        dojoQuery("#contenido").style("display", "block");
      },

      _filtrarResultados: function () {
        var peticiones = [];
        array.forEach(this.listadoServicios, lang.hitch(this, function (servicio, index) {
          var request = esriRequest({
            url: servicio.url,
            content: { f: "json" },
            handleAs: "json"
          });
          request.then(lang.hitch(this, function (response) {
            if (response.type === "Feature Layer") {
              this.capasSeleccionadas.push({ id: servicio.id, nombre: response.name, url: servicio.url, atributos: ["*"] });
            }
          }));
          peticiones.push(request);
        }));

      },

      _limpiarModeloServicios: function () {
        this.modeloTreeServicios = array.filter(this.modeloTreeServicios, lang.hitch(this, function (item) {
          return array.some(this.modeloTreeServicios, function (compare) { return compare.parent === item.name; }) || item.type === "layer";
        }));
      },

      _seleccionarCapa: function (item, nodo, event) {
        this.capasSeleccionadas = [];
        var escala = this.map.getScale().toString();
        var capasRestringidas = this.config.mapaRestriccion[escala];
        var capasAMostrar = array.filter(this.listadoServicios, function (nombreServicio) {
          return array.every(capasRestringidas, function (nombreRestringido) {
            return nombreServicio.nombre !== nombreRestringido;
          })
        });
        array.forEach(capasAMostrar, lang.hitch(this, function (nombreCapa, index) {
          this.capasSeleccionadas.push(nombreCapa);
        }));
      },

      _convertirDistanciaBuffer: function (unidad) {
        var distancia = dom.byId("buffer-size").value;
        var nuevaDistancia = parseFloat(this._convertirDistancia(distancia, unidad));
        var maximo = this.config.maximosBuffer[unidad];
        this.slider.attr('maximum', maximo);
        dom.byId("buffer-size").value = nuevaDistancia;
        this.slider.attr('value', nuevaDistancia);
        this.unidadActual = unidad;
      },

      _convertirDistancia: function (valor, unidad) {
        switch (this.unidadActual) {
          case "UNIT_METER":
            if (unidad === "UNIT_KILOMETER") {
              return (valor * 0.001).toFixed(3);
            }
            if (unidad === "UNIT_STATUTE_MILE") {
              return (valor * 0.000621371192).toFixed(3);
            }
            return valor;
          case "UNIT_KILOMETER":
            if (unidad === "UNIT_METER") {
              return (valor / 0.001).toFixed(3);
            }
            if (unidad === "UNIT_STATUTE_MILE") {
              return (valor * 0.621371192).toFixed(3);
            }
            return valor;
          case "UNIT_STATUTE_MILE":
            if (unidad === "UNIT_METER") {
              return Math.round(valor / 0.000621371192).toFixed(3);
            }
            if (unidad === "UNIT_KILOMETER") {
              return (valor / 0.621371192).toFixed(3);
            }
            return valor;
          default:
            return valor;
        }
      },

      _consultar: function (event) {
        this.accContainer.destroyDescendants(false);
        this._limpiarServicios();
        if (!dom.byId("buffer-size").value) {
          alert("Ingrese valor de distancia de buffer");
          return;
        }
        this.drawTb.deactivate();
        this.map.enableMapNavigation();
        this.map.graphics.add(new Graphic(event.geometry, this.SIMBOLO));
        this._aplicarBuffer(event.geometry);
      },

      _limpiarServicios: function () {

        var arr = {};

        for (var i = 0, len = this.listadoServicios.length; i < len; i++)
          arr[this.listadoServicios[i]['nombre']] = this.listadoServicios[i];

        this.listadoServicios = new Array();
        for (var key in arr)
          this.listadoServicios.push(arr[key]);

      },

      _consultarServicio: function (servicio, i) {

        var query = new Query();
        query.outSpatialReference = this.map.spatialReference;
        query.returnGeometry = true;
        query.outFields = servicio.atributos;
        query.geometry = this.buffer;
        var queryTask = new QueryTask(servicio.url);

        queryTask.execute(
          query,
          lang.hitch(this, function (featureSet) {
            if (featureSet.features.length !== 0) {
              this.selectedfeatureSet.push({ "featureSet": featureSet, "nombre": servicio.nombre });
              //se lanza la busqueda a la tabla de docs
              
              this._consultarDoc(this.config.layerService+"/"+this.config.capadoc,featureSet,servicio.nombre);
             
              
            }
          }),
          lang.hitch(this, function (error) {
            console.error(error);
            var htmlError = this._construirError(error);
            var panel = new ContentPane({ title: servicio.nombre, content: htmlError });
            this.accContainer.addChild(panel);
          }));
      },

_consultarDoc: function(servicio,featureSet,Nombrecapa){
  //armar query de docs
 
  var strQuery = "";
  var i=0;
  array.forEach(featureSet.features, function (feature, index) {
    if(i!=0){strQuery = strQuery + "OR "}
    strQuery += "ID_FK = '"+ feature.attributes.ID + "' ";
    i++;
    });
var querydoc = new Query();
        querydoc.outSpatialReference = this.map.spatialReference;
       querydoc.where = strQuery;
        querydoc.outFields = this.config.fieldDoc;
        var queryTaskdoc = new QueryTask(servicio);

        queryTaskdoc.execute(
          querydoc,
          lang.hitch(this, function (featureSetdoc) {
            if (featureSetdoc.features.length !== 0) {
              
              var contentPane = this._construirResultado(featureSetdoc, Nombrecapa);
             this.accContainer.addChild(contentPane);
              
            }
          }),
          lang.hitch(this, function (error) {
            console.error(error);
            var htmlError = this._construirError(error);
            var panel = new ContentPane({ title: servicio.nombre, content: htmlError });
            this.accContainer.addChild(panel);
          }));
},
//aqui se construye el html de presentacion del resultado
      _construirResultado: function (featureSet, nombreCapa) {
        var tempId = this.selectedfeatureSet.length - 1

        var features = featureSet.features;
        var html = "<div class='tabla_resultados_buffer'>";

        var par = true;
        var idCapa = nombreCapa;
        html += "<div class='esriViewPopup'><div class='mainSection'><div>";
        array.forEach(features, function (feature, index) {
          par != par;
          html += "<table class='attrTable' id='" + idCapa + "_" + feature.attributes.OBJECTID + "_" + tempId + "' cellpadding='0' cellspacing='0'><tbody>";
          var i= 0;
          for (var att in feature.attributes) {
            if (att === "OBJECTID" || att.toUpperCase().indexOf("SHAPE") !== -1)
              continue;
            html += "<tr valign='top'>";
            html += "<td class='attrName'>" + featureSet.fields[i].alias + "</td>";
            html += "<td class='attrValue'>" + feature.attributes[att] + "</td>";
            html += "</tr>";
            i++;
          }
          html += "</tbody></table>";
        });
        html += "</div></div></div>";

        html += "</div>";
        var contentPane = new ContentPane({ title: nombreCapa, content: html, style: "height: auto; width: auto;" });
        return contentPane;
      },

      _initializeMenu: function (event) {
        var id = event;
        var pMenu = new Menu({
          id: "contextMenu",
          targetNodeIds: ["resultados-identify"],
          selector: "div.menu_context",
          leftClickToOpen: true,
          passivePopupDelay: 250,
          popupDelay: 500,
          tittle: "menu html"
        });

        pMenu.addChild(new MenuItem({
          label: "Ver tabla de atributos",
          tittle: "ver tabla de atributos...",
          onFocus: this._onFocus,
          onClick: lang.hitch(this, this._selectOption)
        }));

        pMenu.addChild(new MenuItem({
          label: "Descargar CSV",
          onFocus: this._onFocus,
          onClick: lang.hitch(this, this._selectOption)
        }));

        pMenu.addChild(new MenuItem({
          label: "Descargar XLS",
          onFocus: this._onFocus,
          onClick: lang.hitch(this, this._selectOption)
        }));

        pMenu.startup();
      },

      _onFocus: function (a, b, c, d) {
        tempcontext = this;
      },

      _construirError: function (error) {
        var html = "<div class='tabla_resultados_buffer_error'><h3>Error:</h3>";
        html += "<p class='error'>" + this.config.mensajeErrorConsulta + "</p></div>";
        return html;
      },

      _mostrarPopup: function () {
        this.accContainer.startup();
      },

      _aplicarBuffer: function (geometry) {
        var params = new BufferParameters();
        params.distances = [dom.byId("buffer-size").value];
        params.outSpatialReference = this.map.spatialReference;
        params.geodesic = true;
        params.unit = GeometryService[dom.byId("buffer-unit").value];

        var geometryService = new GeometryService(this.config.geometryService);

        normalizeUtils.normalizeCentralMeridian([geometry]).then(lang.hitch(this, function (normalizedGeometries) {
          var normalizedGeometry = normalizedGeometries[0];
          if (normalizedGeometry.type === "polygon") {
            geometryService.simplify([normalizedGeometry], lang.hitch(this, function (geometries) {
              params.geometries = geometries;
              geometryService.buffer(params, lang.hitch(this, this._showBuffer));
            }));
          } else {
            params.geometries = [normalizedGeometry];
            geometryService.buffer(params, lang.hitch(this, this._showBuffer));
          }

        }));

      },

      _showBuffer: function (bufferedGeometries) {
        if (this.capaFeatureSelected)
          this.map.removeLayer(this.capaFeatureSelected);

        if (this.capaActual)
          this.map.removeLayer(this.capaActual);

        var simboloBuffer = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0, 0.65]), 2
          ),
          new Color([255, 0, 0, 0.35])
        );

        var geometry = bufferedGeometries[0];
        this.map.graphics.add(new Graphic(geometry, simboloBuffer));

        this.buffer = geometry;

        //this._seleccionarCapa();
        array.forEach(this.capasSeleccionadas, lang.hitch(this, this._consultarServicio));
        //this._initializeMenu();
      },
      // onOpen: function(){
      //   console.log('onOpen');
      // },

      _clearWidget: function () {
        this.map.graphics.clear();
        this.drawTb.deactivate();
        this.map.enableMapNavigation();
        this.accContainer.destroyDescendants(false);
        this.listadoServicios = [];
        // this.capasSeleccionadas = [];
      },

      _selectFeature: function (event) {

        if (this.capaFeatureSelected)
          this.map.removeLayer(this.capaFeatureSelected);

        if (this.capaActual)
          this.map.removeLayer(this.capaActual);

        var params = event.currentTarget.id.split("_");
        if (params.length === 3) {
          var nombreCapa = params[0];
          var objectId = params[1];
          var layerId = params[2];

          var selectedLayer = lang.clone(this.selectedfeatureSet[layerId].featureSet);

          var featureSelection = selectedLayer.features.filter(function (feature) {
            return feature.attributes["OBJECTID"].toString() === objectId;
          });

          selectedLayer.features = featureSelection;

          var layerDefinition = {
            "geometryType": selectedLayer.geometryType,
            "fields": selectedLayer.fields
          };

          var nombre = selectedLayer.displayFieldName;

          var featureCollection = {
            layerDefinition: layerDefinition,
            featureSet: selectedLayer
          };

          this.capaFeatureSelected = new FeatureLayer(featureCollection, {
            name: nombre,
            showLabels: true
          });
          var extent = graphicsUtils.graphicsExtent(selectedLayer.features);
          this.map.addLayer(this.capaFeatureSelected);
          this.map.setExtent(extent, true);
        }
      },

      _selectOption: function (event) {
        var layerId = tempcontext.getParent().currentTarget.id.split("_")[1];
        var tipo = event.target.innerHTML;

        if ("Ver tabla de atributos" === tipo) {
          this._openAttributeTable(layerId);
        }

        if ("Descargar CSV" === tipo) {
          this._exportCSV(layerId);
        }

        if ("Descargar XLS" === tipo) {
          this._exportXLS(layerId);
        }

      },

      _openAttributeTable: function (layerId) {
        if (this.capaActual)
          this.map.removeLayer(this.capaActual);
        var selectedLayer = lang.clone(this.selectedfeatureSet[layerId].featureSet);
        this._tituloCapa = this.selectedfeatureSet[layerId].nombre;

        var layerDefinition = {
          "geometryType": selectedLayer.geometryType,
          "fields": selectedLayer.fields
        };

        var nombre = selectedLayer.displayFieldName;

        var featureCollection = {
          layerDefinition: layerDefinition,
          featureSet: selectedLayer
        };
        var fLayerId = nombre + "_ATTR_" + layerId;
        this.capaActual = new FeatureLayer(featureCollection, {
          name: nombre,
          showLabels: true,
          id: fLayerId
        });

        this.map.addLayer(this.capaActual);

      },

      _exportCSV: function (layerId) {

        var selectedLayer = this.selectedfeatureSet[layerId].featureSet;
        var layerDefinition = null;
        var nombre = null;
        var featureCollection = null;
        var featureLayer = null;
        var data = [];
        var columns = [];
        var row = {};

        layerDefinition = {
          "geometryType": selectedLayer.geometryType,
          "fields": selectedLayer.fields
        };

        nombre = selectedLayer.displayFieldName;

        //Llena el array de encabezados de columnas;
        layerDefinition.fields.forEach(function (a) {
          columns.push(a.alias);
        });

        //Llena el array de data
        selectedLayer.features.forEach(function (a) {
          row = {};
          layerDefinition.fields.forEach(function (b) {
            row[b.alias] = a.attributes[b.name];
          });
          data.push(row);
        });

        CSVUtils.exportCSV(nombre, data, columns);

      },


      _exportXLS: function (layerId) {
        // alert('_exportXLS');

        var selectedLayer = this.selectedfeatureSet[layerId].featureSet;
        var layerDefinition = null;
        var nombre = null;
        var featureCollection = null;
        var featureLayer = null;
        var data = [];
        var columns = [];
        var row = {};

        layerDefinition = {
          "geometryType": selectedLayer.geometryType,
          "fields": selectedLayer.fields
        };

        nombre = selectedLayer.displayFieldName;
        console.log(selectedLayer);

        //Llena el array de encabezados de columnas;
        layerDefinition.fields.forEach(function (a) {
          columns.push(a.alias);
        });

        //Llena el array de data
        selectedLayer.features.forEach(function (a) {
          row = {};
          layerDefinition.fields.forEach(function (b) {
            row[b.alias] = a.attributes[b.name];
          });
          data.push(row);
        });

        this._customRequest('POST', this.RUTA_UPLOADER_EXCEL, { request: { "nombre": nombre, "data": data, "columns": columns } });
      },

      _customRequest: function (verb, url, data, target) {
        var form = document.createElement("form");
        form.action = url;
        form.method = verb;
        form.target = target || "_self";
        if (data) {
          for (var key in data) {
            var input = document.createElement("textarea");
            input.name = key;
            input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
            form.appendChild(input);
          }
        }
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
      },


      _processData: function (ev) {
        var layerDefinition = null;
        var nombre = null;
        var featureCollection = null;
        var featureLayer = null;
        var data = [];
        var columns = [];
        var row = {};

        layerDefinition = {
          "geometryType": this.selectedfeatureSet[ev.currentTarget.id].geometryType,
          "fields": this.selectedfeatureSet[ev.currentTarget.id].fields
        };

        nombre = this.selectedfeatureSet[ev.currentTarget.id].displayFieldName;

        //Llena el array de encabezados de columnas;
        layerDefinition.fields.forEach(function (a) {
          columns.push(a.alias);
        });

        //Llena el array de data
        this.selectedfeatureSet[ev.currentTarget.id].features.forEach(function (a) {
          row = {};
          layerDefinition.fields.forEach(function (b) {
            row[b.alias] = a.attributes[b.name];
          });
          data.push(row);
        });

        return { "nombre": nombre, "data": data, "columns": columns };
      },


      onClose: function () {
        this._clearWidget();
        if (this.capaFeatureSelected)
          this.map.removeLayer(this.capaFeatureSelected);

        if (this.capaActual)
          this.map.removeLayer(this.capaActual);
      },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });
