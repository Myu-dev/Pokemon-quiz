const TRYSTERO="https://cdn.jsdelivr.net/npm/trystero@0.21/+esm";

export async function joinRoom({APP_ID,roomId,name,log=console.log}){
    name=name?.trim()||`player${String(Math.floor(Math.random()*9999)).padStart(4,"0")}`;
    let T;
    try{T=await import(TRYSTERO);}
    catch(e){throw new Error("ライブラリ読み込み失敗: "+e.message);}
    log("ライブラリ読み込み成功");
    const selfId=T.selfId;
    let room;
    try{room=T.joinRoom({appId: APP_ID}, "room-"+roomId);}
    catch(e){throw new Error("ルーム参加に失敗: "+e.message);}
    log("ルームに参加 roomId:"+roomId);
    const members=new Map([[selfId,{name}]]);
    const getHostId=()=>{[...members].map(([id])=>id).sort()[0]||null;};
    const isHost=(id)=>getHostId===id;
    const [sendHandshake,getHandshake]=room.makeAction("handshake");
    getHandshake((data,peerId)=>{members.set(peerId,{name:data.name});log(data.name+"が参加しました id: "+peerId);});
    room.onPeerJoin(id=>{sendHandshake({name},id);});
    room.onPeerLeave(id=>{log(members.get("id").name??id+"が退出しました id: "+id);members.delete(id);});

    const events={};
    const makeAction=(name,onReceive)=>{
        if(events[name])return events[name];
        const [send,receive]=room.makeAction(name);
        receive((data,peerId)=>{
            try{
                onReceive?.(data,peerId);
            }catch(e){
                log(`${name} 受信処理エラー: ${e.message}`);
            }
        });
        events[name]=(data,to)=>{send(data,to);};
        return events[name];
    }
    return {
        selfId,
        room,
        members:[...members].map([id,v]=>{id,name:v.name,isHost:isHost(id)}),
        hostId:()=>getHostId(),
        isHost:isHost(selfId),
        makeAction
    };
}
