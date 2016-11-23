var xlsx = require( 'xlsx' );
/*
var argv = require( 'yargs' )
            .usage('Usage: node $0 "string"')
            .demand(1)
            .argv;
*/
module.exports.search = function ( queryString ) {

  var workbook = xlsx.readFile( '/home/phiber/Desktop/Concentration Areas.xlsx' );

  //console.log(workbook);

  var first_sheet = workbook.SheetNames[0];

  var worksheet = workbook.Sheets[first_sheet];

  //var queryString = "\"" + argv._[0] + "\"";
  //console.log("QueryString = " + queryString);

  //var count = 0;

  //Include substring

  for(cell in worksheet)
  {
    if(cell[0] === '!')
      continue;
    else
    {
      //console.log(cell);
        var str_in_sheet = JSON.stringify( worksheet[cell].v );
  //console.log(str_in_sheet);

        if(str_in_sheet === queryString)
        {
          //count++;
          //if(count == 1)
          //{
            return cell;
          //}
        }

    }
  }


  //Using For loop
  /*
  for (var row = range.s.r; row <= range.e.r; row++) {

    for (var col = range.s.c; col <= range.e.c; col++) {

      var cell_address = { c:col, r:row };

      var str_in_sheet = JSON.stringify( worksheet[cell_address].v );
  //console.log(str_in_sheet);

      if(str_in_sheet === queryString)
        count++;

    }
  }

  */
  //console.log("Frequency of Query : " + count);

  return "!";
};
