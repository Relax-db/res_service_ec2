const Model = require('./model');

class Locations extends Model {
  constructor() {
    super('locations');
  }
}

module.exports = new Locations();

