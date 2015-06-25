
var myData;
var searchterms="";
var tagID = 0;
var csvData = "";
var investors=[];

$(document).ready(function(){
    loadCategory();
    $('form').submit(function(event){
        event.preventDefault();
        console.log("Form delivered");
        tagID = getTag($('#searchtermid').val()).toString();
        getSearch(tagID); //investors is assigned inside async function 
        /* display the investors on the screen happens in getSearch async*/
    });
});

  function loadCategory () {
    var categoryArray="didn't load";
    var filename= 'https://gist.githubusercontent.com/eAndrius/b91588d0860edbb7af57/raw/d72dfa7735578f4d3ef6bf3009649a42f237ba4a/AngelList%20Markets.csv'
    var file = $.get(filename)
      .done(function(csvdata) {
        categoryArray = CSVToArray(file.responseText,",");   //callback
          for (i=0; i<categoryArray.length; i++) {
            var catItem = '<option value="' + categoryArray[i][2] + '">' + categoryArray[i][0] + '</option>';
            $( "select[name='verticals']" ).append(catItem);
          }
      });
  };

  function getTag() {
    /* get the tag from the form */
    return 2;
  };

  function getSearch(tagIDs){
    var params = {
      investors: 'by_residence',
      include_children:true
    };
    url = 'https://api.angel.co/1/tags/'+tagIDs+'/users';

    $.getJSON(url, params, function(data){
      console.log(data);
      investors = data.users;
      showResults(investors);
    });
  };

  function showResults (dataresults) {
    myData = dataresults;
    console.log(myData);
    for (i=0; i<myData.length; i++) {
      var inv = myData[i];
      var investorhtml = '<p><img src="'+inv.image +'" >' + inv.name + '<br>'+ inv.bio +inv.what_i_do + '</p>';
      console.log(investorhtml);
      jQuery('#results').append(investorhtml);
    }
  };

    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
  function CSVToArray( strData, strDelimiter ){
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      strDelimiter = (strDelimiter || ",");
      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp(
          (
              // Delimiters.
              "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
              // Quoted fields.
              "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
              // Standard fields.
              "([^\"\\" + strDelimiter + "\\r\\n]*))"
          ),
          "gi"
          );
      // Create an array to hold our data. Give the array
      // a default empty first row.
      var arrData = [[]];
      // Create an array to hold our individual pattern
      // matching groups.
      var arrMatches = null;
      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec( strData )){
          // Get the delimiter that was found.
          var strMatchedDelimiter = arrMatches[ 1 ];
          // Check to see if the given delimiter has a length
          // (is not the start of string) and if it matches
          // field delimiter. If id does not, then we know
          // that this delimiter is a row delimiter.
          if (
              strMatchedDelimiter.length &&
              (strMatchedDelimiter != strDelimiter)
              ){

              // Since we have reached a new row of data,
              // add an empty row to our data array.
              arrData.push( [] );

          }
          // Now that we have our delimiter out of the way,
          // let's check to see which kind of value we
          // captured (quoted or unquoted).
          if (arrMatches[ 2 ]){
              // We found a quoted value. When we capture
              // this value, unescape any double quotes.
              var strMatchedValue = arrMatches[ 2 ].replace(
                  new RegExp( "\"\"", "g" ),
                  "\""
                  );

          } else {
              // We found a non-quoted value.
              var strMatchedValue = arrMatches[ 3 ];
          }
          // Now that we have our value string, let's add
          // it to the data array.
          arrData[ arrData.length - 1 ].push( strMatchedValue );
      }
      // Return the parsed data.
      return( arrData );
  };


/*

Info on tags:
https://api.angel.co/1/tags/2001

Info on investors by location:
https://api.angel.co/1/tags/2001/users?include_children=true&investors=by_residence

Use python to extract tags from : view-source:https://angel.co/markets
Or use these: https://gist.github.com/dandrews/5366604
more up to date: https://gist.githubusercontent.com/eAndrius/b91588d0860edbb7af57/raw/d72dfa7735578f4d3ef6bf3009649a42f237ba4a/AngelList%20Markets.csv
https://gist.github.com/eAndrius/b91588d0860edbb7af57#file-angellist-markets-csv

*/
