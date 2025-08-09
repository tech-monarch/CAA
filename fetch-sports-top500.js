  const fs = require("fs");
  (async function () {
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));
    let sportsPersonalities = [];
    // We'll fetch popular soccer players as an example (can be extended to other sports)
    // TheSportsDB free API key is 123
    const url =
      "https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=";
    // Example: fetch top players by iterating through popular first letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const seen = new Set();
    for (const letter of letters) {
      const response = await fetch(url + letter);
      if (!response.ok) continue;
      const data = await response.json();
      if (!data.player) continue;
      for (const player of data.player) {
        if (!player.strPlayer || seen.has(player.strPlayer)) continue;
        seen.add(player.strPlayer);
        sportsPersonalities.push({
          name: player.strPlayer,
          image: player.strCutout || null,
          sport: player.strSport || null,
          team: player.strTeam || null,
        });
      }
    }
    fs.writeFileSync(
      "sports-top500.json",
      JSON.stringify(sportsPersonalities, null, 2)
    );
    console.log(`Fetched ${sportsPersonalities.length} players.`);
  })();
