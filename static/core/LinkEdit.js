(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var LinkEdit;
    return LinkEdit = (function(_super) {
      var colors;

      __extends(LinkEdit, _super);

      colors = ['#F56545', '#FFBB22', '#BBE535', '#77DDBB', '#66CCDD', '#A9A9A9'];

      function LinkEdit(options) {
        this.options = options;
        this.renderProfile = __bind(this.renderProfile, this);
        this.findHeader = __bind(this.findHeader, this);
        this.deleteLink = __bind(this.deleteLink, this);
        this.cancelEditing = __bind(this.cancelEditing, this);
        this.editLink = __bind(this.editLink, this);
        LinkEdit.__super__.constructor.call(this);
      }

      LinkEdit.prototype.init = function(instances) {
        var _this = this;
        this.dataController = instances['local/Neo4jDataController'];
        this.graphModel = instances['GraphModel'];
        this.graphModel.on("change", this.update.bind(this));
        this.graphView = instances['GraphView'];
        this.selection = instances["LinkSelection"];
        this.selection.on("change", this.update.bind(this));
        this.listenTo(instances["KeyListener"], "down:16:80", function() {
          return _this.$el.toggle();
        });
        $(this.el).appendTo($('#omniBox'));
        this.Create = instances['local/Create'];
        return this.nodeEdit = instances['local/NodeEdit'];
      };

      LinkEdit.prototype.update = function() {
        var $container, blacklist, selectedLinks,
          _this = this;
        this.$el.empty();
        selectedLinks = this.selection.getSelectedLinks();
        $container = $("<div class=\"node-profile-helper\"/>").appendTo(this.$el);
        blacklist = ["selected", "source", "target", "strength", "_type", "_id"];
        return _.each(selectedLinks, function(link) {
          var $linkDiv, _ref;
          if (!(link.color != null)) {
            link.color = "#A9A9A9";
          } else if (!(_ref = link.color.toUpperCase(), __indexOf.call(colors, _ref) >= 0)) {
            link.color = "#A9A9A9";
          }
          $linkDiv = $("<div class=\"node-profile\"/>").css("background-color", "" + link.color).appendTo($container);
          return _this.renderProfile(link, $linkDiv, blacklist);
        });
      };

      LinkEdit.prototype.editLink = function(link, linkDiv, blacklist) {
        var $linkCancel, $linkDelete, $linkMoreFields, $linkSave, colorEditingField, linkInputNumber, origColor,
          _this = this;
        console.log("Editing link: " + link['_id']);
        origColor = "#A9A9A9";
        linkInputNumber = 0;
        linkDiv.html("<div class=\"node-profile-title\">Editing " + (this.findHeader(link)) + "</div><form id=\"Link" + link['_id'] + "EditForm\"></form>");
        _.each(link, function(value, property) {
          var newEditingFields;
          if (blacklist.indexOf(property) < 0 && ["_id", "_Last_Edit_Date", "_Creation_Date", "start", "end", "color"].indexOf(property) < 0) {
            newEditingFields = "<div id=\"Link" + link['_id'] + "EditDiv" + linkInputNumber + "\" class=\"Link" + link['_id'] + "EditDiv\">\n  <input style=\"width:80px\" id=\"Link" + link['_id'] + "EditProperty" + linkInputNumber + "\" value=\"" + property + "\" class=\"propertyLink" + link['_id'] + "Edit\"/> \n  <input style=\"width:80px\" id=\"Link" + link['_id'] + "EditValue" + linkInputNumber + "\" value=\"" + value + "\" class=\"valueLink" + link['_id'] + "Edit\"/> \n  <input type=\"button\" id=\"removeLink" + link['_id'] + "Edit" + linkInputNumber + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>";
            $(newEditingFields).appendTo("#Link" + link['_id'] + "EditForm");
            return linkInputNumber = linkInputNumber + 1;
          } else if (property === "color") {
            return origColor = value;
          }
        });
        colorEditingField = '\
            <form action="#" method="post">\
                <div class="controlset">Color<input id="color' + link['_id'] + '" name="color' + link['_id'] + '" type="text" value="' + origColor + '"/></div>\
            </form>\
          ';
        $(colorEditingField).appendTo(linkDiv);
        $("#color" + link['_id']).colorPicker({
          showHexField: false
        });
        $linkMoreFields = $("<input id=\"moreLink" + link['_id'] + "EditFields\" type=\"button\" value=\"+\">").appendTo(linkDiv);
        $linkMoreFields.click(function() {
          _this.nodeEdit.addField(linkInputNumber, "Link" + link['_id'] + "Edit");
          return linkInputNumber = linkInputNumber + 1;
        });
        $linkSave = $("<input name=\"LinkSaveButton\" type=\"button\" value=\"Save\">").appendTo(linkDiv);
        $linkSave.click(function() {
          var newLinkObj;
          newLinkObj = _this.nodeEdit.assign_properties("Link" + link['_id'] + "Edit");
          if (newLinkObj[0]) {
            return $.post("/get_link_by_id", {
              'id': link['_id']
            }, function(data) {
              var newLink;
              if (data['properties']['_Last_Edit_Date'] === link['_Last_Edit_Date'] || confirm("Link " + _this.findHeader(link) + (" (id: " + link['_id'] + ") has changed on server. Are you sure you want to risk overwriting the changes?"))) {
                newLink = newLinkObj[1];
                newLink['_id'] = link['_id'];
                newLink['color'] = $("#color" + link['_id']).val();
                newLink['_Creation_Date'] = link['_Creation_Date'];
                return _this.dataController.linkEdit(link, newLink, function(savedLink) {
                  savedLink['_id'] = link['_id'];
                  savedLink['_type'] = link['_type'];
                  savedLink['start'] = link['start'];
                  savedLink['end'] = link['end'];
                  savedLink['source'] = link['source'];
                  savedLink['target'] = link['target'];
                  savedLink['strength'] = link['strength'];
                  savedLink['_Creation_Date'] = link['_Creation_Date'];
                  _this.graphModel.filterLinks(function(link) {
                    return !(savedLink['_id'] === link['_id']);
                  });
                  _this.graphModel.putLink(savedLink);
                  _this.selection.toggleSelection(savedLink);
                  return _this.cancelEditing(link, linkDiv, blacklist);
                });
              } else {
                return alert("Did not save link " + _this.findHeader(link) + (" (id: " + link['_id'] + ")."));
              }
            });
          }
        });
        $linkDelete = $("<input name=\"LinkDeleteButton\" type=\"button\" value=\"Delete\">").appendTo(linkDiv);
        $linkDelete.click(function() {
          if (confirm("Are you sure you want to delete this link?")) {
            return _this.deleteLink(link, function() {
              return _this.selection.toggleSelection(link);
            });
          }
        });
        $linkCancel = $("<input name=\"LinkCancelButton\" type=\"button\" value=\"Cancel\">").appendTo(linkDiv);
        return $linkCancel.click(function() {
          return _this.cancelEditing(link, linkDiv, blacklist);
        });
      };

      LinkEdit.prototype.cancelEditing = function(link, linkDiv, blacklist) {
        linkDiv.empty();
        return this.renderProfile(link, linkDiv, blacklist);
      };

      LinkEdit.prototype.deleteLink = function(delLink, callback) {
        var _this = this;
        return this.dataController.linkDelete(delLink, function(response) {
          if (response === "error") {
            return alert("Could not delete Link.");
          } else {
            console.log("Link Deleted");
            _this.graphModel.filterLinks(function(link) {
              return !(delLink['_id'] === link['_id']);
            });
            return callback();
          }
        });
      };

      LinkEdit.prototype.findHeader = function(link) {
        var headerName, realurl, result;
        headerName = link.name;
        if (link.url != null) {
          realurl = "";
          result = link.url.search(new RegExp(/^http:\/\//i));
          if (!result) {
            realurl = link.url;
          } else {
            realurl = 'http://' + link.url;
          }
          headerName = '<a href=' + realurl + ' target="_blank">' + link.name + '</a>';
        }
        if (this.graphView.findText(link.source) && this.graphView.findText(link.target)) {
          return "(" + (this.graphView.findText(link.source)) + ")-" + headerName + "-(" + (this.graphView.findText(link.target)) + ")";
        } else if (this.graphView.findText(link.source)) {
          return "(" + (this.graphView.findText(link.source)) + ")-" + headerName + "-(" + link.end + ")";
        } else if (this.graphView.findText(link.target)) {
          return "(" + link.start + ")-" + headerName + "-(" + (this.graphView.findText(link.target)) + ")";
        } else {
          return "(" + link.start + ")-" + headerName + "-(" + link.end + ")";
        }
      };

      LinkEdit.prototype.renderProfile = function(link, linkDiv, blacklist) {
        var $linkDeselect, $linkEdit, $linkHeader, header,
          _this = this;
        header = this.findHeader(link);
        $linkHeader = $("<div class=\"node-profile-title\">" + header + "</div>").appendTo(linkDiv);
        $linkEdit = $("<i class=\"fa fa-pencil-square-o\"></i>").prependTo($linkHeader);
        $linkDeselect = $("<i class=\"right fa fa-times\"></i>").appendTo($linkHeader);
        $linkDeselect.click(function() {
          return _this.selection.toggleSelection(link);
        });
        _.each(link, function(value, property) {
          var makeLinks;
          value += "";
          if (blacklist.indexOf(property) < 0) {
            if (property === "start" && _this.graphView.findText(link.source)) {
              makeLinks = value + " \"" + _this.graphView.findText(link.source) + "\"";
            } else if (property === "end" && _this.graphView.findText(link.target)) {
              makeLinks = value + " \"" + _this.graphView.findText(link.target) + "\"";
            } else if (property === "_Last_Edit_Date" || property === "_Creation_Date") {
              makeLinks = value.substring(4, 21);
            } else if (value != null) {
              makeLinks = value.replace(/((https?|ftp|dict):[^'">\s]+)/gi, "<a href=\"$1\" target=\"_blank\" style=\"target-new: tab;\">$1</a>");
            } else {
              makeLinks = value;
            }
            if (property !== "color") {
              return $("<div class=\"node-profile-property\">" + property + ": " + makeLinks + "</div>").appendTo(linkDiv);
            }
          }
        });
        return $linkEdit.click(function() {
          return _this.editLink(link, linkDiv, blacklist);
        });
      };

      return LinkEdit;

    })(Backbone.View);
  });

}).call(this);
