/* =====================================
        CryptoShield JavaScript
   ===================================== */



// ================= INTRO ANIMATION =================


window.addEventListener("load",()=>{

    setTimeout(()=>{

        document
        .getElementById("intro")
        .classList
        .add("hide");

    },2000);


});




// ================= PAGE SWITCH =================


function startApp(){

    document.getElementById("homePage")
    .style.display="none";


    document.getElementById("toolPage")
    .style.display="flex";

}



// ================= RSA VARIABLES =================


let rsaPublicKey=null;
let rsaPrivateKey=null;




// ================= GENERATE RSA KEYS =================


function generateRSA(){


    /*
        Demo RSA Values

        p = 61
        q = 53

        n = 3233
        e = 17
        d = 2753

    */


    rsaPublicKey={

        e:17,
        n:3233

    };


    rsaPrivateKey={

        d:2753,
        n:3233

    };



    alert(
        "RSA Demo Keys Generated Successfully!"
    );


}





// ================= ENCRYPT FUNCTION =================


function encrypt(){


    let algo=getAlgorithm();

    let text=getInput();

    let key=getKey();



    if(text.trim()===""){

        alert("Please enter text");
        return;

    }



    let result="";



    try{


        // AES

        if(algo==="aes"){


            if(key===""){

                alert("Enter AES secret key");
                return;

            }


            result =
            CryptoJS.AES.encrypt(
                text,
                key
            ).toString();


        }





        // RSA

        else if(algo==="rsa"){


            if(!rsaPublicKey){

                alert(
                "Generate RSA keys first"
                );

                return;

            }



            result=text
            .split("")
            .map(char=>{


                return modPower(
                    char.charCodeAt(0),
                    rsaPublicKey.e,
                    rsaPublicKey.n
                );


            })
            .join(" ");


        }





        // Base64

        else if(algo==="base64"){


            result =
            btoa(
                text
            );


        }





        // Caesar Cipher

        else if(algo==="caesar"){


            let shift=parseInt(key)||0;


            result =
            caesarEncrypt(
                text,
                shift
            );


        }





        // ROT13

        else if(algo==="rot13"){


            result =
            rot13(text);


        }





        // Binary

        else if(algo==="binary"){


            result =
            text
            .split("")
            .map(
                c=>
                c.charCodeAt(0)
                .toString(2)
            )
            .join(" ");


        }



        setOutput(result);


    }

    catch(error){

        alert(
            "Encryption Error"
        );

    }


}







// ================= DECRYPT FUNCTION =================



function decrypt(){


    let algo=getAlgorithm();

    let text=getInput();

    let key=getKey();


    if(text.trim()===""){

        alert("Please enter encrypted text");
        return;

    }



    let result="";



    try{


        // AES


        if(algo==="aes"){


            result =
            CryptoJS.AES.decrypt(
                text,
                key
            )
            .toString(
                CryptoJS.enc.Utf8
            );


        }






        // RSA


        else if(algo==="rsa"){


            if(!rsaPrivateKey){

                alert(
                "Generate RSA keys first"
                );

                return;

            }



            result =
            text
            .trim()
            .split(/\s+/)
            .map(num=>{


                return String.fromCharCode(

                    modPower(
                        parseInt(num),
                        rsaPrivateKey.d,
                        rsaPrivateKey.n
                    )

                );


            })
            .join("");



        }







        // Base64


        else if(algo==="base64"){


            result =
            atob(text);


        }






        // Caesar


        else if(algo==="caesar"){


            let shift=parseInt(key)||0;


            result =
            caesarDecrypt(
                text,
                shift
            );


        }






        // ROT13


        else if(algo==="rot13"){


            result =
            rot13(text);


        }







        // Binary


        else if(algo==="binary"){


            result =
            text
            .split(/\s+/)
            .map(
                b=>
                String.fromCharCode(
                    parseInt(b,2)
                )
            )
            .join("");

        }




        setOutput(result);



    }


    catch(error){


        alert(
        "Decryption Failed"
        );


    }


}






// ================= CAESAR =================



function caesarEncrypt(text,shift){


    return text.replace(/[a-z]/gi,char=>{


        let base =
        char <= "Z"
        ?65
        :97;


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


    });


}



function caesarDecrypt(text,shift){


    return caesarEncrypt(
        text,
        26-shift
    );


}






// ================= ROT13 =================


function rot13(text){


    return text.replace(/[a-z]/gi,char=>{


        let base =
        char<="Z"
        ?65
        :97;


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


    });


}







// ================= RSA MATH =================



function modPower(base,exp,mod){


    let result=1;


    base=base%mod;



    while(exp>0){


        if(exp%2===1){

            result=
            (result*base)%mod;

        }


        exp=Math.floor(exp/2);


        base=
        (base*base)%mod;


    }


    return result;


}







// ================= CLEAR =================



function clearAll(){


    document
    .getElementById("inputText")
    .value="";


    document
    .getElementById("secretKey")
    .value="";


    document
    .getElementById("outputText")
    .value="";


}






// ================= HELPERS =================


function getAlgorithm(){

    return document
    .getElementById("algo")
    .value;

}



function getInput(){

    return document
    .getElementById("inputText")
    .value;

}



function getKey(){

    return document
    .getElementById("secretKey")
    .value;

}



function setOutput(value){

    document
    .getElementById("outputText")
    .value=value;

}