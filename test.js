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
      'arraystring1',
      'arraystring2',
      'arraystring3'
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

  // original regex ^([^<>()[\]\\.,;:$!/=%&\^*\s@"#$'\+\{\}\|~\?`]+(\.[^<>()[\]\\.,;:$!/=%&\^*\s@"#$'\+\{\}\|~\?`]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$
  // escaped regex "^([^<>()[\\]\\.,;:$!/=%&\\^*\\s@\"#$'\\+\\{\\}\\|~\\?`]+(\\.[^<>()[\\]\\.,;:$!/=%&\\^*\\s@\"#$'\\+\\{\\}\\|~\\?`]+)*)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"
  displayTest(
    'A valid email should pass with appropriate pattern.',
    true,
    validate.test2({ email: 'slassnpm@gmail.com' }),
  );

  displayTest(
    'An invalid email should fail with appropriate pattern.',
    false,
    validate.test2({ email: 'slassnpm@gmailcom' }),
  );

  displayTest(
    'Adding invalid types as a child of an array should fail.',
    false,
    validate.test3({
      array: [
        'arraystring1',
        'arraystring2',
        [],
      ]
    }),
  );

  displayTest(
    'Adding valid types as a child of an array should pass.',
    true,
    validate.test3({
      array: [
        'arraystring1',
        'arraystring2',
        {},
      ],
    }),
  );

  displayTest(
    'Not meeting the minimum number of children should fail.',
    false,
    validate.test3({
      array: [
        'arraystring1',
      ],
    }),
  );

  displayTest(
    'Exceeding the maximum number of children should fail.',
    false,
    validate.test3({
      array: [
        'arraystring1',
        'arraystring2',
        'arraystring3',
        'arraystring4',
      ],
    }),
  );

  displayTest(
    'An object with valid properties and obmitting an optional property should pass.',
    true,
    validate.test4({
      object: {
        key1: 'string1',
      },
    }),
  );

  displayTest(
    'An object obmitting a required property should fail.',
    false,
    validate.test4({
      object: {
        key2: true,
      },
    }),
  );

  displayTest(
    'An object with invalid properties should fail.',
    false,
    validate.test4({
      object: {
        key1: 'string1',
        key2: 'badbool',
      },
    }),
  );

} catch (err) {
  console.error('UNABLE TO START OR COMPLETE TESTS');
  console.error(err);
}