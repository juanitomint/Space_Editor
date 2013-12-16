/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fs = require('fs');
var path = require('path');
var baseDir=path.dirname(fs.realpathSync(__filename));
//var projects = [
//    {
//        name: 'Git Test',
//        url: 'http://localhost/git.test',
//        path: 'git.test'
//    },
//    {
//        name: 'DNA²',
//        url: 'http://localhost/dna2',
//        path: 'dna2'
//    },
//    {
//        name: 'DNA²BPM',
//        url: 'http://localhost/dna2bpm',
//        path: 'dna2bm'
//    }
//
//];
//var data = JSON.stringify(projects);
////---read projects
//fs.writeFile('./projects.json', data, function(err) {
//    if (err) {
//        console.log('There has been an error saving your configuration data.');
//        console.log(err.message);
//        return;
//    }
//    console.log('Configuration saved successfully.')
//});
console.dir(projects);
var projects = {};
readJSON(baseDir+'/projects.json', function(data, err) {
    if (err) {
        console.log('There has been an error parsing');
        console.log(err);
    }
    projects = data;
    console.log('Projects', projects);
});
function readJSON(file, callback) {
    try {
        var data = fs.readFileSync(file),
                myObj;
        try {
            myObj = JSON.parse(data);
            callback(myObj, null);
        }
        catch (err) {
            callback({}, err);
        }
    } catch (err) {
        callback({}, err);
    }
}