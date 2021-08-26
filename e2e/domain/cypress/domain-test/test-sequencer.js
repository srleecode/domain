const Sequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends Sequencer {
  testsOrder = {
    'domain-test.spec.ts': 0
  };
  sort(tests) {
    const orderedTests = [];
    tests.forEach((test) => {
      const fileName = path.basename(test.path);
      orderedTests[this.testsOrder[fileName]] = test;
    });
    return orderedTests;
  }
}

module.exports = CustomSequencer;