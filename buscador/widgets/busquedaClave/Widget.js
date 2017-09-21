define(['dojo/_base/declare',
        'jimu/BaseWidget',
        'dojo/_base/lang',
        'dojo/dom',
        'dojo/on',
        'dojo/request',
        'dojo/query',
        'dojo/promise/all',
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/tasks/QueryTask',
        'esri/tasks/query',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
        'dojo/_base/Color', 'esri/graphicsUtils'
    ],
    function(declare,
        BaseWidget,
        lang,
        dom,
        on,
        request,
        dojoQuery,
        all,
        FeatureLayer,
        GraphicsLayer,
        QueryTask,
        EsriQuery,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Color, graphicsUtils) {

        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {

            DOCUMENTOS_ASOCIADOS_INDEX: 5,
            name: "Consulta con Texto",
            baseClass: 'jimu-widget-busquedaClave',
            busquedaLayer: new GraphicsLayer(),

            startup: function() {
                this.map.addLayer(this.busquedaLayer);
                on(dojo.byId("btn_buscarPorClave"), "click", lang.hitch(this, this._enviarConsulta));
            },

            _borrarResultados: function() {
                var tablaResultados = dojo.byId("tabla_asociados");
                tablaResultados.innerHTML = "";
                dojo.byId("resultados_asociados").classList.add("hidden");
            },

            _enviarConsulta: function() {

                this._borrarResultados();

                var texto = dojo.byId("buscador_textoBusqueda").value;
                var url = this.config.urlBusqueda + "?termino=" + texto;
                request(url).then(lang.hitch(this, this._crearTabla));
            },

            _crearTabla: function generarTabla(data) {
                var respuestaGeometria = JSON.parse(data);
                var html = "";

                respuestaGeometria.forEach(function(resultado) {

                    html += '<div class="main-container click"' +
                        ' data-capa="' + resultado.capa + '" data-idCapa="' + resultado["ID_FK"] + '">' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Entidad</div>' +
                        '<div class="flex-value">' + resultado.Entidad + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Tipo de documento</div>' +
                        '<div class="flex-value">' + resultado['TipoDoc'] + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Url</div>' +
                        '<div class="flex-value"><a href="' + resultado.url + '" target="_blank"> ' + resultado.url + ' </a></div>' +
                        '</div>' +
                        '</div>';
                });
                document.getElementById("resultado_busqueda").innerHTML = html;
                on(dojoQuery(".click"), "click", lang.hitch(this, this._consultarCapa));
            },

            _consultarCapa: function(event) {
                this._borrarResultados();
                var capaConsulta = event.currentTarget.dataset.capa;
                var idCapa = event.currentTarget.dataset.idcapa;

                var queryUrl = this.config.urlServicio + capaConsulta;
                var queryTask = new QueryTask(queryUrl);

                var query = new EsriQuery();
                query.where = "ID=" + idCapa;
                query.returnGeometry = true;
                query.outFields = ["ID_FK", "TipoDoc"];
                query.outSpatialReference = this.map.spatialReference;
                var line = new SimpleLineSymbol();
                line.setColor(new Color([50, 50, 50, 1]));

                var simboloVerde = new SimpleFillSymbol();
                simboloVerde.setOutline(line);
                simboloVerde.setColor(new Color([56, 168, 0, 1]));
                this.busquedaLayer.clear();
                queryTask.execute(query, lang.hitch(this, function(featureSet) {
                    var feature = featureSet.features[0];
                    if (feature) {
                        feature.setSymbol(simboloVerde);
                        this.busquedaLayer.add(feature);
                        var extentresul = graphicsUtils.graphicsExtent(featureSet.features);
                        this.map.setExtent(extentresul);
                        this._consultarDocumentosAsociados(feature);
                    }
                }));
            },

            _consultarDocumentosAsociados: function(feature) {
                var consultasGeometrias = [];

                for (var i = 0; i < 5; i++) {
                    var queryUrl = this.config.urlServicio + i;
                    var queryTask = new QueryTask(queryUrl);

                    var query = new EsriQuery();
                    query.geometry = feature.geometry;
                    query.spatialRelationship = EsriQuery.SPATIAL_REL_INTERSECTS;
                    query.returnGeometry = false;
                    query.outFields = ["ID"];
                    consultasGeometrias.push(queryTask.execute(query));
                }

                all(consultasGeometrias).then(lang.hitch(this, function(results) {
                    var idsGeometrias = "";

                    results.forEach(lang.hitch(this, function(consulta) {
                        consulta.features.forEach(lang.hitch(this, function(feature) {
                            idsGeometrias += feature.attributes["ID"] + ",";
                        }));
                    }));
                    idsGeometrias = idsGeometrias.slice(0, -1);
                    console.log(idsGeometrias);
                    if (!idsGeometrias) return;

                    var queryUrlDoc = this.config.urlServicio + this.DOCUMENTOS_ASOCIADOS_INDEX;
                    var queryTaskDoc = new QueryTask(queryUrlDoc);

                    var queryDoc = new EsriQuery();
                    queryDoc.where = "ID_FK in (" + idsGeometrias + ")";
                    queryDoc.outFields = ["*"];
                    queryTaskDoc.execute(queryDoc, lang.hitch(this, function(featureSet) {
                        this._construirTablaDocumentos(featureSet.features);
                    }));

                }));

            },

            _construirTablaDocumentos: function(features) {
                //Esta es la tabla para hacer luego el divTabla.innerHTML
                var divTabla = dojo.byId("tabla_asociados");

                //armar tabla acá
                var html = "";

                features.forEach(lang.hitch(this, function(resultadoAsociados) {

                    html += '<div class="main-container">' +
                        '<div class="row-container">' +
                        '<div class="flex-label">ID</div>' +
                        '<div class="flex-value">' + resultadoAsociados.attributes.OBJECTID + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Entidad</div>' +
                        '<div class="flex-value">' + resultadoAsociados.attributes.Entidad + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Tipo de documento</div>' +
                        '<div class="flex-value">' + resultadoAsociados.attributes['TipoDoc'] + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Url</div>' +
                        '<div class="flex-value"><a href="' + resultadoAsociados.attributes.url + '" target="_blank"> ' + resultadoAsociados.attributes.url + ' </a></div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Fecha de Creación</div>' +
                        '<div class="flex-value">' + this.getFormattedDate(resultadoAsociados.attributes.FechaCreacion) + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Creado por</div>' +
                        '<div class="flex-value">' + resultadoAsociados.attributes.created_user + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Fecha de Creación</div>' +
                        '<div class="flex-value">' + this.getFormattedDate(resultadoAsociados.attributes.created_date) + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Ultimo Usuario que editó</div>' +
                        '<div class="flex-value">' + resultadoAsociados.attributes.last_edited_user + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Ultima Fecha de Edición</div>' +
                        '<div class="flex-value">' + this.getFormattedDate(resultadoAsociados.attributes.last_edited_date) + '</div>' +
                        '</div>' +
                        '<div class="row-container">' +
                        '<div class="flex-label">Año</div>' +
                        '<div class="flex-value">' + resultadoAsociados.attributes.ANIO + '</div>' +
                        '</div>' +
                        '</div>';

                }));
                document.getElementById("tabla_asociados").innerHTML = html;
                //mostrar div hidden
                dojo.byId("resultados_asociados").classList.remove("hidden");
            },

            getFormattedDate: function(fecha) {
                var date = new Date(fecha);

                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();

                month = (month < 10 ? "0" : "") + month;
                day = (day < 10 ? "0" : "") + day;
                hour = (hour < 10 ? "0" : "") + hour;
                min = (min < 10 ? "0" : "") + min;
                sec = (sec < 10 ? "0" : "") + sec;

                var str = date.getFullYear() + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;

                return str;
            }

        })
    });