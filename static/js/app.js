d3.json("./data/samples.json").then(data=>{
    console.log(data)});

var select = d3.select("#selDataset");
var demTable = d3.select("#sample-metadata");
var bar = d3.select("#bar");
var bubble = d3.select("#bubble");


function init() {

    resetData();

    d3.json("./data/samples.json").then((data=>{

        data.names.forEach((name => {
            var option = select.append("option");
            option.text(name);
        
        }));

        var otu_ids = select.property("value")

        Charts(otu_ids);

    }));

}

function resetData() {

    demTable.html("");
    bar.html("");
    bubble.html("");

}; 

function Charts(id) {
    d3.json("./data/samples.json").then((data => {

        var metData = data.metadata.filter(participant => participant.id == id)[0];
        
        Object.entries(metData).forEach(([key, value]) => {
            var newList = demTable.append("ul");
            var listItem = newList.append("li");
            listItem.text(`${key}: ${value}`);
        

    });

    var sample = data.samples.filter(sample => sample.id == id)[0];
    
    var otuids = [];
    var otulabels = [];
    var svalues = [];

    Object.entries(sample).forEach(([key, value]) => {

        switch (key) {
            case "otu_ids":
                otuids.push(value);
                break;
            case "sample_values":
                svalues.push(value);
                break;
            case "otu_labels":
                otulabels.push(value);
                break;
            default:
                break;
        } 

    });

    var topIds = otuids[0].slice(0,10).reverse();
    var topLabels = otulabels[0].slice(0,10).reverse();
    var topValues = svalues[0].slice(0,10).reverse();

    var topIdLabel = topIds.map(otuID => "OTU_ID" + " " + otuID);



    var barChart={
        y:topIdLabel,
        x:topValues,
        text:topLabels,
        type:"bar",
        orientation:"h"
    };

    var barData = [barChart]

    var barLayout = {
        height: 500,
        width: 900,
        title: {
            text: "Top 10 OTUs",
            font: {
                size:14,
            }
        },
        xaxis: {
            title: "Sample_Values",
        },
        yaxis: {
            tickfont: {size: 11}
        }
    }


    Plotly.newPlot("bar", barData, barLayout);


    var bubble = d3.select("bubble");


    var bubbleChart = {
        margin: {t:0},
        hovermode: "closest",
        xaxis: {
            title: "OTU_IDS",
        },
        yaxis: {
            title:"Sample_Values",
        },
    };

    var bubbleLabels = {
        height: 500,
        width: 900,
        x:otuids[0],
        y:svalues[0],
        text: otulabels[0],
        mode:"markers",
        marker: {
            color:otuids[0],
            size:svalues[0],}
        }
    ;

    bubbleData = [bubbleLabels]

    Plotly.newPlot("bubble", bubbleData, bubbleChart);
    }))};

function optionChanged(id) {
    
    resetData();

    Charts(id);

}

init();