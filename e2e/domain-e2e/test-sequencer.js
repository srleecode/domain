const Sequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends Sequencer {
  testsOrder = {
    'create.spec.ts': 0,
    'add-libraries.spec.ts': 1,
    'add-cypress-project.spec.ts': 2,
 // 'remove-libraries.spec.ts': 3,
  // 'move.spec.ts': 4,
  //  'remove.spec.ts': 5,
  //  'remove-cypress-project.spec.ts': 6,
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
