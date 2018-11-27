/*!
 *
 * Asynjax - Asíncrono Ajax sin jQuery
 * Copyright (c) 2018 JeiHO (https://github.com/jeijei4/Asynjax)
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Version: 2.0.0
 *
 */

var asynjax = {};

asynjax.contains = function (a, b) {
    // true: si a contiene b.
    return (new RegExp(b.toLowerCase(), "g")).test(a.toLowerCase());
};
asynjax.httpRequest = function () {
    'use strict';
    // Determine si el objeto XMLHttpRequest es compatible
    // Chrome, Firefox, Opera 8.0+, Safari
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    //Compatible con el navegador IE
    const versions = [
        'MSXML2.XmlHttp.6.0',
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'
    ];
    // Defina la variable local xhr y almacene el objeto ActiveXObject del navegador IE.
    let xhr;
    for (let i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

asynjax.param = function (xJson, prefix) {
    //https://stackoverflow.com/a/1714899/9463541
    var str = [], p;
    for (p in xJson) {
        if (xJson.hasOwnProperty(p) && xJson[p]) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = xJson[p];
            str.push((v !== null && typeof v === "object") ?
                asynjax.param(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};

asynjax.getFormData = function (formData) {
    let r = {};
    try {
        formData.forEach(function (value, key) {
            r[key] = value;
        });
    } catch (err) {
        r = {};
        throw new Error(err.message);
    }
    return r;
};

asynjax.getForm = function (xform, hideClass) {
    let r = {};
    try {
        const elements = xform.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), input[type="checkbox"]:checked, input[type="radio"]:checked, select, textarea');

        const elemLength = elements.length;
        for (let i = 0; i < elemLength; ++i) {
            const element = elements[i];
            const tagName = elements[i].tagName.toLowerCase();
            var key = element.name;
            const value = element.value;
            if (key) {
                if ('select' === tagName && true === element.multiple) {
                    var selectedArray = [];
                    var j;
                    var count = 0;
                    const selectLength = element.options.length;
                    for (j = 0; j < selectLength; ++j) {
                        if (element.options[j].selected) {
                            selectedArray[count] = element.options[j].value;
                            ++count;
                        }
                    }
                    if (hideClass.length === 0 || asynjax.contains(element.className, hideClass) === false) {

                        const optLength = selectedArray.length;
                        var hilera = '';
                        for (k = 0; k < optLength; ++k) {
                            if ('' !== hilera) {
                                hilera += ',';
                            }
                            if ('string' === typeof(selectedArray[k])) {
                                hilera += '"' + selectedArray[k] + '"';
                            } else {
                                hilera += selectedArray[k];
                            }
                        }
                        const allHilera = '"' + key + '":[' + hilera + ']';
                        var textObject = JSON.stringify(r);
                        if (textObject === '{}') {
                            r = JSON.parse('{' + allHilera + '}');
                        } else {

                            r = JSON.parse('{' + textObject.substring(1, textObject.length - 1) + ',' + allHilera + '}');
                        }
                    }
                } else {
                    if (hideClass.length === 0 || asynjax.contains(element.className, hideClass) === false) {
                        r[key] = value;
                    }
                }
            }
        }
    } catch (err) {
        r = {};
        throw new Error(err.message);
    }
    return r;
};


asynjax.textError = function (xStatus, xStatusText, xResponseText) {
    'use strict';
    const xResponse = xResponseText.trim();
    const respLower = xResponse.toLowerCase();

    if (asynjax.contains(respLower, 'sesi') === true && asynjax.contains(respLower, 'expirado') === true) {
        return 'La sesión ha expirado';
    }
    else {
        let text = "";
        switch (parseInt(xStatus)) {
            case 0:
                text = "Error de conectividad: Verificar la Red";
                break;
            case 400:
                text = "Error de cliente: Solicitud incorrecta. [400]";
                break;
            case 401:
                text = "Error de cliente: No autorizado, la autenticación es posible pero ha fallado o aún no se ha proporcionado. [401]";
                break;
            case 402:
                text = "Error de cliente: Pago requerido. [402]";
                break;
            case 403:
                text = "Error de cliente: Prohibido, el servidor se niega a responder. [403]";
                break;
            case 404:
                text = "Error de cliente: La página solicitada no se encontró. [404]";
                break;
            case 405:
                text = "Error de cliente: Método de solicitud no permitido. [405]";
                break;
            case 406:
                text = "Error de cliente: La respuesta del servidor no es aceptada. [406]";
                break;
            case 407:
                text = "Error de cliente: Debe primero autenticarse con el proxy. [407]";
                break;
            case 408:
                text = "Error de cliente: El servidor agotó el tiempo de espera para la solicitud. [408]";
                break;
            case 409:
                text = "Error de cliente: La solicitud no se pudo completar debido a un conflicto en la solicitud. [409]";
                break;
            case 410:
                text = "Error de cliente: La página solicitada ya no está disponible. [410]";
                break;
            case 411:
                text = 'Error de cliente: La "longitud del contenido" no está definida. El servidor no aceptará la solicitud sin él. [411]';
                break;
            case 412:
                text = "Error de cliente: La condición previa dada en la solicitud es evaluada como falsa por el servidor. [412]";
                break;
            case 413:
                text = "Error de cliente: La entidad de solicitud es demasiado grande. [413]";
                break;
            case 414:
                text = "Error de cliente: La URL es demasiado larga. [414]";
                break;
            case 415:
                text = "Error de cliente: El tipo de medio no es compatible con el servidor. [415]";
                break;
            case 416:
                text = "Error de cliente: El cliente ha solicitado una parte del archivo, pero el servidor no puede suministrar esa parte. [416]";
                break;
            case 417:
                text = "Error de cliente: El servidor no puede cumplir con los requisitos del encabezado de la solicitud. [417]";
                break;
            case 418:
                text = "Error de cliente: Soy una tetera. Se ha intentado realizar una solicitud de café en un servidor que no es una cafetera, sino una tetera. [418]";
                break;
            case 421:
                text = "Error de cliente: Solicitud estraviada. La solicitud se dirigió a un servidor que no es capaz de producir una respuesta. [421]";
                break;
            case 422:
                text = "Error de cliente: La solicitud está bien construida, pero fue imposible de entender debido a errores semánticos. [422]";
                break;
            case 423:
                text = "Error de cliente: El recurso que está siendo accedido está bloqueado. [423]";
                break;
            case 424:
                text = "Error de cliente: Error de dependencia. Error de la solicitud debido a un fallo de una solicitud anterior. [424]";
                break;
            case 426:
                text = "Error de cliente: Actualización obligatoria : El cliente debe cambiar a un protocolo diferente. [426]";
                break;
            case 428:
                text = "Error de cliente: Condición previa obligatoria. El servidor de origen requiere que la solicitud sea condicional. [428]";
                break;
            case 429:
                text = "Error de cliente: El usuario ha enviado demasiadas solicitudes en un período de tiempo determinado. [429]";
                break;
            case 431:
                text = "Error de cliente: El servidor no puede procesar la petición porque el conjunto de las cabeceras de la petición son demasiado grandes. [431]";
                break;
            case 451:
                text = "Error de cliente: No disponible por razones legales. [451]";
                break;
            case 500:
                text = "Error interno del servidor : El servidor encontró una condición inesperada. [500]";
                break;
            case 501:
                text = "Error del Servidor: El servidor no reconoce el método de solicitud o carece de la capacidad para cumplir con la solicitud. [501]";
                break;
            case 502:
                text = "Error del Servidor: El servidor está actuando como una puerta de enlace y recibió una respuesta no válida de otro servidor. [502]";
                break;
            case 503:
                text = "Error del Servidor: El servidor no está disponible actualmente (sobrecargado | en mantenimiento | inactivo). [503]";
                break;
            case 504:
                text = "Error del Servidor: El servidor está actuando como una puerta de enlace y no ha recibido a tiempo una respuesta de otro servidor, por lo que no puede responder adecuadamente a la petición solicitada. [504]";
                break;
            case 505:
                text = "Error del Servidor: El servidor no admite la versión de protocolo HTTP utilizada en la solicitud. [505]";
                break;
            case 506:
                text = "Error del Servidor: Variación también negocia. La negociación de contenido de los resultados de petición deriva en una referencia circular. [506]";
                break;
            case 507:
                text = "Error del Servidor: No hay suficiente espacio de almacenamiento libre. [507]";
                break;
            case 508:
                text = "Error del Servidor: La petición no se puede procesar porque el servidor ha encontrado un bucle infinito. [508]";
                break;
            case 510:
                text = "Error del Servidor: La petición del cliente debe añadir más extensiones para que el servidor pueda procesarla. [510]";
                break;
            case 511:
                text = "Error del Servidor: El cliente debe autenticarse para poder realizar peticiones. [511]";
                break;
            default:
                text = "parsererror" === xStatusText ? "Error de análisis en el JSON solicitado." : "timeout" === xStatusText ? "Error: tiempo de espera excedido." : "abort" === xStatusText ? "Petición Ajax abortada." : "Error no detectado (" + xStatus + " - " + xStatusText + "): " + xResponse;
        }
        return text;
    }
};

asynjax.send = function (url, method, xFunction, options) {
    'use strict';
    let client = asynjax.httpRequest();
    client.open(method, url, true, null, null);

    const withOptions = ('object' === typeof options);

    client.withCredentials = (true === withOptions && true === options.withCredentials); //default false;

    client.ontimeout = function () {
        console.error('Asynjax error: El tiempo de espera para la solicitud ' + url + ' a caducado.');
    };

    client.onerror = function () {
        console.error('Asynjax error: ' + asynjax.textError(client.status, client.statusText, client.responseText));
    };

    client.onreadystatechange = function () {
        if (client.readyState === 4) {
            if (client.status === 200) {// 200 = OK
                let responseText = client.responseText;

                if (true === withOptions && true === options.asJson) {
                    let getData = responseText.trim();
                    try {
                        responseText = JSON.parse(getData);
                    } catch (e) {
                        try {
                            // Si la respuesta está en formato JSONP en lugar de JSON puro:
                            const fixedResponse = getData.replace(/\\'/g, "'");
                            responseText = JSON.parse(fixedResponse);
                        } catch (e) {
                            responseText = {};
                        }
                    }
                }

                xFunction(true, responseText);
            } else {
                // Devolución de llamada de error
                xFunction(false, asynjax.textError(client.status, client.statusText, client.responseText));
            }
        }
    };

    if (true === withOptions && 'function' === typeof options.progress) {
        client.upload.onprogress = function (event) {
            let p = '?';
            if (event.lengthComputable) {
                p = Math.round((event.loaded / event.total) * 100);
            }
            options.progress(p);
        };
    }

/////////////////////////////////////////////////////////////////////////////////////	

    client.setRequestHeader("Cache-Control", "no-cache");
    client.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    if (method === 'POST' && true === withOptions) {
        if ('object' === typeof options.formData) {
            client.send(options.formData);
        } else {
            if (options.contentType) {
                client.setRequestHeader('Content-Type', options.contentType);
            }
            if (options.form) {
                const hideClass = ('string' === typeof options.hideClass) ? options.hideClass : '';

                const xForm = asynjax.getForm(options.form, hideClass);
                client.send(asynjax.param(xForm));
            } else {
                if (null === options.params) {
                    client.send();
                } else {
                    client.send(options.params);
                }
            }
        }
    } else {
        client.send();
    }
};


asynjax.post = function (url, options, xFunction) {
    'use strict';
    if ('function' === typeof options) {
        //Se envía sin parámetros
        asynjax.send(url, 'POST', options);
    } else if ('function' === typeof xFunction) {
        if ('object' === typeof options) {
            // Solicitud con contentType false, sin procesamiento de datos;
            if (options.contentType !== false) {
                if (options.contentType && asynjax.contains(options.contentType, 'json') === true) {
                    if (options.params) {
                        try {
                            options.params = JSON.stringify(options.params);
                        } catch (err) {
                            throw new Error(err.message);
                        }
                    } else {
                        options.params = null;
                    }
                    options.contentType = 'application/json; charset=UTF-8';
                } else {
                    if (options.params) {
                        try {
                            options.params = asynjax.param(options.params);
                        } catch (err) {
                            throw new Error(err.message);
                        }
                    } else {
                        options.params = null;
                    }
                    options.contentType = options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';
                }
            }
            asynjax.send(url, 'POST', xFunction, options);
        } else {
            console.error("Asynjax error: Parámetro inválido, se requiere un objeto.");
            return false;
        }
    } else {
        console.error("Asynjax error: No se encontró la función de salida.");
        return false;
    }
};
//----//
