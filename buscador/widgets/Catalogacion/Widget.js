// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define(["dojo/_base/declare",
        "jimu/BaseWidget",
        "dojo/dom",
        "dojo/on",
        "dojo/_base/lang",
        "esri/layers/FeatureLayer",
        "esri/layers/GraphicsLayer",
        "esri/tasks/QueryTask",
        "esri/tasks/query",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "dojo/_base/Color"
    ],
    function(declare,
        BaseWidget,
        dom,
        on,
        lang,
        FeatureLayer,
        GraphicsLayer,
        QueryTask,
        EsriQuery,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Color) {
        return declare([BaseWidget], {

            baseClass: "jimu-widget-catalogacion",
            UNIDAD_MUNICIPIO: 4,
            UNIDAD_DEPARTAMENTO: 3,
            DOCUMENTOS_ASOCIADOS_INDEX: 5,
            SIMBOLO_VERDE: null,
            SIMBOLO_ROJO: null,
            documentosLayer: new GraphicsLayer(),
            _tipoDocumento: null,
            _unidadAdminsitrativa: null,
            _documentos: null,
            _departamentos: null,
            _municipios: null,

            startup: function() {
                this.inherited(arguments);
                this.map.addLayer(this.documentosLayer);
                this._crearSimbolos();
                this._construirSelectTipoDoc();
                this._cargarTablaDocumentos();
                on(dom.byId("boton_consultar_documentos"), "click", lang.hitch(this, this._consultarDocumentos));
            },

            _construirSelectTipoDoc: function() {
                var tiposDocumento = this.config.tiposDocumento;
                var select = document.getElementById("tipo_doc_select");
                for (var keyDoc in tiposDocumento) {
                    var html = '<option value="' + keyDoc + '" >' + tiposDocumento[keyDoc] + '</option>';
                    select.innerHTML += html;
                }
            },

            _consultarDocumentos: function(event) {
                this._tipoDocumento = dom.byId("tipo_doc_select").value;
                this._unidadAdminsitrativa = dom.byId("unidad_administrativa_select").value;

                if (!this._tipoDocumento || !this._unidadAdminsitrativa) {
                    return;
                }

                this._procesarResultado();

            },

            _procesarResultado: function() {
                this.documentosLayer.clear();

                var features = parseInt(this._unidadAdminsitrativa) === this.UNIDAD_DEPARTAMENTO ? this._departamentos : this._municipios;

                features.forEach(lang.hitch(this, function(feature) {
                    this._consultarDocumentoAsociado(feature);
                }));
            },

            _consultarDocumentoAsociado: function(feature) {

                var existe = this._contarDocumentos(feature.attributes["ID"], this._tipoDocumento);
                if (existe) {
                    feature.setSymbol(this.SIMBOLO_VERDE);
                } else {
                    feature.setSymbol(this.SIMBOLO_ROJO);
                }
                this.documentosLayer.add(feature);
            },

            _contarDocumentos: function(idUnidad, tipoDoc) {

                for (var i = 0; i < this._documentos.length; i++) {
                    var documento = this._documentos[i];
                    if (documento.attributes["ID_FK"] === idUnidad && documento.attributes["TipoDoc"] === tipoDoc)
                        return true;
                }
                return false;
            },

            _crearSimbolos: function() {
                var line = new SimpleLineSymbol();
                line.setColor(new Color([133, 133, 133, 1]));

                this.SIMBOLO_VERDE = new SimpleFillSymbol();
                this.SIMBOLO_VERDE.setOutline(line);
                this.SIMBOLO_VERDE.setColor(new Color([56, 168, 0, 0.75]));

                this.SIMBOLO_ROJO = new SimpleFillSymbol();
                this.SIMBOLO_ROJO.setOutline(line);
                this.SIMBOLO_ROJO.setColor(new Color([255, 0, 0, 0.75]));
            },

            _cargarTablaDocumentos: function() {
                var queryUrl = this.config.urlServicio + this.DOCUMENTOS_ASOCIADOS_INDEX;
                var queryTask = new QueryTask(queryUrl);

                var query = new EsriQuery();
                query.where = "1=1";
                query.returnGeometry = false;
                query.outFields = ["ID_FK", "TipoDoc"];

                queryTask.execute(query, lang.hitch(this, function(featureSet) {
                    this._documentos = featureSet.features;
                }));

                var queryUrl_dep = this.config.urlServicio + this.UNIDAD_DEPARTAMENTO;
                var queryTask_dep = new QueryTask(queryUrl_dep);

                var query_dep = new EsriQuery();
                query_dep.where = "1=1";
                query_dep.returnGeometry = true;
                query_dep.outFields = ["*"];
                query_dep.outSpatialReference = this.map.spatialReference;

                queryTask_dep.execute(query_dep, lang.hitch(this, function(featureSet_dep) {
                    this._departamentos = featureSet_dep.features;
                }), lang.hitch(this, function(error) { alert(error); }));

                queryUrl = this.config.urlServicio + this.UNIDAD_MUNICIPIO;
                queryTask = new QueryTask(queryUrl);

                query = new EsriQuery();
                query.where = "ID_DEP =20 or ID_DEP =5";
                query.returnGeometry = true;
                query.outFields = ["*"];
                query.outSpatialReference = this.map.spatialReference;

                queryTask.execute(query, lang.hitch(this, function(featureSet) {
                    this._municipios = featureSet.features;
                    document.getElementById("div_loader_documento").classList.remove("visible")
                    document.getElementById("div_loader_documento").classList.add("oculto");
                    document.getElementById("div_controles_documento").classList.remove("oculto")
                    document.getElementById("div_controles_documento").classList.add("visible");
                }));

            }
        })
    });