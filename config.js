module.exports ={
    port:process.env.WEB_PORT || 3000,
    appsDir:"/var/www/",
    defaultTeamId:"dna2bpm",
    google:{
        returnUrl:'http://localhost',
    },
    tree:{
      showDotFolders : false,
      showDotFiles : true
    }
};
