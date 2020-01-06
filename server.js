var express 			  = require('express');
var app  				  = express();
var path 				  = require('path');
app.set('views', "./");
app.use(express.static('./'));



var initrow = [];
var counter = 0;
var initchessboard = [];
var solutions  = [];




function queens(n, m, k, row, chessboard)
{
   var i, r, co, isasolution;
   if (counter == m || k==n) {                 
      if(counter == m)
      {  
        
        for (i = 0 ; i < k ; i++)
        { 
           if(row[i]>=0&&row[i]!=n)
           {
            for(r=0;r<n;r++)
             {  
                for(co=0;co<n;co++)
                {
                   if ( row[i] == co ||  
                        i == r ||        
                        row[i]-i == co-r ||              
                        row[i]+i == co+r)
                   {
                      chessboard[r][co]=1;

                   }
                }
             }
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
         if(isasolution==1)
         {
         	solutions.push([]);
         	for(var solution = 0; solution < row.length; solution ++)
         	{

         		if(row[solution]==n)
         			row[solution] = -n;
				solutions[solutions.length-1].push(row[solution]);
         	}
            // for (i = 0 ; i < k ; i++)
            // { 
            //    if(row[i]>=0)
            //     printf("%d/%d ", i+1, row[i]+1); 
            // }
            // printf("\n");
            // (*c)++; 
         }
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
   { /* Δοκίμασε κάθε πιθανή επιλογή τοποθέτησης βασίλισσας στην k γραμμή */
      for (i = 0 ; i < k ; i++) 
      { /* Για κάθε μία από τις ήδη τοποθετημένες βασίλισσες, έλεγξε αν */
         if (row[k] == row[i] ||          /*βρίσκεται στην ίδια  στήλη ή */
             row[k]-k == row[i]-i ||              /* κατιούσα διαγώνιο ή */
             row[k]+k == row[i]+i)                   /* ανιούσα διαγώνιο */
                                 /* με τη βασίλισσα που τοποθετούμε τώρα */
            break;               /* Αν ναι, πήγαινε στην επόμενη επιλογή */
      }

      if ((i == k) && (counter!=m)) 
      {                       
         (counter)++;
         queens(n, m, k+1, row, chessboard);
         (counter)--;
      }       
   }
   if( row[k] == n && k < n-1 && (counter!=m))
   {
      row[k]=-n;
      queens(n, m, k+1, row, chessboard);
      
   }
}

// queens(n,m,0,initrow,initchessboard);
// console.log(solutions);
// console.log(solutions.length);


app.get("/", function(req,res){
	res.sendFile(path.join(__dirname+'/queens.html'));
});

app.get("/solutions", function(req, res){
	initrow = [];
	counter = 0;
	initchessboard = [];
	solutions  = [];
	var n   = 6;
	var m   = 3;
	for(var queen = 0; queen<n ; queen++)
	{
		initrow.push(-n);
		initchessboard.push([]);
		for(var queenj = 0; queenj < n; queenj++)
		{
			initchessboard[queen][queenj]=0;
		}
	}
	queens(n,m,0,initrow,initchessboard);
	
	res.send(solutions);

})

var server = app.listen(8080 , function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Server started...");
});