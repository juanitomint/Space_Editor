var git = require('gift');
var repo = git("/var/www/git.test");
var logErr=function(err){
    console.log('Errorrr');
    console.log(err);
}
repo.status(function(err, status) {
    if (err) {
        console.log(err);

    } else {
        console.log(status.files);

    }
repo.add(['Auth/OpenID.php','Auth/Yadis/HTTPFetcher.php'],logErr);
repo.identify({name:'Jhon Doe',email:'jdow@123.com'},logErr);
repo.commit('some changes',{},logErr);
});