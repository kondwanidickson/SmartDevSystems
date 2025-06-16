// require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const app = express.Router();
const { getDocs } = require('firebase/firestore');
const { Users } = require('./config/firebase.js');

app.use(express.json({limit: '10mb', extended: true}));
app.use(express.urlencoded({limit: '10mb', extended: true}));
app.use(cors({ origin: "*" }));

const typeDefs = `
  type Subscription {
    id: String
    uid: String
    name: String 
    subscriptionType: String
  }

  type User {
    id: String
    email: String
  }
  
  input ServiceInput {
    name: String
    package: PackageInput
  }
  
  input PackageInput {
    name: String
    greater: Boolean
    offers: [String]
    price: String
  }

  type Service {
    name: String
    package: Package
  }

  type Package {
    name: String
    greater: Boolean
    offers: [String]
    price: String
  }

  type Payment {
    id: String
    uid: String 
    my_service: Service
    provider: String
    transid: String 
    amount: String
    fullname: String 
    date: String
    _status: Boolean
    url: String
  }

  type Query {
    subscriptions(id: String, uid: String, name: String, subscriptionType: String): [Subscription!]!
    users(id: String, email: String): [User!]!
    payments(id: String, uid: String, my_service: ServiceInput, provider: String, transid: String, amount: String, fullname: String, date: String, _status: Boolean, url: String): [Payment!]!
  }

  type Mutation {
    updatePayment(id: String, _status: Boolean): Payment
    deletePayment(id: String): Payment
  }
`;

const resolvers = {
  Query: {
    users: async (parent, args) => {
      const { id, email } = args;

      let query = await getDocs(Users);
      if (id && id !== "") {
        query = query.docs.filter(doc => doc.id.match(new RegExp(id, "i")));
      }
      
      if (email && email !== "") {
        query = query.docs.filter(doc => doc.data().email.match(new RegExp(email, "i")));
      }

      const data = query.docs.filter(user => user.email !== null || user.email !== undefined);
      return data.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    subscriptions: require('./controllers/subscription').get_subscriptions,
    payments: require('./controllers/payments').get_payments,
  },
  Mutation: {
    updatePayment: require('./controllers/payments').update_payment,
    deletePayment: require('./controllers/payments').delete_payment,
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

async function startServer() {
  await server.start();
  console.log(`Graphql server is running`);

  // api routes
  app.get('/', async (req, res) => {
    res.send('smartdevsystems server is running!')
  });
  app.use('/subscriptions', require('./routes/subscriptions'));
  app.use('/payments', require('./routes/payments'));
  app.use('/apis', require('./routes/apis'));
  app.use('/contact', require('./routes/contact'));
  app.use('/graphql', cors(), express.json(), expressMiddleware(server));
}

// app.listen(5000, '0.0.0.0',
//   function (err, address) {
//     if (err) {
//       console.error(err);
//       process.exit(1);
//     }

//     startServer();
//     console.log(`Your app is listening on port ${process.env.PORT}`);
//   }
// );


startServer();

module.exports = app