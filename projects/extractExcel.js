var unzip = require( 'unzip' );
var fs = require( 'fs' );

var zip_file_path = "/home/phiber/Desktop/22.10.2016 PM.zip";
var output_path = "/home/phiber/Desktop/";

fs.createReadStream( zip_file_path ).pipe(unzip.Extract({ path: output_path }));
