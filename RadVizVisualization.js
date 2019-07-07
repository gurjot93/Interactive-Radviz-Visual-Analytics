/* Filereader for uploading and displaying contents of a file Referred from : https://stackoverflow.com/questions/36079390/parse-uploaded-csv-file-using-d3-js */
var reader = new FileReader();
/* Default value for last row */
var lastrow = "quality";
const IDradviz = document.querySelector('#radviz');
var titles = null;
var colorAccessor = null;
var columnSelected = [];
var dimensions = [];
var data = null;
var reader1 = null;
var typeFileUpload = false;

/* Loading the default file and displaying the contents*/
d3.csv('winequality-white.csv', function(error, data) {
 if (error) throw (error);

 /* Storing the titles of the dataset*/
 titles = d3.keys(data[0]);
 colorAccessor = function(d) {
  return d['quality'];
 };
 /* Storing the defaulf dimensions*/
 dimensions = ['fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar', 'chlorides', 'free sulfur dioxide', 'total sulfur dioxide', 'density', 'pH', 'sulphates', 'alcohol']
 reader1 = data;
 var dimensionAnchor = Array.apply(null, {
  length: dimensions.length
 }).map(Number.call, Number).map(x => x * 2 * Math.PI / (dimensions.length));
 typeFileUpload = true;
 document.getElementById("displayCSVColumns").innerHTML = '';
 columnSelected = dimensions;

 /* Creating the checkboxed for the anchors*/
 for (var i = 0; i < dimensions.length; i++) {

  const html = `<span style="margin: 0px 10px;"><input style="transform: scale(1.5);" type="checkbox" checked="true" id=column_${i} onclick="columnClicked(${i})" value="${dimensions[i]}"  name="${dimensions[i]}" label="${dimensions[i]}">
						<label style="font-size: 16px;
						font-weight: normal;" id="label_${i}">${dimensions[i]}</label></span>`;
  const docId = document.getElementById("displayCSVColumns");
  docId.innerHTML += html;
 }


 /*Calling the Radviz function Referred from:  //https://github.com/WYanChao/RadViz */
 RadViz()
  .DOMRadViz(IDradviz)
  .TableTitle(titles)
  .ColorAccessor(colorAccessor)
  .Dimensionality(dimensions)
  .DAnchor(dimensionAnchor)
  .DATA(data)
  .call();

 document.getElementById("div-range").style.display = 'block';


});

/* Filereader for uploading and displaying contents of a file Referred from : https://stackoverflow.com/questions/36079390/parse-uploaded-csv-file-using-d3-js */
function loadFile() {
 var file = document.querySelector('input[type=file]').files[0];
 reader.addEventListener("load", parseFile, false);
 if (file) {
  reader.readAsText(file);

 }
}

/* Filereader for uploading and displaying contents of a file Referred from : https://stackoverflow.com/questions/36079390/parse-uploaded-csv-file-using-d3-js */
function parseFile() {
 var doesColumnExist = false;
 data = d3.csvParse(reader.result);
 typeFileUpload = false;
 dimensions = data.columns;
 lastrow = dimensions.pop()

 titles = d3.keys(data[0]); //titles in the data table
 colorAccessor = function(d) {
  return d[lastrow];
 };
 var dimensionAnchor = Array.apply(null, {
  length: dimensions.length
 }).map(Number.call, Number).map(x => x * 2 * Math.PI / (dimensions.length));

 document.getElementById("displayCSVColumns").innerHTML = '';
 columnSelected = dimensions;
 for (var i = 0; i < dimensions.length; i++) {

  const html = `<span style="margin: 0px 10px;"><input style="transform: scale(1.5);" type="checkbox" checked="true" id=column_${i} onclick="columnClicked(${i})" value="${dimensions[i]}"  name="${dimensions[i]}" label="${dimensions[i]}">
						<label style="font-size: 16px;
						font-weight: normal;" id="label_${i}">${dimensions[i]}</label></span>`;
  const docId = document.getElementById("displayCSVColumns");
  docId.innerHTML += html;
 }

 updateRadVis(dimensions, dimensionAnchor);

 document.getElementById("div-range").style.display = 'block';

}

/* Function to update the Radviz on the basis of checked Anchors*/
function columnClicked(e) {


 if (typeFileUpload == true) {
  data = reader1;
 } else {
  data = d3.csvParse(reader.result);
 }
 var dimensions = data.columns;

 if (document.getElementById(`column_${e}`).checked == true) {

  columnSelected.splice(0, 0, dimensions[e]);

  const dimensionAnchor = Array.apply(null, {
   length: columnSelected.length
  }).map(Number.call, Number).map(x => x * 2 * Math.PI / (columnSelected.length));


  updateRadVis(columnSelected, dimensionAnchor)
 } else {
  const columnIndex = columnSelected.indexOf(dimensions[e]);
  columnSelected.splice(columnIndex, 1);
  const dimensionAnchor = Array.apply(null, {
   length: columnSelected.length
  }).map(Number.call, Number).map(x => x * 2 * Math.PI / (columnSelected.length));


  updateRadVis(columnSelected, dimensionAnchor)
 }

}

/*Function to update the RadViz Referred from:  //https://github.com/WYanChao/RadViz */
function updateRadVis(dimensions, dimensionAnchor) {

 RadViz()
  .DOMRadViz(IDradviz)
  .TableTitle(titles)
  .ColorAccessor(colorAccessor)
  .Dimensionality(dimensions)
  .DAnchor(dimensionAnchor)
  .DATA(data)
  .call();

}


/*Radviz function to create the data visualization Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js, https://github.com/WYanChao/RadViz  */
function RadViz() {

 /* Variables for RadVis Implementations*/
 let DOMRadViz,
  TableTitle,
  ColorAccessor,
  Dimensionality,
  DAnchor,
  DATA;

  

 /*Function to generate RadViz*/
 function RV(div) {

  /* Creating SVG margin and colorrange for RadVis*/
  let radiusDA = 7,
   radiusDT = 5;
  let nodecolor = d3.scaleOrdinal(d3.schemeCategory10);
  const formatnumber = d3.format(',d');
  let margin = {
    top: 100,
    right: 180,
    bottom: 50,
    left: 200
   },
   width = 800,
   height = 500;
  let chartRadius = Math.min((height - margin.top - margin.bottom - 40), (width - margin.left - margin.right - 40)) / 2;


  /* Storing The data in Titles */
  var titles = TableTitle;
 // titles.unshift('index');

  /* Generating Dynamic Circles*/
  var dimensions = Dimensionality,
   normalizeSuffix = '_normalized',
   dimensionNamesNormalized = dimensions.map(function(d) {
    return d + normalizeSuffix;
   }),
   DN = dimensions.length,
   DA = DAnchor.slice(),
   dataE = DATA.slice();

  dataE.forEach((d, i) => {
   d.index = i;
   d.id = i;
   d.color = nodecolor(ColorAccessor(d));
  });
  dataE = addNormalizedValues(dataE);
  dataE = calculateNodePosition(dataE, dimensionNamesNormalized, DA);

  let DAdata = dimensions.map(function(d, i) {
   return {
    theta: DA[i],
    x: Math.cos(DA[i]) * chartRadius + chartRadius,
    y: Math.sin(DA[i]) * chartRadius + chartRadius,
    fixed: true,
    name: d
   };
  });

  /* Creating the Legends */
  let colorspace = [],
   colorclass = [];
  dataE.forEach(function(d, i) {

   if (colorspace.indexOf(d.color) < 0) {

    colorspace.push(d.color);
    colorclass.push(d[lastrow]);
   }
  });

  /* SVG for RadViz */
  const radviz = d3.select(DOMRadViz);
  d3.select("svg").remove();
  let svg = radviz.append('svg').attr('id', 'radviz')
   .attr('width', width)
   .attr('height', height);
  svg.append('rect').attr('fill', 'transparent')
   .attr('width', width)
   .attr('height', height);

  svg.append("text")
   .attr("x", 600)
   .attr("y", 60)
   .text(lastrow.toUpperCase())
   .attr('font-size', '16pt').attr('dominat-baseline', 'middle')
   .style("font-weight", 900);

 

  let center = svg.append('g').attr('class', 'center').attr('transform', `translate(${margin.left},${margin.top})`);

  /* Tooltips for Each Radviz Data */
  svg.append('rect').attr('class', 'DAtip-rect');
  let DAtipContainer = svg.append('g').attr('x', 0).attr('y', 0);
  let DAtip = DAtipContainer.append('g')
   .attr('class', 'DAtip')
   .attr('transform', `translate(${margin.left},${margin.top})`)
   .attr('display', 'none');
  DAtip.append('rect');
  DAtip.append('text').attr('width', 150).attr('height', 25)
   .attr('x', 0).attr('y', 25)
   .text(':').attr('text-anchor', 'start').attr('dominat-baseline', 'middle');

  svg.append('rect').attr('class', 'tip-rect')
   .attr('width', 80).attr('height', 200)
   .attr('fill', 'transparent')
   .attr('backgroundColor', d3.rgb(100, 100, 100));
  let tooltipContainer = svg.append('g')
   .attr('class', 'tip')
   .attr('transform', `translate(${margin.left},${margin.top})`)
   .attr('display', 'none');

  /* Rendering the RadViz Data*/
  const RVRadviz = d3.select(DOMRadViz).data([RVradviz()]);
  RVRadviz.each(render);

  function render(method) {
   d3.select(this).call(method);
  }

  /* Resetting The Radviz*/
  document.getElementById('resetRadViz').onclick = function() {
   resetRadViz()
  
  };

  /* Function to reset the Radviz Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
  function resetRadViz() {

   /* Creating the instances again for re-intilization*/
   DA = DAnchor.slice();
   DAdata = dimensions.map(function(d, i) {
    return {
     theta: DA[i], //[0, 2*PI]
     x: Math.cos(DA[i]) * chartRadius + chartRadius,
     y: Math.sin(DA[i]) * chartRadius + chartRadius,
     fixed: true,
     name: d
    };
   });
   calculateNodePosition(dataE, dimensionNamesNormalized, DA);
   RVRadviz.each(render);
  }

  /* Main Function to display Radviz Referred from: https://github.com/WYanChao/RadViz, https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
  function RVradviz() {
   function chart(div) {
    div.each(function() {

     /*Calling the node functions to display the nodes */
     drawPanel(chartRadius);
     drawDA();
     drawDALabel();

     /* Generating Tooltips for each node*/
     let tooltip = tooltipContainer.selectAll('text').data(titles)
      .enter().append('g')
      .attr('x', 0).attr('y', function(d, i) {
       return 25 * i;
      });
     tooltip.append('rect').attr('width', 200).attr('height', 25)
      .attr('x', 0).attr('y', function(d, i) {

       return 25 * (i);
      
      })
      .attr('opacity', 0.8)
      .attr('fill', "rgb(205,133,63)");
     tooltip.append('text').attr('width', 150).attr('height', 25).attr('x', 5).attr('y', function(d, i) {
       //     console.log(d);
       if (d != 'index') {
        return 25 * (i + 0.7);
       }
      })
      .text(d => d + ':').attr('text-anchor', 'start').attr('dominat-baseline', 'hanging').style('font-size', "18px").style("font-weight", 900)
     .style("fill", "rgb(25,25,112)");

     /* Plotting the node and the legend*/
     drawDT();
     drawLegend();

     /* Function to create the parent circle Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
     function drawPanel(a) {
      let panel = center.append('circle')
       .attr('class', 'big-circle')
       .attr('stroke', d3.rgb(0, 0, 0))
       .attr('stroke-width', 3)
       .attr('fill', 'transparent')
       .attr('r', a)
       .attr('cx', a)
       .attr('cy', a);
     }

     /* Function to create the Panel for each node Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
     function drawDA() {
      center.selectAll('circle.DA-node').remove();
      let DANodes = center.selectAll('circle.DA-node')
       .data(DAdata)
       .enter().append('circle').attr('class', 'DA-node')
       .attr('fill', "black")
       .attr('stroke-width', 1.2)
       .attr('r', radiusDA)
       .attr('cx', d => d.x)
       .attr('cy', d => d.y)
       .on('mouseenter', function(d) {
        let damouse = d3.mouse(this);
       })
       .on('mouseout', function(d) {
        svg.select('g.DAtip').attr('display', 'none');
       })
       .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
       );
     }

     /* Function to drag the anchors Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js */
     function dragstarted(d) {
      d3.select(this).raise().classed('active', true);
     }

     function dragended(d) {
      d3.select(this).classed('active', false);
      d3.select(this).attr('stroke-width', 0);
     }

     /* Function to update the nodes on the basis of anchors Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
     function dragged(d, i) {
      d3.select(this).raise().classed('active', true);
      let tempx = d3.event.x - chartRadius;
      let tempy = d3.event.y - chartRadius;
      let newAngle = Math.atan2(tempy, tempx);
      newAngle = newAngle < 0 ? 2 * Math.PI + newAngle : newAngle;
      d.theta = newAngle;
      d.x = chartRadius + Math.cos(newAngle) * chartRadius;
      d.y = chartRadius + Math.sin(newAngle) * chartRadius;
      d3.select(this).attr('cx', d.x).attr('cy', d.y);
      drawDA();
      drawDALabel();
      DA[i] = newAngle;
      calculateNodePosition(dataE, dimensionNamesNormalized, DA);
      drawDT();
     }

     /* Function to draw labels for the data Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
     function drawDALabel() {
      center.selectAll('text.DA-label').remove();
      let DANodesLabel = center.selectAll('text.DA-label')
       .data(DAdata).enter().append('text').attr('class', 'DA-label')
       .attr('x', d => d.x).attr('y', d => d.y)
       .attr('text-anchor', d => Math.cos(d.theta) > 0 ? 'start' : 'end')
       .attr('dominat-baseline', d => Math.sin(d.theta) < 0 ? 'baseline' : 'hanging')
       .attr('dx', d => Math.cos(d.theta) * 15)
       .attr('dy', d => Math.sin(d.theta) < 0 ? Math.sin(d.theta) * (15) : Math.sin(d.theta) * (15) + 10)
       .text(d => d.name)
       .attr('font-size', '18pt');
     }

     /* Function to create the data points of the dataset Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
     function drawDT() {
      center.selectAll('.circle-data').remove();
      let DTNodes = center.selectAll('.circle-data')
       .data(dataE).enter().append('circle').attr('class', 'circle-data')
       .attr('id', d => d.index)
       .attr('r', radiusDT)
       .attr('fill', d => d.color)
       .attr('stroke', 'black')
       .attr('stroke-width', 0.5)
       .attr('cx', d => d.x0 * chartRadius + chartRadius)
       .attr('cy', d => d.y0 * chartRadius + chartRadius)
       .on('mouseenter', function(d) {
        let mouse = d3.mouse(this);

        let tip = svg.select('g.tip').selectAll('text').text(function(k, i) {
         if (k != "index") {

          return k + ': ' + d[k];

         }


        });

        svg.select('g.tip').attr('transform', `translate(${margin.left + mouse[0] +20},${margin.top+mouse[1] - 120})`);
        /* Displaying the tooltip*/
        svg.select('g.tip').attr('display', 'block');

        d3.select(this).raise().transition().attr('r', radiusDT * 2).attr('stroke-width', 3);
       })
       .on('mouseout', function(d) {

        svg.select('g.tip').attr('display', 'none');
        d3.select(this).transition().attr('r', radiusDT).attr('stroke-width', 0.5);
       });
     }

     /* Function to create the legends Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
     function drawLegend() {
      let heightLegend = 25,
       xLegend = margin.left + chartRadius * 1.7,
       yLegend = 25;
      let legendcircle = center.selectAll('circle.legend').data(colorspace)
       .enter().append('circle').attr('class', 'legend')
       .attr('r', radiusDT)
       .attr('cx', xLegend - 50)
       .attr('cy', (d, i) => i * yLegend - 12)
       .attr('fill', d => d);



      let legendtexts = center.selectAll('text.legend')
       .data(colorclass)
       .enter().append('text').attr('class', 'legend')
       .attr('x', xLegend - 8 * radiusDT)
       .attr('y', (d, i) => i * yLegend + 5 - 12)
       .text(d => d)
       .attr('font-size', '16pt').attr('dominat-baseline', 'middle')
       .on('mouseover', function(d) {

        let tempa = d3.select(DOMRadViz).selectAll('.circle-data');
        tempa.nodes().forEach((element) => {
         let tempb = element.getAttribute('id');
         if (dataE[tempb][lastrow] != d) {
          d3.select(element).attr('fill-opacity', 0.2)
           .attr('stroke-width', 0);
         }
        });
       })
       .on('mouseout', function(d) {
        d3.select(DOMRadViz).selectAll('.circle-data')
         .attr('fill-opacity', 1).attr('stroke-width', 0.5);
       });
     }
    });
   }
   return chart;
  }

  /* Changing the opacity of the data nodes. Referred from: https://bl.ocks.org/EfratVil/2bcc4bf35e28ae789de238926ee1ef05*/
  d3.select("#opacity").on("input", function() {


   let tempa = d3.select(DOMRadViz).selectAll('.circle-data');
   tempa.nodes().forEach((element) => {
    let tempb = element.getAttribute('id');

    d3.select(element).attr('fill-opacity', (document.getElementById('opacity').value) / 100)
     .attr('stroke-width', (document.getElementById('opacity').value) / 1000);

   });
  });

  /* Function to calculate the node position Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
  function calculateNodePosition(dataE, dimensionNamesNormalized, DA) {
   dataE.forEach(function(d) {

    let dsum = d.dsum,
     dx = 0,
     dy = 0;
    dimensionNamesNormalized.forEach(function(k, i) {
     dx += Math.cos(DA[i]) * d[k];
     dy += Math.sin(DA[i]) * d[k];
    });
    d.x0 = dx / dsum;
    d.y0 = dy / dsum;
    d.dist = Math.sqrt(Math.pow(dx / dsum, 2) + Math.pow(dy / dsum, 2));
    d.distH = Math.sqrt(Math.pow(dx / dsum, 2) + Math.pow(dy / dsum, 2));
    d.theta = Math.atan2(dy / dsum, dx / dsum) * 180 / Math.PI;
   });
   return dataE;
  }

  /* Function to normaliz the data and addition Referred from:  https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.23.1/babel.min.js*/
  function addNormalizedValues(data) {
   data.forEach(function(d) {
    dimensions.forEach(function(dimension) {
     d[dimension] = +d[dimension];
    });
   });
   var normalizationScales = {};
   dimensions.forEach(function(dimension) {
    normalizationScales[dimension] = d3.scaleLinear().domain(d3.extent(data.map(function(d, i) {
     return d[dimension];
    }))).range([0, 1]);
   });
   data.forEach(function(d) {
    dimensions.forEach(function(dimension) {
     d[dimension + '_normalized'] = normalizationScales[dimension](d[dimension]);
    });
   });
   data.forEach(function(d) {
    let dsum = 0;
    dimensionNamesNormalized.forEach(function(k) {
     dsum += d[k];
    });
    d.dsum = dsum;
   });
   return data;
  }
 }

 /* Calling the functions Referred from:  https://github.com/WYanChao/RadViz */
 RV.DOMRadViz = function(_a) {
  if (!arguments.length) {
   return console.log('No RadViz DOM')
  };
  DOMRadViz = _a;
  return RV;
 };
 RV.TableTitle = function(_a) {
  if (!arguments.length) {
   return console.log('Input TableTitle')
  };
  TableTitle = _a;
  return RV;
 };
 RV.ColorAccessor = function(_a) {
  if (!arguments.length) return console.log('Input ColorAccessor');
  ColorAccessor = _a;
  return RV;
 };
 RV.Dimensionality = function(_a) {
  if (!arguments.length) return console.log('Input Dimensionality');
  Dimensionality = _a;
  return RV;
 };
 RV.DAnchor = function(_a) {
  if (!arguments.length) return console.log('Input initial DAnchor');
  DAnchor = _a;
  return RV;
 };
 RV.DATA = function(_a) {
  if (!arguments.length) return console.log('Input DATA');
  DATA = _a;
  return RV;
 };

 return RV;
};