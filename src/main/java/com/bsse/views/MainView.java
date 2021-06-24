/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bsse.views;

import com.bsse.dataClasses.StaticData;
import com.bsse.views.mainScene.RootNode;
import javafx.scene.Parent;
import javafx.scene.Scene;
import org.kordamp.bootstrapfx.BootstrapFX;

/**
 *
 * @author ASUS
 */
public class MainView extends Scene{
    private final String style = MainView.class.getResource("/compiled-css/style.css").toExternalForm();
    public MainView() {        
        super(getScene(),900, 500);
        addStyleSheets();
    }
    
    private void addStyleSheets(){
        getStylesheets().add(style);
        //getStylesheets().add(BootstrapFX.bootstrapFXStylesheet());
    }
    
    private static Parent getScene() {
        var rootNode = new RootNode();
        StaticData.rootNode = rootNode;                
        return rootNode;
    }
	
}