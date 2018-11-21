# Asynjax 
> Asíncrono Ajax sin jQuery


### 🗃️ POST

Forma sencilla:
```js
asynjax.post('index.php', {
	result: function (exitoso, respuesta) {
		console.log('Éxito: ' + exitoso + ', Respuesta: ' + respuesta);
	}
});
```
Con parámetros:
```js
asynjax.post('index.php', {
	params: {Usuario:'Kendry', Edad:19},
	result: function (exitoso, respuesta) {
		if (exitoso) {
			console.log('Éxito: ', respuesta);
		} else {
			console.error('Error: ' + respuesta);
		}
	}
});
```

Utilizar credenciales ([Ver](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)) :
```js
asynjax.post('index.php', {
	withCredentials: true, // Default false
	result: function (exitoso, respuesta) {
		if (exitoso) {
			console.log('Éxito: ', respuesta);
		} else {
			console.error('Error: ' + respuesta);
		}
	}
});
```

Obtener la respuesta como un objeto JSON:
```js
asynjax.post('index.php', {
	asJson: true, // Default false
	result: function (exitoso, respuesta) {
		if (exitoso) {
			console.log('Éxito: ', respuesta); // respuesta es un JSON.
		} else {
			console.error('Error: ' + respuesta);
		}
	}
});
```

Desde un formulario:
```js
var form = document.getElementById('idFormulario');

asynjax.post('index.php', {
	params: asynjax.getForm(form),
	result: function (exitoso, respuesta) {
		if (exitoso) {
			console.log('Éxito: ', respuesta);
		} else {
			console.error('Error: ' + respuesta);
		}
	}
});

/* 
 * También se puede pasar el formulario a un objeto FormData:
 * var formData = new FormData(form);
 * ... y enviar el formData ...
*/
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
	result: function (exitoso, respuesta) {
		if (exitoso) {
			console.log('Éxito: ', respuesta);
		} else {
			console.error('Error: ' + respuesta);
		}
	}
}, formData);
```
```js
//Forma 2:
asynjax.post('index.php', {
	params: asynjax.getFormData(formData),
	result: function (exitoso, respuesta) {
		if (exitoso) {
			console.log('Éxito: ', respuesta);
		} else {
			console.error('Error: ' + respuesta);
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
function listen(txtEvento, elemento, funcion) {
	if (elemento.addEventListener) /* W3C DOM */
		return elemento.addEventListener(txtEvento.toLowerCase(), funcion, false);
	else if (elemento.attachEvent) /* IE DOM */
		return elemento.attachEvent("on" + txtEvento, funcion);
	else {
		try {
			elemento["on" + txtEvento] = funcion;
		} catch (err) {
			throw 'No es posible añadir el evento ' + txtEvento;
			return false;
		}
	}
}
```
```js
//Añadimos el evento Change al elemento inputArchivo para que ejecute la función enviarArchivo:
const elemento = document.getElementById('inputArchivo');
listen('Change', elemento, enviarArchivo);
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
			result: function (exitoso, respuesta) {
				if (exitoso) {
					console.log('Éxito: ', respuesta);
				} else {
					console.error('Error: ' + respuesta);
				}
			}
		}, formData);
	}
}
```


---
### 🗃️ GET


