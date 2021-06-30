const fs = require("fs");
const csvToJson = require("csvtojson");
var argv = require("minimist")(process.argv.slice(2));
var env = [];
var type = argv.type || "companies";
var attr = argv.attr || "name";

switch (argv.env) {
  case "all":
    env = ["dev", "preprod", "prod"];
    break;
  default:
    env.push(argv.env);
    break;
}
function groupBys(array, f) {
  var groups = {};
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
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

  const file_path = `./input/${type}-${e}.csv`;
  if (fs.existsSync(file_path)) {
    //file exists
    csvToJson({
      delimiter: ";",
    })
      .fromFile(file_path)
      .then((items) => {
        if (type == "agencies") {
          var result = groupBys(items, (item) => {
            return [item.company_id, item.ref];
          });

          let res = [];
          result.map((a) => {
            if (a instanceof Array && a.length > 1) {
              let item;
              let list = a.map((c) => +c.id);
              let max = Math.max(...list);

              res.push({
                id: max,
                doubles: list.filter((e) => e != max),
              });
            }
          });

          let only_duplicated_data = res.filter((c) => c.doubles.length > 0);
          only_duplicated_data.sort((a, b) => {
            return 1 * (a.doubles.length - b.doubles.length);
          });
          fs.writeFileSync(
            `./output/${type}/ref_duplicated_${type}_${e}.json`,
            JSON.stringify(only_duplicated_data, null, 2)
          );
        } else {
          var result = groupBys(items, (item) => {
            return [item.ref, item.erp_id];
          });

          let res = [];
          result.map((a) => {
            if (a instanceof Array && a.length > 1) {
              let item;
              let list = a.map((c) => +c.id);
              let max = Math.max(...list);

              res.push({
                id: max,
                doubles: list.filter((e) => e != max),
              });
            }
          });

          let only_duplicated_data = res.filter((c) => c.doubles.length > 0);
          only_duplicated_data.sort((a, b) => {
            return 1 * (a.doubles.length - b.doubles.length);
          });
          fs.writeFileSync(
            `./output/${type}/ref_duplicated_${type}_${e}.json`,
            JSON.stringify(only_duplicated_data, null, 2)
          );
        }
      });
  } else {
    console.error("No files found in the input directory !!!");
  }
});
