(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var SyntaxCreate;
    return SyntaxCreate = (function(_super) {

      __extends(SyntaxCreate, _super);

      function SyntaxCreate(options) {
        this.options = options;
        SyntaxCreate.__super__.constructor.call(this);
      }

      SyntaxCreate.prototype.init = function(instances) {
        _.extend(this, Backbone.Events);
        this.keyListener = instances['KeyListener'];
        this.graphView = instances['GraphView'];
        this.graphModel = instances['GraphModel'];
        this.dataController = instances['local/Neo4jDataController'];
        this.buildingLink = false;
        this.sourceSet = false;
        this.tempLink = {};
        this.render();
        this.selection = instances["NodeSelection"];
        this.selection.on("change", this.update.bind(this));
        return instances["Layout"].addPlugin(this.el, this.options.pluginOrder, 'Syntax Create');
      };

      SyntaxCreate.prototype.render = function() {
        var $container, $createLinkButton, $createNodeButton, $createSourceNodeButton, $linkInput, $linkingInstructions, $overlay, $sourceInput,
          _this = this;
        $overlay = $("<div class=\"overlay\">");
        $container = $("<div class=\"syntax-create-container\">").appendTo(this.$el);
        $createNodeButton = $("<input id=\"createNodeButton\" type=\"submit\" value=\"New Node\">").appendTo($container);
        $createLinkButton = $("<input id=\"createArrowButton\" type=\"submit\" value=\"New Link\"><br>").appendTo($container);
        this.$sourceWrapper = $("<div class=\"source-container\">").appendTo($container);
        $sourceInput = $("<textarea placeholder=\"Node : A node's description #key1 value1 #key2 value2\" id=\"searchAddNodeField\" name=\"textin\" rows=\"4\" cols=\"27\"></textarea><br>").appendTo(this.$sourceWrapper);
        $createSourceNodeButton = $("<input id=\"queryform\" type=\"button\" value=\"Create Node\"><br>").appendTo(this.$sourceWrapper);
        this.$linkWrapper = $("<div id=\"source-container\">").appendTo($container);
        $linkInput = $("<textarea placeholder=\"Link : A link's description #key1 value1 #key2 value2\" id=\"linkInputField\" name=\"textin\" rows=\"4\" cols=\"27\"></textarea><br>").appendTo(this.$linkWrapper);
        $createLinkButton = $("<input id=\"queryform\" type=\"submit\" value=\"Create Link\"><br>").appendTo(this.$linkWrapper);
        $linkingInstructions = $("<span id=\"link-instructions\">").appendTo(this.$linkWrapper);
        $createNodeButton.click(function() {
          return $sourceInput.focus();
        });
        $createLinkButton.click(function() {
          return $linkInput.focus();
        });
        $("#searchAddNodeField").keypress(function(e) {
          console.log(e.keyCode);
          if (e.keyCode === 13) {
            _this.buildNode(_this.parseSyntax($sourceInput.val()));
            return $sourceInput.val("");
          }
        });
        $createSourceNodeButton.click(function() {
          _this.buildNode(_this.parseSyntax($sourceInput.val()));
          return $sourceInput.val("");
        });
        $createLinkButton.click(function() {
          _this.buildLink(_this.parseSyntax($linkInput.val()));
          $linkInput.val("");
          return $("#link-instructions").replaceWith("<span id=\"link-instructions\" style=\"font-style:italic;\">Click to select source</span>");
        });
        return this.graphView.on("enter:node:click", function(node) {
          var link;
          if (_this.buildingLink) {
            if (_this.sourceSet) {
              _this.tempLink.target = node;
              link = _this.tempLink;
              _this.dataController.linkAdd(link, function(linkres) {
                var allNodes, n, newLink, _i, _j, _len, _len2;
                newLink = linkres;
                allNodes = _this.graphModel.getNodes();
                for (_i = 0, _len = allNodes.length; _i < _len; _i++) {
                  n = allNodes[_i];
                  if (n['_id'] === link.source['_id']) newLink.source = n;
                }
                for (_j = 0, _len2 = allNodes.length; _j < _len2; _j++) {
                  n = allNodes[_j];
                  if (n['_id'] === link.target['_id']) newLink.target = n;
                }
                return _this.graphModel.putLink(newLink);
              });
              _this.sourceSet = _this.buildingLink = false;
              return $("#link-instructions").replaceWith("<span id=\"link-instructions\" style=\"font-style:italic;\"></span>");
            } else {
              _this.tempLink.source = node;
              _this.sourceSet = true;
              return $("#link-instructions").replaceWith("<span id=\"link-instructions\" style=\"font-style:italic;\">Click to select target</span>");
            }
          }
        });
      };

      SyntaxCreate.prototype.update = function(node) {
        return this.selection.getSelectedNodes();
      };

      SyntaxCreate.prototype.buildNode = function(node) {
        var _this = this;
        return this.dataController.nodeAdd(node, function(datum) {
          return _this.graphModel.putNode(datum);
        });
      };

      SyntaxCreate.prototype.buildLink = function(linkProperties) {
        this.tempLink.properties = linkProperties;
        console.log("tempLink set to", this.tempLink);
        return this.buildingLink = true;
      };

      SyntaxCreate.prototype.parseSyntax = function(input) {
        var dict, match, pattern, strsplit, text;
        console.log("input", input);
        strsplit = input.split("#");
        strsplit[0] = strsplit[0].replace(/:/, " #description ");
        /* The : is shorthand for #description
        */
        text = strsplit.join("#");
        pattern = new RegExp(/#([a-zA-Z0-9]+) ([^#]+)/g);
        dict = {};
        match = {};
        while (match = pattern.exec(text)) {
          dict[match[1].trim()] = match[2].trim();
        }
        /*The first entry becomes the name
        */
        dict["name"] = text.split("#")[0].trim();
        console.log("This is the title", text.split("#")[0].trim());
        return dict;
      };

      return SyntaxCreate;

    })(Backbone.View);
  });

}).call(this);
