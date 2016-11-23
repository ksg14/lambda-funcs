var xlsx = require( 'xlsx' );
var argv = require( 'yargs' )
            .usage('Usage: node $0 "string"')
            .demand(1)
            .argv;
var excelSearch = require( './excelCount' );

var isDigit = function( alpha ){

  alpha = alpha - '0';

  if( alpha >= 0 && alpha <= 9 )
    return 1;
  else
    return 0;
};

var getRow = function( cell_address ){

  var num = 0;

for (var i = 0; i < cell_address.length; i++) {

  if( isDigit( cell_address[i] ) )
    num = (num*10) + ( cell_address[i] - '0' );
}

  return num;
};

var getNameIndex = function(){
  //Make it general

  return 'B';
};

var getValueIndex = function(){
  //Make it general

  return 'D';
};

var workbook = xlsx.readFile( '/home/phiber/Desktop/Concentration Areas.xlsx' );

//console.log(workbook);

var first_sheet = workbook.SheetNames[0];
var address_of_cell = 'A1';

var worksheet = workbook.Sheets[first_sheet];

var cell = worksheet[address_of_cell];

var value = cell.v;

//console.log(value);
/*
xlsx.utils.sheet_to_json( worksheet, {header:1} );
console.log(worksheet.F1.v);
*/
var queryString = "\"" + argv._[0] + "\"";

//console.log( excelSearch.search( queryString ) );

var cell_address = excelSearch.search( queryString );

var row_index = getRow( cell_address );

//console.log(row);

var cell_index = getValueIndex() + row_index;

console.log( "\nHere you go : " + worksheet[cell_index].v );
