(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["DataController"], function(DataController) {
    var Neo4jDataController;
    return Neo4jDataController = (function(_super) {

      __extends(Neo4jDataController, _super);

      function Neo4jDataController() {
        Neo4jDataController.__super__.constructor.apply(this, arguments);
      }

      Neo4jDataController.prototype.nodeAdd = function(node, callback) {
        var filteredNode;
        filteredNode = this.filterNode(node);
        console.log("filtered: ", filteredNode);
        return $.post("/create_node", filteredNode, callback);
      };

      Neo4jDataController.prototype.nodeDelete = function(node, callback) {
        return $.post("/delete_node", this.filterNode(node), callback);
      };

      Neo4jDataController.prototype.nodeDeleteFull = function(node, callback) {
        return $.post("/delete_node_full", this.filterNode(node), callback);
      };

      Neo4jDataController.prototype.nodeEdit = function(oldNode, newNode, callback) {
        var deleted_props, property, value;
        oldNode = this.filterNode(oldNode);
        deleted_props = [];
        for (property in oldNode) {
          value = oldNode[property];
          if (newNode[property] != null) {
            if (oldNode[property] === newNode[property]) delete newNode[property];
          } else {
            deleted_props.push(property);
          }
        }
        if (((deleted_props.length === 1) && (!(confirm("Are you sure you want to delete the following property? " + deleted_props)))) || ((deleted_props.length > 1) && (!(confirm("Are you sure you want to delete the following properties? " + deleted_props))))) {
          alert("Cancelled saving of node " + oldNode['_id'] + ".");
          return false;
        }
        return $.post('/edit_node', {
          nodeid: oldNode['_id'],
          properties: newNode,
          remove: deleted_props
        }, function(data) {
          if (data === "error") {
            return alert("Failed to save changes to node " + oldNode['_id'] + ".");
          } else {
            alert("Saved changes to node " + oldNode['_id'] + ".");
            return callback(data);
          }
        });
      };

      Neo4jDataController.prototype.linkAdd = function(link, callback) {
        var filteredLink;
        filteredLink = link;
        filteredLink.source = this.filterNode(link.source);
        filteredLink.target = this.filterNode(link.target);
        console.log(filteredLink);
        return $.post("/create_link", filteredLink, callback);
      };

      Neo4jDataController.prototype.linkDelete = function(link, callback) {
        return $.post("/delete_link", link, callback);
      };

      Neo4jDataController.prototype.linkEdit = function(oldLink, newLink, callback) {
        var deleted_props, property, value;
        oldLink = this.filterLink(oldLink);
        deleted_props = [];
        for (property in oldLink) {
          value = oldLink[property];
          if (newLink[property] != null) {
            if (oldLink[property] === newLink[property]) delete newLink[property];
          } else {
            deleted_props.push(property);
          }
        }
        if (((deleted_props.length === 1) && (!(confirm("Are you sure you want to delete the following property? " + deleted_props)))) || ((deleted_props.length > 1) && (!(confirm("Are you sure you want to delete the following properties? " + deleted_props))))) {
          alert("Cancelled saving of link " + oldLink['_id'] + ".");
          return false;
        }
        return $.post('/edit_link', {
          id: oldLink['_id'],
          properties: newLink,
          remove: deleted_props
        }, function(data) {
          if (data === "error") {
            return alert("Failed to save changes to link " + oldLink['_id'] + ".");
          } else {
            alert("Saved changes to link " + oldLink['_id'] + ".");
            return callback(data);
          }
        });
      };

      Neo4jDataController.prototype.filterNode = function(node) {
        var blacklist, filteredNode;
        blacklist = ["index", "x", "y", "px", "py", "fixed", "selected", "weight", "text"];
        filteredNode = {};
        _.each(node, function(value, property) {
          if (blacklist.indexOf(property) < 0) {
            return filteredNode[property] = value;
          }
        });
        return filteredNode;
      };

      Neo4jDataController.prototype.filterLink = function(link) {
        var blacklist, filteredLink;
        blacklist = ["_type", "end", "selected", "source", "start", "strength", "target"];
        filteredLink = {};
        _.each(link, function(value, property) {
          if (blacklist.indexOf(property) < 0) {
            return filteredLink[property] = value;
          }
        });
        return filteredLink;
      };

      Neo4jDataController.prototype.is_illegal = function(property, type) {
        var reserved_keys;
        reserved_keys = ["_id", "text", "_type", "_Last_Edit_Date", "_Creation_Date", "search"];
        if (property === '') {
          alert(type + " name must not be empty.");
          return true;
        } else if (/^.*[^a-zA-Z0-9_].*$/.test(property)) {
          alert(type + " name '" + property + "' illegal: " + type + " names must only contain alphanumeric characters and underscore.");
          return true;
        } else if (reserved_keys.indexOf(property) !== -1) {
          alert(type + " name illegal: '" + property + "' is a reserved term.");
          return true;
        } else {
          return false;
        }
      };

      return Neo4jDataController;

    })(DataController);
  });

}).call(this);
