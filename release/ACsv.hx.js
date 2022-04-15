// Generated by Haxe 3.4.7
(function ($hx_exports) { "use strict";
$hx_exports["acsv"] = $hx_exports["acsv"] || {};
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
var Std = function() { };
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) {
		v = parseInt(x);
	}
	if(isNaN(v)) {
		return null;
	}
	return v;
};
var StringTools = function() { };
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var acsv_Field = $hx_exports["acsv"]["Field"] = function() {
};
var acsv_Table = $hx_exports["acsv"]["Table"] = function() {
	this._indexSet = { };
	this.body = [];
	this.head = [];
};
acsv_Table.Parse = function(content) {
	var table = acsv_Table.arrayToRows(acsv_Table.textToArray(content));
	table.content = content;
	return table;
};
acsv_Table.textToArray = function(text) {
	var array = [];
	var maxLen = text.length;
	var ptr = text;
	var ptrPos = 0;
	while(true) {
		var curLen = maxLen - ptrPos;
		var cellIndexA = 0;
		var cellIndexB = 0;
		var cells = [];
		var cell;
		var chr;
		while(cellIndexB < curLen) {
			cellIndexA = cellIndexB;
			chr = ptr.charAt(ptrPos + cellIndexB);
			if(chr == "\n" || chr == "\r\n") {
				++cellIndexB;
				break;
			}
			if(chr == "\r" && ptr.charAt(ptrPos + cellIndexB + 1) == "\n") {
				cellIndexB += 2;
				break;
			}
			if(chr == ",") {
				cell = "";
				var nextPos = ptrPos + cellIndexB + 1;
				if(nextPos >= maxLen) {
					chr = "\n";
				} else {
					chr = ptr.charAt(nextPos);
				}
				if(cellIndexA == 0 || chr == "," || chr == "\n" || chr == "\r\n") {
					++cellIndexB;
					cells.push("");
				} else if(chr == "\r" && ptr.charAt(ptrPos + cellIndexB + 2) == "\n") {
					cellIndexB += 2;
					cells.push("");
				} else {
					++cellIndexB;
				}
			} else if(chr == "\"") {
				++cellIndexB;
				while(true) {
					cellIndexB = ptr.indexOf("\"",ptrPos + cellIndexB);
					if(cellIndexB == -1) {
						console.log("[ACsv] Invalid Double Quote");
						return null;
					}
					cellIndexB -= ptrPos;
					if(ptr.charAt(ptrPos + cellIndexB + 1) == "\"") {
						cellIndexB += 2;
						continue;
					}
					break;
				}
				cell = ptr.substring(ptrPos + cellIndexA + 1,ptrPos + cellIndexB);
				cell = StringTools.replace(cell,"\"\"","\"");
				cells.push(cell);
				++cellIndexB;
			} else {
				var indexA = ptr.indexOf(",",ptrPos + cellIndexB);
				if(indexA == -1) {
					indexA = curLen;
				} else {
					indexA -= ptrPos;
				}
				var indexB = ptr.indexOf("\r\n",ptrPos + cellIndexB);
				if(indexB == -1) {
					indexB = ptr.indexOf("\n",ptrPos + cellIndexB);
					if(indexB == -1) {
						indexB = curLen;
					} else {
						indexB -= ptrPos;
					}
				} else {
					indexB -= ptrPos;
				}
				cellIndexB = indexA;
				if(indexB < indexA) {
					cellIndexB = indexB;
				}
				cell = ptr.substring(ptrPos + cellIndexA,ptrPos + cellIndexB);
				cells.push(cell);
			}
		}
		array.push(cells);
		ptrPos += cellIndexB;
		if(ptrPos >= maxLen) {
			break;
		}
	}
	return array;
};
acsv_Table.arrayToRows = function(array) {
	var head = array.shift();
	var body = array;
	var fileds = [];
	var _g1 = 0;
	var _g = head.length;
	while(_g1 < _g) {
		var i = _g1++;
		var fullName = head[i];
		var parts = fullName.split(":");
		var filed = new acsv_Field();
		filed.fullName = fullName;
		filed.name = parts[0];
		filed.type = parts[1];
		fileds.push(filed);
	}
	var _g11 = 0;
	var _g2 = body.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var row = body[i1];
		var _g3 = 0;
		var _g21 = row.length;
		while(_g3 < _g21) {
			var j = _g3++;
			var type = fileds[j].type;
			var cell = row[j];
			var newVal = cell;
			var isEmptyCell = cell == null || cell == "";
			if(type == "bool") {
				if(isEmptyCell || cell == "false" || cell == "0") {
					newVal = false;
				} else {
					newVal = true;
				}
			} else if(type == "int") {
				if(isEmptyCell) {
					newVal = 0;
				} else {
					newVal = Std.parseInt(newVal);
				}
			} else if(type == "number") {
				if(isEmptyCell) {
					newVal = 0.0;
				} else {
					newVal = parseFloat(newVal);
				}
			} else if(type == "json") {
				if(isEmptyCell) {
					newVal = null;
				} else {
					var chr0 = cell.charAt(0);
					if(!(chr0 == "[" || chr0 == "{")) {
						console.log("[ACsv] Invalid json format:" + fileds[j].name + "," + cell);
						return null;
					}
					newVal = cell;
				}
			} else if(type == "strings") {
				if(isEmptyCell) {
					newVal = "[]";
				} else {
					newVal = "[\"" + cell.split(",").join("\",\"") + "\"]";
				}
			}
			row[j] = newVal;
		}
		body[i1] = row;
	}
	var table = new acsv_Table();
	table.head = fileds;
	table.body = body;
	return table;
};
acsv_Table.prototype = {
	merge: function(b) {
		this.body = this.body.concat(b.body);
		var index = b.content.indexOf("\r\n");
		if(index == -1) {
			index = b.content.indexOf("\n");
		}
		var c = b.content.substring(index);
		this.content += c;
	}
	,createIndexAt: function(colIndex) {
		var map = { };
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			var key = row[colIndex];
			map[key] = row;
		}
		this._indexSet[colIndex] = map;
	}
	,getColumnIndexBy: function(name) {
		var _g1 = 0;
		var _g = this.head.length;
		while(_g1 < _g) {
			var i = _g1++;
			var field = this.head[i];
			if(field.name == name) {
				return i;
			}
		}
		return -1;
	}
	,getCurrentSelectdData: function() {
		return this._selectd;
	}
	,fmtRow: function(row) {
		var obj = [];
		var _g1 = 0;
		var _g = this.head.length;
		while(_g1 < _g) {
			var i = _g1++;
			var type = this.head[i].type;
			var val0 = row[i];
			var val1 = null;
			if(type != null && type != "" && acsv_Table.JSON_TYPES.indexOf(type) != -1) {
				if(val0 != null) {
					val1 = JSON.parse(val0);
				}
			} else {
				val1 = val0;
			}
			obj.push(val1);
		}
		return obj;
	}
	,fmtObj: function(row) {
		var obj = { };
		var _g1 = 0;
		var _g = this.head.length;
		while(_g1 < _g) {
			var i = _g1++;
			var name = this.head[i].name;
			var type = this.head[i].type;
			var val0 = row[i];
			var val1 = null;
			if(type != null && type != "" && acsv_Table.JSON_TYPES.indexOf(type) != -1) {
				if(val0 != null) {
					val1 = JSON.parse(val0);
				}
			} else {
				val1 = val0;
			}
			obj[name] = val1;
		}
		return obj;
	}
	,toFirstRow: function() {
		if(this._selectd == null || this._selectd.length == 0) {
			return null;
		}
		return this.fmtRow(this._selectd[0]);
	}
	,toLastRow: function() {
		if(this._selectd == null || this._selectd.length == 0) {
			return null;
		}
		return this.fmtRow(this._selectd[this._selectd.length - 1]);
	}
	,toRows: function() {
		if(this._selectd == null) {
			return null;
		}
		var arr = [];
		var _g1 = 0;
		var _g = this._selectd.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this._selectd[i];
			arr.push(this.fmtRow(row));
		}
		return arr;
	}
	,toFirstObj: function() {
		if(this._selectd == null || this._selectd.length == 0) {
			return null;
		}
		return this.fmtObj(this._selectd[0]);
	}
	,toLastObj: function() {
		if(this._selectd == null || this._selectd.length == 0) {
			return null;
		}
		return this.fmtObj(this._selectd[this._selectd.length - 1]);
	}
	,toObjs: function() {
		if(this._selectd == null) {
			return null;
		}
		var arr = [];
		var _g1 = 0;
		var _g = this._selectd.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this._selectd[i];
			arr.push(this.fmtObj(row));
		}
		return arr;
	}
	,selectAll: function() {
		this._selectd = this.body;
		return this;
	}
	,selectFirstRow: function() {
		this._selectd = [this.body[0]];
		return this;
	}
	,selectLastRow: function() {
		this._selectd = [this.body[this.body.length - 1]];
		return this;
	}
	,selectWhenE: function(limit,value,colIndex) {
		if(colIndex == null) {
			colIndex = 0;
		}
		if(limit == 1) {
			var map = this._indexSet[colIndex];
			if(map != null) {
				var val = map[value];
				if(val != null) {
					this._selectd = [val];
				} else {
					this._selectd = null;
				}
				return this;
			}
		}
		var rows = [];
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			if(row[colIndex] == value) {
				rows.push(row);
				--limit;
				if(limit == 0) {
					break;
				}
			}
		}
		this._selectd = rows;
		return this;
	}
	,selectWhenE2: function(limit,value1,value2,colIndex2,colIndex1) {
		if(colIndex1 == null) {
			colIndex1 = 0;
		}
		if(colIndex2 == null) {
			colIndex2 = 1;
		}
		var rows = [];
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			if(row[colIndex1] == value1 && row[colIndex2] == value2) {
				rows.push(row);
				--limit;
				if(limit == 0) {
					break;
				}
			}
		}
		this._selectd = rows;
		return this;
	}
	,selectWhenE3: function(limit,value1,value2,value3,colIndex3,colIndex2,colIndex1) {
		if(colIndex1 == null) {
			colIndex1 = 0;
		}
		if(colIndex2 == null) {
			colIndex2 = 1;
		}
		if(colIndex3 == null) {
			colIndex3 = 2;
		}
		var rows = [];
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			if(row[colIndex1] == value1 && row[colIndex2] == value2 && row[colIndex3] == value3) {
				rows.push(row);
				--limit;
				if(limit == 0) {
					break;
				}
			}
		}
		this._selectd = rows;
		return this;
	}
	,selectWhenG: function(limit,withEqu,value,colIndex) {
		if(colIndex == null) {
			colIndex = 0;
		}
		var rows = [];
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			var rowVal = row[colIndex];
			if(rowVal > value || withEqu && rowVal == value) {
				rows.push(row);
				--limit;
				if(limit == 0) {
					break;
				}
			}
		}
		this._selectd = rows;
		return this;
	}
	,selectWhenL: function(limit,withEqu,value,colIndex) {
		if(colIndex == null) {
			colIndex = 0;
		}
		var rows = [];
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			var rowVal = row[colIndex];
			if(rowVal < value || withEqu && rowVal == value) {
				rows.push(row);
				--limit;
				if(limit == 0) {
					break;
				}
			}
		}
		this._selectd = rows;
		return this;
	}
	,selectWhenGreaterAndLess: function(limit,GWithEqu,LWithEqu,GValue,LValue,colIndex) {
		if(colIndex == null) {
			colIndex = 0;
		}
		var rows = [];
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			var rowVal = row[colIndex];
			var v1 = rowVal > GValue || GWithEqu && rowVal == GValue;
			var v2 = rowVal < LValue || LWithEqu && rowVal == LValue;
			if(v1 && v2) {
				rows.push(row);
				--limit;
				if(limit == 0) {
					break;
				}
			}
		}
		this._selectd = rows;
		return this;
	}
	,selectWhenLessOrGreater: function(limit,LWithEqu,GWithEqu,LValue,GValue,colIndex) {
		if(colIndex == null) {
			colIndex = 0;
		}
		var rows = [];
		var _g1 = 0;
		var _g = this.body.length;
		while(_g1 < _g) {
			var i = _g1++;
			var row = this.body[i];
			var rowVal = row[colIndex];
			var v1 = rowVal < LValue || LWithEqu && rowVal == LValue;
			var v2 = rowVal > GValue || GWithEqu && rowVal == GValue;
			if(v1 || v2) {
				rows.push(row);
				--limit;
				if(limit == 0) {
					break;
				}
			}
		}
		this._selectd = rows;
		return this;
	}
};
acsv_Table.JSON_TYPES = ["json","strings"];
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this);
