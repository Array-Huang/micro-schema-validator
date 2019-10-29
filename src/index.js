import validator from './validators';
import { isNull } from './utils';

class MicroSchemaValidator {
  constructor(schema) {
    this._library_name = 'micro-schema-validator';
    if (!schema) {
      console.warn("Schema can't be empty.");
    }
    this.schema = schema;
    this.errors = [];
  }

  validate(target) {
    if (!target) {
      console.warn("Validate target can't be empty.");
    }

    for (const columnName in this.schema) {
      if (!Object.prototype.hasOwnProperty.call(this.schema, columnName)) {
        continue;
      }

      const rules = this.schema[columnName];
      for (const ruleName in rules) {
        if (!Object.prototype.hasOwnProperty.call(rules, ruleName)) {
          continue;
        }

        const columnVal = target[columnName];
        const ruleVal = rules[ruleName];

        if (ruleName !== 'required' && (typeof columnVal === 'undefined' || isNull(columnVal))) {
          continue;
        }

        validator.check(this.errors, {
          columnName,
          columnVal,
          ruleName,
          ruleVal
        });
      }
    }

    return {
      status: this.errors.length === 0,
      errors: this.errors
    };
  }

  _getName() {
    return this._library_name;
  }
}

export default MicroSchemaValidator;
