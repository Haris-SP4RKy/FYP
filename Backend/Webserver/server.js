

require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const path = require( 'path');

const expressSanitizer = require('express-sanitizer');
const indexroutes = require('./routes/index');
const http = require('http');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const responseTime = require('response-time');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./graphql')
const { authMiddleware } = require('./middleware/auth-middleware.js')

const app = express();
app.use(authMiddleware)

app.disable('x-powered-by');
app.use(express.json());
app.use(helmet({
	frameguard: {
		action: 'deny'
	}
}));

app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'none'"],
		styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
	}
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(expressSanitizer());
app.use(responseTime());

app.use(cors());
app.use((req, res, next) => {
	res.header('Content-Security-Policy', "frame-ancestors 'none';");
	next();
});

app.get('/', (req, res) => res.status(200).send({ server: 'public' }));

app.use('/api/services/v1', indexroutes);
// app.use('/api/services', services);



const server = new ApolloServer({
	typeDefs,
	resolvers,
});
(async () => {
	await server.start();

	app.use('/graphql', expressMiddleware(server, {
		context: async ({ req }) => ({ token: req.headers.token, user: req.user,Authenticated:req.isAuth,decoded:req.decoded })
	}));



	// server.applyMiddleware({app})
	// (async () => {
	// 	const { url } =  await startStandaloneServer(server, {
	// 		// Note: This example uses the `req` argument to access headers,
	// 		// but the arguments received by `context` vary by integration.
	// 		// This means they vary for Express, Fastify, Lambda, etc.

	// 		// For `startStandaloneServer`, the `req` and `res` objects are
	// 		// `http.IncomingMessage` and `http.ServerResponse` types.
	// 		context: async ({ req, res }) => {
	// 		  // Get the user token from the headers.
	// 		  const token = req.headers.authorization || '';

	// 		  // Try to retrieve a user with the token
	// 		  const user = await getUser(token);

	// 		  // Add the user to the context
	// 		  return { user };
	// 		},
	// 	  });

	// 	  console.log(`🚀 Server listening at: ${url}`);
	// })();

	const port = process.env.PORT || 3000;
	// const httpServer = http.createServer(app);
	// httpServer.listen(port);
	// httpServer.setTimeout(9000000);
	// console.log(`server listening port--->${port}`);
	app.listen(port, () => console.log(`🚀 Server Listening on port ${port}...`));




	app.use((req, res, next) => {
		res.status(200).send('SORRY REQUESTED SERVICE NOT FOUND.....!');
	});

})();



