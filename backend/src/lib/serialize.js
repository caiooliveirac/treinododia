function isDecimal(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.toNumber === "function" &&
    value.constructor?.name === "Decimal"
  );
}

function serializePrisma(value) {
  if (Array.isArray(value)) {
    return value.map(serializePrisma);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (isDecimal(value)) {
    return value.toNumber();
  }

  const output = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    output[key] = serializePrisma(nestedValue);
  }

  return output;
}

module.exports = { serializePrisma };
