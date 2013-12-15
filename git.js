var git = require('gift');
var repo = git("/var/www/git.test2");
repo.status(function(err, status) {
    if (err) {
        console.log(err);

    } else {
        console.log(status.files);

    }
});