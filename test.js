const Cleanbody = require('./index');
const schema = require('./test.json');
const validate = new Cleanbody(schema);

test('Obmitting unrequired objects', () => {
  expect(validate.test1({
    requiredString: 'string1',
    requiredArray: [
      'arraystring1',
      'arraystring2',
      'arraystring3'
    ],
    unrequiredMulti: true,
  })).toBe(true);
});

test('Setting an unrequired object', () => {
  expect(validate.test1({
    requiredString: 'string1',
    unrequiredString1: 'string2',
    unrequiredString2: 'string3',
    requiredArray: [
      'arraystring1',
      'arraystring2',
      'arraystring3'
    ],
    unrequiredObject: 'baddata',
    unrequiredMulti: 'true',
  })).toBe(false);
});

test('Valid email', () => {
  expect(validate.test2({ email: 'slassnpm@gmail.com' })).toBe(true);
});

test('Invalid email', () => {
  expect(validate.test2({ email: 'slassnpm@gmailcom' })).toBe(false);
});

test('Invalid types as a child of an array', () => {
  expect(validate.test3({
    array: [
      'arraystring1',
      'arraystring2',
      [],
    ]
  })).toBe(false);
});

test('Valid types as a child of an array', () => {
  expect(validate.test3({
    array: [
      'arraystring1',
      'arraystring2',
      {},
    ],
  })).toBe(true);
});

test('Minimum and maximum number of children', () => {
  expect(validate.test3({
    array: [
      'arraystring1',
    ],
  })).toBe(false);
  expect(validate.test3({
    array: [
      'arraystring1',
      'arraystring2',
      'arraystring3',
      'arraystring4',
    ],
  })).toBe(false);
});

test('Object with valid properties and obmitting an optional property', () => {
  expect(validate.test4({
    object: {
      key1: 'string1',
    },
  })).toBe(true);
});

test('An object obmitting a required property', () => {
  expect(validate.test4({
    object: {
      key2: true,
    },
  })).toBe(false);
});

test('An object with invalid properties', () => {
  expect(validate.test4({
    object: {
      key1: 'string1',
      key2: 'badbool',
    },
  })).toBe(false);
});

test('JSON strings', () => {
  expect(validate.test5({
    json: "abcdef",
  })).toBe(false);
  expect(validate.test5({
    json: "[\"string1\",\"string2\"]",
  })).toBe(true);
  expect(validate.test5({
    json: "[\"string1\",[]]",
  })).toBe(false);
  expect(validate.test6({
    json: "{\"key\":\"value\"}",
  })).toBe(true);
});
