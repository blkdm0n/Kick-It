// pg allows node to use postgres
const pg = require('pg');
const config = require('../knexfile.js');  
const dev = 'development';
const prod = 'production';
let knex = require('knex')(config[dev]);

knex.raw('DROP DATABASE IF EXISTS kickit;').then( () => {
  knex.raw('CREATE DATABASE kickit;').then( () => {
    knex.destroy();
    config[dev]['connection']['database'] = 'kickit';
    knex = require('knex')(config[dev]);
    module.exports = knex;
  })
  .then( () => {
    knex.raw(`DROP TABLE IF EXISTS events;`).then( (res) => {
      knex.schema.createTable('events', (table) => {
        table.increments('id');
        table.string('name');
        table.text('description', 'longtext');
        // table.foreign('venue_id');
        table.string('price');
        table.string('url');
        table.string('image_url');
        table.dateTime('start_datetime');
        table.dateTime('end_datetime');
        // table.foreign('category_id');
      })
      .then( (res) => {
        console.log('CREATE TABLE res: ', res);
      }).catch( ( err) => {
        console.log('Error occurred when creating events table: ', err);
      })
    })
  })
})


const bookshelf = require('bookshelf')(knex);
const _ = require('lodash');
const Promise = require('bluebird');
const moment = require('moment');


//==========================================================================================
//                    Events Table
//==========================================================================================

class Event extends bookshelf.Model {
  get tableName() {
    return 'events';
  }
}



const Events = bookshelf.Collection.extend({
  model: Event
})


// add to event table
// let addToEvents = client.query (
//   `INSERT INTO events(id, name, description, venue_id, url, logo_url, start, end, is_free, category_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [id, name, description, venue_id, url, logo_url, start, end, is_free, category_id], (err, res) => {
//   if (err) {
//     return err;
//   } else {
//   	return () => client.end();
//   }
// });

module.exports

// add events to table
const addEvents = (eventsList) => {
  eventsList.forEach( (event) => {
    Events.add(event);
  });
}

// search for today's events
const getTodaysEvents = () => {
  return Events.query( (qb) => {
    qb.where('end_datetime', '>', moment().format()).orderBy('start_datetime', 'DESC');
  }).fetch();
}


// search for events in table
const searchAllEvents = (date, categories, price) => {
  return Events.query( (qb) => {
    qb.where('start_datetime', '=', date).andWhere('category_id', 'in', categories).andWhere('price', '=', price)
  }).fetch();
}


//==========================================================================================
//                    Categories Table
//==========================================================================================

class Category extends bookshelf.Model {
  get tableName() {
    return 'categories'
  }
}

const Categories = bookshelf.Collection.extend({
  model: Category
})

// add events to table
// const addCategory = (categoryList) => {
//   categoryList.forEach( (category) => {
//     Categories.add(category)
//   })
// }

// search for events in table
const getCategoryName = (category_id) => {
  return new Categories.query({where: {id: category_id}}).fetchOne()
}

//==========================================================================================
//                    Venues Table
//==========================================================================================

// create join events and categories table
// let venues_Table = client.query((/* add query */));

// // add to categories_events table 
// let addToVenues_Events = client.query (/* add query */ (err, res) => {
//   if (err) {
//     return err;
//   } else {
//     return () => client.end();
//   }
// });

// //search categories_events table
// let searchVenues_Events = client.query((/* add query */));


//==========================================================================================
//                    Exports
//========================================================================================== 

module.exports.addEvents = addEvents;
module.exports.getTodaysEvents = getTodaysEvents;
module.exports.searchAllEvents = searchAllEvents;
// module.exports.addToCategories = addToCategories;
// module.exports.searchCategories = searchCategories;
// module.exports.addToCategories_Events = addToCategories_Events;
// module.exports.searchCategories_Events = searchCategories_Events;


