const fs = require("fs");
require("dotenv").config();
(async function () {
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === "YOUR_TMDB_API_KEY_HERE") {
    throw new Error(
      "TMDb API key is missing. Please set TMDB_API_KEY in a .env file or as an environment variable."
    );
  }
  const startYear = new Date().getFullYear() - 10;
  let actors = [];
  let page = 1;
  const maxPages = 10; // Fetch up to 10 pages (200 actors)
  while (page <= maxPages) {
    const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `TMDb API error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    for (const item of data.results) {
      // Filter by known_for credits in the last 10 years
      const recent =
        item.known_for &&
        item.known_for.some((kf) => {
          if (kf.release_date) {
            const year = parseInt(kf.release_date.slice(0, 4));
            return year >= startYear;
          }
          if (kf.first_air_date) {
            const year = parseInt(kf.first_air_date.slice(0, 4));
            return year >= startYear;
          }
          return false;
        });
      if (recent) {
        actors.push({
          name: item.name,
          image: item.profile_path
            ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
            : null,
        });
      }
    }
    page++;
  }
  fs.writeFileSync("actors-top500.json", JSON.stringify(actors, null, 2));
  console.log("Done.");
})();
