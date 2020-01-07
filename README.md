### Installation and Usage

1. `npm i -s cleanbody`
2. Require package in your JS project.
3. Initialize a Cleanbody instance with a schema. (Examples in test.json and below.)
4. Call a created function on the instance. It will return true if valid, false if not.

### Quick Example

```js
const Cleanbody = require('cleanbody');

/**
 * In your project pass in a valid JS object for a schema to compare against incoming payloads.
 * In my tests I import a JSON file. You can use `test.json` as an example for that.
 * You can use a valid JS object if you don't want to import JSON.
 */
const schema = {
  addUser: {            // <-- root keys on the schema are what functions you will call later. ex. validate.addUser()
    email: {            // <-- each key here is a key on the JSON object you are validating
      type: 'string',   // <-- you can include an string array or a string of what type(s) you allow for this value
      required: true,   // <-- the key can be required or not required. but if it is defined it must meet all criteria
      pattern: '',      // <-- if the value type is a string and you include a pattern in the schema it will validate it
    },
    user: {
      type: 'string',
      required: true,
    }
  },
};

const validate = new Cleanbody(schema); // We initialize the instance with a schema

// Express app example route with body-parser
app.post('/user', (req, res, next) => {
  /**
   * example success body:
   * {
   *   user: 'Scott Lassen',
   *   email: 'slassnpm@gmail.com',
   * }
   *
   * example failed body:
   * {
   *   user: true,
   *   email: 'slassnpmgmailcom',
   * }
   */
  const valid = validate.addUser(req.body); // returns true if payload is validated
  if (valid) {
    res.status(200).send(); // success!
  } else {
    res.status(400).send(); // failed!
  }
});
```

### Notes
1. 1.x.x versions of this project's schema structure may be changed without versioning. Pay attention to version history if you use it during version 1.
2. A future version is likely to support root level bodies as arrays and strings, not just objects.
