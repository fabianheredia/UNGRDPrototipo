define(['dojo/_base/declare', 'jimu/BaseWidget',
        'dojo/_base/lang',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/query',
        'esri/layers/GraphicsLayer',
        'esri/layers/FeatureLayer',
        'esri/graphic',
        'esri/renderers/SimpleRenderer',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/Color',
        'libs/chart'
    ],
    function(declare, BaseWidget,
        lang,
        dom,
        domClass,
        dojoQuery,
        GraphicsLayer,
        FeatureLayer,
        Graphic,
        SimpleRenderer,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Color,
        Chart) {
        return declare([BaseWidget], {

            baseClass: 'jimu-widget-indicadores',
            layerSilueta: new GraphicsLayer(),
            graficasMunicipios: {},
            clasesBarra: "no-info baja media alta critica",
            hoverDisabled: false,
            atributosActuales: {},
            tabSeleccionado: "",
            contextSistemas: null,
            contextIndicadores: null,
            contextDeclaratorias: null,
            chartSistemas: null,
            chartIndicadores: null,
            chartDeclaratorias: null,


            // postCreate: function() {
            //   this.inherited(arguments);
            //   console.log('postCreate');
            // },

            startup: function() {
                this.inherited(arguments);
                this.cargarCapa();
                this.registrarEventos();
                this.iniciarTabs();
                this.iniciarCharts();
            },

            cargarCapa: function() {
                this.graficasMunicipios = new FeatureLayer(this.config.servicio, {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["*"]
                });
                var simboloMunicipios = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([195, 195, 195]),
                        1
                    ),
                    new Color([125, 125, 125, 0.35])
                );
                this.graficasMunicipios.setRenderer(new SimpleRenderer(simboloMunicipios));
                this.map.addLayer(this.graficasMunicipios);
            },

            registrarEventos: function() {
                this.graficasMunicipios.on('mouse-over', lang.hitch(this, this.resaltar));
                this.map.on('click', lang.hitch(this, this.toggleFijarResultados));
            },

            iniciarTabs: function() {
                dojoQuery("button.tablinks").on("click", lang.hitch(this, this.cambiarTab));
                document.getElementById("defaultOpen").click();
            },

            iniciarCharts: function() {
                this.contextSistemas = document.getElementById("chart-sistemas").getContext('2d');
                this.contextIndicadores = document.getElementById("chart-indicadores").getContext('2d');
                this.contextDeclaratorias = document.getElementById("chart-declaratorias").getContext('2d');
            },

            resaltar: function(event) {
                var simboloResalte = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([66, 164, 244]),
                        1
                    ),
                    new Color([66, 116, 244, 0.35])
                );

                this.layerSilueta.clear();
                var grafica = new Graphic(event.graphic.geometry, simboloResalte);
                var titulos = document.getElementsByClassName("nombre-municipio");
                for (var titulo in titulos) {
                    titulos[titulo].innerHTML = event.graphic.attributes["Nombre"] + ", " + event.graphic.attributes["NomDep"];
                }

                this.atributosActuales = event.graphic.attributes;
                this.mostrarPeligro(event.graphic.attributes);
                this.mostrarGraficas();
                this.layerSilueta.add(grafica);
            },

            mostrarPeligro: function(attributes) {
                for (var atributo in attributes) {
                    var valor = attributes[atributo];
                    var indicador = this.config.indicadores[valor] ? this.config.indicadores[valor] : "no-info";

                    var idBarra = "indicador-" + this.config.selectores[atributo];
                    var barra = dom.byId(idBarra);
                    if (barra) {
                        domClass.remove(idBarra, this.clasesBarra);
                        domClass.add(idBarra, indicador);
                    }
                }
            },

            mostrarSistemas: function(attributes) {
                if (this.chartSistemas) {
                    this.chartSistemas.destroy();
                }

                var camposSistemas = Object.keys(this.config.camposSistemas);
                var valores = camposSistemas.map(function(campo) {
                    return attributes[campo] ? attributes[campo] : 0;
                });

                var colores = camposSistemas.map(lang.hitch(this, function(campo) {
                    return this.config.camposSistemas[campo];
                }));

                var dataSistemas = {
                    datasets: [{
                        data: valores,
                        backgroundColor: colores
                    }],
                    labels: camposSistemas
                }

                this.chartSistemas = new Chart(this.contextSistemas, {
                    data: dataSistemas,
                    type: 'polarArea'
                });
            },

            mostrarIndicadores: function(attributes) {
                if (this.chartIndicadores) {
                    this.chartIndicadores.destroy();
                }

                var dataIndicadores = {
                    datasets: [{
                        label: "Población",
                        data: [attributes["PoblacionF"], attributes["PoblacionM"]],
                        backgroundColor: ["#D56B6B", "#6BA0D5"],
                    }],
                    labels: ["Masculina", "Femenina"]
                }

                this.chartIndicadores = new Chart(this.contextIndicadores, {
                    data: dataIndicadores,
                    type: 'bar',
                    options: {
                        tooltips: {
                            enabled: false
                        }
                    }
                });
            },

            mostrarDeclaratorias: function(attributes) {
                if (this.chartDeclaratorias) {
                    this.chartDeclaratorias.destroy();
                }

                var camposDeclaratorias = Object.keys(this.config.camposDeclaratorias);
                var valores = camposDeclaratorias.map(function(campo) {
                    return attributes[campo] ? attributes[campo] : 0;
                });

                var labels = camposDeclaratorias.map(lang.hitch(this, function(campo) {
                    return this.config.camposDeclaratorias[campo];
                }));

                var dataDeclaratorias = {
                    datasets: [{
                        data: valores,
                        borderColor: ["#6BA0D5"],
                        pointBackgroundColor: ["#6BA0D5"],
                        pointRadius: 2
                    }],
                    labels: labels
                }

                this.chartDeclaratorias = new Chart(this.contextDeclaratorias, {
                    data: dataDeclaratorias,
                    type: 'radar',
                    options: {
                        legend: {
                            display: false
                        }
                    }
                });
            },

            mostrarGraficas: function() {
                if (this.tabSeleccionado === "sistemas")
                    this.mostrarSistemas(this.atributosActuales);
                if (this.tabSeleccionado === "indicadores")
                    this.mostrarIndicadores(this.atributosActuales);
                if (this.tabSeleccionado === "declaratorias")
                    this.mostrarDeclaratorias(this.atributosActuales);
            },

            toggleFijarResultados: function(event) {
                if (this.hoverDisabled) {
                    this.graficasMunicipios.enableMouseEvents();
                } else {
                    this.graficasMunicipios.disableMouseEvents();
                }
                this.hoverDisabled = !this.hoverDisabled;
            },

            cambiarTab: function(event) {
                var tabId = event.currentTarget.dataset.tab,
                    i, tabcontent, tablinks;

                this.tabSeleccionado = tabId;
                var buttonStyle = window.getComputedStyle(event.currentTarget, null);
                var contentColor = buttonStyle.backgroundColor;
                var contenedor = this.buscarContenedorJimu(event.currentTarget);
                contenedor.style.backgroundColor = contentColor;

                tabcontent = document.getElementsByClassName("tabcontent");
                for (var i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
                }

                tablinks = document.getElementsByClassName("tablinks");
                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(" active", "");
                }

                document.getElementById(tabId).style.display = "block";
                event.currentTarget.className += " active";
                this.mostrarGraficas();
            },

            buscarContenedorJimu: function(elemento) {
                while ((elemento = elemento.parentElement) && !elemento.classList.contains("jimu-container"));
                return elemento;
            },

            onOpen: function() {
                this.map.addLayer(this.layerSilueta);
            },

            onClose: function() {
                this.map.removeLayer(this.layerSilueta);
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