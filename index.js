express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose=require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://admin:admin@ds221609.mlab.com:21609/newsapi');
// mongoose.connect('mongodb://localhost/test');
var db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open',function () {
    console.log("Connected to DB");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});	// To allow cross website api calls, using vpn etc too
var routes=require('routes');
routes(app);

app.set('port', (process.env.PORT || 3000));


app.listen(app.get('port'), function () {
    console.log("Server running on port " + app.get('port'));
});
app.get('/', function (req, res) {
    str='Hello Aayushi'
    //var obj = JSON.parse();
    //res.json({'GET request to the homepage':'bar'});
    res.send(str);
})

var category_schema = mongoose.Schema({
    name: String
});
var Category = mongoose.model('categories', category_schema);

var user_schema = mongoose.Schema({
    uname: String,
    gid: String,
    email: String,
    country: String,
    pref_categories:[{
        name:String,
        priority: Number
    }],
    pref_publishers:[{
        name:String,
        priority: Number
    }]
});

var user = mongoose.model('users',user_schema);
//==============================================================================================================================
app.route('/login').post(function(req,res){
    var user_name = req.body.user;
    var email_id = req.body.emailid;
    var g_id = req.body.gid;

    user.findOne({uname:user_name},function(err,info){
        if(!info)
        {
            var new_user = new user({uname:user_name,gid:g_id,email:email_id});
            new_user.save(function(nerr,ninfo){
                if(ninfo)
                    res.json({'msg':'Saved'});
                else
                    res.json({'msg':'Error'});
            });
        }
        else{
            res.json({'msg':'Already Registered'});
        }
    })
});
//==============================================================================================================================
app.route('/update').post(function(req,res){
    var email_id = req.body.emailid;
    var pref_category = req.body.pref_category;
    //var pref_country = req.body.country;
    vvvar pref_publisher = req.body.pref_publishers;
    //pref_category = JSON.parse(pref_category);
    //pref_publishers = JSON.parse(pref_publisher);
    //var conditions = { email:email_id}
    user.update({email: email_id},{$set:{country:pref_country/*,pref_categories:pref_category,pref_publishers:pref_publishers*/}},function(err,info){
        if(info){
            res.json({'msg':'updated'});
        }
        if(err){
            res.json({'msg':'error updating'})
        }
    })
});
//==============================================================================================================================
app.route('/prefcategories').post(function(req,res){
    var email_id = req.body.emailid;
    user.findOne({email:email_id},'pref_categories',function(err,info){
        if(info){
            res.json(info); 
        }
    })
});
//==============================================================================================================================
    app.route('/setcategorypriority').post(function(req,res){
   var email_id = req.body.emailid;
    var category = req.body.category;
    user.findOneAndUpdate({email:email_id,"pref_categories.name":category},{$inc : {"pref_categories.$.priority":1}},function(err,info){
        if(info){
            res.json({'msg':'updated'});
        } 
    });
});

//==============================================================================================================================
app.route('/newcat').get(function(req,res){
    var name = req.body.name;
    var new_cat = new Category({name:name});
    new_cat.save(function(err,info) {
        if(info){
            console.log("Saved.");
            res.send("Saved!");
        }
        if (err) {
            console.log("Error");
        }
});
});

// var str = '{category:["string","abcd"]}';

app.get('/categories', function (req, res) {
	Category.find({},function(err,info){
        if(info){
            res.send(info);
        }
    })
	//var obj = JSON.parse();
    //res.json({'GET request to the homepage':'bar'});
})
