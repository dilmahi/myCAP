sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
], (BaseController, MessageBox) => {
  "use strict";

  return BaseController.extend("mbs.mybookshop220014ui.controller.App", {
    onInit() {
    },

    onLogin: function () {

      this.oOwnerComponent = this.getOwnerComponent();
      this.oRouter = this.oOwnerComponent.getRouter();
      this.oRouter.navTo("RouteLogin");
    },

    onDashBoard: function () {

      this.oOwnerComponent = this.getOwnerComponent();
      this.oRouter = this.oOwnerComponent.getRouter();
      this.oRouter.navTo("RouteDashBoard");

    },

    onRegister: function (oEvent) {

      // var pathUser = oEvent.getSource().getBindingContext("capservice").getPath();
      var oViewUser = this.getView();

      this.loadFragment({
        name: "mbs.mybookshop220014ui.view.Register"
      }).then(function (oDialog) {
        // oViewUser.addDependent(oDialog);
        // oDialog.bindElement({
        //     model: "capservice",
        // });
        oDialog.open();
      });

    },

    cancelUser: function (oEvent) {
      // this.byId("oDialog").destroy();

      this.byId("openDialog").close();
      this.byId("openDialog").destroy();

    },

    createUser: function (oEvent) {

      if (this.byId("firstName").getValue() === '' ||
        this.byId("lastName").getValue() === '' ||
        this.byId("email").getValue() === '' ||
        this.byId("password").getValue() === '') {
        MessageBox.error('Missing Information !!!');
      }

      const bindingContexturl = "/User?$filter=email eq '" + this.byId("email").getValue();
      this.getView().getModel("capservice").bindContext(bindingContexturl).requestObject().then(function (Data) {
        MessageBox.error('User Exists !!!');
      })

      const oContext = this.getView().getModel("capservice").bindList("/User").create({
        "fname": this.byId("firstName").getValue(),
        "lname": this.byId("lastName").getValue(),
        "email": this.byId("email").getValue(),
        "pwd": this.byId("password").getValue()
      });

      oContext.created().then(() => {
        MessageBox.success('User Created Successfully');
      });

    }

  });
});