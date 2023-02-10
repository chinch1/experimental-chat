import { Form, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { createSupabaseServerClient } from "~/utils/supabase.server";
import { Login } from "~/components/Login";

// Fetching data from the server
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.from("messages").select();
  return json({ messages: data ?? [] }, { headers: response.headers });
};

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const formData = await request.formData();
  const { message } = Object.fromEntries(formData);

  await supabase.from("messages").insert({ content: String(message) });

  return json({ message: "ok" }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h1>New Chat</h1>
      <Login />

      <Form
        method="post"
        style={{ display: "flex", flexDirection: "row", gap: "12px" }}
      >
        <input type="text" name="message" />
        <button type="submit">Send Message</button>
      </Form>

      <pre>
        {JSON.stringify(
          messages.map((message) => message.content),
          null,
          2
        )}
      </pre>
    </main>
  );
}
