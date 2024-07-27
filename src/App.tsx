import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";

import type { Schema } from "../amplify/data/resource";
import { EventContainer } from "./components/event-container";

const client = generateClient<Schema>();

function App() {
  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  // const createEvent = () => {
  //   // fixme: test purpose only, don't allow users to create events for now
  //   client.models.Event.create({
  //     name: "Test event",
  //     host: "Test host",
  //     description: "Test description",
  //     locationDescription: "Test location",
  //     rsvp: false,
  //     source: "https://example.com",
  //     website: "https://example.com",
  //     types: ["test"],
  //     location: { lat: 0, lon: 0 },
  //     dates: [new Date("1995-12-17T03:24:00").toISOString().split("T")[0]],
  //     times: [new Date("1995-12-17T03:24:00").toISOString().split("T")[1]],
  //   });
  // };

  return (
    <main>
      <h1>
        First draft of amplify frontend. Should work with TODOs since
        amplify/data/resources has TODO model
      </h1>
      <EventContainer client={client} />
      {/* <FeedbackForm /> */}
      <h1>App</h1>
      {/* <button onClick={createEvent}>+ new</button> */}
      {/* <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul> */}
      {/* <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div> */}
    </main>
  );
}

export default App;
