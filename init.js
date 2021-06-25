const fs = require("fs");
if (fs.existsSync("./output")) {
  console.log("Output directory exists!");
} else {
  console.log("Output directory not found.");
  fs.mkdir("./output", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Output directory successfully created.");
    }
  });
}

if (fs.existsSync("./input")) {
  console.log("Input directory exists!");
} else {
  console.log("Input directory not found.");
  fs.mkdir("./input", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Input directory successfully created.");
    }
  });
}
