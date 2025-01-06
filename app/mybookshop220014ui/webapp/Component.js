sap.ui.define([
    "sap/ui/core/UIComponent",
    "mbs/mybookshop220014ui/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("mbs.mybookshop220014ui.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var that = this;

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // // New JSON Model for Resource directory
            // var loginUser = {
            //     Delegatee: "",
            //     SrManagerName: "",
            //     ManagerName: ""
            // };
            // var oModel = new JSONModel(oResourceData);
            // this.getView().setModel(oModel, "resourceDirectoryModel");         
            
            if (that.loginUseremail) {

                this.loginUseremail = that.loginUseremail;                

            } else {

                this.loginUseremail = '';                
            }                
            

            // enable routing
            this.getRouter().initialize();
        }
    });
});