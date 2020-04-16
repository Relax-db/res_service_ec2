const _ = require('lodash');
const db = require('../db');

const executeQuery = (query, values) => db.query(query, values).spread((results) => results);

const parseData = (options) => {
  return _.reduce(options, (parsed, value, key) => {
    parsed.string.push(`${key} = ${value}`);
    parsed.values.push(value);
    return parsed;
  }, { string: [], values: [] });
};

class Model {
  constructor(tablename) {
    this.tablename = tablename;
  }

  getAll(options) {
    if (!options) {
      const queryString = `SELECT * FROM ${this.tablename};`;
      return executeQuery(queryString);
    }
    const parsedOptions = parseData(options);
    const queryString = `SELECT * FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')};`;
    return executeQuery(queryString, parsedOptions.values);
  }

  get(options) {
    const parsedOptions = parseData(options);
    const queryString = `SELECT * FROM ${this.tablename} WHERE ${parsedOptions.string.join(' AND ')};`;
    return executeQuery(queryString, parsedOptions.values)
      .then((results) => results[0]);
  }
}

module.exports = Model;

