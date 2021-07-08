d3.json("./data/samples.json").then(data=>{
    console.log(data)});


function init() {

    change();
    var select = d3.select("#selDataset");
    
    d3.json("./data/samples.json").then((data=>{

        data.names.forEach((name => {
            var option = select.append("option");
            option.text(name);
        
        }));

        var otu_ids = select.property("value")

        Charts(otu_ids);

    }));

}

function change() {

    demTable.html("");
    bar.html("");
    bubble.html("");

}; 

var demTable = d3.select("#sample-metadata");
var bar = d3.select("#bar");
var bubble = d3.select("#bubble");

function Charts(id) {
    d3.json("./data/samples.json").then((data => {

        var metData = data.metadata.filter(sampleID => sampleID.id == id)[0];
        
        Object.entries(metData).forEach(([key, value]) => {
            var List = demTable.append("ul");
            var Item = List.append("li");
            Item.text(`${key}: ${value}`);
        

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



    var barData=[{

        y:topIdLabel,
        x:topValues,
        text:topLabels,
        type:"bar",
        orientation:"h"
    }];


    var barLayout = {
        height: 500,
        width: 900,
        title: {
            text: "Top 10 OTUs",
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


    var bubbleData= {
        height: 500,
        width: 1200,
        hovermode: "closest",
        xaxis: {
            title: "OTU_IDS",
        },
        yaxis: {
            title:"Sample_Values",
        },
    };

    var bubbleLabels = [{
        x:otuids[0],
        y:svalues[0],
        text: otulabels[0],
        mode:"markers",
        marker: {
            color:otuids[0],
            size:svalues[0],}
        }]
    ;


    Plotly.newPlot("bubble", bubbleLabels, bubbleData);
    }))};

function optionChanged(id) {
    
    Change();

    Charts(id);

}

init();