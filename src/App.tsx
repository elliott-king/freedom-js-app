import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";

import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  useEffect(() => {
    client.models.Event.observeQuery().subscribe({
      next: (data) => setEvents([...data.items]),
    });
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  const createEvent = () => {
    // fixme: test purpose only, don't allow users to create events for now
    client.models.Event.create({
      name: "Test event",
      host: "Test host",
      description: "Test description",
      location_description: "Test location",
      rsvp: false,
      source: "https://example.com",
      website: "https://example.com",
      types: ["test"],
      location: { lat: 0, long: 0 },
      dates: [new Date("1995-12-17T03:24:00").toISOString().split("T")[0]],
      times: [new Date("1995-12-17T03:24:00").toISOString().split("T")[1]],
    });
  };

  return (
    <main>
      <h1>
        First draft of amplify frontend. Should work with TODOs since
        amplify/data/resources has TODO model
      </h1>
      {/* <EventContainer />
      <FeedbackForm /> */}
      <h1>Events</h1>
      <button onClick={createEvent}>+ new</button>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
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
