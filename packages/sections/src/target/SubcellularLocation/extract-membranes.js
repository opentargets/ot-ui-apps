/*
This script downloads the UniProt subcellular location vocabulary and generates
membrane-codes.js.

The script attempts to assign membranes to an appropriate parent cell part based
on the name, allowing us to highlight the parent in the SissBioPic - which often
lack the membranes.

The general rule is to remove "membrane" from the part name and see if the 'stem'
is a valid parent, but there are various special cases including:
- Do not include the nucleus or cell membranes - these are included in
SwissBioPics.
- Assign inner and outer membranes to the relevant parent - or to the cell or
nucleus membranes where appropriate.
*/

const fs = require('fs');
const path = require('path');
const https = require('https');

const outputFile = path.join(__dirname, 'membrane-codes.js');
const uniprotVocabUrl = 'https://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/complete/docs/subcell.txt';

// Function to fetch the vocabulary file from UniProt
async function fetchVocabulary() {
  return new Promise((resolve, reject) => {
    console.log('Fetching vocabulary from UniProt...');
    https.get(uniprotVocabUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch vocabulary: ${response.statusCode} ${response.statusMessage}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log('Successfully fetched vocabulary from UniProt');
        resolve(data.split('\n'));
      });
    }).on('error', (error) => {
      reject(new Error(`Error fetching vocabulary: ${error.message}`));
    });
  });
}

async function processVocabulary() {
  let lines;
  try {
    lines = await fetchVocabulary();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  // First pass: collect all entries (both membrane and non-membrane)
  const allEntries = [];
  let currentEntry = null;

  for (const line of lines) {
    const trimmedLine = line.trimStart();
    
    // Check for ID line
    if (trimmedLine.startsWith('ID   ')) {
      // If we have a previous entry that wasn't closed properly, save it
      if (currentEntry && currentEntry.name) {
        allEntries.push(currentEntry);
      }
      
      // Extract the name (remove 'ID   ' prefix and the trailing period)
      const name = trimmedLine.substring(5).replace(/\.$/, '').trim();
      currentEntry = { name, code: null };
    } 
    // Check for AC line (accession code)
    else if (currentEntry && !currentEntry.code && trimmedLine.startsWith('AC   ')) {
      currentEntry.code = trimmedLine.substring(5).trim();
    } 
    // Check for entry terminator
    else if (trimmedLine === '//') {
      if (currentEntry && currentEntry.name && currentEntry.code) {
        allEntries.push(currentEntry);
      }
      currentEntry = null;
    }
  }

  // Create a map of all entries for quick lookup
  const entryMap = new Map(allEntries.map(entry => [entry.name, entry]));

  // Special case parent codes
  const SPECIAL_PARENT_CODES = {
    'Cell membrane': 'SL-0039',
    'Nucleus membrane': 'SL-0182',
    'Host cell membrane': 'SL-0375',
    'Host nucleus membrane': 'SL-0418'
  };

  // Second pass: process only membrane entries and find their parents
  const membraneEntries = allEntries
    .filter(entry => {
      // Filter out the special cases that we don't want in the output
      return entry.name.endsWith(' membrane') && 
             entry.name !== 'Cell membrane' && 
             entry.name !== 'Nucleus membrane' &&
             entry.name !== 'Host cell membrane' &&
             entry.name !== 'Host nucleus membrane';
    })
    .reduce((acc, membraneEntry) => {
      const entryName = membraneEntry.name;
      let parentName = null;
      let parentCode = null;

      // Handle special cases for inner/outer membranes
      if (entryName === 'Cell inner membrane' || entryName === 'Cell outer membrane') {
        parentName = 'Cell membrane';
        parentCode = 'SL-0039';
      } else if (entryName === 'Nucleus inner membrane' || entryName === 'Nucleus outer membrane') {
        parentName = 'Nucleus membrane';
        parentCode = 'SL-0182';
      } else if (entryName === 'Host cell inner membrane' || entryName === 'Host cell outer membrane') {
        parentName = 'Host cell membrane';
        parentCode = 'SL-0375';
      } else if (entryName === 'Host nucleus inner membrane' || entryName === 'Host nucleus outer membrane') {
        parentName = 'Host nucleus membrane';
        parentCode = 'SL-0418';
      } else {
        // For other entries, first try to find a parent by removing ' membrane' suffix
        // For other entries, first try to find a parent by removing ' membrane' suffix
        const baseName = entryName.replace(/ membrane$/, '');
        const parentEntry = entryMap.get(baseName);
        
        if (parentEntry) {
          parentName = baseName;
          parentCode = parentEntry.code;
        } else if (entryName.includes(' inner membrane') || entryName.includes(' outer membrane')) {
          // If it's an inner/outer membrane, try to find parent by removing ' inner/outer membrane'
          const simpleBaseName = entryName.replace(/ (inner|outer) membrane$/, '');
          const simpleParent = entryMap.get(simpleBaseName);
          if (simpleParent) {
            parentName = simpleBaseName;
            parentCode = simpleParent.code;
          }
        }
      }
      
      acc[membraneEntry.code] = {
        name: entryName,
        parentName: parentName,
        parentCode: parentCode
      };
      
      return acc;
    }, {});

  // Generate the output content
  const outputContent = `// This file was auto-generated from ${uniprotVocabUrl}
// Contains membrane-related entries from the UniProt subcellular location vocabulary
// Generated on ${new Date().toISOString()}

const membraneCodes = ${JSON.stringify(membraneEntries, null, 2)};

export default membraneCodes;`;

  // Write to output file
  fs.writeFileSync(outputFile, outputContent, 'utf8');
  console.log(`Successfully extracted ${membraneEntries.length} membrane entries with parent information to ${outputFile}`);
}

// Run the processing
processVocabulary().catch(error => {
  console.error('Error processing vocabulary:', error);
  process.exit(1);
});
