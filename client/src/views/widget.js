// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import html from './widget.html';

let elements = [];
let body;

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export function render(body) {

    var buffer = body;

    var imageStr = arrayBufferToBase64(buffer);

    let temporary = document.createElement('div');
    temporary.innerHTML = html;
   
    body = document.getElementsByTagName('body')[0];
    while (temporary.children.length > 0) {
        elements.push(temporary.children[0]);
        temporary.children[0].setAttribute('src', 'data:image/png;base64,' + imageStr);
        body.appendChild(temporary.children[0]);
    }
  
}
