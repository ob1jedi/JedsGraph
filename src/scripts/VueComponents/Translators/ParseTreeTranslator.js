
function ParseTreeTranslator() {

	this.Name = "Logic Parse Tree";
	this.Examples = [
    "a & (b & c) -> (d -> (e V f)) & !(g || h)"
  ];
	this.ReferenceContent = `
    </br>
      Implication
      <span class ="inputModal code">→</span> 
      <span class ="inputModal code">-></span> 
    </br>
      Conjuntion
      <span class ="inputModal code">∧</span> 
      <span class ="inputModal code">&</span> 
      <span class ="inputModal code">&&</span> 
      <span class ="inputModal code">^</span> 
      <span class ="inputModal code">.</span> 
    </br>
      Disjunction
      <span class ="inputModal code">∨</span> 
      <span class ="inputModal code">||</span> 
      <span class ="inputModal code">V</span> 
      <span class ="inputModal code">+</span> 
    </br>
      Negation
      <span class ="inputModal code">¬</span> 
      <span class ="inputModal code">~</span> 
      <span class ="inputModal code">!</span> 
      <span class ="inputModal code">-</span> 
    </br>
      Parentheses<span class ="inputModal code">(...)</span> 
    `;
	var _stringSvc = new StringHelper();
  var _dictionery = [];
  var _precedence = {
    '→':["->"],
    '∧' :["&", "&&", '^', '.'],
    '∨' :['||', 'V', '+'],
    '¬' :['~', '!', '-'],
  }
	
  
  this.Translate = function (expression) {
		//var dataSvc = new DataService();
    var normalExpression = normalizeExpression(expression);
    var node = TopEvaluate(normalExpression);

 }

  this.GetNormalizedExpression = function(expression){
    return normalizeExpression(expression);
  }
  this.GetNormalizedDictioneryFromExpression = function(expression){
    normalizeExpression(expression);
    return _dictionery;
  }

  function normalizeExpression(expression)
  {
    for (var op in _precedence){
      _precedence[op].forEach(function(alt){
        expression = _stringSvc.ReplaceAll(expression, alt, op);
      });
    }  
    expression = createDictioneryAndNormalizeSubStructures(expression);
    return expression;
  }

  function createDictioneryAndNormalizeSubStructures(expression){
        var dictIndex = 0;
    var encapsulationRegex = new RegExp(/(\((?:\(??[^\(]*?\)))/g);
    
    var encapsulated = expression.match(encapsulationRegex);

    while (encapsulated){
      encapsulated.forEach(function(captured){
        var dictVal = '%' + (++dictIndex);
        _dictionery[dictVal] = captured.slice(1,-1);
        expression = expression.replace(captured, dictVal);
      });
      encapsulated = expression.match(encapsulationRegex);
    }
    return expression;
  }

  function TopEvaluate(expression){
    var exp = getExpressionFromDictionery(expression);
    for (var op in _precedence){
      var node = getNodeOfOperatorIfAny(exp, op);
      if (node)
        return node;
    }
    return translatorCreateNode(exp, 'atom');
  }

  function getExpressionFromDictionery(expKey)
  {
    for (var key in _dictionery)
      if (key == expKey)
        return _dictionery[key];
    return expKey;
  }

  function getNodeOfOperatorIfAny(expression, operator){

    var expressions = expression.split(operator);//_stringSvc.SplitOr(expression, operator);
    if (expressions.length == 1)
      return null;
    var node = translatorCreateNode(operator, 'operator');
    for (var i = 0; i < expressions.length; i++){
      if (expressions[i].trim().length > 0) // Binary/n-ary expression
        translatorCreateRelation(node, TopEvaluate(expressions[i].trim()));
    }
    return node;
  }
  
  function translatorCreateRelation(fromNode, toNode){
    dataSvc.CreateRelation_AddToGraph_ReturnLink(fromNode.id, toNode.id);
  }

  function translatorCreateNode(label, type){
    var dataSvc = new DataService();
    return dataSvc.CreateEntity_AddToGraph_ReturnNode([type], {"Name":label});
  }

}
