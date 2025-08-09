const fs = require("fs");

(async function () {
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

  const nigerianArtists = [
    "Wizkid",
    "Burna Boy",
    "Ayra Starr",
    "Fireboy Dml",
    "Tems",
    "Bella Shmurda",
    "Davido",
    "Olamide",
    "Chike",
    "Judikay"
  ].map(name => name.toLowerCase());

  let musicians = [];
  let index = 0;
  const limit = 100; // Deezer returns 100 items per page

  while (true) {
    const url = `https://api.deezer.com/chart/0/artists?index=${index}`;
    console.log(`Fetching page starting at index ${index}...`);
    const response = await fetch(url);
    if (!response.ok) break;

    const data = await response.json();
    if (!data.data || data.data.length === 0) break;

    for (const artist of data.data) {
      if (!nigerianArtists.includes(artist.name.toLowerCase())) {
        musicians.push({
          name: artist.name,
          id: artist.id,
          image: artist.picture_xl || artist.picture_big || artist.picture,
          link: artist.link
        });
      }
    }

    index += limit;
  }

  fs.writeFileSync("musicians-top500.json", JSON.stringify(musicians, null, 2));
  console.log(`✅ Done. Saved ${musicians.length} non-Nigerian artists.`);
})();
