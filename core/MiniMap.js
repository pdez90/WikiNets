// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var MiniMap;
    return MiniMap = (function(_super) {
      __extends(MiniMap, _super);

      function MiniMap(options) {
        this.options = options;
        MiniMap.__super__.constructor.call(this);
      }

      MiniMap.prototype.init = function(instances) {
        var _this = this;
        this.graphView = instances['GraphView'];
        this.graphView.on("enter:node:click", function(datum) {
          return _this.chooseCenter(datum);
        });
        this.model = instances["GraphModel"];
        this.model.on("change", this.update.bind(this));
        this.selection = instances["NodeSelection"];
        this.selection.on("change", this.update.bind(this));
        instances["Layout"].addPlugin(this.el, this.options.pluginOrder, 'MiniMap', true);
        return this.render();
      };

      MiniMap.prototype.render = function() {
        this.miniMapWidth = 200;
        this.miniMapHeight = 200;
        this.frame = d3.select(this.el).append("svg:svg").attr("width", this.miniMapWidth).attr("height", this.miniMapHeight);
        return this;
      };

      MiniMap.prototype.update = function() {
        var allLinks, centerID, central_width, circle_sizer, k, link, minimap_padding, minimap_scalar, minimap_text_size, neighbors, sub_height, sub_width, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3,
          _this = this;
        this.$el.empty();
        this.frame = d3.select(this.el).append("svg:svg").attr("width", this.miniMapWidth).attr("height", this.miniMapHeight);
        if ((this.mostRecentNode !== void 0) && (_ref = this.mostRecentNode, __indexOf.call(this.model.getNodes(), _ref) >= 0)) {
          centerID = this.model.get("nodeHash")(this.mostRecentNode);
          allLinks = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = this.model.getLinks();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              link = _ref1[_i];
              if (link.strength > 0) {
                _results.push(link);
              }
            }
            return _results;
          }).call(this);
          neighbors = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = allLinks.length; _i < _len; _i++) {
              link = allLinks[_i];
              if (this.model.get("nodeHash")(link.source) === centerID) {
                _results.push(link.target);
              }
            }
            return _results;
          }).call(this);
          for (_i = 0, _len = allLinks.length; _i < _len; _i++) {
            link = allLinks[_i];
            if (this.model.get("nodeHash")(link.target) === centerID) {
              neighbors.push(link.source);
            }
          }
          central_width = 14;
          circle_sizer = 10;
          minimap_padding = 5;
          minimap_scalar = this.miniMapWidth / 2 - central_width / 2 - circle_sizer - minimap_padding;
          minimap_text_size = 14;
          sub_width = this.miniMapWidth;
          sub_height = this.miniMapHeight;
          if (neighbors.length > 0) {
            for (k = _j = 0, _ref1 = neighbors.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              this.frame.append("line").attr("x1", sub_width / 2 + central_width / 2).attr("y1", sub_height / 2 + central_width / 2).attr("x2", minimap_scalar * Math.sin(2 * k * Math.PI / neighbors.length) + sub_width / 2 + central_width / 2).attr("y2", minimap_scalar * Math.cos(2 * k * Math.PI / neighbors.length) + sub_height / 2 + central_width / 2).style("stroke", "lightgrey").style("stroke-width", "2").on("click", function(d_2, i_2) {
                return alert("You clicked a link!", d_2, i_2);
              });
            }
            /* should eventually implement directed arrows here*/

          }
          this.frame.append("circle").attr("class", "node").attr("stroke", "darkgrey").attr("stroke-width", 3).attr("fill", this.mostRecentNode.selected ? "steelblue" : "white").attr("cx", sub_width / 2 + central_width / 2).attr("cy", sub_height / 2 + central_width / 2).attr("r", central_width).on("click", function() {
            return _this.selection.toggleSelection(_this.mostRecentNode);
          });
          if (neighbors.length > 0) {
            for (k = _k = 0, _ref2 = neighbors.length - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; k = 0 <= _ref2 ? ++_k : --_k) {
              this.frame.append("circle").attr("class", "node").attr("r", circle_sizer).attr("stroke", "darkgrey").attr("stroke-width", 3).attr("fill", neighbors[k].selected ? "steelblue" : "white").attr("cx", minimap_scalar * Math.sin(2 * k * Math.PI / neighbors.length) + sub_width / 2 + central_width / 2).attr("cy", minimap_scalar * Math.cos(2 * k * Math.PI / neighbors.length) + sub_height / 2 + central_width / 2).data([neighbors[k]]).on("click", function(node) {
                if (_this.mostRecentNode.selected && !d3.event.shiftKey && !d3.event.ctrlKey) {
                  _this.selection.toggleSelection(_this.mostRecentNode);
                }
                _this.selection.toggleSelection(node);
                if (!d3.event.shiftKey) {
                  return _this.chooseCenter(node);
                }
              });
            }
          }
          if (neighbors.length > 0) {
            for (k = _l = 0, _ref3 = neighbors.length - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; k = 0 <= _ref3 ? ++_l : --_l) {
              this.frame.append("text").attr("fill", "black").attr("font-size", minimap_text_size).attr("x", minimap_scalar * Math.sin(2 * k * Math.PI / neighbors.length) + sub_width / 2 + 16).attr("y", minimap_scalar * Math.cos(2 * k * Math.PI / neighbors.length) + sub_height / 2 + central_width / 2 - 12).text(this.findHeader(neighbors[k]));
            }
          }
          return this.frame.append("text").attr("fill", "black").attr("font-size", minimap_text_size).attr("x", sub_width / 2 + 16).attr("y", sub_height / 2 - 1 + central_width / 2 - 12).text(this.findHeader(this.mostRecentNode));
        }
      };

      MiniMap.prototype.chooseCenter = function(node) {
        this.mostRecentNode = node;
        return this.update();
      };

      MiniMap.prototype.findHeader = function(node) {
        if (node.name != null) {
          return node.name;
        } else if (node.title != null) {
          return node.title;
        } else {
          return '';
        }
      };

      return MiniMap;

    })(Backbone.View);
  });

}).call(this);
