const charts = ["01_choropleth_trips","02_heatmap_quarter_state","03_line_trips_over_time","04_symbol_map_nights",
"05_waffle_purpose","06_slope_commercial_parks","07_tile_grid_trip_length","08_dot_map_sites","09_route_map","10_bump_rank","11_parallel_coordinates"];
charts.forEach(id => vegaEmbed("#c" + id.slice(0,2), "specs/" + id + ".json", {actions:false, renderer:(id.startsWith("08")?"canvas":"svg")}).catch(console.error));
