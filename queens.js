var queensCheck = true;
var foundSolution = false;
var queensComb=[];
var queensCombObj={};

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  mounted () {
    axios
      .get('/solutions')
      .then(response => (this.message = response.data))
  }
})


document.getElementById("boardSize").value=4;

var size = document.getElementById("boardSize").value;
var items = [];
for(var i =0; i<size; i ++)
{
	items.push([]);
	for ( var j =0; j<size; j++)
	{
		items[i].push({hasQueen : false});
	}
}
var initrow = [];
var counter = 0;
var initchessboard = [];
var solutions  = [];

var field = new Vue({
	el: '#chessboardDiv',
	data: {
		board : items,
		message: "",
		solutionsUl : []		
	},
	methods: {
		updateSize: function(event){
			size = document.getElementById("boardSize").value;
			items = [];
			for(var i =0; i<size; i ++)
			{
				items.push([]);
				for ( var j =0; j<size; j++)
				{
					items[i].push({hasQueen : false});
				}
			}
			if(document.getElementById("Queens").value<(Math.floor(document.getElementById("boardSize").value/2)+1))
			{
				this.message="This combination has no solutions.";
				queensCheck = false;
			}
			else if(document.getElementById("Queens").value>document.getElementById("boardSize").value)
			{
				this.message="Number of queens must be less than or equal to the chessboard size.";
				queensCheck = false;
			}
			else
			{
				this.message="";
				queensCheck = true;
			}
			this.board = items;
		},
		checkValidity: function(event){
			if(document.getElementById("Queens").value<(Math.floor(document.getElementById("boardSize").value/2)+1))
			{
				this.message="This combination has no solutions.";
				queensCheck = false;
			}
			else if(document.getElementById("Queens").value>document.getElementById("boardSize").value)
			{
				this.message="Number of queens must be less than or equal to the chessboard size.";
				queensCheck = false;
			}
			else
			{
				this.message="";
				queensCheck = true;
			}
		},
		simulation: function(event){
			if(queensCheck)
			{
				document.getElementById("Message").innerHTML="";
				initrow = [];
				counter = 0;
				initchessboard = [];
				solutions  = [];
				var n   = document.getElementById("boardSize").value;
				var m   = document.getElementById("Queens").value;
				for(var queen = 0; queen<n ; queen++)
				{
					initrow.push(-n);
					initchessboard.push([]);
					for(var queenj = 0; queenj < n; queenj++)
					{
						initchessboard[queen][queenj]=0;
					}
				}
				for(var e=0;e<n;e++)
				{
					for(var t=0;t<n;t++)
						document.getElementById(e.toString()+t.toString()).classList.remove("queen");
				}
				queens(n,m,0,initrow,initchessboard);
				
				var pos =0;
				var countingThreats = false;
				var currentThreat   = 0;
				var queen    		= 0;
				var sols 		    = this.solutionsUl;
				var radios = document.getElementsByName('speed');

				for (var i = 0, length = radios.length; i < length; i++) {
				  if (radios[i].checked) {
				    var speed = parseInt(radios[i].value)
				    break;
				  }
				}




				var steps = setInterval(function(){

					if(queensComb[pos].value==1)
					{
						document.getElementById(queensComb[pos].row.toString()+queensComb[pos].column.toString()).classList.add("queen");
					}
					else if (queensComb[pos].value==0)
					{
						document.getElementById(queensComb[pos].row.toString()+queensComb[pos].column.toString()).classList.remove("queen");

					}
					else if (queensComb[pos].value==2)
					{
						
						countingThreats=true;
						if(currentThreat<queensComb[pos].queens[queen].threatens.length)
						{
							var queenRow = queensComb[pos].queens[queen].row;
							var queenCol = queensComb[pos].queens[queen].column;
							
							document.getElementById(queenRow.toString()+queenCol.toString()).children[0].classList.add("queenBullet");
							document.getElementById(queenRow.toString()+queenCol.toString()).children[0].style.backgroundColor=queensComb[pos].queens[queen].color;
							
							var threatRow = queensComb[pos].queens[queen].threatens[currentThreat].r;
							var threatCol = queensComb[pos].queens[queen].threatens[currentThreat].co;
							document.getElementById(threatRow.toString()+threatCol.toString()).children[0].classList.add("bullet");
							document.getElementById(threatRow.toString()+threatCol.toString()).children[0].style.backgroundColor=queensComb[pos].queens[queen].color;
							document.getElementById(queenRow.toString()+queenCol.toString()).children[0].classList.remove("bullet");

						
							currentThreat++;
						}	
						else if (currentThreat==queensComb[pos].queens[queen].threatens.length)
						{
							currentThreat++;
						}
						else if(currentThreat>queensComb[pos].queens[queen].threatens.length)
						{
							if(queen < queensComb[pos].queens.length-1)
							{
								queen++;
								currentThreat=0;
							}
							else
							{
								queen = 0;
								currentThreat = 0;
								countingThreats = false;
								if(queensComb[pos].isasolution==1)
								{
									sols.push([]);
									
									var tempRow = queensComb[pos].tempSolutions;
									Vue.set(sols,sols.length-1,tempRow)
									
								}
								for(var e=0;e<n;e++)
								{
									for(var t=0;t<n;t++)
									{	
										document.getElementById(e.toString()+t.toString()).children[0].classList.remove("bullet");
										document.getElementById(e.toString()+t.toString()).children[0].classList.remove("queenBullet");
										
									}	
								}
							}
						}
					}
					if(!countingThreats)
					{
						pos++;
					}
					if(queensComb.length<=pos)
					{
						clearInterval(steps);
					}
				},speed)

			}
			else
			{
				document.getElementById("Message").innerHTML="Please check the combination of queens number and chessboard size.";
			}
		}
		
	}
})
var colors = ["orange", "red", "lightblue","green", "magenta", "yellow", "silver", "brown"]
function queens(n, m, k, row, chessboard)
{
   var i, r, co, isasolution;
   if (counter == m || k==n) 
   {                 
      if(counter == m)
      {  
        queensCombObj ={
        	value : 2,
        	queens : []
        }
        for (i = 0 ; i < k ; i++)
        { 
           if(row[i]>=0&&row[i]!=n)
           {
           	var tempQueens = {
           		row       : i,
           		column    : row[i],
           		color     : colors[i],
           		threatens : []
           	}
            for(r=0;r<n;r++)
             {  
                for(co=0;co<n;co++)
                {
                   if ( row[i] == co ||  
                        i == r ||        
                        row[i]-i == co-r ||              
                        row[i]+i == co+r)
                   {
                      var tempThreat = {
                      	r    : r,
                      	co   : co
                      }
					  tempQueens.threatens.push(tempThreat);
                      chessboard[r][co]=1;

                   }
                }
             }
             queensCombObj.queens.push(tempQueens);
           }  
        }

        isasolution=1;
        for(r=0;r<n;r++)
         {  
            for(co=0;co<n;co++)
            {
               if (chessboard[r][co]==0)
               {
                  isasolution=0;
                  break;
               }
            }
         }
         queensCombObj["isasolution"]= isasolution;
         
         if(isasolution==1)
         {
         	solutions.push([]);
         	for(var solution = 0; solution < row.length; solution ++)
         	{

         		if(row[solution]==n)
         			row[solution] = -n;
				solutions[solutions.length-1].push(row[solution]);
         	}
         	queensCombObj["tempSolutions"]=solutions[solutions.length-1];
         	for(var q=0;q<queensCombObj.tempSolutions.length;q++)
         	{
         		queensCombObj.tempSolutions[q]+=1;
         		if(queensCombObj.tempSolutions[q]<0)
         		{
         			queensCombObj.tempSolutions[q]=0;
         		}
         	}
         	
         	foundSolution = true;    
         }
         queensComb.push(queensCombObj);
      }
                                  
      for(r=0;r<n;r++)
     {  
        for(co=0;co<n;co++)
        {
          chessboard[r][co]=0;
        }
      }  
      return;
   }
	
   
	for (row[k] = 0 ; row[k] < n ; row[k]++) 
    { 
     queensCombObj={
     	value  : 1,
     	row    : k,
     	column : row[k]
     }
     queensComb.push(queensCombObj);
      for (i = 0 ; i < k ; i++) 
      { 
        if (row[k] == row[i] ||         
             row[k]-k == row[i]-i ||              
             row[k]+k == row[i]+i)
	        {
	             queensCombObj={
			     	value  : 0,
			     	row    : k,
			     	column : row[k]
			     }
			     queensComb.push(queensCombObj);                  
	            break;
	        }                   
      }

      if ((i == k) && (counter!=m)) 
      {                       
         (counter)++;
         queens(n, m, k+1, row, chessboard);
          queensCombObj={
		     	value  : 0,
		     	row    : k,
		     	column : row[k]
		     }
		     queensComb.push(queensCombObj);
         (counter)--;
      }       
   }
   if( row[k] == n && k < n-1 && (counter!=m))
   {
      row[k]=-n;
      queens(n, m, k+1, row, chessboard);
   }
   
   
}
