import { Client, auth } from 'cassandra-driver';

const client = new Client({
  contactPoints: ["34.49.185.221"],
  localDataCenter: "datacenter1",
  keyspace: "build_zone",
  authProvider: new auth.PlainTextAuthProvider(process.env.CASSANDRA_USER || 'default_secret', process.env.CASSANDRA_PASSWORD|| 'default_password')
});

client.connect()
  .then(() => {
    console.log("Connected to Cassandra");
  })
  .catch((error: Error) => {
    console.error("Error connecting to Cassandra", error);
  });

export default client;
