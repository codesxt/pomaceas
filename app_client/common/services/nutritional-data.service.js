angular.module('PomaceasWebApp')
.service('nutritionalDataSvc', nutritionalDataSvc);

function nutritionalDataSvc($http, $window, authSvc){
  var uploadData = function(data){
    return $http.post('/api/v1/nutritional-data', data);
  }

  var getDataList = function(pageNumber = 0, pageSize = 0){
    return $http.get('/api/v1/nutritional-data',{
      params : {
        'page[number]' : pageNumber,
        'page[size]'   : pageSize
      },
      headers: {
        Authorization: 'Bearer '+ authSvc.getToken()
      }
    });
  }

  var removeData = (dataID) => {
    return $http.delete('/api/v1/nutritional-data/'+dataID, {
      headers: {
        'Authorization': 'Bearer '+ authSvc.getToken()
      }
    });
  }

  return {
    uploadData  : uploadData,
    getDataList : getDataList,
    removeData  : removeData
  };
}