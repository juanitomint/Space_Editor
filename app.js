//
// SERVER-SIDE
// Node.JS! :)
//
console.log(".---------------------------.");
console.log("| * Starting Node service * |");
console.log("'---------------------------'");

var git = require("gift");
var express = require("express");
var util = require("util");
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var walk = require('walk');
var passport = require('passport'),
        util = require('util'),
        GoogleStrategy = require('passport-google').Strategy;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var _ = require('underscore');
// for showing hide dot folders/files
var showDotFolders = false;
var showDotFiles = true;
var groupFilesUsers = [];
var baseDir = path.dirname(fs.realpathSync(__filename));
console.log("'LOADING CONFIG:'");
var config = {};
readJSON(baseDir + '/config/config.json', function(data, err) {
    if (err) {
        console.log('There has been an error parsing');
        console.log(err);
    }
    config = data;
});
var port = process.env.WEB_PORT || config.port;
console.log("'LOADING PROJECTS:'", baseDir);
var projects = {};
readProjects();

//console.log(dirTree('/var/www/git.test'));
//process.exit();
// 
// ------------------------------------------------
// BASIC USER AUTH w/ EXPRESS
// ------------------------------------------------
function authorize(user, pw) {
    var userIsOk = false;
    userIsOk |= (user === 'user' && pw === 'password');
    return userIsOk;
}
/*
 * 
 * Auth with passport google
 * 
 */

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new GoogleStrategy({
    returnURL: config.google.returnUrl + ':' + port + '/auth/google/return',
    realm: config.google.returnUrl + ':' + port + '/'
},
function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {
        profile.identifier = identifier;
        return done(null, profile);
    });
}
));

var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
//app.use(passport.session());
app.use(express.session({
    secret: "a very secret secret",
    store: new express.session.MemoryStore,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30 * 2    //60 days
    }
}));
// Passport local
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
        function(username, password, done) {
            // asynchronous verification, for effect...
            process.nextTick(function() {

                // Find the user by username. If there is no user with the given
                // username, or the password is not correct, set the user to `false` to
                // indicate failure and set a flash message. Otherwise, return the
//      // authenticated `user`.
//      findByUsername(username, function(err, user) {
//        if (err) { return done(err); }
//        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
//        return done(null, user);
//      })

                //---fake obj
                user = {
                    username: username,
                    displayName: username,
                    emails: [{value: username}]
                };
                return done(null, user);
            });
        }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        //console.log(req.user);
        return next();
    }
    res.redirect('/login')
}

// configure Express
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    if (config.enableLog)
        app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({secret: 'keyboard cat'}));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/../../public'));
});

app.get('/account', ensureAuthenticated, function(req, res) {
    res.render('account', {user: req.user});
});

app.get('/login', function(req, res) {
    res.render('login', {
        user: req.user,
        query: req.query
    });
});
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this application at /auth/google/return
app.get('/auth/google',
        passport.authenticate('google', {failureRedirect: '/login'}),
function(req, res) {
    res.redirect('/');
});

// GET /auth/google/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/return',
        passport.authenticate('google', {failureRedirect: '/login'}),
function(req, res) {
    req.user = req.user || {};
    res.cookie("_username", req.user.emails[0].value);
    console.log("say hello to new user: " + req.user.displayName + ' knwon as:' + req.user.emails[0].value);
    res.redirect('/');
});
/*
 * 
 */
app.post('/auth/simple',
        passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
function(req, res) {
    req.user = req.user || {};
    res.cookie("_username", req.user.emails[0].value);
    console.log("say hello to new user: " + req.user.displayName);
    res.redirect('/' + req.body.fname);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//app.use(express.basicAuth(authorize));
var uCount = (new Date()).getTime() % 99999;

var staticProvider = express.static(__dirname + '/public');
app.use(staticProvider); // this is where static files will be served (html, css, js, media, etc.)
// ------------------------------------------------
// ------------------------------------------------

app.get('/', ensureAuthenticated, function(req, res, next) {
    req.url = "index.html";
    staticProvider(req, res, next);
});
app.use(function(req, res, next) {
    if (req.user) {
        req.user = req.user || {};
        res.cookie("_username", req.user.emails[0].value);
        console.log("say hello to new user: " + req.user.displayName);
        console.log(' knwon as:' + req.user.emails[0].value);
    }
    next();
});
var server = app.listen(port, '0.0.0.0');
console.log("Listen on http://localhost:" + port);
var EDITABLE_APPS_DIR = config.appsDir;
var ENABLE_LAUNCH = false;

var thisAppDirName = __dirname.substring(__dirname.lastIndexOf("/") + 1);
var teamID = config.defaultTeamId;
// ------------------------------------------------------------
// ------------------------------------------------------------
// TODO: check credentials before doing any of these GET/POST...
app.get("/allProjectFiles", function(req, res) {
    if (req.query.project && req.query.project.length > 2) {
        var project = req.query.project.replace(/\.\./g, "");
        var projectRoot = EDITABLE_APPS_DIR + project;
        console.log("Listing all project files [" + projectRoot + "] for user: " + req.user.displayName + " --> (~" + usersInGroup[project] + " sockets)");
        try {
            var walker = walk.walk(projectRoot, {followLinks: false});
            var filesAndInfo = [];
            walker.on("names", function(root, nodeNamesArray) {
                // use this to remove/sort files before doing the more expensive "stat" operation.
                for (var i = nodeNamesArray.length - 1; i >= 0; i--) {
                    if (nodeNamesArray[i] == ".git" || nodeNamesArray[i] == "node_modules" || nodeNamesArray[i] == "_db") {
                        nodeNamesArray.splice(i, 1);
                    }
                }
            });
            walker.on("file", function(root, fileStats, next) {
                var rt = root.substring(projectRoot.length + 1);
                if (rt.length > 0) {
                    rt += "/";
                }
                var fname = rt + fileStats.name;
                var sz = fileSizeCache[project + "/" + fname];
                if (sz === undefined) {
                    // first time checking files size.. get it!
                    sz = fileStats.size;
                    fileSizeCache[project + "/" + fname] = sz;
                }
                var td = fileTodoCache[project + "/" + fname];
                var fd = null;
                if (td === undefined && sz < 1000000) {
                    fd = fs.readFileSync(projectRoot + "/" + fname, "utf8");
                    td = occurrences(fd, "TODO");
                    fileTodoCache[project + "/" + fname] = td;
                }
                var fm = fileFixMeCache[project + "/" + fname];
                if (fm === undefined && sz < 1000000) {
                    if (fd === null) {
                        fd = fs.readFileSync(projectRoot + "/" + fname, "utf8");
                    }
                    fm = occurrences(fd, "FIXME");
                    fileFixMeCache[project + "/" + fname] = fm;
                }
                var n = usersInGroup[project + "/" + fname];
                if (n) {
                    filesAndInfo.push([fname, n, sz, td, fm]);
                } else {
                    filesAndInfo.push([fname, 0, sz, td, fm]);
                }
                fd = null;
                next();
            });
            walker.on("end", function() {
                //console.log("Recursively listed project files for: " + project);
                // indicate total team members online.
                var n = usersInGroup[project];
                if (n) {
                    filesAndInfo.push(["", n]);
                } else {
                    filesAndInfo.push(["", 0]);
                }
                res.send(JSON.stringify(filesAndInfo));
                //callback(null, filesAndInfo);
            });
        } catch (ex) {
            console.log("<span style='color: #F00;'>*** exception walking files!</span>");
            console.log(err);
        }
    } else {
        res.send("FAIL: no project name.");
    }
});

function dirTree(filename, projectRoot) {
//----return if file contains dot

    var stats = fs.statSync(filename);
    var info = {
        path: filename.replace(projectRoot, ''),
        //id: filename.replace(projectRoot, ''),
        id: filename.replace(projectRoot, '').replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_"),
        name: path.basename(filename),
        text: path.basename(filename)
    };
    //console.log(filename,stats);
    //console.log(filename,stats.isDirectory(), path.basename(filename)[0] !== '.', stats.isDirectory() && path.basename(filename)[0] !== '.');
    if (stats.isDirectory()) {
        if (path.basename(filename)[0] !== '.' || showDotFolders) {
            info.type = "folder";
            //info.id=info.id+'/';
            info.children = fs.readdirSync(filename).map(function(child) {
                return dirTree(filename + '/' + child, projectRoot);
            });
            info.children = info.children.filter(function(n) {
                if (n)
                    return n;
            });
            return info;
        }
    } else {
        if (path.basename(filename)[0] !== '.' || showDotFiles) {
            // Assuming it's a file. In real life it could be a symlink or
            // something else!
            info.type = "file";
            info.leaf = true;
            info.filesize = stats.size;
        }
        return info;
    }
}

app.get("/getFileTree", function(req, res) {
    if (req.query.project && req.query.project.length > 2) {
        var project = req.query.project.replace(/\.\./g, "");
        var projectRoot = EDITABLE_APPS_DIR + project;
        //---set globals 4 show/hide dot files/folders
        showDotFolders = (req.query.showDotFolders) ? true : config.tree.showDotFolders;
        console.log("Listing all project files [" + projectRoot + "] for user: " + req.user.displayName + " --> (~" + usersInGroup[project] + " sockets)");
        try {
            filesAndInfo = dirTree(projectRoot, projectRoot);
            res.setHeader('Content-type', 'application/json;charset=UTF-8');
            res.send('[' + JSON.stringify(filesAndInfo) + ']');
        } catch (ex) {
            console.log("<span style='color: #F00;'>*** exception walking files!</span>");
            console.log(err);
        }
    } else {
        res.send("FAIL: no project name.");
    }
});
app.get("/getProjectsTree", function(req, res) {
    if (req) {
        readProjects();
        var p = {
            path: "",
            id: "",
            name: "Projects",
            type: "folder",
        };
        var ps = [];
        for (i in projects) {
            ps[i] = projects[i];
            ps[i].id = ps[i].path;
            //---clear trivial passw
            if (ps[i].users) {

                for (j in ps[i].users) {
                    ps[i].users[j].id = ps[i].users[j].mail;
                    ps[i].users[j].leaf= true;
                    ps[i].users[j].iconCls='icon-user';
                    delete ps[i].users[j].passw;
                }
                //----4 tree
                ps[i].children = ps[i].users;
                delete ps[i].users;
            } else {
              ps[i].children=[];  
            }
        }
        p.children=ps;
        res.setHeader('Content-type', 'application/json;charset=UTF-8');

        res.send('[' +JSON.stringify(p)+']');
    }
});
app.post("/launchProject", function(req, res) {
    if (!ENABLE_LAUNCH) {
        res.send("FAIL: Sorry, but launching projects is not currently enabled.");
        return;
    }
    if (req.query.project && req.query.project.length > 2) {
        var projectName = req.query.project.replace(/\.\./g, "");
        console.log("LAUNCHING Project [" + req.user.displayName + "] >> " + projectName);
        var projPath = EDITABLE_APPS_DIR + projectName;
        exec('stop node_' + projectName, {
            encoding: 'utf8',
            timeout: 30000,
            maxBuffer: 200 * 1024,
            killSignal: 'SIGTERM',
            env: null
        },
        function(error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
                // return res.send("FAIL:");
            }
            console.log("STOP: " + stdout);
            exec('start node_' + projectName, {
                encoding: 'utf8',
                timeout: 30000,
                maxBuffer: 200 * 1024,
                killSignal: 'SIGTERM',
                env: null
            },
            function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    return res.send("FAIL:");
                }
                var launchURL = "http://" + projectName.toLowerCase() + ".chaoscollective.org/";
                console.log("START: " + stdout);
                console.log("DEPLOY SUCCESSFUL: " + launchURL);
                res.send("ok");
            }
            ); // exec 2
        }
        ); // exec 1
    } else {
        res.send("FAIL: no project name.");
    }
});
app.post("/createFile", function(req, res) {
    console.log("CREATE FILE [" + req.user.displayName + "]");
    if (req.query.project && req.query.project.length > 2 && req.body.fname) {
        var projectName = req.query.project.replace(/\.\./g, "");
        var fname = req.body.fname;
        if (!fname || fname.length < 2) {
            return;
        }
        var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
        var path = EDITABLE_APPS_DIR + projectName + "/" + safeFName;
        try {
            fs.realpathSync(path);
            console.log("file already exists.. no need to create it: " + path);
            return res.send("FAIL: File already exists. No need to create it.");
        } catch (ex) {
            console.log("file doesn't exist yet. creating it: " + path);
            fs.writeFile(path, "", function(err) {
                if (err) {
                    console.log(err);
                    return res.send("FAIL: Error creating new file.");
                } else {
                    localFileIsMostRecent[projectName + "/" + safeFName] = true; // mark file as saved with no pending changes.
                    console.log("FILE SAVED: " + safeFName);
                    res.send(safeFName);
                }
            });
        }
    } else {
        res.send("FAIL: no project and/or filename.");
    }
});
app.post("/deleteFile", function(req, res) {
    console.log("DELETE FILE [" + req.user.displayName + "]");
    if (req.query.project && req.query.project.length > 2 && req.body.fname) {
        var projectName = req.query.project.replace(/\.\./g, "");
        var fname = req.body.fname;
        if (!fname || fname.length < 2) {
            return;
        }
        var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
        var path = EDITABLE_APPS_DIR + projectName + "/" + safeFName;
        if (usersInGroup[projectName + "/" + safeFName]) {
            console.log("Delete stopped, users still in file: " + path);
            return res.send("FAIL: users still in file.");
        }
        try {
            fs.realpathSync(path);
            console.log("file exists.. delete it: " + path);
            fs.unlink(path, function(err) {
                if (err) {
                    console.log(err);
                    return res.send("FAIL: could not delete file.");
                }
                console.log("successfully deleted: " + path);
                return res.send(safeFName);
            });
        } catch (ex) {
            return res.send("FAIL: File doesn't exist. No need to delete it.");
        }
    } else {
        res.send("FAIL: no project and/or filename.");
    }
});
app.post("/renameFile", function(req, res) {
    console.log("RENAME FILE [" + req.user.displayName + "]");
    if (req.query.project && req.query.project.length > 2 && req.body.fname && req.body.newfname) {
        var projectName = req.query.project.replace(/\.\./g, "");
        var fname = req.body.fname;
        if (!fname || fname.length < 2) {
            return;
        }
        var newfname = req.body.newfname;
        if (!newfname || newfname.length < 2) {
            return;
        }
        var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
        var safeNewFName = newfname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
        var pathA = EDITABLE_APPS_DIR + projectName + "/" + safeFName;
        var pathB = EDITABLE_APPS_DIR + projectName + "/" + safeNewFName;
        try {
            fs.realpathSync(pathA);
            try {
                fs.realpathSync(pathB);
                // if pathB exists, don't do the rename -- it will copy over an existing file!
                console.log("trying to rename file to something that already exists: " + pathA + " >> " + pathB);
                return res.send("FAIL: Cannot rename a file to something that already exists.");
            } catch (ex2) {
                // ok, all set!
                //console.log("all set to rename file: " + pathA + " >> " + pathB);
                fs.rename(pathA, pathB, function(err) {
                    if (err) {
                        console.log(err);
                        return res.send("FAIL: Error renaming file.");
                    }
                    console.log("successfully renamed file [" + req.user.displayName + "]: " + pathA + " >> " + pathB);
                    return res.send(safeNewFName);
                });
            }
        } catch (ex) {
            console.log("trying to rename a file that doesn't exist: " + pathA);
            return res.send("FAIL: File doesn't exist. Cannot rename it.");
        }
    } else {
        res.send("FAIL: no project and/or filename.");
    }
});
app.post("/duplicateFile", function(req, res) {
    console.log("DUPLICATE FILE [" + req.user.displayName + "]");
    if (req.query.project && req.query.project.length > 2 && req.body.fname && req.body.newfname) {
        var projectName = req.query.project.replace(/\.\./g, "");
        var fname = req.body.fname;
        if (!fname || fname.length < 2) {
            return;
        }
        var newfname = req.body.newfname;
        if (!newfname || newfname.length < 2) {
            return;
        }
        var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
        var safeNewFName = newfname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
        var pathA = EDITABLE_APPS_DIR + projectName + "/" + safeFName;
        var pathB = EDITABLE_APPS_DIR + projectName + "/" + safeNewFName;
        try {
            fs.realpathSync(pathA);
            try {
                fs.realpathSync(pathB);
                // if pathB exists, don't do the rename -- it will copy over an existing file!
                console.log("trying to duplicate file to something that already exists: " + pathA + " >> " + pathB);
                return res.send("FAIL: Cannot duplicate a file to something that already exists.");
            } catch (ex2) {
                // ok, all set!
                var is = fs.createReadStream(pathA);
                var os = fs.createWriteStream(pathB);
                util.pump(is, os, function(err) {
                    if (err) {
                        console.log(err);
                        return res.send("FAIL: Error duplicating file.");
                    }
                    console.log("successfully duplicated file [" + req.user.displayName + "]: " + pathA + " >> " + pathB);
                    return res.send(safeNewFName);
                });
            }
        } catch (ex) {
            console.log("trying to duplicate a file that doesn't exist: " + pathA);
            return res.send("FAIL: File doesn't exist. Cannot duplicate it.");
        }
    } else {
        res.send("FAIL: no project and/or filename.");
    }
});
app.get("/allUsersEditingProjectsIFrame", function(req, res) {
    var html = "<html></head><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script><head><body><script>";
    //html += "var u = "+JSON.stringify(nowUsersList)+";";
    html += "function receiveMessage(event){var o = event.origin; var p = parent; $.get('/allUsersEditingProjects', function(data){p.postMessage(JSON.parse(data), o);});};";
    html += "window.addEventListener('message', receiveMessage, false);";
    html += "</script></body></html>";
    res.send(html);
});
app.get("/allUsersEditingProjects", function(req, res) {
    var nowUsers = everyone.users || {}; //nowjs.server.connected || {};
    var nowUsersList = [];
    _.each(nowUsers, function(val, name) {
        var u = (val || {}).user || {};
        var a = u.about || {};
        a.grouplist = u.grouplist;
        nowUsersList.push(a);
    });
    /*
     var html = "<html></head><head><body><script>";
     html += "var u = "+JSON.stringify(nowUsersList)+";";
     html += "function receiveMessage(event){parent.postMessage(u, event.origin);};";
     html += "window.addEventListener('message', receiveMessage, false);";
     html += "</script></body></html>";
     res.send(html);
     */
    res.send(JSON.stringify(nowUsersList));
});
// ------------------------------------------------------------
// ------------------------------------------------------------
var localFileIsMostRecent = []; // an array of flags indicating if the file has been modified since last save.
var nowjs = require("now");
var everyone = nowjs.initialize(server);
// ------ REALTIME NOWJS COLLABORATION ------
//var nowcollab = require("../CHAOS/nowcollab");
//nowcollab.initialize(nowjs, everyone, true);
//-------------------------------------------
nowjs.on('connect', function() {
    console.log("CONNECT    > " + this.user.clientId);
    this.user.teamID = teamID;
    if (this.now.teamID != undefined) {
        this.user.teamID = this.now.teamID;
    }
    //console.log(this.user);
    //console.log(everyone.users);
    console.log(" >> PROJECT:" + this.user.teamID);
    // hack to get out best guess at the user (since now.js doesn't give us the request object or session!);
    var u = {}; //(Auth || {}).getUserFromCache(decodeURIComponent(this.user.cookie['_chaos.auth'])) || {};
    // now populate it..
    this.user.about = {};
    this.user.about._id = u._id || 0;
    this.user.about.name = u.nameGiven || u.displayName || decodeURIComponent(this.user.cookie["_username"]) || "???";
    this.user.about.email = u.emailPrimary || this.user.about.name + "@mail.org";
    // -----
    this.now.name = this.user.about.name;
    this.now.userID = this.user.about._id;
    // -----
    this.user.grouplist = []; // file groups starts out empty.
    addUserToGroup(this.user, this.user.teamID); // the blank file group is the the team group.
    this.now.c_confirmProject(this.user.teamID);
});
nowjs.on('disconnect', function() {
    //console.log("DISCONNECT > "+this.user.clientId+" >> "+this.user.about.name+" <"+this.user.about.email+">"); 
    //console.log("DISCONNECT > "+this.user.clientId+" >> "+this.now.name); 
    //---cleanup presence
    for (var fname in groupFilesUsers) {
        if (fname)
            removeUserFromFileGroup(this.user, fname);
    }
    var teamgroup = nowjs.getGroup(this.user.teamID);
    // remove user from all file groups.
    if (this.user.grouplist !== undefined) {
        for (var i = this.user.grouplist.length - 1; i >= 0; i--) {
            var g = this.user.grouplist[i];
            if (g) {
                var fname = g.substring(g.indexOf("/") + 1);
            }
            usersInGroupMinusMinus(g);
            teamgroup.now.c_processUserFileEvent(fname, "leaveFile", this.user.clientId, usersInGroup[g]);
        }
    }
    // finally, remove the user from the team group. (don't need this now since team is also in user.grouplist)
    teamgroup.now.c_processUserEvent("leave", this.user.clientId, this.now.name);
});
//---------
// NOW: Remote collab messages.
everyone.now.s_updateTree = function() {
    for (var fname in groupFilesUsers) {
        if (fname != '') {
            if (groupFilesUsers[fname])
                this.now.c_setUsersInFile(fname, groupFilesUsers[fname].length);
        }
    }
}
everyone.now.s_setTeamID = function(val) {
    this.user.teamID = val;
    clientId = this.now.clientId;
    addUserToGroup(this.user, this.user.teamID);
    var teamgroup = nowjs.getGroup(this.user.teamID);
    for (var clt in teamgroup.users) {
        if (teamgroup.users.hasOwnProperty(clt)) {
            var user = teamgroup.users[clt].user
            //---send userifo to clients
            if (user.about) {
                teamgroup.now.c_addCollaborator(user);
            }
        }
    }
}
everyone.now.s_sendCursorUpdate = function(fname, range, changedByUser) {
    var userObj = this.user;
    var filegroup = nowjs.getGroup(userObj.teamID + "/" + fname);
    //console.log(filegroup);
    filegroup.now.c_updateCollabCursor(this.user.clientId, this.now.name, range, changedByUser, fname);
};
everyone.now.s_sendDiffPatchesToCollaborators = function(fname, patches, crc32) {
    var userObj = this.user;
    localFileIsMostRecent[userObj.teamID + "/" + fname] = false; // mark file as changed.
    var filegroup = nowjs.getGroup(userObj.teamID + "/" + fname);
    filegroup.now.c_updateWithDiffPatches(this.user.clientId, patches, crc32, fname);
};
// NOW: Remote file tools.
everyone.now.s_getLatestFileContentsAndJoinFileGroup = function(fname, fileRequesterCallback) {
    var callerID = this.user.clientId;
    var userObj = this.user;
    addUserToFileGroup(userObj, fname);
    //removeUserFromAllFileGroupsAndAddToThis(origUser, fname);
    if (localFileIsMostRecent[userObj.teamID + "/" + fname] === true || localFileIsMostRecent[userObj.teamID + "/" + fname] === undefined) {
        localFileFetch(userObj, fname, fileRequesterCallback);
        //console.log("FILE FETCH: " + userObj.teamID + " >> " + fname + ", by user: " + (userObj.about.name || callerID));
    } else {
        console.log("FILE FETCH (passed to user): " + userObj.teamID + " >> " + fname + ", by user: " + callerID);
        var filegroup = nowjs.getGroup(userObj.teamID + "/" + fname);
        var users = filegroup.getUsers(function(users) {
            var foundUser = false;
            for (var i = 0; i < users.length; i++) {
                if (users[i] != callerID) {
                    // this looks like a valid user to get the file from. :)
                    console.log("Trying to get file from: " + users[i]);
                    nowjs.getClient(users[i], function() {
                        if (this.now === undefined) {
                            console.log("Undefined clientId for requestFullFileFromUserID (using local) >> " + users[i]);
                            localFileFetch(userObj, fname, fileRequesterCallback);
                        } else {
                            this.now.c_userRequestedFullFile(fname, callerID, fileRequesterCallback);
                        }
                    });
                    foundUser = true;
                    break;
                }
            }
            if (!foundUser) {
                console.log("Flagged as changed, but no user with file: " + userObj.teamID + " >> " + fname + " >> FETCHING last saved.");
                localFileFetch(userObj, fname, fileRequesterCallback);
            }
        });
    }
};
everyone.now.s_saveUserFileContentsToServer = function(fname, fcontents, fileSaverCallback) {
    localFileSave(this.user, fname, fcontents, fileSaverCallback);
};
//-------
// get rid of this is possible...
everyone.now.s_requestFullFileFromUserID = function(fname, id, fileRequesterCallback) {
    var callerID = this.user.clientId;
    var userObj = this.user;
    var filegroup = nowjs.getGroup(userObj.teamID + "/" + fname);
    filegroup.hasClient(id, function(bool) {
        if (bool) {
            //console.log("requesting full file. valid filegroup. :)");
            nowjs.getClient(id, function() {
                if (this.now === undefined) {
                    console.log("Undefined clientId for requestFullFileFromUserID >> " + id);
                } else {
                    this.now.c_userRequestedFullFile(fname, callerID, fileRequesterCallback);
                }
            });
        }
    });
};
//-------
everyone.now.s_teamMessageBroadcast = function(type, message) {
    var teamgroup = nowjs.getGroup(this.user.teamID);
    var scope = "team";
    var fromUserId = this.user.clientId;
    var fromUserName = this.now.name;
    teamgroup.now.c_processMessage(scope, type, message, fromUserId, fromUserName);
};
everyone.now.s_enterFile = function(fname) {
    var teamgroup = nowjs.getGroup(this.user.teamID);
    var scope = "team";
    var fromUserId = this.user.clientId;
    var fromUserName = this.now.name;
    addUserToFileGroup(this.user, fname);
    teamgroup.now.c_processMessage(scope, 'type', "opened:" + fname, fromUserId, fromUserName);
};
everyone.now.s_leaveFile = function(fname) {
    var teamgroup = nowjs.getGroup(this.user.teamID);
    var fromUserId = this.user.clientId;
    removeUserFromFileGroup(this.user, fname);
};
everyone.now.s_sendUserEvent = function(event) {
    var teamgroup = nowjs.getGroup(this.user.teamID);
    var fromUserId = this.user.clientId;
    var fromUserName = this.now.name;
    teamgroup.now.c_processUserEvent(event, fromUserId, fromUserName);
};
//-------
everyone.now.s_getAllProjectsFiles = function(callback) {
    var team = this.user.teamID;
    var projectRoot = EDITABLE_APPS_DIR + team;
    var walker = walk.walk(projectRoot, {followLinks: false});
    var filesAndInfo = [];
    walker.on("names", function(root, nodeNamesArray) {
        // use this to remove/sort files before doing the more expensive "stat" operation.
        //console.log(root + " / " + nodeNamesArray);
        for (var i = nodeNamesArray.length - 1; i >= 0; i--) {
            if (nodeNamesArray[i] == ".git" || nodeNamesArray[i] == "node_modules" || nodeNamesArray[i] == "_db") {
                nodeNamesArray.splice(i, 1);
            }
        }
    });
    walker.on("file", function(root, fileStats, next) {
        var rt = root.substring(projectRoot.length + 1);
        if (rt.length > 0) {
            rt += "/";
        }
        var fname = rt + fileStats.name;
        var sz = fileSizeCache[team + "/" + fname];
        if (sz === undefined) {
            // first time checking files size.. get it!
            sz = fileStats.size;
            fileSizeCache[team + "/" + fname] = sz;
        }
        var n = usersInGroup[team + "/" + fname];
        if (n) {
            filesAndInfo.push([fname, n, sz]);
        } else {
            filesAndInfo.push([fname, 0, sz]);
        }
        next();
    });
    walker.on("end", function() {
        console.log("Recursively listed project files for: " + team);
        // indicate total team members online.
        var n = usersInGroup[team];
        if (n) {
            filesAndInfo.push(["", n]);
        } else {
            filesAndInfo.push(["", 0]);
        }
        callback(null, filesAndInfo);
    });
};
everyone.now.s_createNewFolder = function(newFoldername, fileCreatorCallback) {
    localFolderCreate(this.user, newFoldername, fileCreatorCallback);
};
everyone.now.s_deleteFolder = function(newFoldername, fileCreatorCallback) {
    localFolderDelete(this.user, newFoldername, fileCreatorCallback);
};
everyone.now.s_createNewFile = function(newFilename, fileCreatorCallback) {
    localFileCreate(this.user, newFilename, fileCreatorCallback);
};
everyone.now.s_deleteFile = function(fname, fileDeleterCallback) {
    var usersInFile = usersInGroup[this.user.teamID + fname];
    if (usersInFile === undefined || usersInFile === 0) {
        localFileDelete(this.user, fname, fileDeleterCallback);
    } else {
        console.log("Cannot delete file. There are users in it! " + this.user.teamID + " >> " + fname);
        fileCallback(fname, ["Cannot delete file. There are users in it!"]);
    }
};
everyone.now.s_renameFile = function(fname, newFName, fileRenamerCallback) {
    var usersInFile = usersInGroup[this.user.teamID + fname];
    if (usersInFile === undefined || usersInFile === 0) {
        localFileRename(this.user, fname, newFName, fileRenamerCallback);
    } else {
        console.log("Cannot rename file. There are users in it! " + this.user.teamID + " >> " + fname);
        fileCallback(fname, ["Cannot rename file. There are users in it!"]);
    }
};
everyone.now.s_duplicateFile = function(fname, newFName, fileDuplicatorCallback) {
    localFileDuplicate(this.user, fname, newFName, fileDuplicatorCallback);
};
//---GIT Related Functions
everyone.now.s_git_status = function(committerCallback) {
    var team = this.user.teamID;
    console.log("git tatus project... >> " + team);
    var teamProjGitPath = EDITABLE_APPS_DIR + team;
    var repo = git(teamProjGitPath);
    var status = {};
    var err = null
    repo.status(committerCallback);
}
everyone.now.s_git_branch = function(committerCallback) {
    var team = this.user.teamID;
    console.log("git branch... >> " + team);
    var teamProjGitPath = EDITABLE_APPS_DIR + team;
    var repo = git(teamProjGitPath);
    var err = null
    repo.branch(committerCallback);
}
everyone.now.s_git_commit = function(txt, paths, committerCallback) {
    var team = this.user.teamID;
    console.log("committing project... >> " + team);
    var teamProjGitPath = EDITABLE_APPS_DIR + team;
    var safeMsg = Utf8.encode(txt).replace(/\"/g, "\\\"");
    var repo = git(teamProjGitPath);
    repo.add(paths, function(err) {
        if (err)
            committerCallback(err);
    });
    repo.identify({name: this.user.about.name, email: this.user.about.email}, function(err) {
        if (err)
            committerCallback(err);
    });
    repo.commit(safeMsg, {}, function(err) {
        committerCallback(err);
    });

};

everyone.now.s_git_fetchCommits = function(fetcherCallback) {
    var team = this.user.teamID;
    console.log("fetching project commits... >> " + team);
    var teamProjGitPath = EDITABLE_APPS_DIR + team;
    localRepoFetchGitLog(this.user, teamProjGitPath, "", function(err, gitlog) {
        if (err) {
            console.log(err);
            if (err && err[0] && err[0].indexOf("Not a git repository") > 0) {
                localRepoInitBare(teamProjGitPath, function(err) {
                    if (err) {
                        console.log("ERROR INITITIALIZING GIT REPO.");
                    } else {
                        console.log("Returned from git repo init.");
                    }
                });
            }
        }
        fetcherCallback(gitlog);
    });
};
everyone.now.s_deployProject = function(txt, deployerCallback) {
    var team = this.user.teamID;
    console.log("DEPLOYING Project >> " + team);
    localProjectDeploy(this.user, deployerCallback);
};
//--------
//
//   Project Functions
//
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

function readProjects() {
    readJSON(baseDir + '/config/projects.json', function(data, err) {
        if (err) {
            console.log('There has been an error parsing');
            console.log(err);
        }
        projects = data;
        console.log('Projects', projects);
    });
}

////
// Git Repository management stuff.
//
function localRepoInitBare(gitRepoPath, paths, callback) {
    var child = exec('git init', {
        encoding: 'utf8',
        timeout: 30000,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        cwd: gitRepoPath,
        env: null
    }, function(error, stdout, stderr) {
        if (error !== null) {
            console.log('git init exec error: ' + error);
        }
        console.log("GIT: Init >> " + gitRepoPath);
        callback(error);
    });
}
function localRepoCommit(userObj, gitRepoPath, message, callback) {
    var safeMsg = Utf8.encode(message).replace(/\"/g, "\\\"");
    var authString = userObj.about.name + " <" + userObj.about.email + ">";
    var safeAuthString = Utf8.encode(authString).replace(/\"/g, "\\\"");
    console.log("GIT: Commit to  >> " + gitRepoPath + " by: " + safeAuthString);
    var child = exec('git add .; git commit -a --allow-empty --allow-empty-message --author=\"' + safeAuthString + '\" -m \"' + safeMsg + '\";', {
        encoding: 'utf8',
        timeout: 30000,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        cwd: gitRepoPath,
        env: null
    }, function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        } else {
            // success! notify team members.
            var teamgroup = nowjs.getGroup(userObj.teamID);
            var fromUserId = userObj.clientId;
            teamgroup.now.c_processUserFileEvent("", "commitProject", fromUserId, 0, "", safeMsg);
        }
        callback(error);
    });
}
function localRepoFetchGitLog(userObj, gitRepoPath, fname, fetcherCallback) {
    // TODO: Make the filtering part of the git command, not an after thought with a ton of results.
    // Seeing all checkpoints since the beginning of a project could lead to looking at many thousand results...
    var authString = userObj.about.name + " <" + userObj.about.email + ">";
    var safeAuthString = Utf8.encode(authString).replace(/\"/g, "\\\"");
    var maxInitialFetch = 10; // hardcoded max value so things don't get crazy until it's explicitly part of the git command...    
    var maxResults = 5;
    var saveThisEntry = false;
    var filter = null;
    console.log("GIT: Fetch commit logs from  >> " + gitRepoPath + " by: " + safeAuthString);
    var cmd = "git log -n" + maxInitialFetch + " --numstat --pretty=format:\"commit  %H%naname   %an%namail   %ae%nrdate   %ar%nutime   %at%ncnote   %s\" -- " + fname;
    //console.log(cmd);
    var child = exec(cmd, {
        encoding: 'utf8',
        timeout: 30000,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        cwd: gitRepoPath,
        env: null
    },
    function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
            if (fetcherCallback) {
                fetcherCallback(error, null);
            }
        } else {
            // success! notify team members.
            var teamgroup = nowjs.getGroup(userObj.teamID);
            var fromUserId = userObj.clientId;
            //teamgroup.now.c_processUserFileEvent("", "commitProject", fromUserId, 0, "", safeMsg);
            console.log("***** STD OUT *****");
            var logLines = stdout.split("\n");
            //console.log(logLines);
            var out = [];
            for (var i = 0; i < logLines.length; i++) {
                var line = logLines[i];
                if (line.indexOf("commit") == 0) {
                    // new entry.. first check if we've hit max entries
                    if (out.length >= maxResults) {
                        break;
                    }
                    out.push({}); // start a new array
                    out[out.length - 1]['commit'] = line.substring(8);
                    saveThisEntry = true;
                }
                if (saveThisEntry) {
                    if (line.indexOf("aname") == 0) {
                        out[out.length - 1]['auth_name'] = line.substring(8);
                    }
                    if (line.indexOf("amail") == 0) {
                        out[out.length - 1]['auth_email'] = line.substring(8);
                    }
                    if (line.indexOf("rdate") == 0) {
                        out[out.length - 1]['time_relative'] = line.substring(8);
                    }
                    if (line.indexOf("utime") == 0) {
                        out[out.length - 1]['time_epoch'] = line.substring(8);
                    }
                    if (line.indexOf("cnote") == 0) {
                        var comment = line.substring(8);
                        out[out.length - 1]['comment'] = comment;
                        if (filter != null) {
                            if (comment.indexOf(filter) < 0) {
                                out.pop();
                                saveThisEntry = false;
                            }
                        }
                    }
                    if (line.length > 0 && !isNaN(line.charAt(0))) {
                        //echo "numeric line.. counting changes!\n";
                        var numArray = line.split("\t");
                        if (numArray.length >= 2 && !isNaN(numArray[0]) && !isNaN(numArray[1]) && numArray[0] != "-" && numArray[1] != "-") {
                            out[out.length - 1]['linesAdded'] = numArray[0];
                            out[out.length - 1]['linesDeleted'] = numArray[1];
                        }
                    }
                }
            }
            //console.log(out);
            fetcherCallback(null, out);
        }
    });
}
//
// group management stuff.
//
var usersInGroup = {};
function addUserToGroup(userObj, groupname) {
    var g = nowjs.getGroup(groupname);
    if (!g.users[userObj.clientId]) {
        // user not in group yet.
        // add to NOW group.
        g.addUser(userObj.clientId);
        // add to local group.
        userObj.grouplist = (userObj.grouplist) ? userObj.grouplist : [];
        userObj.grouplist.push(groupname);
        // keep track locally of users in group.
        usersInGroupPlusPlus(groupname);
        //if (fname.length > 0) {
        var teamgroup = nowjs.getGroup(userObj.teamID);
        //} 
        //----tell others user has joined
        g.now.c_processUserEvent("join", userObj.clientId, userObj.name);
        console.log("Added user " + userObj.clientId + " to group: " + groupname);
    } else {
        console.log("no need to add user " + userObj.clientId + " to group: " + groupname + " ???");
        //console.log(g.users[userObj.clientId]);
    }
}
function addUserToFileGroup(userObj, fname) {
    var groupname = userObj.teamID;
    //----keep track of who is where
    if (groupFilesUsers[fname] == null) {
        groupFilesUsers[fname] = [];
    }
    console.log('add', groupFilesUsers)
    console.log('-----------------------------------------------');
    if (groupFilesUsers[fname].indexOf(userObj.clientId) == -1) {
        groupFilesUsers[fname].push(userObj.clientId);
    }
    if (fname && fname !== "") {
        groupname += "/" + fname;
    }
    //console.log("ADD TO GROUP: " + groupname);
    //console.log("        team: " + userObj.teamID);
    //console.log("       fname: " + fname);
    var teamgroup = nowjs.getGroup(userObj.teamID);
    teamgroup.now.c_processUserFileEvent(fname, 'joinFile', userObj.clientId);
    addUserToGroup(userObj, groupname);
    update_all_trees();
}
function update_all_trees() {
    for (var fname in groupFilesUsers) {
        if (fname != '') {
            if (groupFilesUsers[fname])
                everyone.now.c_setUsersInFile(fname, groupFilesUsers[fname].length);
        }
    }
}
function removeUserFromFileGroup(userObj, fname) {
    console.log('Removing: ', userObj.clientId, ' from: ' + fname);
    var groupname = userObj.teamID;
    // Find and remove item from an array
    if (groupFilesUsers[fname]) {
        var i = groupFilesUsers[fname].indexOf(userObj.clientId);
        if (i != -1) {
            groupFilesUsers[fname].splice(i, 1);
        }
    }
    console.log('removed');
    console.log(groupFilesUsers);
    console.log('-----------------------------------------------');

    if (fname && fname !== "") {
        groupname += "/" + fname;
    }
    var g = nowjs.getGroup(groupname);
    if (g.users[userObj.clientId]) {
        // user was in group.
        // remove user from NOW group.
        g.removeUser(userObj.clientId);
        // remove user from local group.
        for (var i = userObj.grouplist.length; i >= 0; i--) {
            if (userObj.grouplist[i] == groupname) {
                userObj.grouplist.splice(i, 1);
            }
        }
        // keep track locally of users in group.
        usersInGroupMinusMinus(groupname);
        if (fname.length > 0) {
            //var teamgroup = nowjs.getGroup(userObj.teamID);
            g.now.c_processUserFileEvent(fname, "leaveFile", userObj.clientId, usersInGroup[groupname]);
        }
        //console.log("Removed user " + userObj.clientId + " from: " + groupname);
    } else {
        //console.log(g);
        //console.log("no need to remove user " + userObj.clientId + " from group: " + groupname + " ???");
    }
    update_all_trees();
}
function usersInGroupPlusPlus(group) {
    if (usersInGroup[group]) {
        usersInGroup[group]++;
    } else {
        usersInGroup[group] = 1;
    }
    //console.log("UsersInGroup(+): " + group + " >> " + usersInGroup[group]);
}
function usersInGroupMinusMinus(group) {
    if (usersInGroup[group]) {
        usersInGroup[group]--;
    } else {
        usersInGroup[group] = 0;
    }
    //console.log("UsersInGroup(-): " + group + " >> " + usersInGroup[group]);
}
//
// local file stuff
//
var fileSizeCache = {};
var fileTodoCache = {};
var fileFixMeCache = {};
function localFileFetch(userObj, fname, fileRequesterCallback) {
    var team = userObj.teamID;
    fs.readFile(EDITABLE_APPS_DIR + team + "/" + fname, "utf-8", function(err, data) {
        if (err) {
            console.warn("couldn't open: " + team + "/" + fname);
        }
        fileRequesterCallback(fname, data, err, true);
    });
}
function localFileSave(userObj, fname, fcontents, fileSaverCallback) {
    var team = userObj.teamID;
    fs.writeFile(EDITABLE_APPS_DIR + team + "/" + fname, fcontents, function(err) {
        if (err) {
            console.log(err);
        } else {
            localFileIsMostRecent[team + "/" + fname] = true; // mark file as saved with no pending changes.
            console.log("FILE SAVED: " + team + "/" + fname);
            var filegroup = nowjs.getGroup(team + "/" + fname);
            filegroup.now.c_fileStatusChanged(fname, "saved");
            var sz = fcontents.length;
            fileSizeCache[team + "/" + fname] = sz;
            if (sz < 1000000) {
                fileTodoCache[team + "/" + fname] = occurrences(fcontents, "TODO");
                fileFixMeCache[team + "/" + fname] = occurrences(fcontents, "FIXME");
            }
        }
        fileSaverCallback(err);
    });
}
// ---------Folder Functions
function localFolderCreate(userObj, fname, fileCreatorCallback) {
    var team = userObj.teamID;
    if (!fname) {
        return;
    }
    var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '').replace('//', '/');
    var path = EDITABLE_APPS_DIR + team + safeFName;
    path = path.replace('//', '/');
    try {
        fs.realpathSync(path);
        console.log("file already exists.. no need to create it: " + path);
        fileCreatorCallback(safeFName, ["File already exists. No need to create it."]);
    } catch (ex) {
        console.log("file doesn't exist yet. creating it: " + path);
        try {
            fs.mkdir(path, '644', function(err) {
                if (err) {
                    console.log(err);
                } else {


                }
                var teamgroup = nowjs.getGroup(userObj.teamID);
                var fromUserId = userObj.clientId;
                teamgroup.now.c_processUserFileEvent(safeFName, "createFolder", fromUserId, 0);
                fileCreatorCallback(safeFName, err);
            });
        } catch (err) {
            fileCreatorCallback(safeFName, err);
        }
    }
}
function localFolderDelete(userObj, fname, folderDeleterCallback) {
    var team = userObj.teamID;
    if (!fname) {
        return;
    }
    var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '').replace('//', '/');
    var path = EDITABLE_APPS_DIR + team + "/" + safeFName;
    path = path.replace('//', '/');
    try {
        fs.realpathSync(path);
        console.log("all set to delete folder: " + path);
        fs.rmdir(path, function(err) {
            if (err)
                throw err;
            console.log("successfully deleted: " + path);
            var teamgroup = nowjs.getGroup(userObj.teamID);
            var fromUserId = userObj.clientId;
            teamgroup.now.c_processUserFileEvent(safeFName, "deleteFolder", fromUserId, 0);
            folderDeleterCallback(safeFName, []);
        });
    } catch (ex) {
        console.log("trying to delete file, but it doesn't exist: " + path);
        folderDeleterCallback(safeFName, ["File doesn't exist. No need to delete it."]);
    }
}
// ---------File Functions
function localFileCreate(userObj, fname, fileCreatorCallback) {
    var team = userObj.teamID;
    if (!fname) {
        return;
    }
    var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
    var path = EDITABLE_APPS_DIR + team + "/" + safeFName;
    try {
        fs.realpathSync(path);
        console.log("file already exists.. no need to create it: " + path);
        fileCreatorCallback(safeFName, ["File already exists. No need to create it."]);
    } catch (ex) {
        console.log("file doesn't exist yet. creating it: " + path);
        fs.writeFile(path, "", function(err) {
            if (err) {
                console.log(err);
            } else {
                localFileIsMostRecent[teamID + safeFName] = true; // mark file as saved with no pending changes.
                console.log("FILE SAVED: " + safeFName);
                var filegroup = nowjs.getGroup(teamID + safeFName);
                filegroup.now.c_fileStatusChanged(safeFName, "saved");
            }
            var teamgroup = nowjs.getGroup(userObj.teamID);
            var fromUserId = userObj.clientId;
            teamgroup.now.c_processUserFileEvent(safeFName, "createFile", fromUserId, 0);
            fileCreatorCallback(safeFName, err);
        });
    }
}
function localFileDelete(userObj, fname, fileDeleterCallback) {
    var team = userObj.teamID;
    if (!fname) {
        return;
    }
    var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
    var path = EDITABLE_APPS_DIR + team + "/" + safeFName;
    try {
        fs.realpathSync(path);
        console.log("all set to delete file: " + path);
        fs.unlink(path, function(err) {
            if (err)
                throw err;
            console.log("successfully deleted: " + path);
            var teamgroup = nowjs.getGroup(userObj.teamID);
            var fromUserId = userObj.clientId;
            teamgroup.now.c_processUserFileEvent(safeFName, "deleteFile", fromUserId, 0);
            fileDeleterCallback(safeFName, []);
        });
    } catch (ex) {
        console.log("trying to delete file, but it doesn't exist: " + path);
        fileDeleterCallback(safeFName, ["File doesn't exist. No need to delete it."]);
    }
}
function localFileRename(userObj, fname, newFName, fileRenamerCallback) {
    var team = userObj.teamID;
    if (!fname || !newFName) {
        return;
    }
    var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
    var safeNewFName = newFName.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
    var pathA = EDITABLE_APPS_DIR + team + "/" + safeFName;
    var pathB = EDITABLE_APPS_DIR + team + "/" + safeNewFName;
    try {
        fs.realpathSync(pathA);
        try {
            fs.realpathSync(pathB);
            // if pathB exists, don't do the rename -- it will copy over an existing file!
            console.log("trying to rename file to something that already exists: " + pathA + " >> " + pathB);
            fileRenamerCallback(safeFName, ["Cannot rename a file to something that already exists."]);
        } catch (ex2) {
            // ok, all set!
            console.log("all set to rename file: " + pathA + " >> " + pathB);
            fs.rename(pathA, pathB, function(err) {
                if (err)
                    throw err;
                console.log("successfully renamed file: " + pathA + " >> " + pathB);
                var teamgroup = nowjs.getGroup(userObj.teamID);
                var fromUserId = userObj.clientId;
                teamgroup.now.c_processUserFileEvent(safeFName, "renameFile", fromUserId, 0, safeNewFName);
                fileRenamerCallback(safeFName, []);
            });
        }
    } catch (ex) {
        console.log("trying to rename a file that doesn't exist: " + pathA);
        fileRenamerCallback(safeFName, ["File doesn't exist. Cannot rename it."]);
    }
}
function localFileDuplicate(userObj, fname, newFName, fileDuplicatorCallback) {
    var team = userObj.teamID;
    if (!fname || !newFName) {
        return;
    }
    var safeFName = fname.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
    var safeNewFName = newFName.split("..").join("").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
    var pathA = EDITABLE_APPS_DIR + team + "/" + safeFName;
    var pathB = EDITABLE_APPS_DIR + team + "/" + safeNewFName;
    try {
        fs.realpathSync(pathA);
        try {
            fs.realpathSync(pathB);
            // if pathB exists, don't do the rename -- it will copy over an existing file!
            console.log("trying to duplicate file but it already exists: " + pathA + " >> " + pathB);
            fileDuplicatorCallback(safeFName, ["Cannot duplicate a file to something that already exists."]);
        } catch (ex2) {
            // ok, all set!
            console.log("all set to duplicate file: " + pathA + " >> " + pathB);
            var is = fs.createReadStream(pathA);
            var os = fs.createWriteStream(pathB);
            util.pump(is, os, function(err) {
                if (err)
                    throw err;
                console.log("successfully duplicated file: " + pathA + " >> " + pathB);
                var teamgroup = nowjs.getGroup(userObj.teamID);
                var fromUserId = userObj.clientId;
                teamgroup.now.c_processUserFileEvent(safeFName, "duplicateFile", fromUserId, 0, safeNewFName);
                fileDuplicatorCallback(safeFName, []);
            });
        }
    } catch (ex) {
        console.log("trying to dupicate a file that doesn't exist: " + pathA);
        fileDuplicatorCallback(safeFName, ["File doesn't exist. Cannot duplicate it."]);
    }
}
//
// DEPLOY / LAUNCH! :D
//
function localProjectDeploy(userObj, deployerCallback) {
    var team = userObj.teamID;
    var fromUserId = userObj.clientId;
    var projPath = EDITABLE_APPS_DIR + team;
    var projectName = team;
    console.log("DEPLOYMENT PLACEHOLDER: " + projectName);
    exec('stop node_' + userObj.teamID, {
        encoding: 'utf8',
        timeout: 30000,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        env: null
    },
    function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log("STOP: " + stdout);
        exec('start node_' + userObj.teamID, {
            encoding: 'utf8',
            timeout: 30000,
            maxBuffer: 200 * 1024,
            killSignal: 'SIGTERM',
            env: null
        },
        function(error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            var launchURL = "http://" + userObj.teamID + ".chaoscollective.org/";
            console.log("START: " + stdout);
            console.log("DEPLOY SUCCESSFUL: " + launchURL);
            setTimeout(function() {
                var teamgroup = nowjs.getGroup(team);
                teamgroup.now.c_processUserFileEvent("", "launchProject", fromUserId, 0);
            }, 50);
            setTimeout(function() {
                deployerCallback(null, launchURL);
            }, 1500);
        }
        ); // exec 2
    }
    ); // exec 1


    /*
     var haibuApp = {
     "user": team,
     "name": projectName,
     "domain": projectName+".chaoscollective.org",
     "repository": {
     "type": "local",
     "directory": projPath,
     },
     "scripts": {
     "start": "server.js"
     }
     };
     // Attempt to clean up an existing application
     haibuClient.clean(haibuApp, function (err, result) {
     if (err) {
     console.log('Error cleaning app during deployment of: ' + haibuApp.name);
     deployerCallback([err]);
     //return eyes.inspect(err);
     }else{
     console.log('Successfully cleaned app: ' + haibuApp.name);
     haibuClient.start(haibuApp, function (err, result) {
     if (err) {
     console.log('Error starting app during deployment of: ' + haibuApp.name);
     deployerCallback([err]);
     //return eyes.inspect(err);
     }else{
     console.log("DEPLOYMENT SUCCESSFUL: " + haibuApp.name);
     console.log(result);
     var launchURL = "http://"+result.drone.host+":"+result.drone.port+"/";
     deployerCallback(null, launchURL);
     }
     });
     }
     });
     */
}
//
// UTF-8 data encode/decode: http://www.webtoolkit.info/
var Utf8 = {
    encode: function(string) { // public method for url encoding
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    decode: function(utftext) { // public method for url decoding
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

function occurrences(string, substring) {
    var n = 0;
    var pos = 0;
    while (true) {
        pos = string.indexOf(substring, pos);
        if (pos != -1) {
            n++;
            pos += substring.length;
        }
        else {
            break;
        }
    }
    return(n);
}

//
//
//
console.log("| *. Node up and running .* |");
console.log("'---------------------------'");


