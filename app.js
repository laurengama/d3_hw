// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Import Data
d3.csv("data.csv")
.then(function(povertyData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
    povertyData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });
    
  // Step 2: Create scale functions
  // ==============================
    var xLinearScale = d3.scaleLinear()
     .domain([8, d3.max(povertyData, d => d.poverty)])
     .range([8, width]);

    var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(povertyData, d => d.obesity)])
     .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
    chartGroup.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);

    chartGroup.append("g")
     .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
    chartGroup.selectAll("circle")
     .data(povertyData)
     .enter()
     .append("circle")
     .attr("cx", d => xLinearScale(d.poverty))
     .attr("cy", d => yLinearScale(d.obesity))
     .attr("r", "15")
     .attr("opacity", ".75")
     .attr("fill", "lightblue");
     
    // Create circle labels
    chartGroup.append("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .selectAll("tspan")
      .data(povertyData)
      .enter()
      .append("tspan")
          .attr("x", d => xLinearScale(d.poverty))
          .attr("y", d => yLinearScale(d.obesity - 0.2))
          .text(d => d.abbr);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity Rate (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rate (%)");
});