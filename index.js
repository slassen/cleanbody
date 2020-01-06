const validateField = (fieldSchema, field) => {
  if (field === undefined) {
    return fieldSchema.required !== true;
  }

  const expectedTypes = Array.isArray(fieldSchema.type) ? fieldSchema.type : [fieldSchema.type];
  const actualType = Array.isArray(field) ? 'array' : typeof field;

  if (!expectedTypes.includes(actualType)) {
    return false;
  }

  const fieldChildren = fieldSchema.children;
  if (fieldChildren) {
    for (let i = 0; i < fieldChildren.length; i++) {
      return validateField(fieldChildren[i], field[i]);
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
