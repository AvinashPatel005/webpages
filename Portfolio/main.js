function openmenu(){
    if(document.getElementById('m-nav').style.display=="block"){
        document.getElementById('m-nav').style.display="none"
    }
    else{
        document.getElementById('m-nav').style.display="block";
    }
}
function closemenu(){
    document.getElementById('m-nav').style.display="none";
}
function copy(){
    navigator.clipboard.writeText('+91 7061898451');
    if(document.getElementById('toast').style.display=="" || document.getElementById('toast').style.display=="none"){
        document.getElementById('toast').style.display="block";
        setTimeout(function(){ document.getElementById('toast').style.display="none"; }, 2000);
    }
}