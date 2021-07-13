
package com.bsse.views.mainScene;

import java.util.ArrayList;

import com.bsse.business.StateManager;
import com.bsse.dataClasses.BranchDetails;
import com.bsse.dataClasses.Constants;
import com.bsse.dataClasses.RepositoryInfo;
import com.bsse.dataClasses.SingleBranchProps;
import com.bsse.utils.ArrayUtil;

import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;

public class SelectedRepoRightPanel extends HBox{
	private RepositoryInfo repositoryInfo;
	private ArrayList<SingleBranch> branches = new ArrayList<>();
	
    public SelectedRepoRightPanel() {
        super();
        this.addStyles();
        //this.addChildNodes();
        this.repositoryInfo = StateManager.getRepositoryInfo();
       // drawBranch();
    }
    
    public void updateUi() {
    	if(this.repositoryInfo != StateManager.getRepositoryInfo()) {
    		this.repositoryInfo = StateManager.getRepositoryInfo();
    		drawBranch();
    	}
    }
        
    
    public void drawBranch() {
    	this.repositoryInfo = StateManager.getRepositoryInfo();
    	    	
    	int lineNumber = 0;    	    	
    	for (BranchDetails branch : this.repositoryInfo.resolvedBranches) {
    		drawSingleBranch(branch, lineNumber);
    		lineNumber++;
		}
    	drawCommits();
    	
    }
    
    private void drawCommits() {
    	int x = 0;
    	int increamenter = Constants.CommitRadius;
    	for (var commit :this.repositoryInfo.allCommits) {
    		commit.x = x; 
			var branch = ArrayUtil.find(this.branches, b -> b.props.branch.name == commit.ownerBranch.name);
			branch.props.commitHorizontalPositions.add(x);
			x += increamenter;
		}
    	
    	for (SingleBranch singleBranch : branches) {
			singleBranch.draw();
		}
    	var vBox = new VBox();
    	vBox.getChildren().addAll(branches);
    	this.getChildren().add(vBox);
    }
    
    private void drawSingleBranch(BranchDetails branch,int lineNumber) {    	
		int height = lineNumber*100;
		//var vBox = new VBox();		
		var singleBranchProps = new SingleBranchProps();
		singleBranchProps.branch = branch;
		singleBranchProps.y = height;
		var singleBranch = new SingleBranch(singleBranchProps);
		this.branches.add(singleBranch);
		//vBox.getChildren().addAll(singleBranch);
				
		//return vBox;
	}
    
    
    private void addStyles(){
        getStyleClass().addAll("border-red","px-5");
    }
    
    private void addChildNodes(){
        
    }
    
    private Pane getBranchNode() {
    	var container = new VBox();
    	
    	return container;
    }
    
    
}
