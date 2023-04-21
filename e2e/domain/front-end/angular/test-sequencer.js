const Sequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends Sequencer {
  testsOrder = {
    'application-layer.spec.ts': 0,
    'component.spec.ts': 1,
    'infrastructure-layer.spec.ts': 2,
    'directive.spec.ts': 3,
    'domain-layer.spec.ts': 4,
    'util.spec.ts': 5,
    'remove-library.spec.ts': 6,
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
