var express = require("express");
var { createHandler } = require("graphql-http/lib/use/express");
var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

   type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
    hello: String
    quoteOfTheDay:String
    random:Float
  }
`);



// The root provides a resolver function for each API endpoint
var root = {
  rollDice({ numDice, numSides }) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },

  hello() {
    return "Hello world!";
  },
  quoteOfTheDay: ()=>'take it easy',
  random: ()=> Math.random()

};

var app = express();
var { ruruHTML } = require("ruru/server");

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Start the server at port
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");

// {
//   rollDice(numDice: 3, numSides: 6)
//   hello
// }
