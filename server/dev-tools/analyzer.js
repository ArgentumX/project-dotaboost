const madge = require("madge");

madge("../src/index.js").then((res) => {
    console.log(res.circularGraph());
});
