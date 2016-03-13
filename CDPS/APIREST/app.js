var express = require("express"),  
	app = express(),
	bodyParser  = require("body-parser"),
	methodOverride = require("method-override"),
	multer = require('multer'),
	fs = require('fs');


app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json());  
app.use(methodOverride());

var nameFile = ''
var path = '/mnt/nas/' //Cambiar por /mnt/nas/
var router = express.Router();
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path);
	},
	filename: function (req, file, cb) {
		nameFile = file.originalname
		idFile = file.name
		cb(null, nameFile);
	}
});

var upload = multer({storage: storage});

router.get('/', function(req, res) { 
	console.log('--------API REST INICIO--------')
});

router.get('/:trackId', function(req, res) { 
	 console.log('--------Iniciando GET de '+req.params.trackId+'--------')
	 var options = {
		root: '/mnt/nas/' //Cambiar a /mnt/nas/
	 }
	 var fileName = req.params.trackId
	 res.sendFile(fileName, options, function(err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Enviado con exito')
		}
	 });
});

router.get('/image/:imageId', function(req, res) { 
	 console.log('--------Iniciando GET de '+req.params.trackId+'--------')
	 var options = {
		root: '/mnt/nas/' //Cambiar a /mnt/nas/
	 }
	 var fileName = req.params.imageId
	 res.sendFile(fileName, options, function(err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Enviado con exito')
		}
	 });
});

router.post('/', upload.fields([{name: 'file', maxCount: 1},{name: 'file2', maxCount: 1}]), function(req, res){
	console.log('---------Iniciando POST de '+nameFile+'---------');
	res.send('Subida con exito')
});

router.delete('/:trackId', function(req, res){
	var img = req.body.filename;
	console.log('--------Iniciando DELETE de '+req.params.trackId+'--------')
	var filePath = '/mnt/nas/'+req.params.trackId; //Cambiar path a /mnt/nas/
	var filePathUrl = '/mnt/nas/'+img; //Cambiar path a /mnt/nas/

	console.log('Borrado de filePath: '+filePath);
	fs.unlink(filePath, function(err){
		if(err) {
			console.log(err);
			res.send(err); 
		}
		else {
			if (img !== 'quaver3.png') {
				fs.unlink(filePathUrl, function(err) {
					if (err) {
						console.log(err);
						res.send(err);
					}
					else {
						console.log('Borrado con exito');
						res.send('Borrado con exito')
					}
				})
			}
			else {
				console.log('Borrado con exito');
				res.send('Borrado con exito')
			}
		}
	})
});

app.use(router);

app.listen(80, function() {  //Cambiar puerto de 3000 a 80
	console.log("Node server running on port 80");
})
