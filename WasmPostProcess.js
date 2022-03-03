const fs = require("fs");

console.log("\nPost processing...");

const typesFile = "src/RayTracing/rs-ray-tracing/pkg/rs_ray_tracing.d.ts";

fs.readFile(typesFile, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const lines = data.toString().split("\n");

  let start = 0;
  let end = 0;

  lines.forEach((line, index) => {
    line = line.trim();

    if (line === "// HEY PARSER, SPLIT IT HERE!") {
      end = index;
    } else if (line === "/* eslint-disable */") {
      start = index;
    }
  })

  const filteredLines = lines.filter((_, index) => index <= start || index >= end);
  const newData = filteredLines.join("\n");

  fs.writeFile(typesFile, newData, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("\nCompleted :)");
  });
});
