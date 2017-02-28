angular.module('PomaceasWebApp')
.controller('dashboardUserStationsMonthlyCtrl', dashboardUserStationsMonthlyCtrl);

function dashboardUserStationsMonthlyCtrl(stationsSvc, $routeParams, $scope, sensorDataSvc, moment){
  var vm = this;
  vm.station = {};
  vm.stationId = $routeParams.stationId;
  vm.errMessage = "";
  vm.stationSummary = {};
  vm.sensorData = [];
  vm.categories = [
    {name:"Temperatura", value:"temperature"},
    {name:"Humedad Relativa", value:"humidity"},
    {name:"Estrés", value:"stress"},
    {name:"Grados Día", value:"gd"},
    {name:"Días de Frío", value:"cold"},
    {name:"Heladas / Bajo 0°", value:"freeze"},
    {name:"Horas a diferentes T° umbral", value:"tempThres"},
    {name:"Evapotranspiración", value:"et"},
    {name:"Largo del día", value:"daylength"},
    {name:"Horas >300 W/m2", value:"horasRad300"},
    {name:"Radiación máxima", value:"maxRad"},
    {name:"Energía solar", value:"energy"},
    {name:"Velocidad del Viento", value:"windSpeed"},
    {name:"Temperaturas Óptimas", value:"tOpt"},
    {name:"Vuelo de Abejas", value:"hrAbe"},
    {name:"Precipitaciones", value:"pp"},
    {name:"DPV", value:"dpv"},
    {name:"h > 2.5 DPV", value:"h2p5DPV"}
  ]
  vm.selection = {
    startdate: "",
    enddate: "",
    category: vm.categories[0].value
  }

  stationsSvc.getStation(vm.stationId)
  .success(function (data) {
    vm.station = data;
  })
  .error(function (e) {
    vm.errMessage = "La estación solicitada no se pudo encontrar.";
  });

  sensorDataSvc.getStationSummary(vm.stationId)
  .success(function(data){
    vm.stationSummary = data;
    vm.selection.startdate = JSON.stringify(vm.stationSummary.monthsAvailable[vm.stationSummary.monthsAvailable.length-1]._id);
    vm.selection.enddate = JSON.stringify(vm.stationSummary.monthsAvailable[0]._id);
  })
  .error(function(e){
    vm.errMessage = "Ha ocurrido un error en la obtención de los datos de la estación.";
  })

  $scope.$watchGroup(['vm.selection.startdate', 'vm.selection.enddate'], function(){
    if(vm.selection.startdate != "" && vm.selection.enddate != ""){
      var jsonDate = JSON.parse(vm.selection.startdate);
      jsonDate.day = 1;
      var startdate = jsonDate.year+"-"+jsonDate.month+"-"+jsonDate.day;
      jsonDate = JSON.parse(vm.selection.enddate);
      jsonDate.day = 1;
      enddate = jsonDate.year+"-"+jsonDate.month+"-"+jsonDate.day;
      sensorDataSvc.getReportByMonth(vm.station._id, startdate, enddate)
      .success(function(data){
        console.log(data);
        data.forEach(function(row) {
          // TODO: Arreglar cuando se implemente Moment.js
          // Parche cuma para ajustar la zona horaria
          row.date = row.date.replace('Z','-03:00');
          row.date = new Date(row.date);
        });
        vm.data.dataset0 = data;
      })
      .error(function(e){
        vm.errMessage = "Ha ocurrido un error en la obtención de los datos del sensor. Detalles del error: "+e.message;
      })
    }
  })

  $scope.$watch('vm.selection.category', function(){
    console.log("Category selected: "+vm.selection.category)
    switch(vm.selection.category){
      case "temperature":
        console.log("Displaying temperature.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "tempMediaDiaria",
            label: "T° promedio diaria",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieTempOut'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "tempMediaMin",
            label: "T° mínima promedio",
            color: "#349be3",
            type: ['line', 'dot'],
            id: 'serieTempMin'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "tempMediaMax",
            label: "T° máxima promedio",
            color: "#f14610",
            type: ['line', 'dot'],
            id: 'serieTempMax'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "tempMaxMax",
            label: "T° máxima",
            color: "#9c2500",
            type: ['line', 'dot'],
            id: 'serieTempMaxMax'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "tempMinMin",
            label: "T° mínima",
            color: "#146dab",
            type: ['line', 'dot'],
            id: 'serieTempMinMin'
          }
        ];
        return;
      case "humidity":
        console.log("Displaying relative humidity.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "hrMedia",
            label: "Humedad Relativa Media",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieHRMedia'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrMaxima",
            label: "Humedad Relativa Máxima",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieHRMaxima'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrMinima",
            label: "Humedad Relativa Mínima",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieHRMinima'
          }
        ];
        return;
      case "stress":
        console.log("Displaying Stress.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "estres",
            label: "Estrés",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieEstres'
          }
        ];
        return;
      case "gd":
        console.log("Displaying GD.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "gdh",
            label: "GDH",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieGDH'
          }
        ];
        return;
      case "cold":
        console.log("Displaying Cold.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "mineq10",
            label: "< 10°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieMinEq10'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "min105hrs",
            label: "Días con 5 horas < 10°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriemin105hrs'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "mineq7",
            label: "< 7°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriemineq7'
          }
        ];
        return;
      case "freeze":
        console.log("Displaying Freeze.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "diasHel",
            label: "Días con heladas",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieDiasHel'
          }
        ];
        return;
      case "tempThres":
        console.log("Displaying different Temperatures.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "hrmay27c",
            label: "T > 27°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriehrmay27c'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrmay29c",
            label: "T > 29°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriehrmay29c'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrmay32c",
            label: "T > 32°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriehrmay32c'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrmen6c",
            label: "T < 6°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriehrmen6c'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrmen12c",
            label: "T < 12°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriehrmen12c'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrmen18c",
            label: "T < 18°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriehrmen18c'
          },{
            axis: "y",
            dataset: "dataset0",
            key: "hrmay15c",
            label: "T > 15°C",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriehrmay15c'
          }
        ];
        return;
      case "et":
        console.log("Displaying evapotranspiration.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "et0",
            label: "Días con heladas",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieEvapotrans'
          }
        ];
        return;
      case "daylength":
        console.log("Displaying day length.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "horasRad12",
            label: "Largo del día",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieDayLength'
          }
        ];
        return;
      case "horasRad300":
        console.log("Displaying hrs 300.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "horasRad300",
            label: "Horas >300 W/m2",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieRad300'
          }
        ];
        return;
      case "maxRad":
        console.log("Displaying max radiation.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "maxRad",
            label: "Radiación máxima",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieMaxRad'
          }
        ];
        return;
      case "energy":
        console.log("Displaying solar energy.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "energia",
            label: "Energía solar (MJ/m2)",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieEnergiaSolar'
          }
        ];
        return;
      case "windSpeed":
        console.log("Displaying wind speed.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "vmaxViento",
            label: "Velocidad Máxima del Viento (m/s)",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieVelocidadViento'
          }
        ];
        return;
      case "tOpt":
        console.log("Displaying optimal temperature.");
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "hrTOpt",
            label: "Horas con T° Óptima",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieTOpt'
          }
        ];
        return;
      case "hrAbe":
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "hrAbe",
            label: "Horas de Abejas",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieHrAbe'
          }
        ];
        return;
      case "pp":
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "pp",
            label: "Precipitaciones",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'seriePP'
          }
        ];
        return;
      case "dpv":
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "dpv",
            label: "DPV kPa",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieDPV'
          }
        ];
        return;
      case "h2p5DPV":
        vm.options.series = [
          {
            axis: "y",
            dataset: "dataset0",
            key: "hrsDPVmay2p5",
            label: "h DPV > 2.5",
            color: "#c4ac2f",
            type: ['line', 'dot'],
            id: 'serieDPV25'
          }
        ];
        return;
      case "other":
        console.log("Displaying other categories.");
        vm.options.series = [

        ];
        return;
      default:
        console.log("Error en la selección de categoría");
    }
  })

  vm.data = {
    dataset0: []
  };

  vm.options = {
    series: [],
    axes: {x: {key: "date", type: "date"}}
  };


  // ===============================================
  // ======= Código para exportar en CSV ===========
  // ===============================================
  vm.getFileName = function(){
    return "Datos.csv";
  }
  vm.getFileSeparator = function(){
    return ',';
  }
  vm.getFileHeaders = function(){
    return ['Fecha', 'Temp Media Diaria', 'Temp Media Máxima', 'Temp Media Mínima',
      'Temp Máxima', 'Temp Mínima', 'HR Media', 'HR Máxima', 'HR Mínima', 'h > 95%', 'Estrés',
      'Max y Mín', 'GDH', 'GD', '<10°C', '5h<10°C', '<7°C', 'Richardson', 'Unrath', 'Días con Heladas',
      'T < 0°C', 'T>27°C', 'T>29°C', 'T>32°C','5h>27°C','5h>29°C','5h>32°C','T < 6°C','T < 12°C','T < 18°C',
      'T > 15°C', 'ET0', 'Horas luz', 'Horas  >300 W/m2', 'Rad Max (W/m2)', 'Energía Solar (MJ/m2)',
      'Velocidad del Viento (m/s)', 'Hrs. Abejas', 'Precipitaciones', 'Hrs. con T° Óptima',
      'DPV kPa', 'h > 2.5 DPV'];
  }
  vm.getDataInArray = function(){
    //return [{a:1, b:2},{a:3, b:4}];
    var data = [];
    for(var i=0;i<vm.data.dataset0.length;i++){
      var row = vm.data.dataset0[i];
      data.push({
        date: moment(row.date).format(),
        tempMediaDiaria: row.tempMediaDiaria,
        tempMediaMaxi: row.tempMediaMax,
        tempMediaMin: row.tempMediaMin,
        tempMaxMax: row.tempMaxMax,
        tempMinMin: row.tempMinMin,
        hrMedia: row.hrMedia,
        hrMaxima: row.hrMaxima,
        hrMinima: row.hrMinima,
        horas95: row.horas95,
        estres: row.estres,
        gdMaxYMin: row.gdMaxYMin,
        gdh: row.gdh,
        gd: row.gd,
        mineq10: row.mineq10,
        min105hrs: row.min105hrs,
        mineq7: row.mineq7,
        richardson: row.richardson,
        unrath: row.unrath,
        diasHel: row.diasHel,
        hrmen0c: row.hrmen0c,
        hrmay27c: row.hrmay27c,
        hrmay29c: row.hrmay29c,
        hrmay32c: row.hrmay32c,
        dias5hrsmay27: row.dias5hrsmay27,
        dias5hrsmay29: row.dias5hrsmay29,
        dias5hrsmay32: row.dias5hrsmay32,
        hrmen6c: row.hrmen6c,
        hrmen12c: row.hrmen12c,
        hrmen18c: row.hrmen18c,
        hrmay15c: row.hrmay15c,
        et0: row.et0,
        horasRad12: row.horasRad12,
        horasRad300: row.horasRad300,
        maxRad: row.maxRad,
        energia: row.energia,
        vmaxViento: row.vmaxViento,
        hrAbe: row.hrAbe,
        pp: row.pp,
        hrTOpt: row.hrTOpt,
        dpv: row.dpv,
        hrsDPVmay2p5: row.hrsDPVmay2p5
      })
    }
    return data;
  }
}
