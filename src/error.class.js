export default class ValidatorError {
  constructor({ columnName, columnVal, ruleName, ruleVal, msg }) {
    this.columnName = columnName;
    this.columnVal = columnVal;
    this.ruleName = ruleName;
    this.ruleVal = ruleVal;
    this.msg = msg;
  }
}
