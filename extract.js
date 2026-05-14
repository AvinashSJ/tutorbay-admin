const fs = require("fs");
const data = JSON.parse(fs.readFileSync("test-results.json", "utf8"));

for (const suite of data.testResults) {
  const name = suite.name.replace(/.*[\\/]src/, "src");
  for (const a of suite.assertionResults) {
    if (a.status === "passed") continue;
    const loc = a.ancestorTitles.join(" > ");
    const msg = a.failureMessages[0] || "";
    const firstLine = msg.split("\n")[0];
    console.log(`FAIL  ${name}  ${loc} > ${a.title}`);
    console.log(`      ${firstLine}`);
    console.log();
  }
}
