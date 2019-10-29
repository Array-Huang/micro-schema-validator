const Validator = require('./lib/micro-schema-validator.js');

const RULES = {
  windowSelector: {
    type: 'string',
    required: true
  },
  minWidth: {
    type: 'number',
    size: { min: 1 }
  },
  maxWidth: {
    type: 'number'
  },
  minHeight: {
    type: 'number',
    size: { min: 1 }
  },
  maxHeight: {
    type: 'number'
  },
  resizeHandlerClassName: {
    type: 'string'
  },
  customMoveHandler: {
    type: 'string'
  },
  customMaximizeHandler: {
    type: 'string'
  },
  movable: {
    type: 'boolean',
    required: false
  },
  resizable: {
    required: false
  },
  maximizeCallback: {
    type: 'function'
  }
};

const validator = new Validator(RULES);

const params = {
  windowSelector: null,
  minWidth: 0,
  maxWidth: 400,
  minHeight: 100,
  maxHeight: 400
};
const validateResult = validator.validate(params);
console.log(validateResult);
