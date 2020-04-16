const Model = require('./model');

class Bookings extends Model {
  constructor() {
    super('bookings');
  }
}

module.exports = new Bookings();

