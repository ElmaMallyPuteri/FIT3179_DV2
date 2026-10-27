// Draws every chart on the page.
// Each Vega-Lite spec is a hand-readable JSON file in /specs. It is rendered into the empty
// <div id="cNN"> in index.html with the matching number.
// Fonts, colours and axis styling shared by all charts live in specs/theme.json and are added
// to each spec here, so the chart files only contain what is specific to that chart.

const charts = [
  "01_choropleth_trips_per_1000",
  "02_heatmap_quarter_state",
  "03_bar_sites_per_trip",
  "04_symbol_map_nights",
  "05_waffle_purpose",
  "06_stacked_bar_commercial_parks",
  "07_tile_grid_trip_length",
  "08_dot_map_sites",
  "09_route_site_density",
  "10_bump_rank",
  "11_parallel_coordinates",
  "12_gap_map_nearest_site",
];

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url + " returned " + response.status);
  return response.json();
}

async function drawCharts() {
  const theme = await getJSON("specs/theme.json").catch((err) => {
    console.error("Could not load the shared chart theme", err);
    return {};
  });
  charts.forEach(async (id) => {
    const target = "#c" + id.slice(0, 2); // "01_choropleth..." -> "#c01"
    try {
      const spec = await getJSON("specs/" + id + ".json");
      spec.config = Object.assign({}, theme, spec.config);
      await vegaEmbed(target, spec, {
        actions: false, // hide the export menu
        // Chart 08 draws ~9,800 dots, so it uses canvas (faster); the rest use SVG (sharper).
        renderer: id.startsWith("08") ? "canvas" : "svg",
      });
    } catch (err) {
      console.error(id, err);
      document.querySelector(target).textContent = "This chart could not be loaded.";
    }
  });
}

// Vega measures text as it draws, so wait for the web fonts first (but never for more than 2.5 s).
const fontsReady = document.fonts
  ? Promise.all([
      document.fonts.load('400 12px "Public Sans"'),
      document.fonts.load('700 12px "Public Sans"'),
      document.fonts.load('700 17px "Fraunces"'),
    ])
  : Promise.resolve();
Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 2500))])
  .catch(() => {})
  .then(drawCharts);
