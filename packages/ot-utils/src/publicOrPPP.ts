import { PPP_API_URL } from "@ot/constants";

export const isOnPublic = () => {
  const windowLocation = window.location.href;
  // escape validation on dev mode
  if (import.meta.env.DEV) return false;
  return !windowLocation.includes("partner");
};

export async function testPPPaccess() {
  return fetch(PPP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationName: "DataVersion",
      variables: {},
      query: `query DataVersion {
        meta {
          dataVersion {
            month
            year
            __typename
          }
          __typename
    
      }
    }`,
    }),
  })
}