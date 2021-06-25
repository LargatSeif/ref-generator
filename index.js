const fs = require("fs");
const csvToJson = require("csvtojson");
var argv = require("minimist")(process.argv.slice(2));
var env = [];
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
  console.log(`Processed file name : ./input/companies-${e}.csv`);
  console.log(`Processing ...`);

  const groupBy = (prop) => (data) => {
    return data.reduce((dict, item) => {
      const { [prop]: _, ...rest } = item;

      dict[item[prop]] = [...(dict[item[prop]] || []), rest];
      return dict;
    }, {});
  };
  csvToJson({
    delimiter: ";",
  })
    .fromFile(`./input/companies-${e}.csv`)
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
});
