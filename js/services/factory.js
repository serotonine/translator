///////////* REST FACTORY *///////////

app.factory("restFactory", function ($resource, $q) {
  var factory = {
    datas: false,
    nameList: false,
    response: {},
    rest: $resource(
      "https://serotonine.alwaysdata.net/restapi/:type/:user/:id/:fr/:nl/:perf/:imperf",
      {
        type: "@type",
        user: "@user",
        id: "@id", //case of get id is date
        fr: "@fr",
        nl: "@nl",
        perf: "@perf",
        imperf: "@imperf",
        showhide: "@showhide",
      },
      { update: { method: "PUT" } }
    ),
    //return list of such or such type
    //todo add date
    getList: function (usr, tp, date) {
      if (date == "undefined") {
        return factory.rest.query({ type: tp, user: usr });
      } else {
        return factory.rest.query({ type: tp, user: usr, id: date });
      }
    }, //end getList}

    deleteItem: function (usr, tp, index) {
      return factory.rest.delete({ type: tp, user: usr, id: index });
    },
    showhideItem: function (usr, tp, index, show_hide) {
      return factory.rest.update({
        type: tp,
        user: usr,
        id: index,
        fr: "none",
        nl: "none",
        perf: "none",
        imperf: "none",
        showhide: show_hide,
      });
    },
  }; //end var factory

  return factory;
});

///////////* LIST FACTORY *///////////

app.factory("listFactory", function (restFactory) {
  var list = {
    //populate a tab of words
    getNameSample: function (lg, tab_list) {
      var index = utils.getRandomIndex(lg);
      if (!utils.in_array(index, tab_index)) {
        console.log(
          "in factory tab_index if = " + tab_index + " index = " + index
        );
        tab_index.push(index);
        console.log("in factory tab_index after push = " + tab_index);
        return tab_index;
      } else {
        console.log("in factory tab_index else = " + tab_index);
        this.getNameSample(lg, tab_index);
      }
    }, // end getNameSample

    getList: function (list) {},
    //to update the scope list
    newItem: {},
  };
  return list;
});

///////////* POPUP FACTORY *///////////

app.factory("popupFactory", function (restFactory, $timeout) {
  var popup = {
    showPopupForm: false,
    crud: undefined,
    item: { fr: "", nl: "" },
    response: "",
    addToList: "",
    hidePopupForm: function () {
      this.showPopupForm = false;
    },
    //cu is either update either create
    displayPopup: function (cu, item) {
      if (cu === "create") {
        popup.item.fr = "";
        popup.item.nl = "";
      }
      //reeinit response
      this.response = "";
      //this.showPopupForm = !this.showPopupForm;
      this.showPopupForm = true;

      //create or update param
      this.showPopupForm ? (this.crud = cu) : (this.crud = undefined);
      // on update item is the word object
      //todo the right function to determine if item is object
      if (typeof item !== "string") {
        this.item = item;
        this.item.cu = cu;
      }
    },
    update: function (type) {
      //reeinit response
      popup.response = "";
      //index is for the list
      //id is for the object word
      //var item = this.item;
      for (i in this.item) {
        if (
          i === "imperfectum" ||
          i === "perfectum" ||
          i === "perf" ||
          i === "imperf" ||
          i === "fr" ||
          i === "nl"
        ) {
          if (!this.item[i]) {
            this.item[i] = "none"; /*console.log(i+" "+ this.item[i]);*/
          }
        }
      }

      var u = restFactory.rest
        .update({
          type: type,
          user: 1,
          id: this.item.id,
          fr: this.item.fr,
          nl: this.item.nl,
          perf: this.item.perf,
          imperf: this.item.imperf,
          showhide: this.item.showhide,
        })
        .$promise.then(function (request) {
          //add autoclose

          if (request.response) popup.response = request.response;
          $timeout(function () {
            popup.hidePopupForm();
          }, 1000);
        });
    }, //end update

    create: function (type, list) {
      //id is for the object word
      var item = this.item,
        duplicate = new RegExp("1062");

      if (this.item.fr !== "undefined" || this.item.nl !== "undefined") {
        var request = restFactory.rest
          .save({
            type: type,
            user: 1,
            id: "default",
            fr: this.item.fr,
            nl: this.item.nl,
            perf: this.item.perf,
            imperf: this.item.imperf,
          })
          .$promise.then(function (request) {
            if (duplicate.test(request.response)) {
              popup.response = "Item already saved";
            } else {
              popup.response = request.response;
              popup.addToList = {
                fr: popup.item.fr,
                nl: popup.item.nl,
                showhide: 1,
                _new: 1,
              };
            }
          });
      } //endif
    }, //end create
  }; //end popup

  return popup;
});

app.factory("httpFactory", function ($http) {});
