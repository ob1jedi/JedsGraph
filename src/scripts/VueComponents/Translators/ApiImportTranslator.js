

function ApiImportTranslator() {

	this.Name = "Api Importer";
	this.Examples = [
            "http://en.wikipedia.org/api/rest_v1/feed/featured/{Year (eg. 2001)}/{Month (eg. 03)}/{Day (eg. 06)}",
            "http://api.tvmaze.com/search/people?q={Actor Name}",
            "https://itunes.apple.com/search?term={Genre}"
	];
	this.ReferenceContent = ''
            +'Place an API link in the formula box'
            +'<br/>This tranlator uses the "Json-son" translator to graph out the return data.'
            +'<br/>Use <code>{...}</code> to create a prompt, to get info from the user.'

	this.Translate = function (expression, parentNode) {

    //Get all data from user...
    var inBracketsRegex = new RegExp(/\{(?:\{??[^\{]*?\})/g);
    var inBrackets = expression.match(inBracketsRegex);
    while (inBrackets){
      inBrackets.forEach(function(captured){
        var newVal = window.prompt(captured.split(':')[0], "");
        expression = expression.replace(captured, newVal);
      });
      inBrackets = expression.match(inBracketsRegex);
    }

	  var httpClient=new HttpClient();
    httpClient.get(expression,function(response) {
        console.log('response',response);
        new JsonTranslator().Translate(response, parentNode);
    });

	}

}




mappings.Translators.push({name:"Api Importer", translator: new ApiImportTranslator()})