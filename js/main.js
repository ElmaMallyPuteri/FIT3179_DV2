// Draws every chart on the page.
// Each Vega-Lite spec is a hand-readable JSON file in /specs. It is rendered into the empty
// <div id="cNN"> in index.html with the matching number.

const charts = [
  "01_choropleth_trips_per_1000",
  "02_heatmap_quarter_state",
  "03_line_trips_over_time",
  "04_symbol_map_nights",
  "05_waffle_purpose",
  "06_stacked_bar_commercial_parks",
  "07_tile_grid_trip_length",
  "08_dot_map_sites",
  "09_route_map",
  "10_bump_rank",
  "11_parallel_coordinates",
];

function drawCharts() {
  charts.forEach((id) => {
    const target = "#c" + id.slice(0, 2); // "01_choropleth..." -> "#c01"
    vegaEmbed(target, "specs/" + id + ".json", {
      actions: false, // hide the export menu
      // Chart 08 draws ~9,800 dots, so it uses canvas (faster); the rest use SVG (sharper).
      renderer: id.startsWith("08") ? "canvas" : "svg",
    }).catch((err) => {
      console.error(id, err);
      document.querySelector(target).textContent = "This chart could not be loaded.";
    });
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
