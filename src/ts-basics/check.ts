import "dotenv/config";

async function main(): Promise<void> {
  const apiUrl = process.env.TOOLSHOP_API_URL?.trim();

  if (!apiUrl) {
    console.log("Missing: TOOLSHOP_API_URL");
    console.log("Copy .env.example to .env and fill in the values.");
    process.exit(1);
  }

  const url = `${apiUrl.replace(/\/+$/, "")}/products`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    console.log("HTTP status: none (the request did not reach the Toolshop API)");
    console.log("Hint: check your internet connection and TOOLSHOP_API_URL in .env.");
    process.exit(1);
  }

  if (!response.ok) {
    console.log(`HTTP status: ${response.status}`);
    console.log(hintFor(response.status));
    process.exit(1);
  }

  // The products endpoint is paginated: "total" is the number of products,
  // "data" holds only the current page.
  const body = (await response.json()) as { total?: unknown; data?: unknown };
  const count =
    typeof body.total === "number"
      ? body.total
      : Array.isArray(body.data)
        ? body.data.length
        : 0;

  console.log(`Node version: ${process.version}`);
  console.log(`HTTP status: ${response.status}`);
  console.log(`Products: ${count}`);
  console.log("PASS");
}

function hintFor(status: number): string {
  if (status === 404) {
    return "Hint: the products endpoint was not found. Check TOOLSHOP_API_URL in .env.";
  }
  if (status === 429) {
    return "Hint: too many requests. Wait a minute and try again.";
  }
  if (status >= 500) {
    return "Hint: the Toolshop API is having problems. Try again later.";
  }
  return "Hint: the request failed. Check TOOLSHOP_API_URL in .env.";
}

main();
