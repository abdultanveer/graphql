const express = require('express');
//const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Connect to MongoDB
 async function connectToDatabase() {
  await client.connect();
  console.log('Connected to MongoDB');
  const db = client.db('graphqlDB');
  const booksCollection = db.collection('books');
  return booksCollection;
}

const  booksCollectionPromise = connectToDatabase();
module.exports = {booksCollectionPromise}

// Define the GraphQL schema
const schema = buildSchema(`
  type Query {
    getBooks: [Book]
  }

  type Book {
    title: String
    author: String
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
  }
`);

// Define the resolvers
const root = {
  getBooks: async () => {
    const booksCollection = await booksCollectionPromise;
    return booksCollection.find().toArray();
  },
  addBook: async ({ title, author }) => {
    const booksCollection = await booksCollectionPromise;
    const newBook = { title, author };
    await booksCollection.insertOne(newBook);
    return newBook;
  },
};

// const app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));

// app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));


// mutation {
//     addBook(title: "1984", author: "George Orwell") {
//       title
//       author
//     }
//   }

//   {
//     getBooks {
//       title
//       author
//     }
//   }
  