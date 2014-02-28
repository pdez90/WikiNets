(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var ShowAll;
    return ShowAll = (function(_super) {

      __extends(ShowAll, _super);

      function ShowAll(options) {
        this.options = options;
        this.searchNodes = __bind(this.searchNodes, this);
        this.expandSelection = __bind(this.expandSelection, this);
        this.loadAllNodes = __bind(this.loadAllNodes, this);
        ShowAll.__super__.constructor.call(this);
      }

      ShowAll.prototype.init = function(instances) {
        this.render();
        this.graphModel = instances["GraphModel"];
        this.dataProvider = instances["local/WikiNetsDataProvider"];
        this.selection = instances["NodeSelection"];
        $(this.el).appendTo($('#toolBox'));
        this.graphView = instances["GraphView"];
        return this.listView = instances["local/ListView"];
      };

      ShowAll.prototype.render = function() {
        var $chooseSelectButton, $clearAllButton, $clearSelectedButton, $container, $deselectAllButton, $expandSelectionButton, $graphViewButton, $listViewButton, $pinSelectedButton, $selectAllButton, $showAllButton, $showLearningButton, $showResearchButton, $showStudentLifeButton, $unpinAllButton, $unpinSelectedButton,
          _this = this;
        $container = $("<div id=\"show-all-container\">").appendTo(this.$el);
        $listViewButton = $("<input type=\"button\" id=\"listViewButton\" value=\"List View\"></input>").appendTo($container);
        $listViewButton.click(function() {
          $(_this.listView.el).show();
          return $(_this.graphView.el).hide();
        });
        $graphViewButton = $("<input type=\"button\" id=\"graphViewButton\" value=\"Graph View\"></input>").appendTo($container);
        $graphViewButton.click(function() {
          $(_this.listView.el).hide();
          return $(_this.graphView.el).show();
        });
        $showAllButton = $("<input type=\"button\" id=\"showAllButton\" value=\"Show All\"></input>").appendTo($container);
        $showAllButton.click(function() {
          return _this.dataProvider.getEverything(_this.loadAllNodes);
        });
        $clearAllButton = $("<input type=\"button\" id=\"clearAllButton\" value=\"Clear All\"></input>").appendTo($container);
        $clearAllButton.click(function() {
          return _this.graphModel.filterNodes(function(node) {
            return false;
          });
        });
        $expandSelectionButton = $("<input type=\"button\" id=\"expandSelectionButton\" value=\"Expand Selection\"></input>").appendTo($container);
        $expandSelectionButton.click(function() {
          return _this.expandSelection();
        });
        $selectAllButton = $("<input type=\"button\" id=\"selectAllButton\" value=\"Select All\"></input>").appendTo($container);
        $selectAllButton.click(function() {
          return _this.selection.selectAll();
        });
        $deselectAllButton = $("<input type=\"button\" id=\"deselectAllButton\" value=\"Deselect All\"></input>").appendTo($container);
        $deselectAllButton.click(function() {
          return _this.selection.deselectAll();
        });
        $clearSelectedButton = $("<input type=\"button\" id=\"clearSelectedButton\" value=\"Clear Selection\"></input>").appendTo($container);
        $clearSelectedButton.click(function() {
          return _this.selection.removeSelection();
        });
        $chooseSelectButton = $("<input type=\"button\" id=\"chooseSelectButton\" value=\"Clear Unselected\"></input>").appendTo($container);
        $chooseSelectButton.click(function() {
          return _this.selection.removeSelectionCompliment();
        });
        $unpinAllButton = $("<input type=\"button\" id=\"unpinAllButton\" value=\"Un-pin Layout\"></input>").appendTo($container);
        $unpinAllButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.graphModel.getNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = false);
          }
          return _results;
        });
        $unpinAllButton = $("<input type=\"button\" id=\"unpinAllButton\" value=\"Pin Layout\"></input>").appendTo($container);
        $unpinAllButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.graphModel.getNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = true);
          }
          return _results;
        });
        $unpinSelectedButton = $("<input type=\"button\" id=\"unpinSelectedButton\" value=\"Un-Pin Selected\"></input>").appendTo($container);
        $unpinSelectedButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.selection.getSelectedNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = false);
          }
          return _results;
        });
        $pinSelectedButton = $("<input type=\"button\" id=\"unpinSelectedButton\" value=\"Pin Selected\"></input>").appendTo($container);
        $pinSelectedButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.selection.getSelectedNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = true);
          }
          return _results;
        });
        $showLearningButton = $("<input type=\"button\" id=\"showLearningButton\" value=\"Learning\"></input>").appendTo($container);
        $showLearningButton.click(function() {
          return _this.searchNodes({
            Theme: "Learning"
          });
        });
        $showStudentLifeButton = $("<input type=\"button\" id=\"showStudentLifeButton\" value=\"Student Life\"></input>").appendTo($container);
        $showStudentLifeButton.click(function() {
          return _this.searchNodes({
            Theme: "Student Life"
          });
        });
        $showResearchButton = $("<input type=\"button\" id=\"showResearchButton\" value=\"Research\"></input>").appendTo($container);
        return $showResearchButton.click(function() {
          return _this.searchNodes({
            Theme: "Research"
          });
        });
      };

      ShowAll.prototype.loadAllNodes = function(nodes) {
        var node, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          _results.push(this.graphModel.putNode(node));
        }
        return _results;
      };

      ShowAll.prototype.expandSelection = function() {
        var _this = this;
        return this.dataProvider.getLinkedNodes(this.selection.getSelectedNodes(), function(nodes) {
          return _.each(nodes, function(node) {
            if (_this.dataProvider.nodeFilter(node)) {
              return _this.graphModel.putNode(node);
            }
          });
        });
      };

      ShowAll.prototype.searchNodes = function(searchQuery) {
        var _this = this;
        return $.post("/search_nodes", searchQuery, function(nodes) {
          var node, _i, _len, _results;
          console.log("made it here: " + searchQuery[0]);
          _results = [];
          for (_i = 0, _len = nodes.length; _i < _len; _i++) {
            node = nodes[_i];
            _this.graphModel.putNode(node);
            _results.push(_this.selection.toggleSelection(node));
          }
          return _results;
        });
      };

      return ShowAll;

    })(Backbone.View);
  });

}).call(this);
