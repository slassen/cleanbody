const Cleanbody = require('./index');
const schema = require('./test.json');

let testCount = 1;
const displayTest = ( description, expected, actual) => {
  console.group(`\n #${testCount} ${description} [${expected === actual ? 'PASSED' : 'FAILED'}]`);
  console.log(`expected: ${expected}, actual: ${actual} `);
  console.groupEnd();
  testCount++;
}

try {
  const validate = new Cleanbody(schema);

  const body1 = {
    requiredString: 'string1',
    requiredArray: [
      'arraystring'
    ],
    unrequiredMulti: true,
  };

  displayTest(
    'Obmitting unrequired objects should pass.',
    true,
    validate.test1(body1),
  );

  body1.unrequiredString1 = 'string2';
  body1.unrequiredString2 = 'string3';
  body1.unrequiredObject = {},
  body1.unrequiredMulti = 'true';

  displayTest(
    'Adding required objects that match types should pass.',
    true,
    validate.test1(body1),
  );

  body1.unrequiredObject = 'baddata';

  displayTest(
    'Setting an unrequired object as a string should fail.',
    false,
    validate.test1(body1),
  );  
} catch (err) {
  console.error('UNABLE TO START OR COMPLETE TESTS');
}