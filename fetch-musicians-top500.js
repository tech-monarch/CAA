const fs = require("fs");
(async function () {
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
  // Fetch top artists from Deezer API
  const url = "https://api.deezer.com/chart/0/artists";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Deezer API error: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  const musicians = [];
  if (data.data && Array.isArray(data.data)) {
    for (const artist of data.data) {
      musicians.push({
        name: artist.name,
        id: artist.id,
        image: artist.picture_xl || artist.picture_big || artist.picture,
        link: artist.link,
      });
    }
  }
  fs.writeFileSync("musicians-top500.json", JSON.stringify(musicians, null, 2));
  console.log("Done.");
})();
