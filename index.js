// dataset: iris

 //https://stackoverflow.com/questions/36079390/parse-uploaded-csv-file-using-d3-js
 var reader = new FileReader(); 
 var lastrow = "quality";
 function loadFile() {      
   var file = document.querySelector('input[type=file]').files[0];      
   reader.addEventListener("load", parseFile, false);
   if (file) {
	 reader.readAsText(file);
	
   } }
   function parseFile(){
   var doesColumnExist = false;
   var data = d3.csvParse(reader.result);
   var dimensions= data.columns;
   lastrow = dimensions.pop()
  // console.log(lastrow,columns)
  // console.log(columns)
   //console.log(data);
   const IDtable = document.querySelector('#data-table');//the container of table
	const IDradviz = document.querySelector('#radviz');//the container of radviz
	const titles = d3.keys(data[0]);//titles in the data table
	const colorAccessor = function(d){ return d[lastrow]; };//dimension used for coloring
	//const dimensions = ['sepalL', 'sepalW', 'petalL', 'petalW'];//dimensions used for RadViz.
//	const dimensions = ['fixed acidity','volatile acidity',	'citric acid',	'residual sugar',	'chlorides',	'free sulfur dioxide',	'total sulfur dioxide',	'density',	'pH'	,'sulphates'	,'alcohol']
	
	const dimensionAnchor = Array.apply(null, {length: dimensions.length}).map(Number.call, Number).map(x=>x*2*Math.PI/(dimensions.length)); // intial DA configration;
	
	//console.log('index.js:titles', titles);
	//console.log('index.js:colorAccessor', colorAccessor);
	//console.log('index.js:dimensions', dimensions);
	//console.log('index.js:dimensionAnchor', dimensionAnchor);
	
	// call the plot function
	RadViz()
 		.DOMTable(IDtable)
		.DOMRadViz(IDradviz)
		.TableTitle(titles)
		.ColorAccessor(colorAccessor)
		.Dimensionality(dimensions)
		.DAnchor(dimensionAnchor)
		.DATA(data)
		.call();
 }


/* 
d3.csv('winequality-red.csv', function(error, data) {
	if(error) throw(error);
	console.log(data);
	const IDtable = document.querySelector('#data-table');//the container of table
	const IDradviz = document.querySelector('#radviz');//the container of radviz
	const titles = d3.keys(data[0]);//titles in the data table
	const colorAccessor = function(d){ return d['quality']; };//dimension used for coloring
	//const dimensions = ['sepalL', 'sepalW', 'petalL', 'petalW'];//dimensions used for RadViz.
	const dimensions = ['fixed acidity','volatile acidity',	'citric acid',	'residual sugar',	'chlorides',	'free sulfur dioxide',	'total sulfur dioxide',	'density',	'pH'	,'sulphates'	,'alcohol']
	
	const dimensionAnchor = Array.apply(null, {length: dimensions.length}).map(Number.call, Number).map(x=>x*2*Math.PI/(dimensions.length)); // intial DA configration;
	
	//console.log('index.js:titles', titles);
	//console.log('index.js:colorAccessor', colorAccessor);
	//console.log('index.js:dimensions', dimensions);
	//console.log('index.js:dimensionAnchor', dimensionAnchor);
	
	// call the plot function
	RadViz()
 		.DOMTable(IDtable)
		.DOMRadViz(IDradviz)
		.TableTitle(titles)
		.ColorAccessor(colorAccessor)
		.Dimensionality(dimensions)
		.DAnchor(dimensionAnchor)
		.DATA(data)
		.call();
}); 
*/