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
  addUser: {
    email: {
      type: 'string',
      required: true,
      pattern: '',
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