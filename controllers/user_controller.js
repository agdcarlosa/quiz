var users={
	admin:{id:1, username:"Admin", password:"1234"},
	pepe:{id:2, username:"Pepe", password:"5678"}
};

//comprueba si el ususario está registrado en users
//si autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar=function(login, password, callback){
	if(users[login]){
		if(password === users[login].password){
			callback(null, users[login]);
		}
		else{ callback(new Error('Password erróneo.')); }
	}
	else{ callback(new Error('No existe el usuario.')); }
};