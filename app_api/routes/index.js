var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlAuth            = require('../controllers/authentication');
var ctrlUsers           = require('../controllers/users');
var ctrlStations        = require('../controllers/stations');
var ctrlSensorData      = require('../controllers/sensor-data');
var ctrlReports         = require('../controllers/reports');
var ctrlSummaries       = require('../controllers/summaries');
var ctrlComments        = require('../controllers/comments');
var ctrlNutritionalData = require('../controllers/nutritional-data');
var ctrlExcel           = require('../controllers/excel');

// ========== Authentication Endpoints =============

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/request-password-reset', ctrlAuth.requestPasswordReset);
router.post('/reset-password', ctrlAuth.resetPassword);
router.post('/password-change', auth, ctrlAuth.passwordChange);

// ================ User Endpoints =================
router.get('/users',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlUsers.list);
router.get('/users/:userId',
  auth,
  ctrlUsers.readOne);
router.put('/users/:userId',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlUsers.updateOne);
router.delete('/users/:userId',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlUsers.deleteOne);
router.put('/user-update/:userId',
  auth,
  ctrlUsers.updateSelf);

// ================ Stations Endpoints =============

router.get('/stations',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlStations.list);
router.get('/stations/all',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlStations.listAll);
router.post('/stations',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlStations.create);
router.delete('/stations/:stationId',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlStations.deleteOne);
router.get('/stations/:stationId',
  ctrlStations.readOne);
router.put('/stations/:stationId',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlStations.updateOne);
router.patch('/stations_sectors/:stationId',
  auth,
  ctrlStations.updateSectors);

router.get('/userstations/:userId',
  auth,
  ctrlAuth.roleAuthorization(['administrator', 'user']),
  ctrlStations.getByUser);

router.get('/stations-public',
  ctrlStations.list);

// ============= Sensor Data Endpoints =============
// Uploads Sensor Data
router.post('/sensor-data',
  ctrlSensorData.storeData);
// Counts data per day
router.get('/check-datacount/:stationId',
  ctrlSensorData.getDataCount);
// Get available dates in sensordata per station id
router.get('/get-station-summary/:stationId',
  ctrlSensorData.getStationSummary);
// Get the sensor data organized by date
router.get('/get-sensordata-bydate/:stationId',
  ctrlSensorData.getSensorDataByDate);
router.get('/daily-avg-bymonth/:stationId',
  ctrlSensorData.getDailySensorDataByMonth);
// Queries indicators by station id and date range
// If endDate not set, only one day
// get-report-byday/XXXXX?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/get-report-byday/:stationId',
  ctrlSensorData.getReportByDay);
// Get indicators calculated by month
router.get('/get-report-bymonth/:stationId',
  ctrlSensorData.getReportByMonth);

router.get('/get-variable/',
  ctrlSensorData.getVariable);

router.delete('/sensordata/:stationId',
  auth,
  ctrlSensorData.deleteDataByDate);

// ============== Prediction Endpoints =============
router.get('/pred-color-gala/:stationId',
  ctrlSensorData.getColorPrediction);
router.get('/pred-size-gala/:stationId',
  ctrlSensorData.getSizePrediction);
router.get('/pred-harvest-gala/:stationId',
  ctrlSensorData.getHarvestPrediction);
router.get(
  '/pred-sun-fuji/:stationId',
  ctrlSensorData.getFujiSunDamage);
router.get(
  '/pred-sun-pink/:stationId',
  ctrlSensorData.getPinkSunDamage);
router.get(
  '/pred-fuji-russet/:stationId',
  ctrlSensorData.getFujiRusset);
router.get(
  '/pred-color-fujipink/:stationId',
  ctrlSensorData.getColorPredictionFujiPink);
router.get(
  '/pred-bitterpit-fuji/:stationId',
  ctrlSensorData.getFujiBitterPit
)
router.get(
  '/pred-lenticelosis-gala/:stationId',
  ctrlSensorData.getGalaLenticelosis
)
router.get(
  '/pred-earlystorage-gala/:stationId',
  ctrlSensorData.getEarlyStoragePotentialGala
)
router.get(
  '/pred-earlystorage-fuji/:stationId',
  ctrlSensorData.getEarlyStoragePotentialFuji
)
router.get(
  '/pred-earlystorage-pink/:stationId',
  ctrlSensorData.getEarlyStoragePotentialCrippsPink
)
router.get(
  '/pred-harveststorage-gala/:stationId',
  ctrlSensorData.getHarvestStoragePotentialGala
)
router.get(
  '/pred-harveststorage-fuji/:stationId',
  ctrlSensorData.getHarvestStoragePotentialFuji
)
router.get(
  '/pred-harveststorage-pink/:stationId',
  ctrlSensorData.getHarvestStoragePotentialPink
)

// ======== Variables Summaries Endpoints ==========
router.get('/summaries',
  ctrlSummaries.listSummaries);
router.get('/summary/:summaryId',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlSummaries.getSummary);
router.patch('/summary/:summaryId',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlSummaries.updateSummary);
router.post('/summaries',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlSummaries.createSummary);
router.delete('/summaries/:summaryId',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlSummaries.deleteSummary);

// ================= Comments Endpoints ================
router.get('/comments',
  auth,
  ctrlComments.getComment);
router.post('/comments',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlComments.createComment);
router.patch('/comments/:id',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlComments.updateComment);
router.delete('/comments/:id',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlComments.deleteComment);

// ========== Nutritional Data Endpoints ===========
router.post(
  '/nutritional-data',
  ctrlNutritionalData.create
);

router.get(
  '/nutritional-data',
  auth,
  ctrlNutritionalData.list
);

router.get(
  '/nutritional-data-admin',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlNutritionalData.listAdmin
);

router.get(
  '/nutritional-data/all',
  auth,
  ctrlAuth.roleAuthorization(['administrator']),
  ctrlNutritionalData.listAll
);


// Get all data to filter and query in front-end
router.get(
  '/nutritional-data/bulk',
  auth,
  ctrlNutritionalData.getAllNutData
)

router.delete(
  '/nutritional-data/:id',
  ctrlNutritionalData.remove
);

router.get(
  '/nutritional-variables/:id',
  //auth,
  ctrlNutritionalData.calculations
)

// ================ Excel Endpoints ================
router.post(
  '/excel',
  ctrlExcel.getExcelFile
)

// ================= Test Endpoints ================
router.get('/querytest',
  ctrlSensorData.queryTest);
router.get('/testreport',
  ctrlReports.generatePDF);

router.post('/uploadsensordata/:stationId', ctrlSensorData.dataUpload);

// =================================================
module.exports = router;
