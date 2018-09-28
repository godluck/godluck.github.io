var zip = require('./zip.js');
zip.initLoad('combine.zip',{
    loadOptions:{
        success:function(e){
            console.log(e)
        },
        error:function(e){
            console.log(e)
        },
        progress:function(e){
            console.log(e)
        }
    },
    returnOptions:{
        'png': zip.TYPE_URL,
        'jpg': zip.TYPE_URL,
    },
    mimeOptions:{
        'jpg':'image/jpeg',
        'png':'image/png'
    }
})