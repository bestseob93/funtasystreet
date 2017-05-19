'use strict';

const GeoFencing = require('react-native').NativeModules.GCGmetry;

module.exports = {
  containsLocation: function (point, polygon) {
    console.log(point);
    console.log(polygon);
    return new Promise(function (resolve, reject) {
      GeoFencing.containsLocation(
        point,
        polygon,
        isWithinCoverage => {
          if (isWithinCoverage) {
            resolve(true);
          } else {
            reject();
          }
        }
      )
    });
  }
};
