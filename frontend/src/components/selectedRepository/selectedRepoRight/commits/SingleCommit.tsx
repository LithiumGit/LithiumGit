import { ICommitInfo } from "common_library";
import { UiUtils } from "../../../../lib";
import moment from "moment";
import React from "react";
import { FaCircle, FaDotCircle, FaHashtag, FaKey, FaKeybase, FaKeycdn, FaUser } from "react-icons/fa";

interface ISingleCommitProps{
    commit:ICommitInfo;
    isSelected:boolean;
    onSelect:(commit:ICommitInfo)=>void;
    onRightClick:(e: React.MouseEvent<HTMLDivElement, MouseEvent>,commit:ICommitInfo)=>void;
}

function SingleCommitComponent(props:ISingleCommitProps){
    const getTimeZonOffsetStr = ()=>{
        return UiUtils.getTimeZonOffsetStr();
    }
    return <div className={`py-1 w-100 overflow-auto ${props.isSelected?'selected':''}`} onClick={()=>props.onSelect(props.commit)} onContextMenu={e=>props.onRightClick(e,props.commit)}>
     <div className="border border-primary ps-2">
        <div>
            <span><FaHashtag /> </span>
            <span>{props.commit.hash}</span>
            {!!props.commit.refs && 
             <b className="text-danger"> ({props.commit.refs})</b>}
        </div>        
        <div className="d-flex align-items-center">
            <span className="pe-2" style={{fontSize:'0.9em'}}><FaUser /> </span>
            <span>{props.commit.author_name}({props.commit.author_email}). </span>
            <span className="px-1" style={{fontSize:'0.5em'}}><FaCircle /> </span>
            <span title={getTimeZonOffsetStr()}>{moment(props.commit.date).format("MMMM Do YYYY, h:mm:ss a") }</span>
        </div>
        <div className="w-100 overflow-ellipsis">
            <span className="no-wrap" title={props.commit.message}>{props.commit.message}</span>
        </div>
    </div>
    </div>
}

export const SingleCommit = React.memo(SingleCommitComponent);