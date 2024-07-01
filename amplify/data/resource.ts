import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.guest()]),
  Event: a
    .model({
      name: a.string().required(),
      host: a.string().required(),
      description: a.string().required(),
      location_description: a.string().required(),
      rsvp: a.boolean().required(),

      source: a.url().required(),
      website: a.url().required(),

      // todo: can this be enum array based on EVENT_TYPES?
      types: a.string().array(),

      location: a.customType({
        lat: a.float().required(),
        long: a.float().required(),
      }),

      dates: a.date().array().required(),
      times: a.time().array(),
    }) // TODO: only allow logged-in users access
    .authorization((allow) => [allow.guest().to(["read"])]),
  // .authorization((allow) => [allow.guest()]), // for testing

  EventPhoto: a
    .model({
      eventId: a.id(),
      event: a.belongsTo("Event", "eventId"),
      url: a.url().required(),
    })
    .authorization((allow) => [allow.guest().to(["read"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
