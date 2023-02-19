export async function apiFetch(url, body, verb) {
  const response = await fetch(url, {
    method: verb,
    headers: { "Content-Type": "application/json" },
    body: body,
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function apiFetchNoBody(url, verb) {
  const response = await fetch(url, {
    method: verb,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();

  return data;
}
