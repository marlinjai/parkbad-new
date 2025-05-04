// Simple test script for the opening hours API
const fetch = require('node-fetch');

async function testOpeningHours() {
  try {
    console.log('Testing opening hours API...');
    
    // Adjust this URL to your actual development server
    const response = await fetch('http://localhost:3000/api/openingHours');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.openingHours && data.openingHours.length > 0) {
      console.log('\nOpening hours:');
      data.openingHours.forEach(day => {
        console.log(`${day.dayName}: ${day.hours}`);
      });
    } else {
      console.log('No opening hours data found.');
    }
  } catch (error) {
    console.error('Error testing opening hours API:', error);
  }
}

testOpeningHours(); 