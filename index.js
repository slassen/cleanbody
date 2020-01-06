const validateField = (fieldSchema, field) => {
  /** 
   * If the field is not defined then we check to see if it is required.
   * We can return early here because:
   * 1. If it is not required and not defined we don't need to process further.
   * 2. If it is required but not defined then the test fails.
   */
  if (field === undefined) {
    return fieldSchema.required !== true;
  }

  /**
   * We check a list of object types here. A type can contain either an array of strings
   * that specifc the types allowed or it can specify one.
   */
  const expectedTypes = Array.isArray(fieldSchema.type) ? fieldSchema.type : [fieldSchema.type];
  const actualType = Array.isArray(field) ? 'array' : typeof field;
  if (!expectedTypes.includes(actualType)) {
    return false;
  }

  /**
   * You can pass in patterns to validate strings as well. Keep in mind that you
   * will need to escape the pattern if include it in a JSON file.
   */
  if (actualType === 'string' && fieldSchema.pattern) {
    const regex = new RegExp(fieldSchema.pattern);
    if (!regex.test(field)) {
      return false;
    }
  }

  /**
   * For arrays we have an children property. You can specify the type of children and
   * mark them as required or use the same properties you would at the root of the object.
   */
  const fieldChildren = fieldSchema.children;
  if (fieldChildren) {
    for (let i = 0; i < field.length; i++) {
      if (!validateField(fieldChildren, field[i])) {
        return false;
      };
    }
  }

  return true;
};

class Cleanbody {
  constructor(schema) {
    for (let key in schema) {
      this[key] = (body) => {
        const methodSchema = schema[key];
        for (let key in methodSchema) {
          if (!validateField(methodSchema[key], body[key])) {
            return false;
          }
        }

        return true;
      };
    }
  }
};

module.exports = Cleanbody;
