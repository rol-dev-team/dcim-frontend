import { useEffect, useState } from "react";
import { ablyAPI } from "./../api/ablyAPI";

export const AblyConnections = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ablyAPI.connection.once("connected", () => {
      console.log("Connected to Ably!");
      console.log("Client ID:", ablyAPI.auth.clientId);
    });
    const channel = ablyAPI.channels.get("public:sensor-channel");
    channel.subscribe("event_name", (message) => {
      //   setMessages((prev) => [...prev, message.data]);
      console.log(JSON.stringify(message.data.comment)); // Log the data to inspect its structure
      setMessages(message.data);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      {messages ? (
        // Check if `messages.comment` is available and render it
        <div>
          {messages.comment
            ? JSON.stringify(messages.comment, null, 2)
            : "No comment found"}
        </div>
      ) : (
        <div>Loading...</div> // Loading state while data is being fetched
      )}
    </div>
  );
  //   return (
  //     <div>
  //        <h1>Live Comments</h1>
  //       <ul>
  //         {messages.map((msg, index) => (
  //           <li key={index}>{msg.comment}</li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
};
