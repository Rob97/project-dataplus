'use strict';

const fs = require('file-system');
const _ = require('lodash');
var parse = require('csv-parse');

crossRef();


function crossRef() {
    let yelpFile = fs.readFileSync('./scripts/RestaurantsWithFips.json');
    let yelpObject = JSON.parse(yelpFile);
    fs.readFile('./Seattle_Census_Tract_Data.csv', function (err, data) {
        parse(data, { columns: true }, function (err, dataValue) {
            compareCensusTract(dataValue, yelpObject);
        });
    });
}

function compareCensusTract(censusJson, yelpObject) {
    var notFound = 0;
    for (let i = 0; i < yelpObject.length; i++) {
        let matchedIndex = _.findIndex(censusJson, e => {
            return e.GEOID === yelpObject[i].GeoId;
        })
        //debugger;
        if (matchedIndex !== -1) {
            yelpObject[i].censusTract = censusJson[matchedIndex].Census_Tract;
            yelpObject[i].censusMedianHHIncome = censusJson[matchedIndex].Median_Household_Income;
            yelpObject[i].censusMedianHHError = censusJson[matchedIndex].MHI_Error;
            yelpObject[i].censusIncomePerCapita = censusJson[matchedIndex].Per_Capita_Income;
            yelpObject[i].censusIndexOfInequality = censusJson[matchedIndex].Gini_Index_Of_Inequality;
            yelpObject[i].censusTotalPopulation = censusJson[matchedIndex].Total_Population;
        }
        if (matchedIndex === -1) {
            yelpObject[i].censusTract = null;
        }
    }
    fs.writeFile('SeattleYelpRestaurantsWithCensusInfo.json', JSON.stringify(yelpObject, null, 2));
}