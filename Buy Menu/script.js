let contract_id = null;
let tokenid = null;
let offerid = null;
let price =0;
let userid = null;
let xrp_account=null;

let socket = io("wss://xrplapii.herokuapp.com");

async function generateQR(){
    $("#loader").show()
    socket.emit("signin");
    socket.on("qr",(qr) => {
        $("#loader").hide()
        $("#qr_img").attr('src',qr);
        $("#qimg").css('display','flex');
        console.log(qr);
    })
    socket.on("usertoken",(id,account) => {
        userid=id;
        xrp_account=account;
        console.log(account);
        $("#qimg").hide()
        getData();
    })
}

function buy(){
  
  socket.emit("buynft",offerid,userid)
  socket.on("nftbought",(tokenofferid) =>{
    $("#loader").hide()
    console.log(tokenofferid);
    $("#popup").css('display','flex')
    $("#txhash_url").attr('href',`https://nft-devnet.xrpl.org/accounts/${xrp_account}`)
    $("#txhash_url").text("For More information click here!")
  })
}

async function getData(){
  let url_string = window.location.href;
  let url = new URL(url_string);
  let nftid = url.searchParams.get("nftid");
  if(nftid){
   
    $("#loader").show()
    let req =  await fetch('https://xrplapii.herokuapp.com/nftsingle',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({  
        "tokenid":nftid
      })
    })
    let res = await req.json()


    contract_id = res['contractid']
    tokenid = res['tokenid']
    price = res['price'] || '0'
    offerid = res['offer'];

    let meta_ = await fetch(`https://${res['metadata'].split("/")[2]}.ipfs.infura-ipfs.io/metadata.json`)
    let meta_res = await meta_.json()
    let t = meta_res['image'].split("/")
    let img_url = `https://${t[2]}.ipfs.infura-ipfs.io/${t[t.length-1]}`

    $("#zxcas").attr('src',img_url)
    $("#pricex").text(`${price} XRP`)
    
    $("#xuid").show()
    $("#xuidb").css('display','flex')
    $("#loader").hide()
  }
}

document.addEventListener('DOMContentLoaded',async function () {

  generateQR();


  $( "#wfh" ).click(async()=> {
    $("#loader").show()
    $( "#wfh" ).hide()
    buy()
  });
});

