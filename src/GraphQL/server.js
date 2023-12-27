import { ApolloServer, gql } from "apollo-server";

// GraphQL에 알려줬던 형태를 따라야 한다.
const tweets = [
  {
    id:"1",
    text:"first one!",
  },
  {
    id:"2",
    text:"second one!",
  }
]

// type Query는 restAPI에서 이 형태로 만든것과 같다
// GET /text

// 사용자가 request할 수 있도록 하고 싶은 모든 건 type Query안에 있어야한다.
// Scalar type, non-scalar type 혹은 root type은 graphql에 built-in 내장되어 있는 것 (String,Int,Boolean type존재)
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }
  type Mutation {
      postTweet(text:String!, userId: ID!): Tweet!
      deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets(){
      return tweets;
    },
    tweet(root, {id}) {
      return tweets.find((tweet) => tweet.id === id);
    }
  },
}

const server = new ApolloServer({ typeDefs, resolvers });

// listen() 은 Promise이다.
server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});


// type User {
//   id: ID
//   username: String
// }
// type Tweet {
//   id: ID
//   text: String
//   author: User
// }
// type Query {
//   allTweets: [Tweet]
//   tweet(id: ID): Tweet
// }