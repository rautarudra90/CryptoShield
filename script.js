/* =====================================================
   CryptoShield
   Modern Multi Encryption System

   Developer:
   Rudra Narayan Rauta

   Technologies:
   Web Crypto API
===================================================== */



// ================================
// DOM ELEMENTS
// ================================


const algorithm =
document.getElementById("algorithm");


const inputText =
document.getElementById("inputText");


const secretKey =
document.getElementById("secretKey");


const outputText =
document.getElementById("outputText");


const status =
document.getElementById("status");


const encryptBtn =
document.getElementById("encryptBtn");


const decryptBtn =
document.getElementById("decryptBtn");


const rsaBtn =
document.getElementById("rsaBtn");


const copyBtn =
document.getElementById("copyBtn");


const downloadBtn =
document.getElementById("downloadBtn");


const clearBtn =
document.getElementById("clearBtn");




// ================================
// RSA STORAGE
// ================================


let rsaKeys = null;





// ================================
// STATUS SYSTEM
// ================================


function updateStatus(message){

status.innerHTML = message;

}




function loading(){

status.innerHTML =
`
<span>
⏳ Processing...
</span>
`;

}





// ================================
// ENCRYPT BUTTON
// ================================


encryptBtn.addEventListener(
"click",
async()=>{


if(inputText.value.trim()===""){

updateStatus(
"⚠ Enter text first"
);

return;

}



loading();



let type =
algorithm.value;



try{


let result;



switch(type){


case "AES":

result =
await encryptAES(
inputText.value,
secretKey.value
);

break;



case "RSA":

result =
await encryptRSA(
inputText.value
);

break;



case "CAESAR":

result =
caesarEncrypt(
inputText.value,
secretKey.value
);

break;



case "ROT13":

result =
rot13(
inputText.value
);

break;



case "BASE64":

result =
base64Encode(
inputText.value
);

break;



case "BINARY":

result =
textToBinary(
inputText.value
);

break;


default:

result="";


}



outputText.value=result;


updateStatus(
"✅ Encryption Successful"
);



}

catch(error){


console.log(error);


updateStatus(
"❌ Encryption Failed"
);


}



});









// ================================
// DECRYPT BUTTON
// ================================


decryptBtn.addEventListener(
"click",
async()=>{


loading();


let type =
algorithm.value;



try{


let result;



switch(type){



case "AES":

result =
await decryptAES(
outputText.value,
secretKey.value
);

break;



case "RSA":

result =
await decryptRSA(
outputText.value
);

break;



case "CAESAR":

result =
caesarDecrypt(
outputText.value,
secretKey.value
);

break;



case "ROT13":

result =
rot13(
outputText.value
);

break;



case "BASE64":

result =
base64Decode(
outputText.value
);

break;



case "BINARY":

result =
binaryToText(
outputText.value
);

break;


}



outputText.value=result;


updateStatus(
"✅ Decryption Successful"
);



}

catch(error){


console.log(error);


updateStatus(
"❌ Decryption Failed"
);


}



});









// =====================================================
// AES ENCRYPTION
// Web Crypto API
// =====================================================



async function encryptAES(
text,
password
){



if(password.length < 4){

throw "Weak Key";

}



const encoder =
new TextEncoder();



const data =
encoder.encode(text);



const passwordKey =
await crypto.subtle.importKey(

"raw",

encoder.encode(password),

"PBKDF2",

false,

["deriveKey"]

);





const aesKey =
await crypto.subtle.deriveKey(


{

name:"PBKDF2",

salt:
encoder.encode("CryptoShield"),

iterations:100000,

hash:"SHA-256"

},


passwordKey,


{

name:"AES-GCM",

length:256

},


false,


[
"encrypt",
"decrypt"
]


);






const iv =
crypto.getRandomValues(
new Uint8Array(12)
);





const encrypted =
await crypto.subtle.encrypt(

{

name:"AES-GCM",

iv:iv

},

aesKey,

data

);





return arrayBufferToBase64(

new Uint8Array(

[

...iv,

...new Uint8Array(encrypted)

]

)

);



}
// =====================================================
// AES DECRYPTION
// =====================================================


async function decryptAES(
encryptedText,
password
){


const encoder =
new TextEncoder();


const encryptedBytes =
base64ToArrayBuffer(
encryptedText
);



const iv =
encryptedBytes.slice(
0,
12
);



const data =
encryptedBytes.slice(
12
);



const passwordKey =
await crypto.subtle.importKey(

"raw",

encoder.encode(password),

"PBKDF2",

false,

["deriveKey"]

);




const aesKey =
await crypto.subtle.deriveKey(

{

name:"PBKDF2",

salt:
encoder.encode("CryptoShield"),

iterations:100000,

hash:"SHA-256"

},


passwordKey,


{

name:"AES-GCM",

length:256

},


false,


[
"encrypt",
"decrypt"
]

);




const decrypted =
await crypto.subtle.decrypt(

{

name:"AES-GCM",

iv:iv

},

aesKey,

data

);



return new TextDecoder()
.decode(decrypted);


}







// =====================================================
// RSA KEY GENERATION
// =====================================================



rsaBtn.addEventListener(
"click",
async()=>{


loading();



try{


rsaKeys =
await generateRSAKeys();



updateStatus(
"🔑 RSA Key Pair Generated Successfully"
);



}

catch(error){


console.log(error);


updateStatus(
"❌ RSA Generation Failed"
);


}



});







async function generateRSAKeys(){



return await crypto.subtle.generateKey(


{


name:"RSA-OAEP",


modulusLength:2048,


publicExponent:
new Uint8Array(
[1,0,1]
),


hash:"SHA-256"



},



true,



[
"encrypt",
"decrypt"
]


);


}







// =====================================================
// RSA ENCRYPTION
// =====================================================



async function encryptRSA(text){



if(!rsaKeys){

throw "Generate RSA Key First";

}



const encoded =
new TextEncoder()
.encode(text);




const encrypted =
await crypto.subtle.encrypt(

{

name:"RSA-OAEP"

},

rsaKeys.publicKey,

encoded

);



return arrayBufferToBase64(

new Uint8Array(encrypted)

);



}







// =====================================================
// RSA DECRYPTION
// =====================================================



async function decryptRSA(text){



if(!rsaKeys){

throw "RSA Key Missing";

}



const data =
base64ToArrayBuffer(text);



const decrypted =
await crypto.subtle.decrypt(

{

name:"RSA-OAEP"

},

rsaKeys.privateKey,

data

);



return new TextDecoder()
.decode(decrypted);


}








// =====================================================
// CAESAR CIPHER
// =====================================================



function caesarEncrypt(
text,
shift
){



shift =
parseInt(shift)||3;



return text.replace(
/[a-z]/gi,
char=>{


let base =
char<="Z"
?
65
:
97;



return String.fromCharCode(

(
char.charCodeAt(0)
-
base
+
shift
)
%26
+
base

);


}

);


}






function caesarDecrypt(
text,
shift
){


shift =
parseInt(shift)||3;



return caesarEncrypt(
text,
26-shift
);


}









// =====================================================
// ROT13
// =====================================================



function rot13(text){



return text.replace(

/[a-z]/gi,

char=>{


let base =
char<="Z"
?
65
:
97;



return String.fromCharCode(

(
char.charCodeAt(0)
-
base
+
13
)
%26
+
base

);



}

);



}








// =====================================================
// BASE64
// =====================================================



function base64Encode(text){


return btoa(
unescape(
encodeURIComponent(text)
)
);


}




function base64Decode(text){


return decodeURIComponent(

escape(

atob(text)

)

);


}









// =====================================================
// BINARY CONVERSION
// =====================================================



function textToBinary(text){



return text
.split("")
.map(
char=>

char
.charCodeAt(0)
.toString(2)
.padStart(8,"0")

)
.join(" ");



}




function binaryToText(binary){



return binary
.split(" ")
.map(

byte=>

String.fromCharCode(
parseInt(byte,2)
)

)
.join("");

}








// =====================================================
// COPY OUTPUT
// =====================================================



copyBtn.addEventListener(
"click",
()=>{


if(outputText.value===""){

updateStatus(
"⚠ Nothing to Copy"
);

return;

}



navigator.clipboard.writeText(
outputText.value
);



updateStatus(
"📋 Output Copied"
);



});








// =====================================================
// DOWNLOAD RESULT
// =====================================================



downloadBtn.addEventListener(
"click",
()=>{


const blob =
new Blob(

[
outputText.value

],

{
type:"text/plain"
}

);



const url =
URL.createObjectURL(blob);



const link =
document.createElement("a");


link.href=url;


link.download=
"CryptoShield_Result.txt";


link.click();



URL.revokeObjectURL(url);



updateStatus(
"📥 File Downloaded"
);



});









// =====================================================
// CLEAR FUNCTION
// =====================================================



clearBtn.addEventListener(
"click",
()=>{


inputText.value="";

secretKey.value="";

outputText.value="";


updateStatus(
"🧹 Cleared"
);



});








// =====================================================
// ARRAY BUFFER HELPERS
// =====================================================



function arrayBufferToBase64(bytes){



let binary="";



bytes.forEach(
byte=>{

binary +=
String.fromCharCode(byte);

}

);



return btoa(binary);


}






function base64ToArrayBuffer(base64){

const binary =
atob(base64);

const bytes =
new Uint8Array(binary.length);

for(
let i=0;
i<binary.length;
i++
){

bytes[i]=
binary.charCodeAt(i);

}

return bytes.buffer;

}






// =====================================================
// PAGE START
// =====================================================



window.onload=()=>{


updateStatus(
"🛡 CryptoShield Ready"
);


};