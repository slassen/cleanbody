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
   * For arrays we have a children property. You can specify the type of children and
   * mark them as required or use the same properties you would at the root of the object.
   * In addition, check to make sure the optional minimum and maximum elements are met.
   */
  const fieldChildren = fieldSchema.children;
  if (actualType === 'array' && fieldChildren) {
    if ((fieldSchema.maximum && field.length > fieldSchema.maximum) || (fieldSchema.minimum && field.length < fieldSchema.minimum)) {
      return false;
    }

    for (let i = 0; i < field.length; i++) {
      if (!validateField(fieldChildren, field[i])) {
        return false;
      };
    }
  }

  /**
   * For objects we have a properties property. You can use the same properties for this
   * type but you need to assign each property of the object it's own object that includes
   * things like type, required, pattern, et. cetera. We must loop twice. Once through the
   * body keys and once through the schema keys to ensure required keys are included.
   */
  const fieldProperties = fieldSchema.properties;
  if (actualType === 'object' && fieldProperties) {
    for (let key in field) {
      if (!validateField(fieldProperties[key], field[key])) {
        return false;
      }
    }

    for (let key in fieldProperties) {
      if (fieldProperties[key].required && field[key] === undefined) {
        return false;
      }
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
