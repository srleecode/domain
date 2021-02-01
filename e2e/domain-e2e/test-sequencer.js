const Sequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends Sequencer {
  testsOrder = {
    'create.spec.ts': 0,
    'add-component.spec.ts': 1,
    'add-libraries.spec.ts': 2,
    'add-cypress-project.spec.ts': 3,
    'remove-libraries.spec.ts': 4,
    'move.spec.ts': 5,
    'remove.spec.ts': 6,
    'remove-cypress-project.spec.ts': 7,
    'add-private-api.spec.ts': 8,
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
