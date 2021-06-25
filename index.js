const fs = require("fs");
const csvToJson = require("csvtojson");
var argv = require("minimist")(process.argv.slice(2));
var env = [];

if (fs.existsSync('./output')) {
  console.log('Output directory exists!');
} else {
  console.log('Output directory not found.');
  fs.mkdir("./output", function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("Output directory successfully created.")
    }
  })
}

if (fs.existsSync('./input')) {
  console.log('Input directory exists!');
} else {
  console.log('Input directory not found.');
  fs.mkdir("./input", function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("Input directory successfully created.")
    }
  })
}

switch (argv.env) {
  case "all":
    env = ["dev", "preprod", "prod"];
    break;
  default:
    env.push(argv.env);
    break;
}
env.forEach((e) => {
  console.log(`Selected environement : ${e}`);

  const groupBy = (prop) => (data) => {
    return data.reduce((dict, item) => {
      const { [prop]: _, ...rest } = item;

      dict[item[prop]] = [...(dict[item[prop]] || []), rest];
      return dict;
    }, {});
  };
  const file_path = `./input/companies-${e}.csv`;
  if (fs.existsSync(file_path)) {
    //file exists
    csvToJson({
      delimiter: ";",
    })
      .fromFile(file_path)
      .then((companies) => {
        const result = Object.entries(groupBy("name")(companies)).map(
          ([key, value]) => ({ name: key, children: value })
        );
  
        var res = [];
        result.forEach((company) => {
          if (company.children.length > 1) {
            let list = company.children.map((c) => +c.id);
            let max = Math.max(...list);
            company.id = max;
            company.doubles = list.filter((e) => e != max);
            delete company.name;
            delete company.children;
          } else {
            company.id = company.children[0].id;
            company.doubles = [];
            delete company.name;
            delete company.children;
          }
          res.push(company);
          // company.children
        });
  
        let only_duplicated_data = res.filter((c) => c.doubles.length > 0);
        only_duplicated_data.sort((a, b) => {
          return 1 * (a.doubles.length - b.doubles.length);
        });
        fs.writeFileSync(
          `./output/ref_duplicated_companies_${e}.json`,
          JSON.stringify(only_duplicated_data, null, 2)
        );
      });
  }else{
    console.error('No files found in the input directory !!!');
  }
  
});
