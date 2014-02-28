(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var NodeDetailsView;
    return NodeDetailsView = (function(_super) {

      __extends(NodeDetailsView, _super);

      function NodeDetailsView(options) {
        this.options = options;
        NodeDetailsView.__super__.constructor.call(this);
      }

      NodeDetailsView.prototype.init = function(instances) {
        var _this = this;
        this.selection = instances["NodeSelection"];
        this.selection.on("change", this.update.bind(this));
        this.listenTo(instances["KeyListener"], "down:80", function() {
          return _this.$el.toggle();
        });
        instances["Layout"].addPlugin(this.el, this.options.pluginOrder, 'Node Details');
        return this.$el.toggle();
      };

      NodeDetailsView.prototype.update = function() {
        var $container, blacklist, selectedNodes;
        this.$el.empty();
        selectedNodes = this.selection.getSelectedNodes();
        $container = $("<div class=\"node-profile-helper\"/>").appendTo(this.$el);
        blacklist = ["index", "x", "y", "px", "py", "fixed", "selected", "weight"];
        return _.each(selectedNodes, function(node) {
          var $nodeDiv;
          $nodeDiv = $("<div class=\"node-profile\"/>").appendTo($container);
          $("<div class=\"node-profile-title\">" + node['text'] + "</div>").appendTo($nodeDiv);
          return _.each(node, function(value, property) {
            if (blacklist.indexOf(property) < 0) {
              return $("<div class=\"node-profile-property\">" + property + ":  " + value + "</div>").appendTo($nodeDiv);
            }
          });
        });
      };

      return NodeDetailsView;

    })(Backbone.View);
  });

}).call(this);
