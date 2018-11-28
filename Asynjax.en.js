/*!
 *
 * Asynjax - Asynchronous Ajax without jQuery
 * Copyright (c) 2018 JeiHO (https://github.com/jeijei4/Asynjax)
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Version: 2.0.0
 *
 */

var asynjax = {};

asynjax.contains = function (a, b) {
    // true: if a contains b.
    return (new RegExp(b.toLowerCase(), "g")).test(a.toLowerCase());
};
asynjax.httpRequest = function () {
    'use strict';
    // Determine if the XMLHttpRequest object is compatible
    // Chrome, Firefox, Opera 8.0+, Safari
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    //Compatible with IE browser
    const versions = [
        'MSXML2.XmlHttp.6.0',
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'
    ];
    // Define the local variable xhr and store the ActiveXObject object of the IE browser.
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

asynjax.send = function (url, method, xFunction, options) {
    'use strict';
    let client = asynjax.httpRequest();
    client.open(method, url, true, null, null);

    const withOptions = ('object' === typeof options);

    client.withCredentials = (true === withOptions && true === options.withCredentials); //default false;

    client.ontimeout = function () {
        console.error('Asynjax error: The waiting time for the ' + url + ' request has expired.');
    };

    client.onerror = function () {
        console.error('Asynjax error: ' + client.statusText + ' [' + client.status + ']  -  ' + client.responseText);
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
                            // If the answer is in JSONP format instead of pure JSON:
                            const fixedResponse = getData.replace(/\\'/g, "'");
                            responseText = JSON.parse(fixedResponse);
                        } catch (e) {
                            responseText = {};
                        }
                    }
                }

                xFunction(true, responseText);
            } else {
                // Error callback
                xFunction(false, 'Asynjax error: ' + client.statusText + ' [' + client.status + ']  -  ' + client.responseText);
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
        //It is sent without parameters
        asynjax.send(url, 'POST', options);
    } else if ('function' === typeof xFunction) {
        if ('object' === typeof options) {
            // Request with contentType false, without data processing;
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
            console.error("Asynjax error: Invalid parameter, an object is required.");
            return false;
        }
    } else {
        console.error("Asynjax error: The exit function was not found.");
        return false;
    }
};
//----//
