/**
 * Quick test for name masking improvements
 * Tests that company names, product names, and tech terms are NOT masked
 * while actual person names ARE masked
 */

import { maskFullNames, validateNameMasking } from './namesMasking';

console.log('=== Name Masking Tests ===\n');

// Test 1: Company names should NOT be masked
const test1 = "We worked with Goldman Sachs and Morgan Stanley on this project.";
const result1 = maskFullNames(test1);
console.log('Test 1 - Company Names:');
console.log('Input:', test1);
console.log('Output:', result1);
console.log('✓ Pass:', result1 === test1, '\n');

// Test 2: Product names should NOT be masked
const test2 = "Using Microsoft Office and Google Analytics for our analysis.";
const result2 = maskFullNames(test2);
console.log('Test 2 - Product Names:');
console.log('Input:', test2);
console.log('Output:', result2);
console.log('✓ Pass:', result2 === test2, '\n');

// Test 3: Technology terms should NOT be masked
const test3 = "Our Deep Learning and Natural Language processing solutions.";
const result3 = maskFullNames(test3);
console.log('Test 3 - Technology Terms:');
console.log('Input:', test3);
console.log('Output:', result3);
console.log('✓ Pass:', result3 === test3, '\n');

// Test 4: Person names WITH strong indicators SHOULD be masked
const test4 = "Contact: John Smith for more information.";
const result4 = maskFullNames(test4);
const expected4 = "Contact: John **** for more information.";
console.log('Test 4 - Person Names with Indicator:');
console.log('Input:', test4);
console.log('Output:', result4);
console.log('Expected:', expected4);
console.log('✓ Pass:', result4 === expected4, '\n');

// Test 5: Person names with titles SHOULD be masked
const test5 = "Dr. Sarah Johnson presented the research.";
const result5 = maskFullNames(test5);
const expected5 = "Dr. Sarah **** presented the research.";
console.log('Test 5 - Person Names with Title:');
console.log('Input:', test5);
console.log('Output:', result5);
console.log('Expected:', expected5);
console.log('✓ Pass:', result5 === expected5, '\n');

// Test 6: Industry terms should NOT be masked
const test6 = "Investment Banking and Private Equity sectors are growing.";
const result6 = maskFullNames(test6);
console.log('Test 6 - Industry Terms:');
console.log('Input:', test6);
console.log('Output:', result6);
console.log('✓ Pass:', result6 === test6, '\n');

// Test 7: Location names should NOT be masked
const test7 = "Offices in Salt Lake City and Hong Kong.";
const result7 = maskFullNames(test7);
console.log('Test 7 - Location Names:');
console.log('Input:', test7);
console.log('Output:', result7);
console.log('✓ Pass:', result7 === test7, '\n');

// Test 8: Company context ("at Company") should NOT be masked
const test8 = "Working at Apple Computer on new features.";
const result8 = maskFullNames(test8);
console.log('Test 8 - Company Context:');
console.log('Input:', test8);
console.log('Output:', result8);
console.log('✓ Pass:', result8 === test8, '\n');

// Test 9: Person with job title context SHOULD be masked
const test9 = "Sales Manager John Smith handled the account.";
const result9 = maskFullNames(test9);
const expected9 = "Sales Manager John **** handled the account.";
console.log('Test 9 - Person with Job Title:');
console.log('Input:', test9);
console.log('Output:', result9);
console.log('Expected:', expected9);
console.log('✓ Pass:', result9 === expected9, '\n');

// Test 10: Validation should pass for business terms
const validation1 = validateNameMasking("Goldman Sachs and Morgan Stanley");
console.log('Test 10 - Validation of Business Terms:');
console.log('✓ Pass:', validation1.isValid, '\n');

console.log('=== All Tests Complete ===');
