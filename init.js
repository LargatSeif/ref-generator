const fs = require("fs");
if (fs.existsSync("./output/agencies")) {
  console.log("Output agencies directory exists!");
} else {
  console.log("Output agencies directory not found.");
  fs.mkdir("./output/agencies", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Output agencies directory successfully created.");
    }
  });
}

if (fs.existsSync("./output/companies")) {
  console.log("Output companies directory exists!");
} else {
  console.log("Output companies directory not found.");
  fs.mkdir("./output/companies", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Output companies directory successfully created.");
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
