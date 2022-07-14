import React from "react"
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { shallowEqual } from "react-redux";
import { BranchUtils } from "../../../lib";
import { useSelectorTyped } from "../../../store/rootReducer";

function PullPushMenuComponent(){
    const store = useSelectorTyped(state=>({
        current:state.repository.statusCurrent,
        ahead:state.repository.aheadCount,
        behind:state.repository.behindCount,
    }),shallowEqual);

    console.log("BranchUtils.repositoryDetails",BranchUtils.repositoryDetails);

    return <div className="row g-0 align-items-center ps-2">
        <div className="col-auto border py-2 px-1">
            <div className="row g-0">
                <div className="col-auto">
                    {store.current}
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
        <div className="col-auto"></div>
    </div>
}

export const PullPushMenu = React.memo(PullPushMenuComponent);