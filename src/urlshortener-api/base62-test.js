'use strict;'

// Reference: https://www.npmjs.com/package/base-62.js

var base62 = require('base-62.js');

var big_number = '144928238032487217698238462873470924850921348902347582734698872031234';
var encoded = base62.encode(big_number);
var decoded = base62.decode(encoded);

console.log(`Big number : ${big_number}`);
console.log(`Encoded    : ${encoded}`);
console.log(`Decoded    : ${decoded}`);

var big_number = '10234234';
var encoded = base62.encode(big_number);
var decoded = base62.decode(encoded);

console.log(`Big number : ${big_number}`);
console.log(`Encoded    : ${encoded}`);
console.log(`Decoded    : ${decoded}`);

// GUID/UUID : 
var guid = "252efd2b-7f8e-41ec-9412-0b74fcbdc84e"
var big_number = '32353265666432622d376638652d343165632d393431322d306237346663626463383465';
var encoded = base62.encodeHex(big_number);
var decoded = base62.decode(encoded);

console.log(`GUID/UUID  : ${guid}`);
console.log(`Big number : ${big_number}`);
console.log(`Encoded    : ${encoded}`);
console.log(`Decoded    : ${decoded}`);