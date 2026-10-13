const TRYSTERO="https://cdn.jsdelivr.net/npm/trystero@0.21/+esm";

export async function joinRoom({APP_ID,roomId,name=`player${Math.floor(Math.random()*9999)}`,log=console.log}){
    let T;
    try{T=await import(TRYSTERO);}
    catch(e){throw new Error("ライブラリ読み込み失敗: "+e.message);
    }
    log("ライブラリ読み込み成功");
    const selfId=T.selfId;
    let room;
    try{room=T.joinRoom({appId: APP_ID}, "room-"+roomId);}
    catch(e){throw new Error("ルーム参加に失敗: "+e.message);}
    log("ルームに参加 roomId:"+roomId);
    const members=new Map([[selfId,name]]);
    const [sendHandshake,getHandshake]=room.makeAction("handshake");
    getHandshake((data,peerId)=>{members.set(id,{name:d.name});log(d.name+"が参加しました id: "+id);});
    room.onPeerJoin(id=>{sendHandshake({name},id);});
    room.onPeerLeave(id=>{members.delete(id);log("相手が退出しました id: "+id)});

    const events={};
    const defineEvent=(name,onReceive)=>{
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
    return {selfId,room,defineEvent};
}
