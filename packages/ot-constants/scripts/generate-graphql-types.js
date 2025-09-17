#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try different possible endpoints
const GRAPHQL_ENDPOINTS = ["https://api.platform.dev.opentargets.xyz/api/v4/graphql"];

// GraphQL introspection query to get the schema
const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Function to convert GraphQL type to TypeScript type
function graphqlTypeToTypeScript(type) {
  if (type.kind === "NON_NULL") {
    return graphqlTypeToTypeScript(type.ofType);
  }

  if (type.kind === "LIST") {
    const innerType = graphqlTypeToTypeScript(type.ofType);
    return `${innerType}[]`;
  }

  if (type.kind === "SCALAR") {
    switch (type.name) {
      case "Int":
      case "Float":
        return "number";
      case "String":
        return "string";
      case "Boolean":
        return "boolean";
      case "ID":
        return "string";
      default:
        return "any";
    }
  }

  return type.name || "any";
}

// Function to generate TypeScript interface from GraphQL type
function generateTypeScriptInterface(type) {
  if (type.kind !== "OBJECT" && type.kind !== "INPUT_OBJECT") {
    return null;
  }

  const fields = type.fields || type.inputFields || [];
  if (fields.length === 0) {
    return null;
  }

  let interfaceCode = `export interface ${type.name} {\n`;

  fields.forEach(field => {
    const fieldType = graphqlTypeToTypeScript(field.type);
    const isOptional = field.type.kind !== "NON_NULL";
    const optionalMarker = isOptional ? "?" : "";

    if (field.description) {
      interfaceCode += `  /** ${field.description} */\n`;
    }
    interfaceCode += `  ${field.name}${optionalMarker}: ${fieldType};\n`;
  });

  interfaceCode += "}\n\n";
  return interfaceCode;
}

// Function to generate TypeScript enum from GraphQL enum
function generateTypeScriptEnum(type) {
  if (type.kind !== "ENUM") {
    return null;
  }

  let enumCode = `export enum ${type.name} {\n`;

  type.enumValues.forEach(enumValue => {
    if (enumValue.description) {
      enumCode += `  /** ${enumValue.description} */\n`;
    }
    enumCode += `  ${enumValue.name} = '${enumValue.name}',\n`;
  });

  enumCode += "}\n\n";
  return enumCode;
}

// Function to generate TypeScript union type
function generateTypeScriptUnion(type) {
  if (type.kind !== "UNION") {
    return null;
  }

  const possibleTypes = type.possibleTypes.map(t => t.name).join(" | ");
  return `export type ${type.name} = ${possibleTypes};\n\n`;
}

// Function to test an endpoint
async function testEndpoint(endpoint) {
  try {
    console.log(`Testing endpoint: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: INTROSPECTION_QUERY,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.data && result.data.__schema) {
        console.log(`✅ Endpoint working: ${endpoint}`);
        return result;
      }
    }

    console.log(`❌ Endpoint failed: ${endpoint} (${response.status})`);
    return null;
  } catch (error) {
    console.log(`❌ Endpoint error: ${endpoint} - ${error.message}`);
    return null;
  }
}

// Main function to fetch schema and generate types
async function generateGraphQLTypes() {
  try {
    console.log("Testing GraphQL endpoints...");

    let result = null;
    let workingEndpoint = null;

    // Try each endpoint
    for (const endpoint of GRAPHQL_ENDPOINTS) {
      result = await testEndpoint(endpoint);
      if (result) {
        workingEndpoint = endpoint;
        break;
      }
    }

    if (!result) {
      throw new Error("No working GraphQL endpoint found. Please check the API endpoints.");
    }

    const schema = result.data.__schema;
    const types = schema.types.filter(
      type =>
        !type.name.startsWith("__") &&
        type.name !== "Query" &&
        type.name !== "Mutation" &&
        type.name !== "Subscription"
    );

    console.log(`Found ${types.length} types to process`);

    let generatedCode = `// Auto-generated GraphQL types from Open Targets Platform API
// Generated on: ${new Date().toISOString()}
// Source: ${workingEndpoint}

`;

    // Generate interfaces and input types
    const objectTypes = types.filter(
      type => type.kind === "OBJECT" || type.kind === "INPUT_OBJECT"
    );
    objectTypes.forEach(type => {
      const interfaceCode = generateTypeScriptInterface(type);
      if (interfaceCode) {
        generatedCode += interfaceCode;
      }
    });

    // Generate enums
    const enumTypes = types.filter(type => type.kind === "ENUM");
    enumTypes.forEach(type => {
      const enumCode = generateTypeScriptEnum(type);
      if (enumCode) {
        generatedCode += enumCode;
      }
    });

    // Generate union types
    const unionTypes = types.filter(type => type.kind === "UNION");
    unionTypes.forEach(type => {
      const unionCode = generateTypeScriptUnion(type);
      if (unionCode) {
        generatedCode += unionCode;
      }
    });

    // Write the generated types to a file in the types folder
    const outputPath = path.join(__dirname, "..", "src", "types", "graphql-types.ts");
    fs.writeFileSync(outputPath, generatedCode);

    console.log(`✅ GraphQL types generated successfully at: ${outputPath}`);
    console.log(
      `📊 Generated ${objectTypes.length} interfaces, ${enumTypes.length} enums, and ${unionTypes.length} union types`
    );
  } catch (error) {
    console.error("❌ Error generating GraphQL types:", error.message);
    process.exit(1);
  }
}

// Run the script
generateGraphQLTypes();
