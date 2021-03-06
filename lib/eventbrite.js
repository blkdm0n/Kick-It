const { APIKEY } = require('../config.js');
const request = require('request');
const Promise = require('bluebird');

// ==========================================================================================
//                     OPTIONS for API get request
// ==========================================================================================

// options for Weekend
const weekend_options = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.keyword': 'this_weekend',
    sort_by: 'date',
    'location.address': '',
  },
  headers: {
    authorization: APIKEY,
  },
};


// options for Month
const month_options = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.keyword': 'this_month',
    sort_by: 'date',
    'location.address': 'san francisco',
    categories: '103,110,113,116,17001,104,105,102,118,108,109',
    page: 1,
  },
  headers: {
    authorization: APIKEY,
  },
};

//options for today
const today_options = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.keyword': 'today',
    sort_by: 'best',
    'location.address': 'san francisco',
  },
  headers: {
    authorization: APIKEY,
  },
};

//options for location
let location = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.range_start': '2017-11-30T00:00:00',
    'start_date.range_end': '2017-12-10T19:00:00',
    sort_by: 'date',
    'location.address': '',
    categories: '103,110,113,116,17001,104,105,102,118,108,109',
    page: 1,
  },
  headers: {
    authorization: APIKEY,
  },
};

// ==========================================================================================
//                    GET requests
// ==========================================================================================


const getMonthEvents = () =>
  new Promise((resolve, reject) => {
    request(month_options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

const getWeekendEvents = (city = 'san francisco') => {
  weekend_options['qs']['location.address'] = city;
  return new Promise((resolve, reject) => {
    request(weekend_options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        // console.log('Weekend Body', body);
        resolve(body);
      }
    });
  });
};

const getTodayEvents = () =>
  new Promise((resolve, reject) => {
    request(today_options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

//Function for getting events by city
let eventHolder = [];
const getCityEventsForMonth = (city, pages = 1) => {
  let curPage;
  let parsedEvents;
  location['qs']['location.address'] = city;
  console.log(' in the cityAPI, heres the city:', city);
  return new Promise((resolve, reject) => {
    request(location, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        parsedEvents = JSON.parse(body).events;
        eventHolder = eventHolder.concat(parsedEvents);
        curPage = JSON.parse(body).pagination.page_number;
        console.log('in the getCities else, here is curPage', curPage);
        if (curPage <= pages) {
          location.qs.page += 1;
          resolve(getCityEventsForMonth(city, pages));
        } else {
          resolve(eventHolder);
          eventHolder = [];
          location.qs.page = 1;
        }
      }
    });
  });
}

module.exports = {
  month: getMonthEvents,
  weekend: getWeekendEvents,
  today: getTodayEvents,
  cityApi: getCityEventsForMonth,
  monthOptions: month_options,
};
