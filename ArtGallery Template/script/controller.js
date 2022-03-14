$("#ipfs-data").hide();
$("#pg-data").hide();
let indx=0;
let themes = [{imgurl:"/images/t1.jpg",id:"genesis"}/*,{imgurl:"/images/t1.jpg",id:"t2"}*/];
let xrp_account="";
let socket = io("wss://xrplapii.herokuapp.com");

async function generateQR(){
    $("#btn_a").hide()
    $("#btn_b").hide()
    $("#loader").show()
    $("#progress_status").show()
    setprogress("Generating XUMM QR.")
    socket.emit("signin");
    socket.on("qr",(qr) => {
        $("#loader").hide()
        setprogress("Scan QR With XRP XUMM Wallet To Continue.")
        $("#qr_img").attr('src',qr)
        $("#qr_img").show()
        console.log(qr);
    })
    socket.on("usertoken",(id,account) => {
        xrp_account=account;
        console.log(account);
        $("#qr_img").hide()
        $("#progress_status").hide()
        setprogress("")
        $("#btn_a").show()
        $("#btn_b").show()
    })
} 

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function toast(message){
    Toastify({
        text: message,
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        className: "info",
        duration:2500
      }).showToast();
}

function setprogress(message){
    $("#progress_status").html(message)
}



$("input:file").change(function (){
    let fileName = document.getElementById("h_uri_h").files[0];
    $("#h_uri").val(fileName.name);
});

$("#upload_nftx").click(async function() {
    event.preventDefault();
    $('#h_uri_h').click();
})

$( "#gogo" ).click(async function() {
    $("#btn_a").hide()
    $("#btn_b").hide()
    $("#loader").show()
    $("#progress_status").show()
    try{
        event.preventDefault();
 
       

        let title = $("#h_title").val();
        let ns_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVlMjM0NEU4OTdiZjIyZjc2RDU2NDA5MjkzQkFlN0Y3ODFmYzg5QWUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODgwMDA3NTY2OCwibmFtZSI6InRlc3QifQ._vXmDNn5-3JWSUMj4jfC-rJXgPpOgIjV9l83iB96LIM";//$("#ns_token").val();
        let dtype = $('input[type=radio][name=dtype]:checked').val();
        let ipfs_api="";
        
        if(title=="" || dtype==undefined){
            toast("Please fill all the details!");
            throw("")
        }
        if(dtype=="ipfs"){
            ipfs_api = $("#ipfs-api").val();
            if(ipfs_api==""){
                toast("Please fill all the details!");
                throw("")
              
            }
        }
        let host_addr = xrp_account;
        setprogress("Starting metaverse deployment process on ipfs...")
        if(dtype=="ipfs"){
            let inputs = $("#ipfs-data").find("input");
            let headers={}
            let j=0;
            if(inputs.length>1){
                for(let i=1;i<inputs.length;i+=2){
                    let k =$(inputs[i]).val();
                    let v=$(inputs[i]).val();
                    if(k!="" && v!=""){
                        headers[k]=v;
                        j++;
                    }
                }
            }
            if(j){
                initIpfsPinService(ipfs_api,headers);
            }else{
                initIpfsPinService(ipfs_api,null);
            }      
        }
        setprogress("Metaverse upload started on ipfs...")
        let cidV1=await deployMetaVerse(dtype,themes[indx].id,title,"","",host_addr, "" ,ns_token);
        
        setprogress("Metaverse uploaded sucessfully on ipfs...")

        setprogress("Initiating art gallery smart contract...")
                
        console.log(`LocalNode: https://${cidV1}.infura-ipfs.io/`)
        console.log(`LocalNode: https://ipfs.io/ipfs/${cidV1}`)
        $("#metaverse_url").children("a").html(`http://${cidV1}.ipfs.infura-ipfs.io/`)
        $("#metaverse_url").children("a").attr("href",`http://${cidV1}.ipfs.infura-ipfs.io/`)
        $("#progress_status").hide()
        $("#loader").hide()
        $("#metaverse_url").show()
    }catch(e){
        console.log(e)
        $("#btn_a").show()
        $("#btn_b").show()
        if(e){
            toast("Something went wrong check console for more details.")
        }
    }
    $("#progress_status").hide()
    $("#loader").hide()



});


$( "#comming_soon" ).click(async function() {
    event.preventDefault();
    alert('Edit World Feature Coming Soon🥳.')
});



$('input[type=radio][name=dtype]').change(function() {
    if($(this).val()=="ipfs"){
        $("#ipfs-data").show()
        $("#pg-data").hide();
    }else if($(this).val()=="web3s"){
        $("#web3s-data").show();
    }else{
        $("#ipfs-data").hide();
        $("#pg-data").show();
    }
})



$( "#add_btn" ).click(function() {
    let id=makeid(5);
    let a='<div id="ob_'+id+'" style="display: flex; flex-direction:row;" class="material-textfield">'
    a+='<div>'
    a+='<input  class="woei"  placeholder="key" type="text">'
    a+='</div>'
    a+='<div  style="margin-left: 5px;">'
    a+='<input  class="woei"  placeholder="value" type="text">'
    a+='</div>'
    a+='<div id="h_del" style="margin: 5px; align-self: center;background: red;" class="roar">'
    a+='<div class="minus">'  
    a+='</div>'
    a+='</div>'
    a+='</div>'
    $("#ipfs-data").append(a);
    $('#ob_'+id).on('click','div[id="h_del"]', function() {
        $("#"+$(this).parent().attr("id")).remove();
    });
    
});


document.addEventListener('DOMContentLoaded', function () {
    const ele = document.getElementById('avnfts');
    ele.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function (e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    ele.addEventListener('mousedown', mouseDownHandler);
    generateQR()
});

let n =  themes.length;

let a="";

for(let theme of themes){
    a+=`<div id="${theme['id']}" style="margin: 5px; ">`
    a+=`<img  style="border-radius: 10px; height: 150px;width: 256px;" draggable="false" ondragstart="return false;" class="unselectable" src="${theme['imgurl']}">`
    a+='</div>'
}

$("#avnfts").append(a);
$( "#"+themes[0]['id'] ).addClass( "selected" )

$("#nleft").click(()=>{
    $( "#"+themes[indx]['id'] ).removeClass( "selected" )
    indx=indx-1;
    if(indx<0){
        indx=n-1;
    }
    $( "#"+themes[indx]['id'] ).addClass( "selected" )
})

$("#nright").click(()=>{
    $( "#"+themes[indx]['id'] ).removeClass( "selected" )
    indx=(indx+1)%n;
    $( "#"+themes[indx]['id'] ).addClass( "selected" )
})



