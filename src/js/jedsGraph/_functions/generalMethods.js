		function calculateDistance(pos1, pos2){
			return Math.sqrt(Math.pow(pos2.x - pos1.x,2) + Math.pow(pos2.y - pos1.y,2));
		}
		
		function parseDataType(n, _type) {

		    if (_type)
		    {
		        switch (_type) {
		            case "string":
		                return '"' + n + '"';
		                break;
		            case "number":
		                if (!isNaN(parseFloat(n)) && isFinite(n)) return Number(n);
		                break;
		            case "other": //boolean
		                if (n == "true") { return true; }
		                if (n == "false") { return false; }
		                break;
		            case "array":
		                
		                return '[' + n.split(',').map(function (m) { return '"' + m + '"' }).join() + ']';
		                break;
 		        }
		    }


			if (n=="true"){return true;}
			if (n=="false"){return false;}
			if (n=="null"){return null;}
			if (n=="undefined"){return undefined;}
			if (!isNaN(parseFloat(n)) && isFinite(n)) return Number(n);

			return '"' + n + '"';
		}

		var sort_by = function(field, reverse, primer){
		   var key = primer ? 
			   function(x) {return primer(x[field])} : 
			   function(x) {return x[field]};
		   reverse = !reverse ? 1 : -1;
		   return function (a, b) {
			   return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
			 } 
		}

		// Returns a random number between min (inclusive) and max (exclusive)
		function getRandomArbitrary(min, max) {
			return Math.random() * (max - min) + min;
		}
		//RGB to #HEX
		function rgb2hex(red, green, blue) {
				var rgb = blue | (green << 8) | (red << 16);
				return '#' + (0x1000000 + rgb).toString(16).slice(1)
		  }

		
		function sleepFor( sleepDuration ){
			var now = new Date().getTime();
			while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
		}
		
		
		
		function getType(p) {
			if (Array.isArray(p)) return 'array';
			else if (typeof p == 'string') return 'string';
			else if (p != null && typeof p == 'object') return 'object';
			else if (p != null && typeof p == 'number') return 'number';
			else return 'other';
		}