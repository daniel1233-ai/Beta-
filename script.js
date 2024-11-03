document.addEventListener("DOMContentLoaded", function () {
  const width = 960;
  const height = 600;

  // Define the color scale for political stability
  const colorScale = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5])
    .range(["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#1a9850", "#cccccc"]);  // Red to green, gray for no data

  const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  // Load data and map
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
           return stability !== undefined ? colorScale(stability) : "#cccccc";
         })
         .attr("stroke", "#333")
         .on("mouseover", (event, d) => {
           d3.select(event.target).attr("stroke", "#000");
         })
         .on("mouseout", event => {
           d3.select(event.target).attr("stroke", "#333");
         })
         .on("click", (event, d) => showCountryData(d.properties.name));

      // Create color legend
      createColorLegend();
    }).catch(error => console.error("Error loading GeoJSON:", error));
  }).catch(error => console.error("Error loading CSV:", error));

  function createColorLegend() {
    const legendData = [
      { color: "#d73027", text: "Very Unstable" },
      { color: "#fc8d59", text: "Unstable" },
      { color: "#fee08b", text: "Moderate" },
      { color: "#d9ef8b", text: "Stable" },
      { color: "#1a9850", text: "Very Stable" },
      { color: "#cccccc", text: "No Data" }
    ];

    const legend = d3.select("#color-legend")
                     .append("svg")
                     .attr("width", 400)
                     .attr("height", 50)
                     .selectAll("g")
                     .data(legendData)
                     .enter()
                     .append("g")
                     .attr("transform", (d, i) => `translate(${i * 60}, 0)`);

    legend.append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", d => d.color);

    legend.append("text")
          .attr("x", 25)
          .attr("y", 15)
          .text(d => d.text)
          .style("font-size", "12px")
          .style("fill", "#333");
  }

  function showCountryData(country) {
    // Placeholder function for clicking on a country; update as needed
  }
});
