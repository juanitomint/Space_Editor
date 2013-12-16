var git = require('gift');
var repo = git("/var/www/git.test");
var logErr = function(err) {
    console.log('Errorrr');
    console.log(err);
}
repo.status(function(err, status) {
    if (err) {
        console.log(err);
    } else {
        console.log(status.files);
    }
    /*repo.add(['Auth/OpenID.php','Auth/Yadis/HTTPFetcher.php'],logErr);
     repo.identify({name:'Jhon Doe',email:'jdow@123.com'},logErr);
     repo.commit('some changes',{},logErr);
     */
});
//repo.branches(function(err, heads) {
//    if (err) {
//        console.log(err);
//    } else {
//        for (var branch in heads) {
//            console.dir(heads[branch].name);
//        }
//    }
//});
repo.branch(function(err, head) {
    if (err) {
        console.log(err);
    } else {

        console.log('actual Branch:'+head.name);

    }
});