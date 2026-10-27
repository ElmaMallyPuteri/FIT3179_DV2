// the file that draws the charts.
// It takes each Vega-Lite spec (a .json file in /specs) and renders it into
// the matching empty <div id="cNN"> in index.html.

// 1. The list of chart spec files (file names without ".json").
//    The first two digits (01, 02, ...) match the div ids: c01, c02, ...
const charts = [
  "01_choropleth_trips",
  "02_heatmap_quarter_state",
  "03_line_trips_over_time",
  "04_symbol_map_nights",
  "05_waffle_purpose",
  "06_slope_commercial_parks",
  "07_tile_grid_trip_length",
  "08_dot_map_sites",
  "09_route_map",
  "10_bump_rank",
  "11_parallel_coordinates",
];

// 2. Loop over every chart and render it with vegaEmbed (from the Vega-Embed library).
charts.forEach((id) => {
  vegaEmbed(
    "#c" + id.slice(0, 2), // target div, e.g. "01_choropleth_trips" -> "#c01"
    "specs/" + id + ".json", // the spec file to load
    {
      actions: false, // hide the "export / view source" menu
      // Chart 08 has ~9,800 dots, so use canvas (faster); all others use SVG (sharper)
      renderer: id.startsWith("08") ? "canvas" : "svg",
    },
  ).catch(console.error); // if one chart fails, log the error and keep going
});
