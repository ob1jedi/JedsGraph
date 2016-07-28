//============ NEO4J COMMAND BROKER ================================================================================================================================================================================================
	function Neo4j_Command(statements, successCallback, _sourceConfig, failCallback)
	{
		var sourceConfig = _sourceConfig ? _sourceConfig : currentTheme.sourceConfig;
		var body = new neo_APIcall(); 
		statements.forEach(function(statement){
			body.statements.push(new neo_Statement(statement));
			//console.log(statement);
		});
		
		$.ajax({
				url: sourceConfig.neo4jconnection.server + "/db/data/transaction/commit",
				type: 'post',
				data: JSON.stringify(body),
				headers: {
					"Accept":'application/json; charset=UTF-8',
					"Content-Type": 'application/json',
					"Authorization": 'Basic ' + window.btoa(sourceConfig.neo4jconnection.username + ':' + sourceConfig.neo4jconnection.password) //_connection.userToken
				},
				dataType: 'json',				
				
				success: function (returnbody){
					if (successCallback){
						successCallback(returnbody, sourceConfig);
					}
				},
				error: function (returnbody){
					if (failCallback){
						failCallback(returnbody, sourceConfig);
					}
				}()
			});
	}



