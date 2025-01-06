sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",  
  "sap/m/ViewSettingsFilterItem",
	"sap/m/ViewSettingsItem",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
  "sap/ui/model/FilterOperator",    
  "sap/m/MessageBox",
], (BaseController, Fragment, ViewSettingsFilterItem, ViewSettingsItem, Filter, Sorter, FilterOperator, MessageBox) => {
  "use strict";

  return BaseController.extend("mbs.mybookshop220014ui.controller.Books", {
    onInit() {

      if (this.getOwnerComponent().loginUseremail === '') {

        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.navTo("RouteLogin");  

      }

      var oModel = new sap.ui.model.json.JSONModel();
      var that = this;
      var aData = jQuery.ajax({

        url: "https://openlibrary.org/search.json?q=technology&fields=title,author_name,subject,cover_i",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
          
        var booksData = {
          "books": []
        }

        booksData.books = data.docs.map( item => ({

          bookId: item.cover_i,
          bookName: item.title,
          author: item.author_name?.[0],
          category: item.subject?.[0]

        }))

        booksData.books = booksData.books.filter( item => item.bookId > 0 );
        oModel.setData(booksData);

        },
        error: function (error) {
          alert(error.statusText);
        }
      });

      this._mDialogs = {};
      this.getView().setModel(oModel);      
      this.setDefaultModels();
      this.getOwnerComponent().setModel(oModel, "BooksModel");

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
    },

    onFav: function (oEvent) {

      this.addBookToShelf(oEvent.getSource().getBindingContext("BooksModel").getObject(),this.getOwnerComponent().loginUseremail);      

      const oContext = this.getView().getModel("capservice").bindList("/FavBooks").create({
        "obookid": String(oEvent.getSource().getBindingContext("BooksModel").getObject().bookId),
        "usermail": this.getOwnerComponent().loginUseremail
      });

      oContext.created().then(() => {
        MessageBox.success('Book Added to Favorite List');
      });

      this.getView().getModel("capservice").refresh(true);      

    },

    onRecm: function (oEvent) {

      this.addBookToShelf(oEvent.getSource().getBindingContext("BooksModel").getObject(),this.getOwnerComponent().loginUseremail);      

      const oContext = this.getView().getModel("capservice").bindList("/RecmBooks").create({
        "obookid": String(oEvent.getSource().getBindingContext("BooksModel").getObject().bookId),
        "recmusremail": this.getOwnerComponent().loginUseremail
      });

      oContext.created().then(() => {
        MessageBox.success('Book Added to Favorite List');
      });

      this.getView().getModel("capservice").refresh(true);      

    },

    onShelf: function (oEvent) {

      this.addBookToShelf(oEvent.getSource().getBindingContext("BooksModel").getObject(),this.getOwnerComponent().loginUseremail);

    },

    addBookToShelf: function (oObject,loginUseremail) {
 
      const oContext = this.getView().getModel("capservice").bindList("/Books").create({
        "obookid": String(oObject.bookId),
        "name": oObject.bookName,
        "author": oObject.author,
        "category": oObject.category,
        "usremail": loginUseremail
      });

      oContext.created().then(() => {
        MessageBox.success('Book Added to Personal Shelf');
      });

    },

    // Opens View Settings Dialog on Filter page
    handleOpenDialogSort: function() {
      this._openDialog("MainFilter", "sort", this._presetSettingsItems);
    },
    // Opens View Settings Dialog on Filter page
    handleOpenDialogFilter: function() {
      this._openDialog("MainFilter", "filter", this._presetSettingsItems);
    },
    // Opens View Settings Dialog on Filter page
    handleOpenDialogGroup: function() {
      this._openDialog("MainFilter", "group", this._presetSettingsItems);
    },
    
    _openDialog: function(sName, sPage, fInit) {
      let oView = this.getView(),
          oThis = this;
  
      // creates requested dialog if not yet created
      if (!this._mDialogs[sName]) {
          this._mDialogs[sName] = Fragment.load({
              id: oView.getId(),
              name: "mbs.mybookshop220014ui.view." + sName,
              controller: this
          }).then(function(oDialog) {
              oView.addDependent(oDialog);
              if (fInit) {
                  fInit(oDialog, oThis);
              }
              return oDialog;
          });
      }
      this._mDialogs[sName].then(function(oDialog) {
          oDialog.open(sPage); // opens the requested dialog page
      });
    },
    
    _presetSettingsItems: function(oDialog, oThis) {
      oThis._presetFiltersInit(oDialog, oThis);
      oThis._presetSortsInit(oDialog, oThis);
      oThis._presetGroupsInit(oDialog, oThis);
    },

    _presetFiltersInit: function(oDialog, oThis) {
      let oDialogParent = oDialog.getParent(),
          oModelData = oDialogParent.getController().getOwnerComponent().getModel("BooksModel").getData(),
          oTable = oDialogParent.byId("BooksList"),
          oColumns = oTable.getColumns();
      // Loop every column of the table
      oColumns.forEach(column => {
          let columnId = column.getId().split("--")[2], // Get column ID (JSON Property)
              oColumnItems = oModelData.books.map(oItem => oItem[columnId]), // Use column ID as JSON property (Here's the magic !)
              oUniqueItems = oColumnItems.filter((value, index, array) => array.indexOf(value) === index), // Get all unique values for this column
              oUniqueFilterItems = oUniqueItems.map(oItem => new ViewSettingsItem({ // Convert unique values into ViewSettingsItem objects.
                  text: oItem,
                  key: columnId + "___" + "EQ___" + oItem // JSON property = Unique value
              }));
          // Set this values as selectable on the filter list
          oDialog.addFilterItem(new ViewSettingsFilterItem({
              key: columnId, // ID of the column && JSON property
              text: column.getAggregation("header").getProperty("text"), // Filter Name -> Column Text
              items: oUniqueFilterItems // Set of possible values of the filter
          }));
      })
    },

    _presetSortsInit: function(oDialog, oThis) {
      let oDialogParent = oDialog.getParent(),
          oTable = oDialogParent.byId("BooksList"),
          oColumns = oTable.getColumns();
      // Loop every column of the table
      oColumns.forEach(column => {
          let columnId = column.getId().split("--")[2]; // Get column ID (JSON Property)
          oDialog.addSortItem(new ViewSettingsItem({ // Convert column ID into ViewSettingsItem objects.
              key: columnId, // Key -> JSON Property
              text: column.getAggregation("header").getProperty("text"),
          }));
      })
    },


    onSearchBookID: function(oEvent) {
	// build filter array
  var aFilter = [];
  var sQuery = oEvent.getParameter("query");
  if (sQuery) {
    aFilter.push(new Filter("bookId", FilterOperator.EQ,sQuery));
  }
                    // filter binding
  var oList = this.getView().byId("BooksList");
  var oBinding = oList.getBinding("items");
  oBinding.filter(aFilter);    
},

    handleConfirm: function(oEvent) {
      let oTable = this.byId("BooksList"),
          mParams = oEvent.getParameters(),
          oBinding = oTable.getBinding("items"),
          aFilters = [],
          sPath,
          bDescending,
          aSorters = [],
          vGroup,
          aGroups = [];
  
      // Filtering
      if (mParams.filterItems) {
          mParams.filterItems.forEach(function(oItem) {
              let aSplit = oItem.getKey().split("___"),
                  sPath = aSplit[0],
                  sOperator = aSplit[1],
                  sValue1 = aSplit[2],
                  sValue2 = aSplit[3],
                  oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
              aFilters.push(oFilter);
          });
          // apply filter settings
          oBinding.filter(aFilters);
          // update filter bar
          this.byId("BooksFilterBar").setVisible(aFilters.length > 0);
          this.byId("BooksFilterLabel").setText(mParams.filterString);
      }
      // Sorting
      if (mParams.sortItem) {
          sPath = mParams.sortItem.getKey();
          bDescending = mParams.sortDescending;
          aSorters.push(new Sorter(sPath, bDescending));
          // apply the selected sort and group settings
          oBinding.sort(aSorters);
      }
      // Grouping
      if (mParams.groupItem) {
          sPath = mParams.groupItem.getKey();
          bDescending = mParams.groupDescending;
          vGroup = this.mGroupFunctions[sPath];
          aGroups.push(new Sorter(sPath, bDescending, vGroup));
          // apply the selected group settings
          oBinding.sort(aGroups);
      } else if (this.groupReset) {
          oBinding.sort();
          this.groupReset = false;
      }
  },

  _presetGroupsInit: function(oDialog, oThis) {
    let oDialogParent = oDialog.getParent(),
        oTable = oDialogParent.byId("BooksList"),
        oColumns = oTable.getColumns();

    this.mGroupFunctions = {};
    // Loop every column of the table
    oColumns.forEach(column => {
        let columnId = column.getId().split("--")[2]; // Get column ID (JSON Property)
        oDialog.addGroupItem(new ViewSettingsItem({ // Convert column ID into ViewSettingsItem objects.
            key: columnId, // ID of the column && JSON property
            text: column.getAggregation("header").getProperty("text") // Filter Name -> Column Text
        }));
        // Set group functions
        let groupFn = function(oContext) {
            var name = oContext.getProperty(columnId);
            return {
                key: name, // ID of the column && JSON property
                text: name // Filter Name -> Column Text
            };
        }
        this.mGroupFunctions[columnId] = {};
        this.mGroupFunctions[columnId] = groupFn;
    });
},


favsState: async function (sBookID) {

  const FavsData = this.getView().getModel("FavsDataModel").getData().value;   

  const idExists = FavsData.find(favs => favs.obookid === String(sBookID));

  if (idExists != undefined) {

    return "sap-icon://heart";

  } else {

    return "sap-icon://heart-2";

  }

},


favsRecm: function (sBookID) {

  const RecmData = this.getView().getModel("RecmDataModel").getData().value;   

  const idExists = RecmData.find(favs => favs.obookid === String(sBookID));

  if (idExists != undefined) {

    return "sap-icon://favorite";

  } else {

    return "sap-icon://unfavorite";

  }     
},


favsShelf: function (sBookID) {

  const ShelfData = this.getView().getModel("ShelfDataModel").getData().value;   

  const idExists = ShelfData.find(favs => favs.obookid === String(sBookID));

  if (idExists != undefined) {

    return "sap-icon://bookmark";

  } else {

    return "sap-icon://bookmark-2";

  }          
},

setDefaultModels: function () {

  /// Recm Data Model
  this.oCapModel = this.getOwnerComponent().getModel("capservice");
  ///// Fav Model
  var oFavsModel = new sap.ui.model.json.JSONModel();


  var url = "/odata/v4/catalog/FavBooks?$filter=usermail eq '" + this.getOwnerComponent().loginUseremail + "'";
  var aData = jQuery.ajax({
    url: url,
    dataType: "json",
    async: false,
    success: function (data, textStatus, jqXHR) {

      oFavsModel.setData(data);
      
    },
    error: function (error) {
      alert(error.statusText);
    }
  });

  this.getView().setModel(oFavsModel, "FavsDataModel");  


  var oRecmBookModel = new sap.ui.model.json.JSONModel();

  url = "/odata/v4/catalog/RecmBooks?$filter=recmusremail eq '" + this.getOwnerComponent().loginUseremail + "'";
  var aData = jQuery.ajax({
    url: url,
    dataType: "json",
    async: false,
    success: function (data, textStatus, jqXHR) {

      oRecmBookModel.setData(data);
      
    },
    error: function (error) {
      alert(error.statusText);
    }
  });
  this.getView().setModel(oRecmBookModel, "RecmDataModel");

  /// Shelf Data Model    
  var oShelfModel = new sap.ui.model.json.JSONModel();
  url = "/odata/v4/catalog/Books?$filter=usremail eq '" + this.getOwnerComponent().loginUseremail + "'";
  var aData = jQuery.ajax({
    url: url,
    dataType: "json",
    async: false,
    success: function (data, textStatus, jqXHR) {

      oShelfModel.setData(data);
      
    },
    error: function (error) {
      alert(error.statusText);
    }
  });

  this.getView().setModel(oShelfModel, "ShelfDataModel");

}

  })

});