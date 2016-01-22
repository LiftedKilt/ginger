/*
 * Copyright IBM Corp, 2015
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

// This variable is used while deleting multiple interfaces
// to pass the interface name in case of error message print
ginger.selectedNWInterface = null;

ginger.initNetworkConfig = function() {
  ginger.opts_nw_if = [];
  ginger.opts_nw_if['id'] = 'nw-configuration';
  ginger.opts_nw_if['gridId'] = "nwConfigGrid";
  ginger.opts_nw_if['identifier'] = "device";
  ginger.opts_nw_if['loadingMessage'] = i18n['GINNET0025M'];

  ginger.listNetworkConfig();
}

ginger.loadBootgridNWActions = function() {

  var addActionsId = "nw-configuration-add";
  var tabActionsId = "nw-configuration-actions";
  // Add actions for Network Configuration
  var addButton = [{
    id: 'nw-add-bond-button',
    class: 'fa fa-plus-circle',
    label: i18n['GINNET0006M'],
    onClick: function(event) {
      ginger.selectedInterface = null;
      wok.window.open('plugins/ginger/host-network-bond.html');
    }
  }, {
    id: 'nw-add-vlan-button',
    class: 'fa fa-plus-circle',
    label: i18n['GINNET0007M'],
    onClick: function(event) {
      ginger.selectedInterface = null;
      wok.window.open('plugins/ginger/host-network-vlan.html');
    }
  }, {
    id: 'nw-add-adapter-button',
    class: 'fa fa-plus-circle',
    label: i18n['GINNET0008M'],
    onClick: function(event) {
      ginger.getPlugins(function(result) {
        if ($.inArray("gingers390x", result) != -1) {
          wok.window.open('plugins/gingers390x/network.html');
        } else {
          var settings = {
            content: i18n["GINNET0014M"],
            confirm: i18n["GINNET0015M"]
          };
          wok.confirm(settings, function() {});
        }
      });
    }
  }];
  // }, {
  //   id: 'nw-add-bridge-button',
  //   class: 'fa fa-plus-circle',
  //   label: 'Add Bridge',
  //   onClick: function(event) {
  //     // wok.window.open('plugins/ginger/host-create-bridge.html');
  //   }
  // }];

  // Actions for Network Configuration
  var actionButton = [{
    id: 'nw-up-button',
    class: 'fa fa-power-off',
    label: i18n['GINNET0009M'],
    onClick: function(event) {
      var selectedIf = ginger.getSelectedRowsData(ginger.opts_nw_if);
      if ((selectedIf && selectedIf.length == 1) && (selectedIf[0]["status"] == "down")) {
        ginger.showBootgridLoading(ginger.opts_nw_if);
        ginger.enableInterface(selectedIf[0]["device"], "up", function(result) {
          var message = i18n['GINNET0016M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0020M'];
          wok.message.success(message, '#message-nw-container-area');
          ginger.getInterfaces(function(result) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
            ginger.loadBootgridData(ginger.opts_nw_if['gridId'], result);
          }, function(error) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
          });
        }, function(error) {
          ginger.hideBootgridLoading(ginger.opts_nw_if);
          var message = i18n['GINNET0016M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0021M'];
          wok.message.error(message + " " + error.responseJSON.reason, '#message-nw-container-area', true);
        });
      } else {
        var settings = {
          content: i18n["GINNET0022M"],
          confirm: i18n["GINNET0015M"]
        };
        wok.confirm(settings, function() {});
      }
    }
  }, {
    id: 'nw-down-button',
    class: 'fa fa-ban',
    label: i18n['GINNET0010M'],
    onClick: function(event) {
      var selectedIf = ginger.getSelectedRowsData(ginger.opts_nw_if);
      if ((selectedIf && selectedIf.length == 1) &&
        ((selectedIf[0]["status"] == "up") || (selectedIf[0]["status"] == "unknown"))) {
        ginger.showBootgridLoading(ginger.opts_nw_if);
        ginger.enableInterface(selectedIf[0]["device"], "down", function(result) {
          var message = i18n['GINNET0017M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0020M'];
          wok.message.success(message, '#message-nw-container-area');
          ginger.getInterfaces(function(result) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
            ginger.loadBootgridData(ginger.opts_nw_if['gridId'], result);
          }, function(error) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
          });
        }, function(error) {
          ginger.hideBootgridLoading(ginger.opts_nw_if);
          var message = i18n['GINNET0017M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0021M'];
          wok.message.error(message + " " + error.responseJSON.reason, '#message-nw-container-area', true);
        });
      } else {
        var settings = {
          content: i18n["GINNET0022M"],
          confirm: i18n["GINNET0015M"]
        };
        wok.confirm(settings, function() {});
      }
    }
  }, {
    id: 'nw-restart-button',
    class: 'fa fa-undo',
    label: i18n['GINNET0011M'],
    onClick: function(event) {
      var selectedIf = ginger.getSelectedRowsData(ginger.opts_nw_if);
      if ((selectedIf && selectedIf.length == 1) &&
        ((selectedIf[0]["status"] == "up") || (selectedIf[0]["status"] == "unknown"))) {
        ginger.showBootgridLoading(ginger.opts_nw_if);
        // First Bring down the interface
        ginger.enableInterface(selectedIf[0]["device"], "down", function(result) {
          // Second Bring the interface up back again
          ginger.enableInterface(selectedIf[0]["device"], "up", function(result) {
            var message = i18n['GINNET0018M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0020M'];
            wok.message.success(message, '#message-nw-container-area');
            ginger.getInterfaces(function(result) {
              ginger.hideBootgridLoading(ginger.opts_nw_if);
              ginger.loadBootgridData(ginger.opts_nw_if['gridId'], result);
            }, function(error) {
              ginger.hideBootgridLoading(ginger.opts_nw_if);
            });
          }, function(error) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
            var message = i18n['GINNET0018M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0021M'];
            wok.message.error(message + " " + error.responseJSON.reason, '#message-nw-container-area', true);
          });
        }, function(error) {
          ginger.hideBootgridLoading(ginger.opts_nw_if);
          var message = "Failed to brought down the interface " + selectedIf[0]["device"];
          wok.message.error(message + " " + error.responseJSON.reason, '#message-nw-container-area', true);
        });
      } else if (selectedIf && selectedIf.length == 1 && (selectedIf[0]["status"] == "down")) {
        ginger.showBootgridLoading(ginger.opts_nw_if);
        // Assuming interface is down already and just needs to brought up
        ginger.enableInterface(selectedIf[0]["device"], "up", function(result) {
          var message = i18n['GINNET0018M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0020M'];
          wok.message.success(message, '#message-nw-container-area');
          ginger.getInterfaces(function(result) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
            ginger.loadBootgridData(ginger.opts_nw_if['gridId'], result);
          }, function(error) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
          });
        }, function(error) {
          ginger.hideBootgridLoading(ginger.opts_nw_if);
          var message = i18n['GINNET0018M'] + " " + selectedIf[0]["device"] + " " + i18n['GINNET0021M'];
          wok.message.error(message + " " + error.responseJSON.reason, '#message-nw-container-area', true);
        });
      } else {
        var settings = {
          content: i18n["GINNET0022M"],
          confirm: i18n["GINNET0015M"]
        };
        wok.confirm(settings, function() {});
      }
    }
  }, {
    id: 'nw-settings-button',
    class: 'fa fa-cog',
    label: i18n['GINNET0012M'],
    onClick: function(event) {
      var selectedIf = ginger.getSelectedRowsData(ginger.opts_nw_if);
      if (selectedIf && (selectedIf.length == 1)) {
        ginger.selectedInterface = (selectedIf[0]["device"] == "undefined" ? null : selectedIf[0]["device"]);
        if ((selectedIf[0]["type"]).toLowerCase() == "vlan") {
          wok.window.open('plugins/ginger/host-network-vlan.html');
        } else if ((selectedIf[0]["type"]).toLowerCase() == "bond") {
          wok.window.open('plugins/ginger/host-network-bond.html');
        } else if (((selectedIf[0]["type"]).toLowerCase() == "ethernet") || ((selectedIf[0]["type"]).toLowerCase() == "nic")) {
          // condition nic should go away if #104 to be correct and resolved
          wok.window.open('plugins/ginger/host-network-settings.html');
        }
      } else {
        var settings = {
          content: i18n["GINNET0022M"],
          confirm: i18n["GINNET0015M"]
        };
        wok.confirm(settings, function() {});
      }
    }
  }, {
    id: 'nw-delete-button',
    class: 'fa fa-minus-circle',
    label: i18n['GINNET0013M'],
    critical: true,
    onClick: function(event) {
      var selectedIf = ginger.getSelectedRowsData(ginger.opts_nw_if);
      if (selectedIf && (selectedIf.length == 1)) {
        ginger.showBootgridLoading(ginger.opts_nw_if);
          ginger.selectedNWInterface = selectedIf[0]["device"];
          ginger.deleteInterface(ginger.selectedNWInterface, function(result) {
            var message = i18n['GINNET0019M'] + " " + ginger.selectedNWInterface + " " + i18n['GINNET0020M'];
            wok.message.success(message, '#message-nw-container-area');

            //Re-load the network interfaces after delete action
            ginger.getInterfaces(function(result) {
              ginger.hideBootgridLoading(ginger.opts_nw_if);
              ginger.loadBootgridData(ginger.opts_nw_if['gridId'], result);
            }, function(error) {
              ginger.hideBootgridLoading(ginger.opts_nw_if);
            });
          }, function(error) {
            ginger.hideBootgridLoading(ginger.opts_nw_if);
            var message = i18n['GINNET0019M'] + " " + ginger.selectedNWInterface + " " + i18n['GINNET0021M'];
            wok.message.error(message + " " + error.responseJSON.reason, '#message-nw-container-area', true);
          });
      } else {
        var settings = {
          content: i18n["GINNET0022M"],
          confirm: i18n["GINNET0015M"]
        };
        wok.confirm(settings, function() {});
      }
    }
  }];

  ginger.opts_nw_if['addButtons'] = JSON.stringify(addButton);
  ginger.opts_nw_if['actions'] = JSON.stringify(actionButton);

  var addListSettings = {
    panelID: addActionsId,
    buttons: addButton,
    type: 'add'
  };

  var actionListSettings = {
    panelID: tabActionsId,
    buttons: actionButton,
    type: 'action'
  };

  ginger.createActionList(addListSettings);

  // Remove button "Add Adapter" in case of architecture != s390x
  if (ginger.hostarch != "s390x") {
    $('#' + "nw-add-adapter-button").hide();
  } else {
    $('#' + "nw-add-adapter-button").show();
  }

  // Hide button "Add VLAN" and "Add BOND "in case of capability "cfginterfaces" false
  if (!ginger.cfginterfaces) {
    $('#nw-add-bond-button').hide();
    $('#nw-add-vlan-button').hide();
    if (ginger.hostarch != "s390x") {
      $('#action-dropdown-button-nw-configuration-add').hide();
    } else {
      $('#action-dropdown-button-nw-configuration-add').show();
    }
  } else {
    $('#nw-add-bond-button').show();
    $('#nw-add-vlan-button').show();
  }

  ginger.createActionList(actionListSettings);

}

ginger.listNetworkConfig = function() {

  var nwGrid = [];
  var gridFields = [];

  // Network Configuration section options.
  // var gridId = "nwConfigGrid";
  // var opts = [];
  // opts['id'] = 'nw-configuration';
  // opts['gridId'] = gridId;
  // opts['identifier'] = "device";
  // ginger.hideBootgridData(opts);

  ginger.loadBootgridNWActions();
  //Network Configuration grid columns
  gridFields = [{
      "column-id": 'status',
      "type": 'string',
      "width": "5%",
      "formatter": "nw-interface-status",
      "title": ""
    }, {
      "column-id": 'device',
      "type": 'string',
      "width": "15%",
      "identifier": true,
      "title": i18n['GINNET0001M']
    }, {
      "column-id": 'type',
      "type": 'string',
      "width": "10%",
      "title": i18n['GINNET0003M']
    }, {
      "column-id": 'ipaddr',
      "formatter": "nw-address-space",
      "type": 'string',
      "width": "25%",
      "title": i18n['GINNET0004M']
    },
    // {
    //   "column-id": 'enslavedby',
    //     "type": 'string',
    //     "width":"20%",
    //     "title":"Enslaved By"
    // },
    {
      "column-id": 'macaddr',
      "type": 'string',
      "width": "40%",
      "title": i18n['GINNET0005M']
    }
  ];

  ginger.opts_nw_if['gridFields'] = JSON.stringify(gridFields);

  nwGrid = ginger.createBootgrid(ginger.opts_nw_if);
  ginger.hideBootgridLoading(ginger.opts_nw_if);

  nwGrid.bootgrid().on("selected.rs.jquery.bootgrid", function(e, rows) {
    changeActionButtonsState();
  }).on("deselected.rs.jquery.bootgrid", function(e, rows) {
    changeActionButtonsState();
  }).on("loaded.rs.jquery.bootgrid", function(e, rows) {
    changeActionButtonsState();
  });

  var changeActionButtonsState = function() {
    // By default enable them all
    ginger.changeButtonStatus(["nw-up-button", "nw-down-button", "nw-restart-button",
      "nw-settings-button", "nw-delete-button"
    ], true);
    // Based on the interface status hide/show the right buttons
    var selectedIf = ginger.getSelectedRowsData(ginger.opts_nw_if);
    if (selectedIf && selectedIf.length == 1) {
      if (selectedIf && (selectedIf[0]["status"] == 'up' || selectedIf[0]["status"] == 'unknown')) {
        ginger.changeButtonStatus(["nw-up-button"], false);
      } else {
        ginger.changeButtonStatus(["nw-down-button"], false);
      }
    }

    // Do not disable certain options even multiple interfaces selected.
    // else if (selectedIf && selectedIf.length > 1) {
    //   ginger.changeButtonStatus(["nw-up-button", "nw-down-button", "nw-restart-button",
    //     "nw-settings-button"
    //   ], false);
    // }

    //hide or show settings button based on cfginterfaces value
    ginger.changeButtonStatus(["nw-settings-button"], ginger.cfginterfaces);
  };
  ginger.initNetworkConfigGridData();
};

ginger.initNetworkConfigGridData = function() {
  // var opts = [];
  // opts['gridId'] = "nwConfigGrid";
  ginger.clearBootgridData(ginger.opts_nw_if['gridId']);
  ginger.getInterfaces(function(result) {
    ginger.loadBootgridData(ginger.opts_nw_if['gridId'], result);
  });
};

ginger.initGlobalNetworkConfig = function() {
  var toggleBtnEdit = function(item, on) {
    $("button", item).toggleClass("hide");
    $(".cancel", item).toggleClass("hide", !on);
  };
  var attachBtnEvt = function(node, editFunc, saveFunc, cancelFunc) {
    // disable the inputs for edit if they are already filled
    var ip = $("#ip-address", node);
    var mask = $("#ip-mask", node);
    if (!(ip === undefined || ip === null) && !(mask === undefined || mask === null)) {
      if (!(ip.val() === "") && !(mask.val() === "")) {
        ip.prop("disabled", true);
        mask.prop("disabled", true);
      }
    }
    $("input", node).each(function() {
      $(this).on("keyup", function() {
        var isValid = ginger.validateIp($(this).val());
        if ($(this).parent().hasClass("mask")) {
          isValid = isValid && ginger.validateMask($(this).val());
        }
        isValid = isValid || $(this).val().trim() == "";
        $(this).toggleClass("invalid-field", !isValid);
        $(".save", node).prop("disabled", !isValid);
      });
    });
    $(".edit", node).on("click", function(event) {
      event.preventDefault();
      editFunc(node);
    });
    $(".save", node).on("click", function(event) {
      event.preventDefault();
      saveFunc(node);
    });
    $(".cancel", node).on("click", function(event) {
      event.preventDefault();
      cancelFunc(node);
    });
  };
  ginger.getNetworkGlobals(function(data) {
    var toggleNWGlobalsEdit = function(item, on) {
      $("#dns-ip-address", item).prop("disabled", !on);
      toggleBtnEdit(item, on);
    };
    var attachNWGlobalBtnEvt = function(node, saveFunc) {
      attachBtnEvt(node, function() {
        toggleNWGlobalsEdit(node, true);
      }, function() {
        saveFunc();
      }, function() {
        toggleNWGlobalsEdit(node, false);
      });
    };
    if (!data.nameservers || data.nameservers.length == 0) {
      data.nameservers = [""];
    }
    var addGlobalItem = function(container, itemValue, saveFunc) {
      var ip = itemValue;
      var tempNode = $.parseHTML(wok.substitute($("#nwGlobalItem").html(), {
        ip: ip,
        viewMode: ip == "" ? "hide" : "",
        editMode: ip == "" ? "" : "hide"
      }));
      $("input", tempNode).prop("disabled", ip != "");
      $("#" + container).append(tempNode);
      $("input", tempNode).prop("oriVal", ip);
      attachBtnEvt(tempNode, function(node) {
        toggleNWGlobalsEdit(node, true);
      }, function(node) {
        saveFunc(node, function(item) {
          var input = $("input", item);
          if (input.val() == "" && $(".sec-content", "#" + container).length != 1) {
            item.remove();
          } else {
            input.prop("oriVal", input.val());
            toggleNWGlobalsEdit(item, false);
          }
        });
      }, function(node) {
        // DNS IP Address Cancel
        var input = $("input", node);
        $("button", node).prop("disabled", false);
        input.val(input.prop("oriVal"));
        if (input.prop("oriVal") == "") {
          node[1].remove();
        } else {
          toggleNWGlobalsEdit(node, false);
        }
      });
      return tempNode;
    };
    var addDnsItem = function(dnsVal) {
      return addGlobalItem("gingerDNS", dnsVal, function(item, postSave) {
        if (!($("input", item).val().trim() == "" && $("input", item).prop("oriVal").trim() == "")) {
          var nwGol = {
            nameservers: []
          };
          $("input", item).each(function() {
            if ($(this).val().trim() != "") {
              nwGol.nameservers.push($(this).val());
            }
          });
          if (nwGol.nameservers.length == 0) {
            delete nwGol.nameservers;
          }
          ginger.updateNetworkGlobals(nwGol, function() {
            postSave(item);
          });
        }
      });
    };
    $("#gingerDnsAdd").button({
      text: false
    }).click(function() {
      var item = addDnsItem("");
      $(".cancel", item).removeClass("hide");
    });
    for (var i = 0; i < data.nameservers.length; i++) {
      addDnsItem(data.nameservers[i]);
    }
    addGlobalItem("gingerGateway", data.gateway ? data.gateway : "", function(item, postSave) {
      var gateway = $("input", item).val();
      if (gateway.trim() != "") {
        ginger.updateNetworkGlobals({
          gateway: gateway
        }, function() {
          ginger.confirmNetworkUpdate(function() {
            postSave(item);
          });
        });
      }
    });
  });
}

ginger.initNetwork = function() {
  $(".content-area", "#gingerHostNetwork").css("height", "100%");
  ginger.getHostDetails(function(result) {
    ginger.hostarch = result["architecture"];
    ginger.getCapabilities(function(result) {
      $.each(result, function(enableItem, capability) {
        var itemLowCase = enableItem.toLowerCase();
        switch (itemLowCase) {
          case "network":
            ginger.initGlobalNetworkConfig();
            ginger.initNetworkConfig();
            break;
          case "cfginterfaces":
            ginger.cfginterfaces = capability;
            break;
        }
      });
    });
  });
};
