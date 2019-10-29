import ValidatorError from './error.class';
import { isNull } from './utils';

export default {
  originInfo: null,
  buildError(msg) {
    return new ValidatorError({
      ...this.originInfo,
      msg
    });
  },
  check(errorsContainer, { columnName, columnVal, ruleName, ruleVal }) {
    const checkMethodName = `${ruleName}Check`;
    if (!this[checkMethodName] && typeof this[checkMethodName] !== 'function') {
      console.warn(`Unexpected rule found: ${ruleName}`);
      return;
    }

    this.originInfo = { columnName, columnVal, ruleName, ruleVal };

    const checkResult = this[checkMethodName]({ columnName, columnVal, ruleName, ruleVal });
    if (checkResult instanceof ValidatorError) {
      errorsContainer.push(checkResult);
    }
  },
  requiredCheck({ columnName, columnVal, ruleVal }) {
    if (!!ruleVal && (typeof columnVal === 'undefined' || isNull(columnVal))) {
      return this.buildError(`RequiredCheck: ${columnName} is required`);
    }

    return true;
  },
  typeCheck({ columnName, columnVal, ruleVal }) {
    const availableTypes = ruleVal.split('|');
    if (availableTypes.length === 0) {
      console.warn('TypeCheck: Type requirement should not be empty');
    }

    const columnValType = typeof columnVal;
    if (
      availableTypes.every(availableType => {
        if (availableType === 'array') {
          return !Array.isArray(columnVal);
        }
        return columnValType !== availableType;
      })
    ) {
      return this.buildError(
        `TypeCheck: ${columnName} need to be ${ruleVal}, but now is ${columnValType}`
      );
    }
  },
  sizeCheck({ columnName, columnVal, ruleVal }) {
    function _stringAndArraySizeCheck() {
      const length = columnVal.length;
      if (typeof ruleVal.min === 'number' && ruleVal.min > 0 && length < ruleVal.min) {
        return false;
      }

      if (typeof ruleVal.max === 'number' && ruleVal.max > 0 && length > ruleVal.max) {
        return false;
      }

      return true;
    }

    function _numberSizeCheck() {
      if (typeof ruleVal.min === 'number' && ruleVal.min > 0 && columnVal < ruleVal.min) {
        return false;
      }

      if (typeof ruleVal.max === 'number' && ruleVal.max > 0 && columnVal > ruleVal.max) {
        return false;
      }

      return true;
    }

    let checkResult;
    if (typeof columnVal === 'string' || Array.isArray(columnVal)) {
      checkResult = _stringAndArraySizeCheck();
    } else if (typeof columnVal === 'number') {
      checkResult = _numberSizeCheck();
    } else {
      console.warn(`SizeCheck: ${columnName} need to be a string, a number, or an array`);
      return;
    }

    if (!checkResult) {
      return this.buildError('SizeCheck failed');
    }
  }
};
