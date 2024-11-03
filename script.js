// Load the updated data file
d3.csv("updated_combined_data_with_russia.csv").then(data => {

  const width = 960;
  const height = 600;

  // Define a color scale for political stability, ensuring a clear gradient
  const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([1, 5]);

  const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  // Tooltip for country hover info
  const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("display", "none");

  // Load world map GeoJSON data
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(geoData => {

    // Draw the map
    svg.selectAll("path")
       .data(geoData.features)
       .enter()
       .append("path")
       .attr("d", d3.geoPath().projection(d3.geoMercator().scale(130).translate([width / 2, height / 1.5])))
       .attr("fill", d => {
         const countryData = data.find(row => row.Country === d.properties.name);
         return countryData && countryData.StabilityEstimate ? colorScale(+countryData.StabilityEstimate) : "#f0f0f0";
       })
       .attr("stroke", "#d3d3d3")
       .on("mouseover", (event, d) => {
          tooltip.style("display", "block").text(d.properties.name);
       })
       .on("mousemove", event => {
          tooltip.style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 20) + "px");
       })
       .on("mouseout", () => tooltip.style("display", "none"))
       .on("click", (event, d) => showCountryData(d.properties.name));
  });

  // Function to display graphs when a country is clicked
  function showCountryData(country) {
    const countryData = data.filter(row => row.Country === country);

    if (countryData.length === 0) {
      alert("Data not available for " + country);
      return;
    }

    // Extract data for plots
    const years = countryData.map(row => +row.Year);
    const stability = countryData.map(row => +row.StabilityEstimate);
    const armsDeliveries = countryData.map(row => +row.ArmsDeliveries);

    // Arms Export Graph
    const armsTrace = {
      x: years,
      y: armsDeliveries,
      mode: 'lines+markers',
      name: 'Arms Export',
      line: { color: '#ff7f0e' }
    };

    const armsLayout = {
      title: `${country} - Arms Export Over Time`,
      xaxis: { title: 'Year' },
      yaxis: { title: 'Arms Export Value' }
    };

    // Stability Graph
    const stabilityTrace = {
      x: years,
      y: stability,
      mode: 'lines+markers',
      name: 'Political Stability',
      line: { color: '#1f77b4' }
    };

    const stabilityLayout = {
      title: `${country} - Political Stability Over Time`,
      xaxis: { title: 'Year' },
      yaxis: { title: 'Stability Level' }
    };

    // Render arms graph above stability graph
    Plotly.newPlot("arms-chart", [armsTrace], armsLayout);
    Plotly.newPlot("stability-chart", [stabilityTrace], stabilityLayout);
  }
});
