#!/usr/bin/env node

/**
 * Generate Tests Script
 * 
 * This script uses Anthropic's Claude API to generate interactors and test files
 * for newly detected widgets/sections.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

const INTERACTOR_OUTPUT_PATH = 'packages/platform-test/POM/objects/widgets';
const TEST_OUTPUT_PATH = 'packages/platform-test/e2e/pages';
const FIXTURES_PATH = 'packages/platform-test/fixtures/testConfig.ts';

/**
 * Call Anthropic Claude API
 */
async function callClaude(systemPrompt, userPrompt, maxTokens = MAX_TOKENS) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Load prompt templates
 */
function loadPromptTemplate(templateName) {
  const templatePath = path.join('.github/prompts', `${templateName}.md`);
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf-8');
  }
  return null;
}

/**
 * Load example files for few-shot learning
 */
function loadExamples() {
  const examples = {
    interactor: '',
    test: '',
    fixtures: ''
  };

  // Load example interactor
  const exampleInteractorPath = 'packages/platform-test/POM/objects/widgets/KnownDrugs/knownDrugsSection.ts';
  if (fs.existsSync(exampleInteractorPath)) {
    examples.interactor = fs.readFileSync(exampleInteractorPath, 'utf-8');
  }

  // Load example test that uses fixtures
  const exampleTestPath = 'packages/platform-test/e2e/pages/drug/drugIndications.spec.ts';
  if (fs.existsSync(exampleTestPath)) {
    examples.test = fs.readFileSync(exampleTestPath, 'utf-8');
  }

  // Load another widget interactor example
  const ontologyInteractorPath = 'packages/platform-test/POM/objects/widgets/Ontology/ontologySection.ts';
  if (fs.existsSync(ontologyInteractorPath)) {
    examples.interactorOntology = fs.readFileSync(ontologyInteractorPath, 'utf-8');
  }

  // Load shared interactor example (EVA)
  const sharedInteractorPath = 'packages/platform-test/POM/objects/widgets/shared/evaSection.ts';
  if (fs.existsSync(sharedInteractorPath)) {
    examples.interactorShared = fs.readFileSync(sharedInteractorPath, 'utf-8');
  }

  // Load current fixtures/testConfig.ts
  if (fs.existsSync(FIXTURES_PATH)) {
    examples.fixtures = fs.readFileSync(FIXTURES_PATH, 'utf-8');
  }

  return examples;
}

/**
 * Generate interactor for a widget
 */
async function generateInteractor(widget, examples) {
  const interactorTemplate = loadPromptTemplate('interactor-template');
  
  const systemPrompt = `You are an expert TypeScript developer specializing in Playwright Page Object Model (POM) patterns. 
You generate clean, well-documented interactor classes for UI testing.
Your code should follow these principles:
- Use TypeScript with proper types
- Follow the existing naming conventions and patterns
- Include comprehensive methods for common interactions
- Use data-testid selectors when possible
- Include JSDoc comments for methods`;

  const userPrompt = `${interactorTemplate || ''}

## Task
Generate a Playwright interactor class for the following widget/section.

## Widget Information
- **Name**: ${widget.name}
- **Entity**: ${widget.entity}
- **Section ID**: ${widget.id || widget.name.toLowerCase()}
- **Display Name**: ${widget.displayName || widget.name}

## Widget Source Code

### index.ts
\`\`\`typescript
${widget.sources?.index || 'Not available'}
\`\`\`

### Body.tsx
\`\`\`typescript
${widget.sources?.Body || 'Not available'}
\`\`\`

### Summary.tsx
\`\`\`typescript
${widget.sources?.Summary || 'Not available'}
\`\`\`

## Example Interactor (KnownDrugs)
\`\`\`typescript
${examples.interactor}
\`\`\`

## Example Interactor (Ontology)
\`\`\`typescript
${examples.interactorOntology || ''}
\`\`\`

## Requirements
1. Create a class named \`${widget.name}Section\`
2. Use data-testid selectors based on the section id: \`section-${widget.id || widget.name.toLowerCase()}\`
3. Include methods for:
   - Getting the section container
   - Checking section visibility
   - Getting section header
   - Interacting with any tables (if present)
   - Any widget-specific interactions based on the Body component
   - Waiting for section to load
4. Follow the exact pattern from the examples
5. Only output the TypeScript code, no explanations

Generate the complete interactor class:`;

  const response = await callClaude(systemPrompt, userPrompt);
  
  // Extract code from response (remove markdown code blocks if present)
  let code = response;
  const codeMatch = response.match(/```typescript\n([\s\S]*?)```/);
  if (codeMatch) {
    code = codeMatch[1];
  }
  
  return code.trim();
}

/**
 * Generate test file for a widget
 */
async function generateTest(widget, examples, interactorCode) {
  const testTemplate = loadPromptTemplate('test-template');
  
  const systemPrompt = `You are an expert QA engineer specializing in Playwright end-to-end testing.
You write comprehensive, maintainable test suites that follow best practices.
Your tests should:
- Be independent and isolated
- Have clear, descriptive test names
- Use proper assertions
- Follow the AAA pattern (Arrange, Act, Assert)
- Include appropriate waits for async operations
- Use the testConfig fixture for test data instead of hardcoded values`;

  const userPrompt = `${testTemplate || ''}

## Task
Generate a Playwright test file for the following widget/section.

## Widget Information
- **Name**: ${widget.name}
- **Entity**: ${widget.entity}
- **Section ID**: ${widget.id || widget.name.toLowerCase()}
- **Display Name**: ${widget.displayName || widget.name}

## Widget Source Code

### Body.tsx
\`\`\`typescript
${widget.sources?.Body || 'Not available'}
\`\`\`

## Generated Interactor
\`\`\`typescript
${interactorCode}
\`\`\`

## Example Test File (uses fixtures)
\`\`\`typescript
${examples.test}
\`\`\`

## Current Test Config Fixtures
\`\`\`typescript
${examples.fixtures}
\`\`\`

## Requirements
1. Import test and expect from "../../../fixtures" (NOT from @playwright/test)
2. Import the generated interactor class
3. Import the appropriate page class (e.g., DrugPage, VariantPage, DiseasePage, TargetPage)
4. Create a test.describe block for "${widget.displayName || widget.name} Section"
5. In beforeEach:
   - Create page and section instances
   - Use testConfig fixture to get entity IDs (e.g., testConfig.${widget.entity}.primary or testConfig.${widget.entity}.with${widget.name})
   - Navigate to the entity page
   - Wait for section to load, skip if section not visible
6. Include tests for:
   - Section visibility
   - Main content/table is visible (if applicable)
   - Any interactive elements work correctly
7. For the interactor import path:
   - If it's a shared widget (used by multiple entities), use: "../../../POM/objects/widgets/shared/${widget.name.toLowerCase()}Section"
   - Otherwise use: "../../../POM/objects/widgets/${widget.name}/${widget.name.toLowerCase()}Section"
8. Only output the TypeScript code, no explanations

Generate the complete test file:`;

  const response = await callClaude(systemPrompt, userPrompt);
  
  // Extract code from response
  let code = response;
  const codeMatch = response.match(/```typescript\n([\s\S]*?)```/);
  if (codeMatch) {
    code = codeMatch[1];
  }
  
  return code.trim();
}

/**
 * Generate fixture updates for new widgets
 */
async function generateFixtureUpdates(widgets, examples) {
  const systemPrompt = `You are an expert TypeScript developer who understands Playwright test fixtures.
You analyze widget requirements and suggest appropriate test data configurations.
You output valid TypeScript code that follows existing patterns.`;

  const widgetSummaries = widgets.map(w => ({
    name: w.name,
    entity: w.entity,
    id: w.id,
    displayName: w.displayName,
    hasTable: w.sources?.Body?.includes('Table') || w.sources?.Body?.includes('table'),
    hasSearch: w.sources?.Body?.includes('search') || w.sources?.Body?.includes('Search'),
  }));

  const userPrompt = `## Task
Analyze the following new widgets and suggest updates to the TestConfig interface and mock data.

## New Widgets
${JSON.stringify(widgetSummaries, null, 2)}

## Current TestConfig File
\`\`\`typescript
${examples.fixtures}
\`\`\`

## Requirements
1. For each new widget, determine if it needs a specific test data entry in TestConfig
2. Widgets often need a specific entity ID that has data for that widget (e.g., "withPharmacogenomics", "withEVA")
3. Add new optional properties to the appropriate entity in TestConfig interface
4. Add corresponding mock values in fetchTestConfig()
5. Use realistic Open Targets Platform IDs:
   - Targets: ENSG IDs (e.g., "ENSG00000157764" for BRAF)
   - Diseases: EFO IDs (e.g., "EFO_0000612" for myocardial infarction)
   - Drugs: CHEMBL IDs (e.g., "CHEMBL1201585" for trastuzumab)
   - Variants: chr_pos_ref_alt format (e.g., "1_154453788_C_T")
   - Studies: GCST IDs for GWAS, descriptive IDs for QTL

## Output Format
Return a JSON object with two fields:
1. "interfaceAdditions": An object mapping entity names to new interface properties (TypeScript type definitions)
2. "mockDataAdditions": An object mapping entity names to new mock data values

Example output:
\`\`\`json
{
  "interfaceAdditions": {
    "variant": {
      "withNewWidget": "string"
    }
  },
  "mockDataAdditions": {
    "variant": {
      "withNewWidget": "19_44908822_C_T"
    }
  },
  "reasoning": "The NewWidget section displays variant data, so we need a variant ID that has this data available."
}
\`\`\`

Only output the JSON, no additional explanation.`;

  const response = await callClaude(systemPrompt, userPrompt);
  
  // Extract JSON from response
  let json = response;
  const jsonMatch = response.match(/```json\n([\s\S]*?)```/);
  if (jsonMatch) {
    json = jsonMatch[1];
  }
  
  try {
    return JSON.parse(json.trim());
  } catch (e) {
    console.warn('  ⚠️ Could not parse fixture suggestions:', e.message);
    return null;
  }
}

/**
 * Apply fixture updates to testConfig.ts
 */
function applyFixtureUpdates(fixtureUpdates) {
  if (!fixtureUpdates || !fs.existsSync(FIXTURES_PATH)) {
    return null;
  }

  let content = fs.readFileSync(FIXTURES_PATH, 'utf-8');
  const originalContent = content;
  
  // Apply interface additions
  if (fixtureUpdates.interfaceAdditions) {
    for (const [entity, additions] of Object.entries(fixtureUpdates.interfaceAdditions)) {
      for (const [propName, propType] of Object.entries(additions)) {
        // Find the entity interface block and add the new property
        const entityPattern = new RegExp(`(${entity}:\\s*\\{[^}]*)(\\})`, 's');
        const match = content.match(entityPattern);
        
        if (match) {
          // Check if property already exists
          if (!content.includes(`${propName}:`)) {
            const newProp = `\n    /** ${propName} - auto-generated */\n    ${propName}?: ${propType};`;
            content = content.replace(entityPattern, `$1${newProp}\n  $2`);
          }
        }
      }
    }
  }

  // Apply mock data additions
  if (fixtureUpdates.mockDataAdditions) {
    for (const [entity, additions] of Object.entries(fixtureUpdates.mockDataAdditions)) {
      for (const [propName, propValue] of Object.entries(additions)) {
        // Find the entity in the mock data return block
        const mockPattern = new RegExp(`(${entity}:\\s*\\{[^}]*)(\\},?)`, 's');
        const match = content.match(mockPattern);
        
        if (match) {
          // Check if property already exists in mock data
          if (!match[1].includes(`${propName}:`)) {
            const newMockProp = `\n      ${propName}: "${propValue}",`;
            content = content.replace(mockPattern, `$1${newMockProp}\n    $2`);
          }
        }
      }
    }
  }

  // Only write if content changed
  if (content !== originalContent) {
    fs.writeFileSync(FIXTURES_PATH, content);
    return FIXTURES_PATH;
  }
  
  return null;
}

  const response = await callClaude(systemPrompt, userPrompt);
  
  // Extract code from response
  let code = response;
  const codeMatch = response.match(/```typescript\n([\s\S]*?)```/);
  if (codeMatch) {
    code = codeMatch[1];
  }
  
  return code.trim();
}

/**
 * Write generated files to disk
 */
function writeGeneratedFiles(widget, interactorCode, testCode) {
  // Create interactor directory and file
  const interactorDir = path.join(INTERACTOR_OUTPUT_PATH, widget.name);
  if (!fs.existsSync(interactorDir)) {
    fs.mkdirSync(interactorDir, { recursive: true });
  }
  
  const interactorFileName = `${widget.name.charAt(0).toLowerCase() + widget.name.slice(1)}Section.ts`;
  const interactorPath = path.join(interactorDir, interactorFileName);
  fs.writeFileSync(interactorPath, interactorCode);
  console.log(`  ✅ Created interactor: ${interactorPath}`);

  // Create test directory and file
  const testDir = path.join(TEST_OUTPUT_PATH, widget.entity);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  const testFileName = `${widget.name.toLowerCase()}.spec.ts`;
  const testPath = path.join(testDir, testFileName);
  fs.writeFileSync(testPath, testCode);
  console.log(`  ✅ Created test: ${testPath}`);

  return { interactorPath, testPath };
}

/**
 * Main execution
 */
async function main() {
  console.log('🤖 Starting test generation...\n');

  if (!ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is not set');
    process.exit(1);
  }

  // Load detected widgets
  let widgets;
  
  if (process.env.NEW_WIDGETS_JSON) {
    widgets = JSON.parse(process.env.NEW_WIDGETS_JSON);
  } else if (fs.existsSync('.github/scripts/.detected-widgets.json')) {
    widgets = JSON.parse(fs.readFileSync('.github/scripts/.detected-widgets.json', 'utf-8'));
  } else {
    console.error('❌ No widgets data found. Run detect-new-widgets.js first.');
    process.exit(1);
  }

  if (!widgets || widgets.length === 0) {
    console.log('No widgets to process.');
    return;
  }

  // Filter to only widget types
  const widgetsToProcess = widgets.filter(w => w.type === 'widget');
  
  if (widgetsToProcess.length === 0) {
    console.log('No widget-type items to process.');
    return;
  }

  // Load examples for few-shot learning
  const examples = loadExamples();
  
  console.log(`📦 Processing ${widgetsToProcess.length} widget(s)...\n`);

  // First, generate fixture updates for all widgets
  console.log('📋 Analyzing fixture requirements...');
  const fixtureUpdates = await generateFixtureUpdates(widgetsToProcess, examples);
  
  if (fixtureUpdates) {
    console.log('  📝 Suggested fixture updates:');
    if (fixtureUpdates.interfaceAdditions) {
      console.log('    Interface additions:', JSON.stringify(fixtureUpdates.interfaceAdditions));
    }
    if (fixtureUpdates.mockDataAdditions) {
      console.log('    Mock data additions:', JSON.stringify(fixtureUpdates.mockDataAdditions));
    }
    if (fixtureUpdates.reasoning) {
      console.log('    Reasoning:', fixtureUpdates.reasoning);
    }
    
    // Apply fixture updates
    console.log('  💾 Applying fixture updates...');
    const fixturesPath = applyFixtureUpdates(fixtureUpdates);
    if (fixturesPath) {
      console.log(`  ✅ Updated fixtures: ${fixturesPath}`);
    } else {
      console.log('  ℹ️  No fixture changes needed or could not apply updates');
    }
  }

  const results = [];

  for (const widget of widgetsToProcess) {
    console.log(`\n🔧 Generating tests for: ${widget.name} (${widget.entity})`);

    try {
      // Generate interactor
      console.log('  📝 Generating interactor...');
      const interactorCode = await generateInteractor(widget, examples);

      // Generate test (now includes fixture context)
      console.log('  📝 Generating test file...');
      const testCode = await generateTest(widget, examples, interactorCode);

      // Write files
      console.log('  💾 Writing files...');
      const paths = writeGeneratedFiles(widget, interactorCode, testCode);
      
      results.push({
        widget: widget.name,
        entity: widget.entity,
        success: true,
        ...paths
      });

    } catch (error) {
      console.error(`  ❌ Error generating tests for ${widget.name}:`, error.message);
      results.push({
        widget: widget.name,
        entity: widget.entity,
        success: false,
        error: error.message
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Generation Summary');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\nGenerated files:');
    successful.forEach(r => {
      console.log(`  - ${r.widget}: ${r.interactorPath}, ${r.testPath}`);
    });
  }

  if (failed.length > 0) {
    console.log('\nFailed widgets:');
    failed.forEach(r => {
      console.log(`  - ${r.widget}: ${r.error}`);
    });
  }

  // Clean up temp file
  if (fs.existsSync('.github/scripts/.detected-widgets.json')) {
    fs.unlinkSync('.github/scripts/.detected-widgets.json');
  }

  console.log('\n✅ Generation complete!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
