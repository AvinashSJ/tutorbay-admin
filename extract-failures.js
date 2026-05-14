const fs = require("fs");
const data = JSON.parse(fs.readFileSync("test-results.json", "utf8"));
for (const suite of data.testResults) {
  const failed = suite.assertionResults.filter(a => a.failureMessages.length > 0);
  if (failed.length === 0) continue;
  const name = suite.name.replace(/.*[\\/]src/, "src");
  console.log(`\n=== ${name} ===`);
  for (const a of failed) {
    console.log(`  ${a.ancestorTitles.join(" > ")} > ${a.title}`);
    const firstLine = a.failureMessages[0].split("\n")[0];
    console.log(`    ${firstLine}`);
  }
}
