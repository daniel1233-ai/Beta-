document.addEventListener("DOMContentLoaded", function () {
  const width = 960;
  const height = 600;

  const colorScale = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5])
    .range(["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#1a9850", "#ccc"]);  // Red to green, with gray for no data

  const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  d3.csv("updated_combined_data_with_russia.csv").then(data => {
    const stabilityData = new Map(data.map(d => [d.Country, +d.StabilityEstimate]));

    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(geoData => {
      svg.selectAll("path")
         .data(geoData.features)
         .enter()
         .append("path")
         .attr("d", d3.geoPath().projection(d3.geoMercator().scale(130).translate([width / 2, height / 1.5])))
         .attr("fill", d => {
           const stability = stabilityData.get(d.properties.name);
           return stability !== undefined ? colorScale(stability) : "#ccc";
         })
         .attr("stroke", "#333")
         .on("mouseover", (event, d) => {
           d3.select(event.target).attr("stroke", "#000");
           console.log("Hovered over:", d.properties.name);
         })
         .on("mouseout", event => {
           d3.select(event.target).attr("stroke", "#333");
         })
         .on("click", (event, d) => showCountryData(d.properties.name));
    }).catch(error => console.error("Error loading GeoJSON:", error));
  }).catch(error => console.error("Error loading CSV:", error));

  function showCountryData(country) {
    // Data extraction logic remains as in previous versions
    // With separate graphs for Arms and Stability
  }
});
