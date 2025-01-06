sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("mbs.mybookshop220014ui.controller.Login", {
        onInit() {
        },

        goBack: function () {
            history.go(-1);
        },

        onLoginPress: function () {

          var that = this;

          const bindingContexturl = "/User?$filter=email eq '" + this.byId("emailid").getValue() + "' and pwd eq '" + this.byId("pasw").getValue() + "'";
          this.getView().getModel("capservice").bindContext(bindingContexturl).requestObject().then(function (Data) {

            if (Data.value.length > 0) {

              that.oOwnerComponent = that.getOwnerComponent();
              that.oOwnerComponent.loginUseremail = that.byId("emailid").getValue();
              that.oRouter = that.oOwnerComponent.getRouter();
              that.oRouter.navTo("RouteDashBoard");              


            } else {

              MessageBox.error('User Does Not Exists !!!');

            }
                      
          }).catch(function (error) {

            MessageBox.error('User Does Not Exists !!!');

        });

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