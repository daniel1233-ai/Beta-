// Load the cleaned data file (make sure it’s saved in the same directory).
d3.csv("cleaned_combined_data.csv").then(data => {
  
  const width = 960;
  const height = 600;

  // Define a color scale for stability, with light blue to dark blue for increasing stability
  const colorScale = d3.scaleLinear().domain([1, 8]).range(["#B0D0E0", "#0056A1"]); // Light to dark blue

  const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  // Load world GeoJSON data
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(geoData => {
    // Draw the map
    svg.selectAll("path")
       .data(geoData.features)
       .enter()
       .append("path")
       .attr("d", d3.geoPath().projection(d3.geoMercator().scale(130).translate([width / 2, height / 1.5])))
       .attr("fill", d => {
         const countryData = data.find(row => row.Country === d.properties.name);
         return countryData && countryData.StabilityEstimate !== ".." ? colorScale(countryData.StabilityEstimate) : "#D3D3D3";
       })
       .attr("stroke", "#fff")
       .on("click", (event, d) => showCountryData(d.properties.name));
  });

  // Function to show data when a country is clicked
  function showCountryData(country) {
    const countryData = data.filter(row => row.Country === country);
    
    if (countryData.length === 0) {
      alert("Data not available for " + country);
      return;
    }
    
    // Extract time series data for plotting
    const years = countryData.map(row => +row.Year);
    const stability = countryData.map(row => +row.StabilityEstimate);
    const armsDeliveries = countryData.map(row => +row.ArmsDeliveries);

    // Plot with Plotly
    const trace1 = {
      x: years,
      y: stability,
      mode: 'lines+markers',
      name: 'Political Stability',
      line: { color: 'blue' }
    };

    const trace2 = {
      x: years,
      y: armsDeliveries,
      mode: 'lines+markers',
      name: 'Arms Export',
      line: { color: 'red' }
    };

    const layout = {
      title: `${country} - Stability and Arms Export Over Time`,
      xaxis: { title: 'Year' },
      yaxis: { title: 'Value' }
    };

    Plotly.newPlot("chart", [trace1, trace2], layout);
  }
});
