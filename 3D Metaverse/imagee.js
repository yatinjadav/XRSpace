const  getImagess =async () => {
  let res = await fetch('https://xrplapii.herokuapp.com/nftid',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({  
      "ownerid": window.config1.host
    })
  })
  let data = await res.json()
  window.nfts = {nfts:[]};
  for (i = 0; i < data.length; i++) {
      console.log(data[i])
      isSold = data[i].isonsale
      if (isSold) {
          window.nfts.nfts.push({ tokenid: data[i].tokenid, uri: data[i].metadata })
      }
  }
  window.nfts = JSON.stringify(window.nfts)
}