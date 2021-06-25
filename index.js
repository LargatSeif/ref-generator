const fs = require("fs");
const csvToJson = require("csvtojson");
var argv = require("minimist")(process.argv.slice(2));
var env = [];
var type = argv.type || 'companies';
var attr = argv.attr || 'name';

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
  const file_path = `./input/${type}-${e}.csv`;
  if (fs.existsSync(file_path)) {
    //file exists
    csvToJson({
      delimiter: ";",
    })
      .fromFile(file_path)
      .then((items) => {
        const result = Object.entries(groupBy(attr)(items)).map(
          ([key, value]) => ({ name: key, children: value })
        );
  
        var res = [];
        result.forEach((item) => {
          if (item.children.length > 1) {
            let list = item.children.map((c) => +c.id);
            let max = Math.max(...list);
            item.id = max;
            item.doubles = list.filter((e) => e != max);
            delete item.name;
            delete item.children;
          } else {
            item.id = item.children[0].id;
            item.doubles = [];
            delete item.name;
            delete item.children;
          }
          res.push(item);
          // item.children
        });
  
        let only_duplicated_data = res.filter((c) => c.doubles.length > 0);
        only_duplicated_data.sort((a, b) => {
          return 1 * (a.doubles.length - b.doubles.length);
        });
        fs.writeFileSync(
          `./output/${type}/ref_duplicated_${type}_${e}.json`,
          JSON.stringify(only_duplicated_data, null, 2)
        );
      });
  }else{
    console.error('No files found in the input directory !!!');
  }
  
});
