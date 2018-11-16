# Asynjax 
> Asíncrono Ajax sin jQuery


### 🗃️ POST

Desde un formulario:
```js
var form = document.getElementById('frmTest');

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

---
### 🗃️ GET


