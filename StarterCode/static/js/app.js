const url= 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


// Function to initialize the page and load the data
function init() {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  // Use D3 to read in the samples.json file
  d3.json(url).then((data) => {
    // Get the names/id list from the data
    let names = data.names;

    // Populate the dropdown menu with the list of names
    names.forEach((name) => {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    // Load initial data for the first id in the list
    updateCharts(names[0]);
  });
}

 
function updateCharts(selectedID) {
    // Use D3 to select the data for the selected ID
  d3.json(url).then((data) => {
    let samples = data.samples;
    let selectedSample = samples.find((sample) => sample.id === selectedID);
    let metadata=data.metadata
    let selectedMetadata = metadata.find((entry) => entry.id.toString() === selectedID);
      // Get the top 10 OTUs
    let top10Values = selectedSample.sample_values.slice(0, 10).reverse();
    let top10Labels = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let top10HoverText = selectedSample.otu_labels.slice(0, 10).reverse();
  
      // Create the horizontal bar chart
    let traceBar = {
      x: top10Values,
      y: top10Labels,
      type: "bar",
      orientation: "h",
      text: top10HoverText
      };
  
    let layoutBar = {
      title: `Top 10 OTUs for ${selectedID}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
      };
  
    let barData = [traceBar];
  
    
    Plotly.newPlot("bar", barData, layoutBar);

    let traceBubble = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      mode: 'markers',
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: 'Earth'
      },
      text: selectedSample.otu_labels
    };

    let layoutBubble = {
      title: `Bubble Chart for ${selectedID}`,
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    let bubbleData = [traceBubble];

    // Plot the bubble chart
    Plotly.newPlot("bubble", bubbleData, layoutBubble);

    let metadataDisplay = d3.select("#sample-metadata");
    metadataDisplay.html("");
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataDisplay.append("p").text(`${key}: ${value}`);
    });
  });

  }
  
  // Event listener for the dropdown menu change
function optionChanged(selectedID) {
    // Update the charts when a new ID is selected
  updateCharts(selectedID);
  }
  
  // Initialize the page
init();