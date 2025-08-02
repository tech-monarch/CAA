const fs = require("fs");

// Define the files and their price ranges
const files = [
  { name: "sports-top500.json", minPrice: 100, maxPrice: 1200 },
  { name: "musicians-top500.json", minPrice: 150, maxPrice: 1500 },
  { name: "actors-top500.json", minPrice: 200, maxPrice: 2000 },
];

// Weighted random function to favor lower prices
function getWeightedRandomPrice(min, max) {
  // 70% chance for lower range (min to 60% of max)
  // 30% chance for higher range (60% of max to max)
  const midPoint = min + (max - min) * 0.6;

  if (Math.random() < 0.7) {
    return Math.floor(Math.random() * (midPoint - min + 1)) + min;
  } else {
    return Math.floor(Math.random() * (max - midPoint + 1)) + midPoint;
  }
}

// Function to generate random price within range (keeping for compatibility)
function getRandomPrice(min, max) {
  return getWeightedRandomPrice(min, max);
}

// Process each file
files.forEach((fileConfig) => {
  try {
    console.log(`Processing ${fileConfig.name}...`);

    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(fileConfig.name, "utf8"));

    // Update each entry with a random price
    data.forEach((item) => {
      item.price = getRandomPrice(fileConfig.minPrice, fileConfig.maxPrice);
    });

    // Write the updated data back to the file
    fs.writeFileSync(fileConfig.name, JSON.stringify(data, null, 2));

    console.log(`✓ Updated ${fileConfig.name} with ${data.length} entries`);
    console.log(
      `  Price range: $${fileConfig.minPrice.toLocaleString()} - $${fileConfig.maxPrice.toLocaleString()}`
    );
  } catch (error) {
    console.error(`Error processing ${fileConfig.name}:`, error.message);
  }
});

console.log("\nAll files have been updated with random prices!");
