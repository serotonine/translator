var utils= {
	
	getRandomIndex:function(lg){ return Math.floor(Math.random() * (lg)) ; },
	
	in_array: function(needle, haystack){
    var lg = haystack.length;
    for(var i = 0; i < lg; i++) { if(haystack[i] == needle) return true; }
    return false;
	},
	
	mix:function(tab){

				console.log("sib property in object " + this.getRandomIndex );

					for ( var i=0, lg = tab.length ;i<lg; i++ ){

						var _item =tab.splice(this.getRandomIndex(lg),1);
						tab.splice(this.getRandomIndex(lg),0, _item[0] );
                        

					}

					
	}
	
	
	}//end object
	
	
	Array.max = function( tab ){ return Math.max.apply( Math, tab ); };

