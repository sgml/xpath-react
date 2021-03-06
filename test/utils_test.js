"use strict";

var Assert = require("assert");

var XPathUtils = require("../utils");

var React = require("react");

var Foo = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },

  render: function () {
    return (
      <div>
        <p>Hello world!</p>
        <button onClick={this.props.onClick}>
          Bar
        </button>
      </div>
    );
  }
});

describe("XPathReact", function () {
  describe("Utils", function () {
    describe("render()", function () {
      it("should create a shallow rendering of a component", function () {
        var output = XPathUtils.render(<Foo />);

        Assert.equal(output.props.children[0].props.children, "Hello world!");
      });
    });

    describe("find()", function () {
      it("should return the first element matching the expression", function () {
        var output = XPathUtils.render(<Foo />);

        var p = XPathUtils.find(output, ".//p");

        Assert.equal(p.props.children, "Hello world!");
      });

      it("should return null when no elements match the expression", function () {
        var output = XPathUtils.render(<Foo />);

        var ul = XPathUtils.find(output, ".//ul");

        Assert.equal(ul, null);
      });

      it("should support returning string types", function () {
        var output = XPathUtils.render(<Foo />);

        var buttonText = XPathUtils.find(output, "string(.//p)");

        Assert.equal(buttonText, "Hello world!");
      });

      it("should support returning number types", function () {
        var output = XPathUtils.render(<Foo />);

        var nButtons = XPathUtils.find(output, "count(.//button)");

        Assert.equal(nButtons, 1);
      });

      it("should support returning boolean types", function () {
        var output = XPathUtils.render(<Foo />);

        var hasBarButton = XPathUtils.find(output, "count(.//button[contains(., 'Bar')]) = 1");

        Assert.equal(hasBarButton, true);
      });

      it("should throw an error when provided something other than a React element", function () {
        Assert.throws(function () {
          var notReactElement = {foo: "bar"};

          XPathUtils.find(notReactElement, "/*");
        }, /Expected a React element/);
      });
    });

    describe("Simulate.<event>()", function () {
      describe("when provided with a React element", function () {
        it("should invoke the event handler of the element", function () {
          var wasInvoked = false;

          var onClick = function (e) {
            if (e.foo === "bar") {
              wasInvoked = true;
            }
          };

          var output = XPathUtils.render(<Foo onClick={onClick} />);

          var button = XPathUtils.find(output, ".//button");

          XPathUtils.Simulate.click(button, {foo: "bar"});

          Assert.equal(wasInvoked, true);
        });

        it("should throw an error when no event handler is present", function () {
          Assert.throws(function () {
            var output = XPathUtils.render(<Foo />);

            var button = XPathUtils.find(output, ".//button");

            XPathUtils.Simulate.mouseDown(button);
          }, /No event handler for onMouseDown/);
        });
      });

      describe("when also provided with an XPath expression", function () {
        it("should invoke the event handler of the matching element", function () {
          var wasInvoked = false;

          var onClick = function (e) {
            if (e.foo === "bar") {
              wasInvoked = true;
            }
          };

          var output = XPathUtils.render(<Foo onClick={onClick} />);

          XPathUtils.Simulate.click(output, ".//button", {foo: "bar"});

          Assert.equal(wasInvoked, true);
        });

        it("should throw an error when no event handler is present", function () {
          Assert.throws(function () {
            var output = XPathUtils.render(<Foo />);

            XPathUtils.Simulate.mouseDown(output, ".//button");
          }, /No event handler for onMouseDown/);
        });
      });
    });
  });
});
