
import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserData } from "../user-data";

const userDataQuery = (username) => ({
  queryKey: ['userData', 'friends', username],
  queryFn: async () => {
    const data = await fetchUserData(username);
    if (!data) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return data;
  },
});

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const query = userDataQuery(params.username);
    return (
      queryClient.getQueryData(query) ?? (await queryClient.fetchQuery(query))
    );
  };


  export default function GrabUserResults() {
    const { username } = useParams();
    const userData = useQuery(userDataQuery(username));
    return (
      <div>
        <h1>Grab User Results</h1>
        <p>
          <b>Username:</b> {username}
        </p>
        <p>
          <b>Friends:</b> {userData.data.length}
        </p>
      </div>
    );
  }
