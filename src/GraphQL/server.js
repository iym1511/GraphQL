import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2"
  },
  {
    id: "2",
    text: "second one!",
    userId: "1"
  },
];

let users = [
  {
    id: "1",
    firstName: "moon",
    lastName: "ilyun",
  },
  {
    id: "2",
    firstName:"kim",
    lastName:"jinhye"
  }
]

// type Query는 restAPI에서 이 형태로 만든것과 같다
// GET /text

// 사용자가 request할 수 있도록 하고 싶은 모든 건 type Query안에 있어야한다.
// Scalar type, non-scalar type 혹은 root type은 graphql에 built-in 내장되어 있는 것 (String,Int,Boolean type존재)
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      console.log(id)
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers called!");
      return users
    }
  },
  Mutation: {
    postTweet(root, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({firstName, lastName}){
      return `${firstName} ${lastName}`
    },
  },
  Tweet: {
    author({userId}){
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
  
// listen() 은 Promise이다.
server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
