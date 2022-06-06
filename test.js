const utilities = require("./src/helpers/utilities");
const { read } = require("./src/lib/data");

// read("users", "01913055200", (err, data) => {
//   console.log(err);
//   console.log(data);
// });

let hash = utilities.hash("nehal");
let hash2 = utilities.hash(hash);
console.log(hash2);
