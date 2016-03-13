var fs = require('fs');
var track_model = require('./../models/tracks');
var needle = require('needle');
var a = 0


exports.list_playlist = function (req, res) {
	var play_list = [];
	var track = track_model;
	console.log("--------Mostrar lista de Playlist (Accion List_Playlist)--------")
	track.find(function(err,songs){
		if (err) {
			console.log(err);
		}
		else {
			for(var myKey in songs) {
				if (songs[myKey].playlist!=='') {
					if (play_list.indexOf(songs[myKey].playlist)===-1) {
						play_list.push(songs[myKey].playlist);
					}
				}
			}
		res.render('tracks/playlist', {play_list: play_list});
		}
	})
}

exports.add_playlist = function (req, res) {
	var songs = req.params.trackId;
	var pl = req.body.pl;
	var track = track_model;
	console.log("--------Añadir cancion a una Playlist (Accion Add_Playlist)--------")
	track.findOne({'name': songs}, function(err, song){
		console.log("Datos de cancion: "+song)
		var song2 = new track({
				id: song.id,
				name: song.name,
				url: song.url,
				urli: song.urli,
				playlist: pl
		});
		song.remove(function(err) {
			if (err) {
				console.log(err)
			}
			else {
				song2.save(function(err, song){
					if (err) {
						console.log('Error Saving: '+err);
					}		
					else {
						console.log('Canción añadida a MongoDB');
						res.redirect('/tracks');
					}
				});
			}
		});
	});
}

// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
	var trackArray = []
	var trackUrl = []
	var track = track_model;
	var str=''
	var urli=''
	var urlt=[]
	var n=0
	console.log("--------Mostrar lista de Canciones (Accion List)--------")
	track.find(function(err, song){
		if (err) {
			console.log("ERROR: GET DBALL: "+ err);
		}
		else {
			console.log("Canciones presentes en MongoDB:")
			for(var myKey in song) {
				console.log("Numero: "+myKey+' Nombre: '+song[myKey].name);
				str = (song[myKey].name).replace('.mp3','');
				urli = (song[myKey].urli)
				if (trackArray.indexOf(str)===-1) {
					trackArray.push(str)
					trackUrl.push(urli)
					urlt.push(song[myKey].name)
					console.log("Añadido al array de canciones: "+str)
					n++;
				}
			}
			a=n;
			console.log("Canciones a mostrar: "+ trackArray.toString())
		}
		res.render('tracks/index', {tracks: trackArray, urli: trackUrl, urlt: urlt});
	});
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new');
};

exports.new_playlist = function (req, res) {
	res.render('tracks/new_playlist');
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	var track = track_model;
	console.log('--------Mostrar una unica cancion (Accion Show)--------')
	track.findOne({'name': req.params.trackId}, function(err, song){
		console.log("Datos de cancion: "+song)
		res.render('tracks/show', {track: song});
	});
};

exports.show_playlist = function (req, res) {
	var track = track_model;
	var str = '';
	var urli = '';
	var urlt = [];
	var trackArray = [];
	var trackUrl = [];
	console.log("--------Mostrar una única playlist con sus canciones (Accion Show_Playlist)--------")
	track.find({'playlist': req.params.playlistId}, function(err, song){
		if (err) {
			console.log(err);
		}
		else {
			for(var myKey in song) {
				console.log("Numero: "+myKey+' Nombre: '+song[myKey].name);
				str = (song[myKey].name).replace('.mp3','');
				urli = (song[myKey].urli)
				if (trackArray.indexOf(str)===-1) {
					trackArray.push(str)
					trackUrl.push(urli)
					urlt.push(song[myKey].name)
					console.log("Añadido al array de canciones: "+str)
				}
			}
		console.log("Canciones a mostrar: "+ trackArray.toString())
		res.render('tracks/index', {tracks: trackArray, urli: trackUrl, urlt: urlt});
		}
	})
}

// Escribe una nueva canción en el registro de canciones.
// TODO:
// - Escribir en tracks.cdpsfy.es el fichero de audio contenido en req.files.track.buffer
// - Escribir en el registro la verdadera url generada al añadir el fichero en el servidor tracks.cdpsfy.es
exports.create = function (req, res) {
	var track = req.files.track;
	var trackm = track_model;
	var cover = req.files.cover;
	var extm = ''
	var exti = ''
	var name = ''
	var covername = ''
	var n = 0
	console.log('--------POST de una cancion (Accion Create)--------');
	
	if (track!== undefined) {
		name = track.originalname;
		n = name.indexOf('.');
		extm = name.substring(n, track.length);
		if (cover !== undefined) {
			covername = cover.originalname;
			n = covername.indexOf('.');
			exti =covername.substring(n, covername.length)
			var data = {
				file: {
					buffer: track.buffer,
					filename: name,
					content_type: 'audio/'+extm
				},
				file2: {
					buffer: cover.buffer,
					filename: covername,
					content_type: 'image/'+exti
				}	
			};
		}
		else {
			covername = 'quaver3.png'
			var data = {
				file: {
					buffer: track.buffer,
					filename: name,
					content_type: 'audio/'+extm
				}
			};
		}	
	}
	else {
		console.log("No se ha introducido canción");
		res.redirect('/tracks');
	}

	needle.post('http://tracks.cdpsfy.es', data, {multipart:true}, function(err, resp, body) { //Cambiar por http://tracks.cdpsfy.es
		if(err) {
			console.log(err);
		}
		else {
			console.log('Respuesta del servidor REST: '+resp);
			var song = new trackm({
				id: a.toString(),
				name: name,
				url: 'http://tracks.cdpsfy.es/'+name, //Cambiar despues por http://track.cdpsfy.es
				urli: 'http://tracks.cdpsfy.es/image/'+covername,
				playlist: ''
			});
			trackm.findOne({'name': name}, function(err, songs){
				console.log("Datos de cancion existente o null en caso de ser nueva: "+songs)
				if (songs===null){
					song.save(function(err, song){
						if (err) {
							console.log('Error Saving: '+err);
						}
						else {
							console.log('Canción añadida a MongoDB');
						}
					});
				}
				else {
					console.log('Canción ya existente')
				}
			})
		}
		res.redirect('/tracks');
	});
};

// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;
	var trackm = track_model;

	console.log('--------DELETE de una cancion (Accion Destroy)--------')
	console.log("EL nombre de la cancion que se quiere borrar es: "+trackId)

	trackm.findOne({'name': req.params.trackId}, function(err, song) {
		var url = song.urli.replace('http://tracks.cdpsfy.es/image/', '');
		var data = {
			filename: url
		}

		needle.delete('http://tracks.cdpsfy.es/'+trackId, data, function(err, resp){
			if(err) {
				console.log(err); 
			}
			else {
				if (song!==null){
					song.remove(function(err) {
						if (err) {
							console.log(err);
						}	
					});
				}
				else {
					console.log('No existe esta cancion')
				}
			}	
			console.log(resp.body);
			res.redirect('/tracks/#about');
		});
	});
};