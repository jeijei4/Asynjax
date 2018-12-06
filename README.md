# Asynjax v2.0.0
> Asíncrono Ajax sin jQuery


### 🗃️ POST

Forma sencilla
```js
asynjax.post('index.php', function (exitoso, respuesta) {
	console.log('Éxito: ' + exitoso + ', Respuesta: ' + respuesta);
});
```

Enviar datos al servidor
<br>
```js
//Desde un objeto FormData:
var nFormData = new FormData();
    nFormData.append('Usuario', 'Kendry');
    nFormData.append('Edad', 19);

asynjax.post('index.php', {
	formData: nFormData
}, function (exitoso, respuesta) {
	if (exitoso) {
		console.log('Éxito: ', respuesta);
	} else {
		console.error('Error: ' + respuesta);
	}
});
```
```js
//Desde un formulario:
var nForm = document.getElementById('idFormulario');

asynjax.post('index.php', {
	form: nForm,
	hideClass: 'noEnviar' // (Opcional) Si algún elemento tiene la clase especificada, no será enviado.
}, function (exitoso, respuesta) {
	if (exitoso) {
		console.log('Éxito: ', respuesta);
	} else {
		console.error('Error: ' + respuesta);
	}
});
```
```js
//Con parámetros:
asynjax.post('index.php', {
	params: {Usuario: 'Kendry', Edad: 19}
}, function (exitoso, respuesta) {
	if (exitoso) {
		console.log('Éxito: ', respuesta);
	} else {
		console.error('Error: ' + respuesta);
	}
});
```

Otras opciones disponibles
```js
asynjax.post('index.php', {
    withCredentials: true, // Utilizar credenciales. Default false.
    asJson: true, // Obtener la respuesta como un objeto JSON. Default false.
    contentType: 'application/json; charset=UTF-8', // Default 'application/x-www-form-urlencoded; charset=UTF-8'.
    progress: function (porcentaje) {
   	console.log('Progreso: ' + porcentaje + '%');
    }
}, function (exitoso, respuesta) {
    console.log('Éxito: ' + exitoso + ', Respuesta: ' + respuesta);
});
```

<details>
<summary>Ejemplo práctico</summary>

<br>Subir archivos al servidor:
<br><br>	
```html
<input id="inputArchivo" type="file" lang="es" accept="*" multiple="multiple">
```
```js
//Función que añade un evento a un objeto del DOM
function evento(txtEvento, elemento, funcion) {
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
if(elemento){
	evento('Change', elemento, enviarArchivo);
}
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
                    formData: formData,
                    progress: function (porcentaje) {
                        console.log('Progreso: ' + porcentaje + '%');
                    }
                }, function (exitoso, respuesta) {
                    if (exitoso) {
                        console.log('Éxito: ', respuesta);
                    } else {
                        console.error('Error: ' + respuesta);
                    }
                });
	}
}
```

</details>


---
### 🗃️ GET


