const Sequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends Sequencer {
  testsOrder = {
    'create.spec.ts': 0,
    'lint.spec.ts': 1,
    'test.spec.ts': 2,
    'add-component.spec.ts': 3,
    'add-libraries.spec.ts': 4,
    'add-cypress-project.spec.ts': 5,
    'remove-libraries.spec.ts': 6,
    'move.spec.ts': 7,
    'remove.spec.ts': 8,
    'remove-cypress-project.spec.ts': 9,
    'add-private-api.spec.ts': 10,
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
