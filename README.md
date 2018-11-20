# Asynjax 
> Asíncrono Ajax sin jQuery


### 🗃️ POST

Sin parámetros:
```js
asynjax.post('index.php', {
	result: function (isSuccessful, data) {
		if (isSuccessful) {
			console.log('Success: ', data);
		} else {
			console.error('Error: ' + data);
		}
	}
});
```

Obtener el resultado como un objeto JSON:
```js
asynjax.post('index.php', {
	asJson: true,
	result: function (isSuccessful, data) {
		if (isSuccessful) {
			console.log('Success: ', data); // data es un JSON.
		} else {
			console.error('Error: ' + data);
		}
	}
});
```

Desde un formulario:
```js
var form = document.getElementById('idFormulario');

asynjax.post('index.php', {
	params: asynjax.getForm(form),
	result: function (isSuccessful, data) {
		if (isSuccessful) {
			console.log('Success: ', data);
		} else {
			console.error('Error: ' + data);
		}
	}
});
```

Desde un objeto FormData:
```js
var formData = new FormData();
formData.append('Usuario', 'Kendry');
formData.append('Edad', 19);
```
```js
//Forma 1:
asynjax.post('index.php', {
	result: function (isSuccessful, data) {
		if (isSuccessful) {
			console.log('Success: ', data);
		} else {
			console.error('Error: ' + data);
		}
	}
}, formData);
```
```js
//Forma 2:
asynjax.post('index.php', {
	params: asynjax.getFormData(formData),
	result: function (isSuccessful, data) {
		if (isSuccessful) {
			console.log('Success: ', data);
		} else {
			console.error('Error: ' + data);
		}
	}
});
```

Subir archivos:
```html
<input id="inputArchivo" type="file" lang="es" accept="*" multiple="multiple">
```
```js
//Función que añade un evento a un objeto del DOM
function listen(str_evento, elemento, funcion) {
	console.log('Pasó por listen');
	if (elemento.addEventListener) /* W3C DOM */
		return elemento.addEventListener(str_evento.toLowerCase(), funcion, false);
	else if (elemento.attachEvent) /* IE DOM */
		return elemento.attachEvent("on" + str_evento, funcion);
	else {
		try {
			elemento["on" + str_evento] = funcion;
		} catch (err) {
			throw 'No es posible añadir el evento ' + str_evento;
			return false;
		}
	}
}
```
```js
//Añadimos el evento Change a inputArchivo para que ejecute la función enviarArchivo:
listen('Change', document.getElementById('inputArchivo'), enviarArchivo);
```
```js
function enviarArchivo() {
	const input = document.getElementById('inputArchivo');
	if (input.files) {
		var formData = new FormData();
		formData.append('Detalle', '¡Hola server!');

		const cant = input.files.length;
		for(var i=0; i<cant; ++i) formData.append("arrayArchivos[]", input.files[i], input.files[i].name);

		asynjax.post('index.php', {
			progress: function (percentage) {
				console.log('Progreso: ' + percentage + '%');
			},
			result: function (isSuccessful, data) {
				if (isSuccessful) {
					console.log('Success: ', data);
				} else {
					console.error('Error: ' + data);
				}
			}
		}, formData);
	}
}
```


---
### 🗃️ GET


