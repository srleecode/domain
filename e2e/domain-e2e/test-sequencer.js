const Sequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends Sequencer {
  testsOrder = {
    'create.spec.ts': 0,
    'add-libraries.spec.ts': 1,
    'remove-libraries.spec.ts': 2,
    'move.spec.ts': 3,
    'remove.spec.ts': 4,
    'add-e2e-project.spec.ts': 5,
    'remove-e2e-project.spec.ts': 6,
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
