/**
 * this module represent familiar grid for use we name it [gridy]
 * in this version 1.0. gridy will contains data with minmum operation
 * we will work to make gridy have a new  features step by step .
 * GRIDY DEVELOPEMENT TEAM .
 * for any question please contact us on a.m.k-it@hotmail.com
 */

(function (window, document) {
  "use strict";

  var gridyproto;
  var gridyConstructor;
  var gridTable;

  // private element will be used in gridy
  var rowsFilter = []; // variable for store rows selected by filter

  //gridy information
  const version = "1.0.0";
  const license = "MIT";
  const support = "javascript, api, json";

  // constant element define as a key
  const gridyKey = "table";
  const _columnKey = "tr";
  const _column = "td";
  const _headerKey = "th";
  const _sectionHead = "thead";
  const _sectionBody = "tbody";
  const _sectionFooter = "tfoot";
  const _ctrlFilter = "input";
  const _ctrlSpan = "span";

  //gridy default values .
  const defaultColumnvalue = 20;
  const defaultIsSort = false;
  const defaultDataType = "json";
  const dataTypePossible = ["json", "xml", "JSON", "XML"];

  // gridy  userMessage
  const NoData = "no data";

  //functions will support gridy.

  function checkDataType(datatype) {
    if (dataTypePossible.indexOf(datatype) != -1) return true;

    throw '"' +
      datatype +
      '" ' +
      " data type not supported in gridy please using XML or JSON type";
  }

  //serialize data in gridy
  function serializeDateAsJson() {}

  ///////////////////// End support elements ////////////////////////////

  //gridy Modules build by ammar kh .
  var gridy = function (el = "", options = {}) {
    this.el = el; // set id parameter as element id;

    if (typeof this.el == "string") {
      this._element = document.getElementById(this.el);

      // check if id is define for element.
      if (this._element != null) {
        //check if gridy container is div or not .
        if (
          this._element.nodeName != "<div>" &&
          this._element.nodeName != "DIV"
        ) {
          throw "no valid container define for gridy please define div !";
        } else {
          if (options != (Object.length == 0)) {
            this._columns_keys = options.columns;
            this.data = options.dataSource;
            this.isSort = options.isSort;
            this.cssClass = options.css;
            this.viewRowCount = options.viewCount;
            this.dataType = options.dataType;
            this.errorMessage = "";

            this.createGridy();
            this.setOptions(options);
          }
        }
      } else {
        throw this.el + " element not html element in current context !";
      }
    } else {
      throw "not valid id for gridy please insert a valid id";
    }
  };

  gridy.prototype = {
    setOptions: function (opt = {}) {
      // if user set options in your grid will accept and start render gridy.
      if (opt) {
        if (this._columns_keys !== undefined) {
          if (this._columns_keys.length > 0) {
            this.generateGridyHead();
          }
        } else {
          throw 'columns for gridy undefined please set columns for gridy use [columns] property';
        }

        // check if is user set sorted in correct state
        if (this.isSort) {
          if (typeof this.isSort !== "boolean") {
            throw "isSort type is not valid please using boolean type !";
          }
        } else {
          this.isSort = defaultIsSort;
        }

        // check if user set count of rowsview count in correct state.
        if (this.viewRowCount) {
          if (typeof this.viewRowCount !== "number") {
            throw "Count value not valid type please insert number type";
          }
        } else {
          this.viewRowCount = defaultColumnvalue;
        }

        // check user datatype user send.
        if (this.dataType) {
          if (typeof this.dataType === "string") {
            var res = checkDataType(this.dataType);
          }
        } else {
          this.dataType = "JSON" | "json";
        }

        //check user data not empty data.
        if (this.data !== undefined) {
          if (this.data.length > 0) {
            this.generateGridyBody();
          } else {
            this.errorMessage = NoData;
            // use div view for set this message will be view for user.
          }
        } else {
          throw 'data not undefined please define data by use [dataSource] property';
          //property define set null empty div next version .
        }

      }
    },

    //create gridy
    createGridy: function () {
      this.grid = document.createElement(gridyKey);
      this.grid.classList.add("gridyCss");

      this._element.appendChild(this.grid);
      gridTable = this.grid;
    },
    //set head for gridy
    generateGridyHead: function () {
      var sectionHead = document.createElement(_sectionHead);
      var sectionCaption = document.createElement(_columnKey);
      var sectionFilter = document.createElement(_columnKey);

      this._columns_keys.forEach(element => {
        var currElem = document.createElement(_headerKey);
        var headSpan = document.createElement(_ctrlSpan);
        headSpan.innerText = element.columnName;

        currElem.appendChild(headSpan);

        sectionCaption.appendChild(currElem);
        var curfilterCtrl = document.createElement(_column);
        var currFilter = document.createElement(_ctrlFilter);
        //set filter function
        currFilter.addEventListener("keyup", function () {
          // console.log(this.value + "|" + this.getAttribute('role'));
          gridy.prototype.superFilter();
          //gridy.prototype._filter(this.value, this.getAttribute("role"));
        });
        //

        currFilter.classList.add("filterCtrl");
        currFilter.setAttribute("role", this._columns_keys.indexOf(element));

        curfilterCtrl.appendChild(currFilter);
        sectionFilter.appendChild(curfilterCtrl);

        //sectionHead.appendChild(currElem);
      });
      sectionHead.appendChild(sectionCaption);
      sectionHead.appendChild(sectionFilter);

      this.grid.appendChild(sectionHead);
    },
    //set body for gridy.
    generateGridyBody: function () {
      var sectionBody = document.createElement(_sectionBody);

      this.data.forEach(element => {
        var currElement = document.createElement(_columnKey);
        sectionBody.appendChild(currElement);

        //set element data .
        for (var i = 0; i < Object.keys(element).length; i++) {
          var curData = document.createElement(_column);
          curData.innerText = element[Object.keys(element)[i]];

          currElement.appendChild(curData);
        }
      });
      this.grid.appendChild(sectionBody);
    },
    // set pagenation
    generateGridyFooter: function () {},
    setGridView: function () {},
    superFilter: function () {
      var filterKeys = [];
      var keyrows = gridTable
        .getElementsByTagName(_sectionHead)[0]
        .getElementsByTagName(_columnKey)[1];

      var cols = keyrows.getElementsByTagName(_column);

      for (var index = 0; index < cols.length; index++) {
        var k = cols[index].getElementsByTagName(_ctrlFilter)[0];
        if (k.value.trim() != "") {
          filterKeys[index] = k.value;
        }
      }

      this._filter(filterKeys);
    },

    _filter: function (filter = []) {
      //debugger;

      var rows = gridTable
        .getElementsByTagName(_sectionBody)[0]
        .getElementsByTagName(_columnKey);

      // if (rowsFilter.length == 0) {
      //   for (var index = 0; index < rows.length; index++)
      //     rowsFilter.push(index);
      // }

      if (filter.length > 0) {
        for (var index = 0; index < rows.length; index++) {
          var cols = rows[index].getElementsByTagName(_column);
          var value = [];
          filter.forEach(element => {
            if (element != "") {
              if (
                cols[filter.indexOf(element)].innerText
                .toUpperCase()
                .indexOf(filter[filter.indexOf(element)].toUpperCase()) > -1
              ) {
                value[filter.indexOf(element)] = true;
              } else {
                value[filter.indexOf(element)] = false;
              }
            }

            if (value.indexOf(false) > -1) {
              rows[index].style.display = "none";
            } else {
              rows[index].style.display = "";
            }
          });
        }
        // for (var index = 0; index < rows.length; index++) {
        //   for (var colindex = 0; colindex < filter.length; colindex++) {
        //     if (filter[colindex] != null) {
        //       var keu = rows[index].getElementsByTagName("td")[colindex];
        //       if (keu.innerText.toUpperCase().indexOf(filter[colindex]) > -1) {
        //         rows[index].style.display = "";
        //       } else {
        //         rows[index].style.display = "none";
        //       }
        //     }
        //   }
        // }
      } else {
        for (var index = 0; index < rows.length; index++) {
          rows[index].style.display = "";
        }
      }

      // for (var i = 0; i < rows.length; i++) {
      //   var curColumn = rows[i].getElementsByTagName(_column)[role];
      //   if (curColumn) {
      //     // check if is Not Null columns .
      //     if (
      //       curColumn.innerText.toUpperCase().indexOf(value.toUpperCase()) > -1
      //     ) {
      //       if (rowsFilter.length > 0) {
      //         if (rowsFilter.indexOf(i) > -1) rows[i].style.display = "";
      //       }
      //     } else {
      //       if (rowsFilter.length > 0) {
      //         if (rowsFilter.indexOf(i) > -1) {
      //           rowsFilter.splice(rowsFilter.indexOf(i), 1);
      //         }
      //         rows[i].style.display = "none";
      //       }
      //     }
      //   }
      // }
    }
  };

  window.gridy = function (el, options = {}) {
    return new gridy(el, options);
  };

  return gridy;
})(this, this.document);

var gridy = window.gridy;