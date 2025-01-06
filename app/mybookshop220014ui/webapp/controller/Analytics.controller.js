sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
  ], (BaseController, MessageBox) => {
    "use strict";
  
    return BaseController.extend("mbs.mybookshop220014ui.controller.Analytics", {
      onInit() {
      },
  
      onLogin: function () {

        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.navTo("RouteLogin");
      },

      pressFavs: function () {

        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.navTo("RouteFavs");
      },

      pressRecms: function () {

        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.navTo("RouteRecm");
      },

      pressKPIs: function () {

        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.navTo("RouteKPIs");
      }
        
    });
  });