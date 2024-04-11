import { RendererEvents } from "common_library";
import React, { useEffect, useMemo, useRef } from "react"
import { Dropdown } from "react-bootstrap";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaArrowDown, FaCaretDown } from "react-icons/fa";
import { shallowEqual, useDispatch } from "react-redux";
import { BranchUtils, EnumModals, useMultiState } from "../../../lib";
import { useSelectorTyped } from "../../../store/rootReducer";
import { ActionUI } from "../../../store/slices/UiSlice";
import { IpcUtils } from "../../../lib/utils/IpcUtils";
import { ActionModals } from "../../../store";

interface IStatus{
    showPushTo:boolean;
    showPullFrom:boolean;
    showFetchAll:boolean;
    
}

function PullPushMenuComponent(){
    const store = useSelectorTyped(state=>({
        current:state.ui.status?.current,
        hashOfHead:state.ui.status?.headCommit?.avrebHash,
        ahead:state.ui.status?.ahead,
        behind:state.ui.status?.behind,
        isDetached:!!state.ui.status?.isDetached
    }),shallowEqual);

    const [state,setState] = useMultiState<IStatus>({showPushTo:false,
        showPullFrom:false,showFetchAll:false});

    const refData = useRef({onHoverPushTo:false,onHoverPullFrom:false,onHoverFetchAll:false});

    const dispatch = useDispatch();
    const currentText = useMemo(()=>{
        if(store.isDetached)
            return store.hashOfHead+"(Detached)";
        return store.current;
    },[store.isDetached,store.current,store.hashOfHead])

    const handlePull=()=>{
        dispatch(ActionUI.setLoader({text:"Pull in progress..."}));
        IpcUtils.trigerPull().then(()=>{
            dispatch(ActionUI.setLoader({text:"Checking status..."}));
            IpcUtils.getRepoStatus().finally(()=>{
                dispatch(ActionUI.setLoader(undefined));
            })
        })
    }

    const handlePush=()=>{
        dispatch(ActionUI.setLoader({text:"Push in progress..."}));
        IpcUtils.trigerPush().then(()=>{
            dispatch(ActionUI.setLoader({text:"Checking status..."}));
            IpcUtils.getRepoStatus().finally(()=>{                
                dispatch(ActionUI.setLoader(undefined));
            })
        })
    }

    const handleFetch=(isAll:boolean)=>{
        if(isAll){
            setState({showFetchAll:false});
        }
        dispatch(ActionUI.setLoader({text:"Fetching..."}));
        IpcUtils.fetch(isAll).then(_=>{
            dispatch(ActionUI.setLoader(undefined));
            IpcUtils.getRepoStatus();
        })
    }

    const handlePushCaretClick=(e: React.MouseEvent<SVGElement, MouseEvent>)=>{        
        setState({showPushTo:!state.showPushTo});
    }

    const handlePullCaretClick=(e: React.MouseEvent<SVGElement, MouseEvent>)=>{        
        setState({showPullFrom:!state.showPullFrom});
    }
    const handleFetchCaretClick=(e: React.MouseEvent<SVGElement, MouseEvent>)=>{        
        setState({showFetchAll:!state.showFetchAll});
    }

    useEffect(()=>{
        const handler = ()=>{
            if(!refData.current.onHoverPushTo){
                setState({showPushTo:false})    
            }
            if(!refData.current.onHoverPullFrom){
                setState({showPullFrom:false})    
            }
            if(!refData.current.onHoverFetchAll){
                setState({showFetchAll:false})    
            }            
        }
        document.addEventListener("click",handler);

        return ()=>{
            document.removeEventListener("click",handler);
        }
    },[])

    const handlePushTo = ()=>{
        setState({showPushTo:false});
        dispatch(ActionModals.showModal(EnumModals.PUSH_TO));
    }
    const handlePullFrom = ()=>{
        setState({showPullFrom:false});
        dispatch(ActionModals.showModal(EnumModals.PULL_FROM));
    }    

    return <div className="row g-0 align-items-stretch ps-2">
        <div className="col-auto border px-1">
            <div className="row g-0 align-items-center h-100">
                <div className="col-auto">
                    {currentText}
                </div>
                <div className="col-auto ps-1">
                    <div className="row g-0 bg-info px-1 rounded">
                        <div className="col-auto">
                            <FaAngleDoubleUp />
                        </div>
                        <div className="col-auto">
                            {store.ahead}
                        </div>
                    </div>
                </div>
                <div className="col-auto ps-1">
                    <div className="row g-0 bg-info px-1 rounded">
                        <div className="col-auto">
                            <FaAngleDoubleDown />
                        </div>
                        <div className="col-auto">
                            {store.behind}
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div className="col-auto ps-1 pe-1">
            <div className="row g-0 align-items-stretch h-100 bg-success">
                <div className="col-auto d-flex align-items-center button-effect" onClick={handlePush}>
                    <span className="px-2 text-light">Push</span> 
                </div>
                <div className="border-secondary border-start border-end col-auto d-flex align-items-center position-relative" 
                    onMouseEnter={()=> {refData.current.onHoverPushTo = true}} onMouseLeave={()=>{refData.current.onHoverPushTo = false}}>
                    <FaCaretDown onClick={handlePushCaretClick} />
                    {state.showPushTo && <div className="position-absolute bg-success py-1 px-2 button-effect" style={{top:'105%', right:0}}
                        onClick={handlePushTo}>
                        <span className="text-nowrap text-light">Push To &gt;</span>
                    </div>}
                </div>
            </div>
        </div>
        <div className="col-auto ps-1 pe-1">
            <div className="row g-0 align-items-stretch h-100 bg-success">
                <div className="col-auto d-flex align-items-center button-effect" onClick={handlePull}>
                    <span className="px-2 text-light">Pull</span> 
                </div>
                <div className="border-secondary border-start border-end col-auto d-flex align-items-center position-relative"
                    onMouseEnter={()=> {refData.current.onHoverPullFrom = true}} onMouseLeave={()=>{refData.current.onHoverPullFrom = false}}>
                    <FaCaretDown onClick={handlePullCaretClick} />
                    {state.showPullFrom && <div className="position-absolute bg-success py-1 px-2 button-effect" style={{top:'105%', right:0}}
                        onClick={handlePullFrom}>
                        <span className="text-nowrap text-light">Pull From &gt;</span>
                    </div>}
                </div>
            </div>
        </div>

        <div className="col-auto ps-1 pe-1">
            <div className="row g-0 align-items-stretch h-100 bg-success">
                <div className="col-auto d-flex align-items-center button-effect" onClick={_=> handleFetch(false)}>
                    <span className="px-2 text-light">Fetch</span> 
                </div>
                <div className="border-secondary border-start border-end col-auto d-flex align-items-center position-relative"
                    onMouseEnter={()=> {refData.current.onHoverFetchAll = true}} onMouseLeave={()=>{refData.current.onHoverFetchAll = false}}>
                    <FaCaretDown onClick={handleFetchCaretClick} />
                    {state.showFetchAll && <div className="position-absolute bg-success py-1 px-2 button-effect" style={{top:'105%', right:0}}
                        onClick={_=> handleFetch(true)}>
                        <span className="text-nowrap text-light">Fetch all</span>
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

export const PullPushMenu = React.memo(PullPushMenuComponent);