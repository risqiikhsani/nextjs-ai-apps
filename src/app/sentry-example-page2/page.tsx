import React from "react";

const URL = process.env.NEXT_PUBLIC_API_URL
export default async function Page() {
  let data;

  try {
    const response = await fetch(`${URL}/api/sentry-example-api2`);
    data = await response.json();
  } catch (error) {
    console.error(error);
  }
  return (
    <div>
      Page
      This page will return error.
      {data && JSON.stringify(data)}
    </div>
  );
}
