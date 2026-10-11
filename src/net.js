const TRYSTERO="https://cdn.jsdelivr.net/npm/trystero@0.21/+esm";
const APP_ID="myu-pokemon-quiz";
export async function joinNet({id,name,host,topics,onPeer,log=console.log}){
    T=await import(TRYSTERO);
    const selfId=T.selfId;
    const members=new Map([[selfId,{name,host}]]);
    const room=T.joinRoom({appId: APP_ID}, "room-"+id);

    room.onPeerJoin(id=>{
        log(id+"が入室しました");
    });
    room.onPeerLeave(id=>{
        log(id+"が退出しました")
    });
}