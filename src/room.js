import {joinNet} from "./net.js";

const q=new URLSearchParams(location.search);
const roomId=q.get("id")||"";

let net=null;

function log(content){
    document.main.textContent+=content+"\n";
}

async function joinRoom(id){
    try{
         net=await joinNet({id:roomId,name:"",host:1,log});
    }catch(e) {
        log(e);
        
    }
}

joinRoom(id);