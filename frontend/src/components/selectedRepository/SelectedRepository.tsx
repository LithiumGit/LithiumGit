import React, { useEffect, useMemo, useRef } from "react";
import { BranchUtils, CacheUtils, ReduxUtils, useDrag, useMultiState } from "../../lib";
import { SelectedRepoLeft } from "./SelectedRepoLeft";
import { SelectedRepoRight } from "./selectedRepoRight/SelectedRepoRight";
import './SelectedRepository.scss';
import { IRepositoryDetails, RendererEvents, RepositoryInfo } from "common_library";
import { useSelectorTyped } from "../../store/rootReducer";
import { shallowEqual, useDispatch } from "react-redux";
import { BranchGraphUtils } from "../../lib/utils/BranchGraphUtils";
import { ActionUI } from "../../store/slices/UiSlice";


interface ISelectedRepositoryProps{
    height:number;
    repo:RepositoryInfo
}

interface IState{
    isLoading:boolean;
}

function SelectedRepositoryComponent(props:ISelectedRepositoryProps){
    const store = useSelectorTyped(state=>({
        branchPanelRefreshVersion:state.ui.versions.branchPanelRefresh,
        status:state.ui.status,
    }),shallowEqual);
    const[state,setState]=useMultiState<IState>({isLoading:true});
    const leftWidthRef = useRef(200);
    const positionRef = useRef(0);
    const {currentMousePosition:position,elementRef:resizer} = useDrag();
    const dispatch = useDispatch();
    const refData = useRef({previousRepo:props.repo});
    
    const getRepoDetails = async ()=>{            
        const res:IRepositoryDetails = await window.ipcRenderer.invoke(RendererEvents.getRepositoryDetails().channel,props.repo);
        return res;
    }

    const updateRepoData = async ()=>{
        let res = await CacheUtils.getRepoDetails(props.repo.path);
        if(!res){
            res = await getRepoDetails();
            BranchUtils.getRepoDetails(res);
            CacheUtils.setRepoDetails(res);
        }
        BranchUtils.repositoryDetails = res;
        ReduxUtils.setStatusCurrent(res.status);                        
        if(state.isLoading)
            setState({isLoading:false});        
        
    }

    useEffect(()=>{                       
       updateRepoData();
    },[]);

    useEffect(()=>{
        if(!store.status)
            return;
        const requiredReload = BranchGraphUtils.isRequiredReload(store.status);
        if(requiredReload) dispatch(ActionUI.increamentVersion("branchPanelRefresh"));
        else BranchGraphUtils.checkForUiUpdate(store.status);
    },[store.status]);

    useEffect(()=>{
        if(!store.branchPanelRefreshVersion) return;
        // setState({repoDetails:undefined});
        getRepoDetails().then(res=>{
            BranchUtils.getRepoDetails(res);
            BranchUtils.repositoryDetails = res;
            CacheUtils.setRepoDetails(res);
            BranchGraphUtils.createBranchPanel();
            dispatch(ActionUI.setLoader(undefined));
        });
    },[store.branchPanelRefreshVersion]); 

    const leftWidth = useMemo(()=>{
        if(!position){
            leftWidthRef.current += positionRef.current;
            positionRef.current = 0;
            return leftWidthRef.current;
        }
        positionRef.current = position.x;
        return leftWidthRef.current + positionRef.current;
    },[position?.x])

    useEffect(()=>{
        if(refData.current.previousRepo != props.repo){
            updateRepoData().then(_=>{
                refData.current.previousRepo = props.repo;
                BranchGraphUtils.createBranchPanel();
            });
            
        }
    },[props.repo]);

    if(state.isLoading) return <p className="text-center">Loading...</p>;
    return <div id="SelectedRepository" className="d-flex h-100">
        <div style={{width:`${leftWidth - 3}px`}}>
            <SelectedRepoLeft height={props.height}  />
        </div>
        <div ref={resizer as any} className="bg-second-color cur-resize" style={{ width: '3px' }} />
        <div style={{width:`calc(100% - ${leftWidth}px)`}} className="overflow-hidden">
            <SelectedRepoRight height={props.height} />
        </div>
    </div>
}

export const SelectedRepository = React.memo(SelectedRepositoryComponent);