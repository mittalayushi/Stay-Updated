express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose=require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://admin:admin@ds221609.mlab.com')
// mongoose.connect('mongodb://localhost/test');
var db=mongoose.connection;
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
var category_schema = mongoose.Schema({
    name: String
})
var Category = mongoose.model('categories', category_schema);

app.route('/new').post(function(req,res){
    var name = req.body.name;
    var new_cat = new Category({name:name});
    new_cat.save(function(err,info) {
        if(info){
            console.log("Saved.");
            res.send("I love you!");
        }
        if (err) {
            console.log("Error");
        }

});
});

// var str = '{category:["string","abcd"]}';

app.get('/', function (req, res) {
	str='Hello Aayushi'
	//var obj = JSON.parse();
    //res.json({'GET request to the homepage':'bar'});
    res.send(str);
})

app.get('/categories', function (req, res) {
	Category.find({},function(err,info){
        if(info){
            res.send(info);
        }
    })
	//var obj = JSON.parse();
    //res.json({'GET request to the homepage':'bar'});
})

