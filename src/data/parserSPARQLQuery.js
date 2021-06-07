(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./lib/BlankNode"), exports);
__exportStar(require("./lib/DataFactory"), exports);
__exportStar(require("./lib/DefaultGraph"), exports);
__exportStar(require("./lib/Literal"), exports);
__exportStar(require("./lib/NamedNode"), exports);
__exportStar(require("./lib/Quad"), exports);
__exportStar(require("./lib/Variable"), exports);

},{"./lib/BlankNode":3,"./lib/DataFactory":4,"./lib/DefaultGraph":5,"./lib/Literal":6,"./lib/NamedNode":7,"./lib/Quad":8,"./lib/Variable":9}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlankNode = void 0;
/**
 * A term that represents an RDF blank node with a label.
 */
class BlankNode {
    constructor(value) {
        this.termType = 'BlankNode';
        this.value = value;
    }
    equals(other) {
        return !!other && other.termType === 'BlankNode' && other.value === this.value;
    }
}
exports.BlankNode = BlankNode;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFactory = void 0;
const BlankNode_1 = require("./BlankNode");
const DefaultGraph_1 = require("./DefaultGraph");
const Literal_1 = require("./Literal");
const NamedNode_1 = require("./NamedNode");
const Quad_1 = require("./Quad");
const Variable_1 = require("./Variable");
let dataFactoryCounter = 0;
/**
 * A factory for instantiating RDF terms and quads.
 */
class DataFactory {
    constructor(options) {
        this.blankNodeCounter = 0;
        options = options || {};
        this.blankNodePrefix = options.blankNodePrefix || `df_${dataFactoryCounter++}_`;
    }
    /**
     * @param value The IRI for the named node.
     * @return A new instance of NamedNode.
     * @see NamedNode
     */
    namedNode(value) {
        return new NamedNode_1.NamedNode(value);
    }
    /**
     * @param value The optional blank node identifier.
     * @return A new instance of BlankNode.
     *         If the `value` parameter is undefined a new identifier
     *         for the blank node is generated for each call.
     * @see BlankNode
     */
    blankNode(value) {
        return new BlankNode_1.BlankNode(value || `${this.blankNodePrefix}${this.blankNodeCounter++}`);
    }
    /**
     * @param value              The literal value.
     * @param languageOrDatatype The optional language or datatype.
     *                           If `languageOrDatatype` is a NamedNode,
     *                           then it is used for the value of `NamedNode.datatype`.
     *                           Otherwise `languageOrDatatype` is used for the value
     *                           of `NamedNode.language`.
     * @return A new instance of Literal.
     * @see Literal
     */
    literal(value, languageOrDatatype) {
        return new Literal_1.Literal(value, languageOrDatatype);
    }
    /**
     * This method is optional.
     * @param value The variable name
     * @return A new instance of Variable.
     * @see Variable
     */
    variable(value) {
        return new Variable_1.Variable(value);
    }
    /**
     * @return An instance of DefaultGraph.
     */
    defaultGraph() {
        return DefaultGraph_1.DefaultGraph.INSTANCE;
    }
    /**
     * @param subject   The quad subject term.
     * @param predicate The quad predicate term.
     * @param object    The quad object term.
     * @param graph     The quad graph term.
     * @return A new instance of Quad.
     * @see Quad
     */
    quad(subject, predicate, object, graph) {
        return new Quad_1.Quad(subject, predicate, object, graph || this.defaultGraph());
    }
    /**
     * Create a deep copy of the given term using this data factory.
     * @param original An RDF term.
     * @return A deep copy of the given term.
     */
    fromTerm(original) {
        // TODO: remove nasty any casts when this TS bug has been fixed:
        //  https://github.com/microsoft/TypeScript/issues/26933
        switch (original.termType) {
            case 'NamedNode':
                return this.namedNode(original.value);
            case 'BlankNode':
                return this.blankNode(original.value);
            case 'Literal':
                if (original.language) {
                    return this.literal(original.value, original.language);
                }
                if (!original.datatype.equals(Literal_1.Literal.XSD_STRING)) {
                    return this.literal(original.value, this.fromTerm(original.datatype));
                }
                return this.literal(original.value);
            case 'Variable':
                return this.variable(original.value);
            case 'DefaultGraph':
                return this.defaultGraph();
            case 'Quad':
                return this.quad(this.fromTerm(original.subject), this.fromTerm(original.predicate), this.fromTerm(original.object), this.fromTerm(original.graph));
        }
    }
    /**
     * Create a deep copy of the given quad using this data factory.
     * @param original An RDF quad.
     * @return A deep copy of the given quad.
     */
    fromQuad(original) {
        return this.fromTerm(original);
    }
    /**
     * Reset the internal blank node counter.
     */
    resetBlankNodeCounter() {
        this.blankNodeCounter = 0;
    }
}
exports.DataFactory = DataFactory;

},{"./BlankNode":3,"./DefaultGraph":5,"./Literal":6,"./NamedNode":7,"./Quad":8,"./Variable":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultGraph = void 0;
/**
 * A singleton term instance that represents the default graph.
 * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
 */
class DefaultGraph {
    constructor() {
        this.termType = 'DefaultGraph';
        this.value = '';
        // Private constructor
    }
    equals(other) {
        return !!other && other.termType === 'DefaultGraph';
    }
}
exports.DefaultGraph = DefaultGraph;
DefaultGraph.INSTANCE = new DefaultGraph();

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Literal = void 0;
const NamedNode_1 = require("./NamedNode");
/**
 * A term that represents an RDF literal, containing a string with an optional language tag or datatype.
 */
class Literal {
    constructor(value, languageOrDatatype) {
        this.termType = 'Literal';
        this.value = value;
        if (typeof languageOrDatatype === 'string') {
            this.language = languageOrDatatype;
            this.datatype = Literal.RDF_LANGUAGE_STRING;
        }
        else if (languageOrDatatype) {
            this.language = '';
            this.datatype = languageOrDatatype;
        }
        else {
            this.language = '';
            this.datatype = Literal.XSD_STRING;
        }
    }
    equals(other) {
        return !!other && other.termType === 'Literal' && other.value === this.value &&
            other.language === this.language && other.datatype.equals(this.datatype);
    }
}
exports.Literal = Literal;
Literal.RDF_LANGUAGE_STRING = new NamedNode_1.NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
Literal.XSD_STRING = new NamedNode_1.NamedNode('http://www.w3.org/2001/XMLSchema#string');

},{"./NamedNode":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedNode = void 0;
/**
 * A term that contains an IRI.
 */
class NamedNode {
    constructor(value) {
        this.termType = 'NamedNode';
        this.value = value;
    }
    equals(other) {
        return !!other && other.termType === 'NamedNode' && other.value === this.value;
    }
}
exports.NamedNode = NamedNode;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quad = void 0;
/**
 * An instance of DefaultGraph represents the default graph.
 * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
 */
class Quad {
    constructor(subject, predicate, object, graph) {
        this.termType = 'Quad';
        this.value = '';
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.graph = graph;
    }
    equals(other) {
        // `|| !other.termType` is for backwards-compatibility with old factories without RDF* support.
        return !!other && (other.termType === 'Quad' || !other.termType) &&
            this.subject.equals(other.subject) &&
            this.predicate.equals(other.predicate) &&
            this.object.equals(other.object) &&
            this.graph.equals(other.graph);
    }
}
exports.Quad = Quad;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
/**
 * A term that represents a variable.
 */
class Variable {
    constructor(value) {
        this.termType = 'Variable';
        this.value = value;
    }
    equals(other) {
        return !!other && other.termType === 'Variable' && other.value === this.value;
    }
}
exports.Variable = Variable;

},{}],10:[function(require,module,exports){
var XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';
var XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';

function Generator(options) {
  this._options = options = options || {};

  var prefixes = options.prefixes || {};
  this._prefixByIri = {};
  var prefixIris = [];
  for (var prefix in prefixes) {
    var iri = prefixes[prefix];
    if (isString(iri)) {
      this._prefixByIri[iri] = prefix;
      prefixIris.push(iri);
    }
  }
  var iriList = prefixIris.join('|').replace(/[\]\/\(\)\*\+\?\.\\\$]/g, '\\$&');
  this._prefixRegex = new RegExp('^(' + iriList + ')([a-zA-Z][\\-_a-zA-Z0-9]*)$');
  this._usedPrefixes = {};
  this._sparqlStar = options.sparqlStar;
  this._indent =  isString(options.indent)  ? options.indent  : '  ';
  this._newline = isString(options.newline) ? options.newline : '\n';
  this._explicitDatatype = Boolean(options.explicitDatatype);
}

// Converts the parsed query object into a SPARQL query
Generator.prototype.toQuery = function (q) {
  var query = '';

  if (q.queryType)
    query += q.queryType.toUpperCase() + ' ';
  if (q.reduced)
    query += 'REDUCED ';
  if (q.distinct)
    query += 'DISTINCT ';

  if (q.variables){
    query += mapJoin(q.variables, undefined, function (variable) {
      return isTerm(variable) ? this.toEntity(variable) :
             '(' + this.toExpression(variable.expression) + ' AS ' + variableToString(variable.variable) + ')';
    }, this) + ' ';
  }
  else if (q.template)
    query += this.group(q.template, true) + this._newline;

  if (q.from)
    query += this.graphs('FROM ', q.from.default) + this.graphs('FROM NAMED ', q.from.named);
  if (q.where)
    query += 'WHERE ' + this.group(q.where, true) + this._newline;

  if (q.updates)
    query += mapJoin(q.updates, ';' + this._newline, this.toUpdate, this);

  if (q.group)
    query += 'GROUP BY ' + mapJoin(q.group, undefined, function (it) {
      var result = isString(it.expression) ? it.expression : '(' + this.toExpression(it.expression) + ')';
      return it.variable ? '(' + result + ' AS ' + variableToString(it.variable) + ')' : result;
    }, this) + this._newline;
  if (q.having)
    query += 'HAVING (' + mapJoin(q.having, undefined, this.toExpression, this) + ')' + this._newline;
  if (q.order)
    query += 'ORDER BY ' + mapJoin(q.order, undefined, function (it) {
      var expr = '(' + this.toExpression(it.expression) + ')';
      return !it.descending ? expr : 'DESC ' + expr;
    }, this) + this._newline;

  if (q.offset)
    query += 'OFFSET ' + q.offset + this._newline;
  if (q.limit)
    query += 'LIMIT ' + q.limit + this._newline;

  if (q.values)
    query += this.values(q);

  // stringify prefixes at the end to mark used ones
  query = this.baseAndPrefixes(q) + query;
  return query.trim();
};

Generator.prototype.baseAndPrefixes = function (q) {
  var base = q.base ? ('BASE <' + q.base + '>' + this._newline) : '';
  var prefixes = '';
  for (var key in q.prefixes) {
    if (this._options.allPrefixes || this._usedPrefixes[key])
      prefixes += 'PREFIX ' + key + ': <' + q.prefixes[key] + '>' + this._newline;
  }
  return base + prefixes;
};

// Converts the parsed SPARQL pattern into a SPARQL pattern
Generator.prototype.toPattern = function (pattern) {
  var type = pattern.type || (pattern instanceof Array) && 'array' ||
             (pattern.subject && pattern.predicate && pattern.object ? 'triple' : '');
  if (!(type in this))
    throw new Error('Unknown entry type: ' + type);
  return this[type](pattern);
};

Generator.prototype.triple = function (t) {
  return this.toEntity(t.subject) + ' ' + this.toEntity(t.predicate) + ' ' + this.toEntity(t.object) + '.';
};

Generator.prototype.array = function (items) {
  return mapJoin(items, this._newline, this.toPattern, this);
};

Generator.prototype.bgp = function (bgp) {
  return this.encodeTriples(bgp.triples);
};

Generator.prototype.encodeTriples = function (triples) {
  if (!triples.length)
    return '';

  var parts = [], subject = undefined, predicate = undefined;
  for (var i = 0; i < triples.length; i++) {
    var triple = triples[i];
    // Triple with different subject
    if (!equalTerms(triple.subject, subject)) {
      // Terminate previous triple
      if (subject)
        parts.push('.' + this._newline);
      subject = triple.subject;
      predicate = triple.predicate;
      parts.push(this.toEntity(subject), ' ', this.toEntity(predicate));
    }
    // Triple with same subject but different predicate
    else if (!equalTerms(triple.predicate, predicate)) {
      predicate = triple.predicate;
      parts.push(';' + this._newline, this._indent, this.toEntity(predicate));
    }
    // Triple with same subject and predicate
    else {
      parts.push(',');
    }
    parts.push(' ', this.toEntity(triple.object));
  }
  parts.push('.');

  return parts.join('');
}

Generator.prototype.graph = function (graph) {
  return 'GRAPH ' + this.toEntity(graph.name) + ' ' + this.group(graph);
};

Generator.prototype.graphs = function (keyword, graphs) {
  return !graphs || graphs.length === 0 ? '' :
    mapJoin(graphs, '', function (g) { return keyword + this.toEntity(g) + this._newline; }, this)
}

Generator.prototype.group = function (group, inline) {
  group = inline !== true ? this.array(group.patterns || group.triples)
                          : this.toPattern(group.type !== 'group' ? group : group.patterns);
  return group.indexOf(this._newline) === -1 ? '{ ' + group + ' }' : '{' + this._newline + this.indent(group) + this._newline + '}';
};

Generator.prototype.query = function (query) {
  return this.toQuery(query);
};

Generator.prototype.filter = function (filter) {
  return 'FILTER(' + this.toExpression(filter.expression) + ')';
};

Generator.prototype.bind = function (bind) {
  return 'BIND(' + this.toExpression(bind.expression) + ' AS ' + variableToString(bind.variable) + ')';
};

Generator.prototype.optional = function (optional) {
  return 'OPTIONAL ' + this.group(optional);
};

Generator.prototype.union = function (union) {
  return mapJoin(union.patterns, this._newline + 'UNION' + this._newline, function (p) { return this.group(p, true); }, this);
};

Generator.prototype.minus = function (minus) {
  return 'MINUS ' + this.group(minus);
};

Generator.prototype.values = function (valuesList) {
  // Gather unique keys
  var keys = Object.keys(valuesList.values.reduce(function (keyHash, values) {
    for (var key in values) keyHash[key] = true;
    return keyHash;
  }, {}));
  // Check whether simple syntax can be used
  var lparen, rparen;
  if (keys.length === 1) {
    lparen = rparen = '';
  } else {
    lparen = '(';
    rparen = ')';
  }
  // Create value rows
  return 'VALUES ' + lparen + keys.join(' ') + rparen + ' {' + this._newline +
    mapJoin(valuesList.values, this._newline, function (values) {
      return '  ' + lparen + mapJoin(keys, undefined, function (key) {
        return values[key] ? this.toEntity(values[key]) : 'UNDEF';
      }, this) + rparen;
    }, this) + this._newline + '}';
};

Generator.prototype.service = function (service) {
  return 'SERVICE ' + (service.silent ? 'SILENT ' : '') + this.toEntity(service.name) + ' ' +
         this.group(service);
};

// Converts the parsed expression object into a SPARQL expression
Generator.prototype.toExpression = function (expr) {
  if (isTerm(expr)) {
    return this.toEntity(expr);
  }
  switch (expr.type.toLowerCase()) {
    case 'aggregate':
      return expr.aggregation.toUpperCase() +
             '(' + (expr.distinct ? 'DISTINCT ' : '') + this.toExpression(expr.expression) +
             (expr.separator ? '; SEPARATOR = ' + '"' + expr.separator.replace(escape, escapeReplacer) + '"' : '') + ')';
    case 'functioncall':
      return this.toEntity(expr.function) + '(' + mapJoin(expr.args, ', ', this.toExpression, this) + ')';
    case 'operation':
      var operator = expr.operator.toUpperCase(), args = expr.args || [];
      switch (expr.operator.toLowerCase()) {
      // Infix operators
      case '<':
      case '>':
      case '>=':
      case '<=':
      case '&&':
      case '||':
      case '=':
      case '!=':
      case '+':
      case '-':
      case '*':
      case '/':
          return (isTerm(args[0]) ? this.toEntity(args[0]) : '(' + this.toExpression(args[0]) + ')') +
                 ' ' + operator + ' ' +
                 (isTerm(args[1]) ? this.toEntity(args[1]) : '(' + this.toExpression(args[1]) + ')');
      // Unary operators
      case '!':
        return '!(' + this.toExpression(args[0]) + ')';
      case 'uminus':
        return '-(' + this.toExpression(args[0]) + ')';
      // IN and NOT IN
      case 'notin':
        operator = 'NOT IN';
      case 'in':
        return this.toExpression(args[0]) + ' ' + operator +
               '(' + (isString(args[1]) ? args[1] : mapJoin(args[1], ', ', this.toExpression, this)) + ')';
      // EXISTS and NOT EXISTS
      case 'notexists':
        operator = 'NOT EXISTS';
      case 'exists':
        return operator + ' ' + this.group(args[0], true);
      // Other expressions
      default:
        return operator + '(' + mapJoin(args, ', ', this.toExpression, this) + ')';
      }
    default:
      throw new Error('Unknown expression type: ' + expr.type);
  }
};

// Converts the parsed entity (or property path) into a SPARQL entity
Generator.prototype.toEntity = function (value) {
  if (isTerm(value)) {
    switch (value.termType) {
    // variable, * selector, or blank node
    case 'Wildcard':
      return '*';
    case 'Variable':
      return variableToString(value);
    case 'BlankNode':
      return '_:' + value.value;
    // literal
    case 'Literal':
      var lexical = value.value || '', language = value.language || '', datatype = value.datatype;
      value = '"' + lexical.replace(escape, escapeReplacer) + '"';
      if (language){
        value += '@' + language;
      } else if (datatype) {
        // Abbreviate literals when possible
        if (!this._explicitDatatype) {
          switch (datatype.value) {
          case XSD_STRING:
            return value;
          case XSD_INTEGER:
            if (/^\d+$/.test(lexical))
              // Add space to avoid confusion with decimals in broken parsers
              return lexical + ' ';
          }
        }
        value += '^^' + this.encodeIRI(datatype.value);
      }
      return value;
    case 'Quad':
      if (!this._sparqlStar)
          throw new Error('SPARQL* support is not enabled');

      if (value.graph && value.graph.termType !== "DefaultGraph") {
        return '<< GRAPH ' +
          this.toEntity(value.graph) +
          ' { ' +
          this.toEntity(value.subject) + ' ' +
          this.toEntity(value.predicate) + ' ' +
          this.toEntity(value.object) +
          ' } ' +
          ' >>'
      }
      else {
        return (
          '<< ' +
          this.toEntity(value.subject) + ' ' +
          this.toEntity(value.predicate) + ' ' +
          this.toEntity(value.object) +
          ' >>'
        );
      }
    // IRI
    default:
      return this.encodeIRI(value.value);
    }
  }
  // property path
  else {
    var items = value.items.map(this.toEntity, this), path = value.pathType;
    switch (path) {
    // prefix operator
    case '^':
    case '!':
      return path + items[0];
    // postfix operator
    case '*':
    case '+':
    case '?':
      return '(' + items[0] + path + ')';
    // infix operator
    default:
      return '(' + items.join(path) + ')';
    }
  }
};
var escape = /["\\\t\n\r\b\f]/g,
    escapeReplacer = function (c) { return escapeReplacements[c]; },
    escapeReplacements = { '\\': '\\\\', '"': '\\"', '\t': '\\t',
                           '\n': '\\n', '\r': '\\r', '\b': '\\b', '\f': '\\f' };

// Represent the IRI, as a prefixed name when possible
Generator.prototype.encodeIRI = function (iri) {
  var prefixMatch = this._prefixRegex.exec(iri);
  if (prefixMatch) {
    var prefix = this._prefixByIri[prefixMatch[1]];
    this._usedPrefixes[prefix] = true;
    return prefix + ':' + prefixMatch[2];
  }
  return '<' + iri + '>';
};

// Converts the parsed update object into a SPARQL update clause
Generator.prototype.toUpdate = function (update) {
  switch (update.type || update.updateType) {
  case 'load':
    return 'LOAD' + (update.source ? ' ' + this.toEntity(update.source) : '') +
           (update.destination ? ' INTO GRAPH ' + this.toEntity(update.destination) : '');
  case 'insert':
    return 'INSERT DATA '  + this.group(update.insert, true);
  case 'delete':
    return 'DELETE DATA '  + this.group(update.delete, true);
  case 'deletewhere':
    return 'DELETE WHERE ' + this.group(update.delete, true);
  case 'insertdelete':
    return (update.graph ? 'WITH ' + this.toEntity(update.graph) + this._newline : '') +
           (update.delete.length ? 'DELETE ' + this.group(update.delete, true) + this._newline : '') +
           (update.insert.length ? 'INSERT ' + this.group(update.insert, true) + this._newline : '') +
           (update.using ? this.graphs('USING ', update.using.default) : '') +
           (update.using ? this.graphs('USING NAMED ', update.using.named) : '') +
           'WHERE ' + this.group(update.where, true);
  case 'add':
  case 'copy':
  case 'move':
    return update.type.toUpperCase() + (update.source.default ? ' DEFAULT ' : ' ') +
           'TO ' + this.toEntity(update.destination.name);
  case 'create':
  case 'clear':
  case 'drop':
    return update.type.toUpperCase() + (update.silent ? ' SILENT ' : ' ') + (
      update.graph.default ? 'DEFAULT' :
      update.graph.named ? 'NAMED' :
      update.graph.all ? 'ALL' :
      ('GRAPH ' + this.toEntity(update.graph.name))
    );
  default:
    throw new Error('Unknown update query type: ' + update.type);
  }
};

// Indents each line of the string
Generator.prototype.indent = function(text) { return text.replace(/^/gm, this._indent); }

function variableToString(variable){
  return '?' + variable.value;
}

// Checks whether the object is a string
function isString(object) { return typeof object === 'string'; }

// Checks whether the object is a Term
function isTerm(object) {
  return typeof object.termType === 'string';
}

// Checks whether term1 and term2 are equivalent without `.equals()` prototype method
function equalTerms(term1, term2) {
  if (!term1 || !isTerm(term1)) { return false; }
  if (!term2 || !isTerm(term2)) { return false; }
  if (term1.termType !== term2.termType) { return false; }
  switch (term1.termType) {
    case 'Literal':
      return term1.value === term2.value
          && term1.language === term2.language
          && equalTerms(term1.datatype, term2.datatype);
    case 'Quad':
      return equalTerms(term1.subject, term2.subject)
          && equalTerms(term1.predicate, term2.predicate)
          && equalTerms(term1.object, term2.object)
          && equalTerms(term1.graph, term2.graph);
    default:
      return term1.value === term2.value;
  }
}

// Maps the array with the given function, and joins the results using the separator
function mapJoin(array, sep, func, self) {
  return array.map(func, self).join(isString(sep) ? sep : ' ');
}

/**
 * @param options {
 *   allPrefixes: boolean,
 *   indentation: string,
 *   newline: string
 * }
 */
module.exports = function SparqlGenerator(options = {}) {
  return {
    stringify: function (query) {
      var currentOptions = Object.create(options);
      currentOptions.prefixes = query.prefixes;
      return new Generator(currentOptions).toQuery(query);
    },
    createGenerator: function() { return new Generator(options); }
  };
};

},{}],11:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var SparqlParser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[6,12,15,28,41,50,55,107,117,120,122,123,132,133,138,322,323,324,325,326],$V1=[2,209],$V2=[107,117,120,122,123,132,133,138,322,323,324,325,326],$V3=[1,20],$V4=[1,29],$V5=[6,90],$V6=[45,46,58],$V7=[45,58],$V8=[1,58],$V9=[1,60],$Va=[1,56],$Vb=[1,59],$Vc=[1,65],$Vd=[1,66],$Ve=[26,34,35],$Vf=[13,16,312],$Vg=[119,141,320,327],$Vh=[13,16,119,141,312],$Vi=[1,88],$Vj=[1,92],$Vk=[1,94],$Vl=[119,141,320,321,327],$Vm=[13,16,119,141,312,321],$Vn=[1,100],$Vo=[2,251],$Vp=[1,99],$Vq=[13,16,34,35,87,93,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$Vr=[6,45,46,58,68,75,78,86,88,90],$Vs=[6,13,16,34,45,46,58,68,75,78,86,88,90,312],$Vt=[6,13,16,26,34,35,37,38,45,46,48,58,68,75,78,86,87,88,90,93,100,116,119,132,133,135,140,167,168,170,173,174,191,195,219,224,226,227,231,235,245,246,250,254,258,273,278,295,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328,330,331,333,334,335,336,337,338,339,340],$Vu=[34,35,45,46,58],$Vv=[13,16,34,35,87,275,276,277,279,281,282,284,285,288,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,340,341,342,343,344,345],$Vw=[2,454],$Vx=[1,123],$Vy=[1,117],$Vz=[1,124],$VA=[1,125],$VB=[6,13,16,34,35,46,48,87,90,93,119,167,168,170,173,174,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$VC=[2,310],$VD=[1,142],$VE=[1,140],$VF=[6,191],$VG=[2,327],$VH=[2,315],$VI=[45,135],$VJ=[6,48,78,86,88,90],$VK=[2,255],$VL=[1,156],$VM=[1,158],$VN=[6,48,75,78,86,88,90],$VO=[2,253],$VP=[1,164],$VQ=[1,176],$VR=[1,174],$VS=[1,184],$VT=[1,182],$VU=[1,175],$VV=[1,180],$VW=[1,181],$VX=[1,185],$VY=[1,186],$VZ=[1,189],$V_=[1,190],$V$=[1,191],$V01=[1,192],$V11=[1,193],$V21=[1,194],$V31=[1,195],$V41=[1,196],$V51=[1,197],$V61=[1,198],$V71=[1,199],$V81=[6,68,75,78,86,88,90],$V91=[37,38,191,250,278],$Va1=[37,38,191,250,254,278],$Vb1=[37,38,191,250,254,258,273,278,295,306,307,308,309,310,311,334,335,336,337,338,339,340],$Vc1=[26,37,38,191,250,254,258,273,278,295,306,307,308,309,310,311,331,334,335,336,337,338,339,340],$Vd1=[1,229],$Ve1=[1,230],$Vf1=[1,232],$Vg1=[1,233],$Vh1=[1,234],$Vi1=[1,235],$Vj1=[1,237],$Vk1=[1,238],$Vl1=[2,461],$Vm1=[1,240],$Vn1=[1,241],$Vo1=[1,242],$Vp1=[1,248],$Vq1=[1,243],$Vr1=[1,244],$Vs1=[1,245],$Vt1=[1,246],$Vu1=[1,247],$Vv1=[13,16,48,87,100,231,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$Vw1=[48,93],$Vx1=[34,38],$Vy1=[6,116,191],$Vz1=[48,119],$VA1=[6,48,86,88,90],$VB1=[2,339],$VC1=[2,331],$VD1=[1,293],$VE1=[1,295],$VF1=[48,119,328],$VG1=[13,16,34,195,312],$VH1=[13,16,34,35,38,46,48,87,90,93,119,167,168,170,173,174,191,195,219,224,226,227,231,235,245,246,278,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$VI1=[13,16,26,34,35,37,38,46,48,87,90,93,100,119,167,168,170,173,174,191,195,219,224,226,227,231,235,245,246,250,254,258,273,278,295,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328,331,334,335,336,337,338,339,340],$VJ1=[13,16,26,34,35,37,38,46,48,87,90,93,100,119,167,168,170,173,174,191,195,219,224,226,227,231,235,245,246,250,254,258,273,278,295,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328,331,334,335,336,337,338,339,340],$VK1=[13,16,34,35,87,219,273,275,276,277,279,281,282,284,285,288,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,334,340,341,342,343,344,345],$VL1=[1,329],$VM1=[1,330],$VN1=[1,332],$VO1=[1,331],$VP1=[6,13,16,26,34,35,37,38,46,48,75,78,81,83,86,87,88,90,93,119,167,168,170,173,174,191,226,231,245,246,250,254,258,273,275,276,277,278,279,281,282,284,285,288,290,295,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328,331,334,335,336,337,338,339,340,341,342,343,344,345],$VQ1=[1,340],$VR1=[1,339],$VS1=[35,93],$VT1=[1,353],$VU1=[1,354],$VV1=[1,367],$VW1=[6,48,90],$VX1=[6,13,16,35,48,78,86,88,90,275,276,277,279,281,282,284,285,288,290,312,340,341,342,343,344,345],$VY1=[6,13,16,34,35,46,48,78,81,83,86,87,88,90,93,119,167,168,170,173,174,226,231,245,246,275,276,277,279,281,282,284,285,288,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328,340,341,342,343,344,345],$VZ1=[46,48,90,119,167,168,170,173,174],$V_1=[1,386],$V$1=[1,387],$V02=[1,393],$V12=[1,392],$V22=[48,119,191,227,328],$V32=[13,16,34,35,38,87,93,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$V42=[13,16,34,35,38,48,87,93,119,191,226,227,231,245,246,278,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$V52=[13,16,26,34,35,87,219,273,275,276,277,279,281,282,284,285,288,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,334,340,341,342,343,344,345],$V62=[13,16,38,48,87,100,231,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$V72=[35,48],$V82=[2,330],$V92=[1,451],$Va2=[1,448],$Vb2=[1,449],$Vc2=[6,13,16,26,34,35,37,38,46,48,68,75,78,81,83,86,87,88,90,93,119,167,168,170,173,174,191,226,231,245,246,250,254,258,273,275,276,277,278,279,281,282,284,285,288,290,295,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328,329,331,334,335,336,337,338,339,340,341,342,343,344,345],$Vd2=[13,16,35,195,219,224,312],$Ve2=[2,387],$Vf2=[1,469],$Vg2=[46,48,90,119,167,168,170,173,174,328],$Vh2=[13,16,34,35,195,219,224,312],$Vi2=[6,13,16,34,35,48,75,78,86,88,90,275,276,277,279,281,282,284,285,288,290,312,340,341,342,343,344,345],$Vj2=[13,16,34,35,38,48,87,93,119,191,195,226,227,231,245,246,278,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$Vk2=[6,13,16,34,35,48,81,83,86,88,90,275,276,277,279,281,282,284,285,288,290,312,340,341,342,343,344,345],$Vl2=[13,16,34,35,46,48,87,90,93,119,167,168,170,173,174,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$Vm2=[13,16,34,312],$Vn2=[13,16,34,35,46,48,87,90,93,119,167,168,170,173,174,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$Vo2=[2,342],$Vp2=[13,16,34,35,38,46,48,87,90,93,119,167,168,170,173,174,191,226,227,231,245,246,278,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$Vq2=[13,16,34,35,37,38,46,48,87,90,93,119,167,168,170,173,174,191,195,219,224,226,227,231,235,245,246,278,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$Vr2=[2,337],$Vs2=[13,16,35,195,219,312],$Vt2=[13,16,34,35,38,46,48,87,90,93,119,167,168,170,173,174,191,195,219,224,226,227,231,245,246,278,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328],$Vu2=[13,16,38,87,100,231,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$Vv2=[46,48,90,119,167,168,170,173,174,191,227,328],$Vw2=[13,16,34,38,48,87,100,195,231,235,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$Vx2=[13,16,34,35,48,87,93,119,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312],$Vy2=[13,16,34,35,38,87,93,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312,330,331],$Vz2=[13,16,26,34,35,38,87,93,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312,330,331,333,334],$VA2=[1,630],$VB2=[1,631],$VC2=[2,325],$VD2=[13,16,38,195,224,312];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"QueryOrUpdate":3,"Prologue":4,"QueryOrUpdate_group0":5,"EOF":6,"Prologue_repetition0":7,"Query":8,"Query_group0":9,"Query_option0":10,"BaseDecl":11,"BASE":12,"IRIREF":13,"PrefixDecl":14,"PREFIX":15,"PNAME_NS":16,"SelectQuery":17,"SelectClauseWildcard":18,"SelectQuery_repetition0":19,"WhereClause":20,"SolutionModifierNoGroup":21,"SelectClauseVars":22,"SelectQuery_repetition1":23,"SolutionModifier":24,"SelectClauseBase":25,"*":26,"SelectClauseVars_repetition_plus0":27,"SELECT":28,"SelectClauseBase_option0":29,"SubSelect":30,"SubSelect_option0":31,"SubSelect_option1":32,"SelectClauseItem":33,"VAR":34,"(":35,"Expression":36,"AS":37,")":38,"VarTriple":39,"ConstructQuery":40,"CONSTRUCT":41,"ConstructTemplate":42,"ConstructQuery_repetition0":43,"ConstructQuery_repetition1":44,"WHERE":45,"{":46,"ConstructQuery_option0":47,"}":48,"DescribeQuery":49,"DESCRIBE":50,"DescribeQuery_group0":51,"DescribeQuery_repetition0":52,"DescribeQuery_option0":53,"AskQuery":54,"ASK":55,"AskQuery_repetition0":56,"DatasetClause":57,"FROM":58,"DatasetClause_option0":59,"iri":60,"WhereClause_option0":61,"GroupGraphPattern":62,"SolutionModifier_option0":63,"SolutionModifierNoGroup_option0":64,"SolutionModifierNoGroup_option1":65,"SolutionModifierNoGroup_option2":66,"GroupClause":67,"GROUP":68,"BY":69,"GroupClause_repetition_plus0":70,"GroupCondition":71,"BuiltInCall":72,"FunctionCall":73,"HavingClause":74,"HAVING":75,"HavingClause_repetition_plus0":76,"OrderClause":77,"ORDER":78,"OrderClause_repetition_plus0":79,"OrderCondition":80,"ASC":81,"BrackettedExpression":82,"DESC":83,"Constraint":84,"LimitOffsetClauses":85,"LIMIT":86,"INTEGER":87,"OFFSET":88,"ValuesClause":89,"VALUES":90,"InlineData":91,"InlineData_repetition0":92,"NIL":93,"InlineData_repetition1":94,"InlineData_repetition_plus2":95,"InlineData_repetition3":96,"DataBlockValue":97,"Literal":98,"ConstTriple":99,"UNDEF":100,"DataBlockValueList":101,"DataBlockValueList_repetition_plus0":102,"Update":103,"Update_repetition0":104,"Update1":105,"Update_option0":106,"LOAD":107,"Update1_option0":108,"Update1_option1":109,"Update1_group0":110,"Update1_option2":111,"GraphRefAll":112,"Update1_group1":113,"Update1_option3":114,"GraphOrDefault":115,"TO":116,"CREATE":117,"Update1_option4":118,"GRAPH":119,"INSERTDATA":120,"QuadPattern":121,"DELETEDATA":122,"DELETEWHERE":123,"Update1_option5":124,"InsertClause":125,"Update1_option6":126,"Update1_repetition0":127,"Update1_option7":128,"DeleteClause":129,"Update1_option8":130,"Update1_repetition1":131,"DELETE":132,"INSERT":133,"UsingClause":134,"USING":135,"UsingClause_option0":136,"WithClause":137,"WITH":138,"IntoGraphClause":139,"INTO":140,"DEFAULT":141,"GraphOrDefault_option0":142,"GraphRefAll_group0":143,"QuadPattern_option0":144,"QuadPattern_repetition0":145,"QuadsNotTriples":146,"QuadsNotTriples_group0":147,"QuadsNotTriples_option0":148,"QuadsNotTriples_option1":149,"QuadsNotTriples_option2":150,"TriplesTemplate":151,"TriplesTemplate_repetition0":152,"TriplesSameSubject":153,"TriplesTemplate_option0":154,"GroupGraphPatternSub":155,"GroupGraphPatternSub_option0":156,"GroupGraphPatternSub_repetition0":157,"GroupGraphPatternSubTail":158,"GraphPatternNotTriples":159,"GroupGraphPatternSubTail_option0":160,"GroupGraphPatternSubTail_option1":161,"TriplesBlock":162,"TriplesBlock_repetition0":163,"TriplesSameSubjectPath":164,"TriplesBlock_option0":165,"GraphPatternNotTriples_repetition0":166,"OPTIONAL":167,"MINUS":168,"GraphPatternNotTriples_group0":169,"SERVICE":170,"GraphPatternNotTriples_option0":171,"GraphPatternNotTriples_group1":172,"FILTER":173,"BIND":174,"FunctionCall_option0":175,"FunctionCall_repetition0":176,"ExpressionList":177,"ExpressionList_repetition0":178,"ConstructTemplate_option0":179,"ConstructTriples":180,"ConstructTriples_repetition0":181,"ConstructTriples_option0":182,"TriplesSameSubject_group0":183,"PropertyListNotEmpty":184,"TriplesNode":185,"PropertyList":186,"PropertyList_option0":187,"VerbObjectList":188,"PropertyListNotEmpty_repetition0":189,"SemiOptionalVerbObjectList":190,";":191,"SemiOptionalVerbObjectList_option0":192,"Verb":193,"ObjectList":194,"a":195,"ObjectList_repetition0":196,"GraphNode":197,"ObjectListPath":198,"ObjectListPath_repetition0":199,"GraphNodePath":200,"TriplesSameSubjectPath_group0":201,"PropertyListPathNotEmpty":202,"TriplesNodePath":203,"TriplesSameSubjectPath_option0":204,"PropertyListPathNotEmpty_group0":205,"PropertyListPathNotEmpty_repetition0":206,"PropertyListPathNotEmpty_repetition1":207,"PropertyListPathNotEmptyTail":208,"PropertyListPathNotEmptyTail_group0":209,"Path":210,"Path_repetition0":211,"PathSequence":212,"PathSequence_repetition0":213,"PathEltOrInverse":214,"PathElt":215,"PathPrimary":216,"PathElt_option0":217,"PathEltOrInverse_option0":218,"!":219,"PathNegatedPropertySet":220,"PathOneInPropertySet":221,"PathNegatedPropertySet_repetition0":222,"PathNegatedPropertySet_option0":223,"^":224,"TriplesNode_repetition_plus0":225,"[":226,"]":227,"TriplesNodePath_repetition_plus0":228,"GraphNode_group0":229,"GraphNodePath_group0":230,"<<":231,"VarTriple_group0":232,"VarTriple_group1":233,"VarTriple_group2":234,">>":235,"VarTriple_group3":236,"VarTriple_group4":237,"ConstTriple_group0":238,"ConstTriple_group1":239,"ConstTriple_group2":240,"ConstTriple_group3":241,"ConstTriple_group4":242,"VarOrTerm":243,"Term":244,"BLANK_NODE_LABEL":245,"ANON":246,"ConditionalAndExpression":247,"Expression_repetition0":248,"ExpressionTail":249,"||":250,"RelationalExpression":251,"ConditionalAndExpression_repetition0":252,"ConditionalAndExpressionTail":253,"&&":254,"AdditiveExpression":255,"RelationalExpression_group0":256,"RelationalExpression_option0":257,"IN":258,"MultiplicativeExpression":259,"AdditiveExpression_repetition0":260,"AdditiveExpressionTail":261,"AdditiveExpressionTail_group0":262,"NumericLiteralPositive":263,"AdditiveExpressionTail_repetition0":264,"NumericLiteralNegative":265,"AdditiveExpressionTail_repetition1":266,"UnaryExpression":267,"MultiplicativeExpression_repetition0":268,"MultiplicativeExpressionTail":269,"MultiplicativeExpressionTail_group0":270,"UnaryExpression_option0":271,"PrimaryExpression":272,"-":273,"Aggregate":274,"FUNC_ARITY0":275,"FUNC_ARITY1":276,"FUNC_ARITY2":277,",":278,"IF":279,"BuiltInCall_group0":280,"BOUND":281,"BNODE":282,"BuiltInCall_option0":283,"EXISTS":284,"COUNT":285,"Aggregate_option0":286,"Aggregate_group0":287,"FUNC_AGGREGATE":288,"Aggregate_option1":289,"GROUP_CONCAT":290,"Aggregate_option2":291,"Aggregate_option3":292,"GroupConcatSeparator":293,"SEPARATOR":294,"=":295,"String":296,"LANGTAG":297,"^^":298,"DECIMAL":299,"DOUBLE":300,"BOOLEAN":301,"STRING_LITERAL1":302,"STRING_LITERAL2":303,"STRING_LITERAL_LONG1":304,"STRING_LITERAL_LONG2":305,"INTEGER_POSITIVE":306,"DECIMAL_POSITIVE":307,"DOUBLE_POSITIVE":308,"INTEGER_NEGATIVE":309,"DECIMAL_NEGATIVE":310,"DOUBLE_NEGATIVE":311,"PNAME_LN":312,"QueryOrUpdate_group0_option0":313,"Prologue_repetition0_group0":314,"SelectClauseBase_option0_group0":315,"DISTINCT":316,"REDUCED":317,"DescribeQuery_group0_repetition_plus0_group0":318,"DescribeQuery_group0_repetition_plus0":319,"NAMED":320,"SILENT":321,"CLEAR":322,"DROP":323,"ADD":324,"MOVE":325,"COPY":326,"ALL":327,".":328,"UNION":329,"|":330,"/":331,"PathElt_option0_group0":332,"?":333,"+":334,"!=":335,"<":336,">":337,"<=":338,">=":339,"NOT":340,"CONCAT":341,"COALESCE":342,"SUBSTR":343,"REGEX":344,"REPLACE":345,"$accept":0,"$end":1},
terminals_: {2:"error",6:"EOF",12:"BASE",13:"IRIREF",15:"PREFIX",16:"PNAME_NS",26:"*",28:"SELECT",34:"VAR",35:"(",37:"AS",38:")",41:"CONSTRUCT",45:"WHERE",46:"{",48:"}",50:"DESCRIBE",55:"ASK",58:"FROM",68:"GROUP",69:"BY",75:"HAVING",78:"ORDER",81:"ASC",83:"DESC",86:"LIMIT",87:"INTEGER",88:"OFFSET",90:"VALUES",93:"NIL",100:"UNDEF",107:"LOAD",116:"TO",117:"CREATE",119:"GRAPH",120:"INSERTDATA",122:"DELETEDATA",123:"DELETEWHERE",132:"DELETE",133:"INSERT",135:"USING",138:"WITH",140:"INTO",141:"DEFAULT",167:"OPTIONAL",168:"MINUS",170:"SERVICE",173:"FILTER",174:"BIND",191:";",195:"a",219:"!",224:"^",226:"[",227:"]",231:"<<",235:">>",245:"BLANK_NODE_LABEL",246:"ANON",250:"||",254:"&&",258:"IN",273:"-",275:"FUNC_ARITY0",276:"FUNC_ARITY1",277:"FUNC_ARITY2",278:",",279:"IF",281:"BOUND",282:"BNODE",284:"EXISTS",285:"COUNT",288:"FUNC_AGGREGATE",290:"GROUP_CONCAT",294:"SEPARATOR",295:"=",297:"LANGTAG",298:"^^",299:"DECIMAL",300:"DOUBLE",301:"BOOLEAN",302:"STRING_LITERAL1",303:"STRING_LITERAL2",304:"STRING_LITERAL_LONG1",305:"STRING_LITERAL_LONG2",306:"INTEGER_POSITIVE",307:"DECIMAL_POSITIVE",308:"DOUBLE_POSITIVE",309:"INTEGER_NEGATIVE",310:"DECIMAL_NEGATIVE",311:"DOUBLE_NEGATIVE",312:"PNAME_LN",316:"DISTINCT",317:"REDUCED",320:"NAMED",321:"SILENT",322:"CLEAR",323:"DROP",324:"ADD",325:"MOVE",326:"COPY",327:"ALL",328:".",329:"UNION",330:"|",331:"/",333:"?",334:"+",335:"!=",336:"<",337:">",338:"<=",339:">=",340:"NOT",341:"CONCAT",342:"COALESCE",343:"SUBSTR",344:"REGEX",345:"REPLACE"},
productions_: [0,[3,3],[4,1],[8,2],[11,2],[14,3],[17,4],[17,4],[18,2],[22,2],[25,2],[30,4],[30,4],[33,1],[33,5],[33,5],[40,5],[40,7],[49,5],[54,4],[57,3],[20,2],[24,2],[21,3],[67,3],[71,1],[71,1],[71,3],[71,5],[71,1],[74,2],[77,3],[80,2],[80,2],[80,1],[80,1],[85,2],[85,2],[85,4],[85,4],[89,2],[91,4],[91,4],[91,6],[97,1],[97,1],[97,1],[97,1],[101,3],[103,3],[105,4],[105,3],[105,5],[105,4],[105,2],[105,2],[105,2],[105,6],[105,6],[129,2],[125,2],[134,3],[137,2],[139,3],[115,1],[115,2],[112,2],[112,1],[121,4],[146,7],[151,3],[62,3],[62,3],[155,2],[158,3],[162,3],[159,2],[159,2],[159,2],[159,3],[159,4],[159,2],[159,6],[159,6],[159,1],[84,1],[84,1],[84,1],[73,2],[73,6],[177,1],[177,4],[42,3],[180,3],[153,2],[153,2],[186,1],[184,2],[190,2],[188,2],[193,1],[193,1],[193,1],[194,2],[198,2],[164,2],[164,2],[202,4],[208,1],[208,3],[210,2],[212,2],[215,2],[214,2],[216,1],[216,1],[216,2],[216,3],[220,1],[220,1],[220,4],[221,1],[221,1],[221,2],[221,2],[185,3],[185,3],[203,3],[203,3],[197,1],[197,1],[200,1],[200,1],[39,9],[39,5],[99,9],[99,5],[243,1],[243,1],[244,1],[244,1],[244,1],[244,1],[244,1],[36,2],[249,2],[247,2],[253,2],[251,1],[251,3],[251,4],[255,2],[261,2],[261,2],[261,2],[259,2],[269,2],[267,2],[267,2],[267,2],[272,1],[272,1],[272,1],[272,1],[272,1],[272,1],[82,3],[72,1],[72,2],[72,4],[72,6],[72,8],[72,2],[72,4],[72,2],[72,4],[72,3],[274,5],[274,5],[274,6],[293,4],[98,1],[98,2],[98,3],[98,1],[98,1],[98,1],[98,1],[98,1],[98,1],[296,1],[296,1],[296,1],[296,1],[263,1],[263,1],[263,1],[265,1],[265,1],[265,1],[60,1],[60,1],[60,1],[313,0],[313,1],[5,1],[5,1],[314,1],[314,1],[7,0],[7,2],[9,1],[9,1],[9,1],[9,1],[10,0],[10,1],[19,0],[19,2],[23,0],[23,2],[27,1],[27,2],[315,1],[315,1],[29,0],[29,1],[31,0],[31,1],[32,0],[32,1],[43,0],[43,2],[44,0],[44,2],[47,0],[47,1],[318,1],[318,1],[319,1],[319,2],[51,1],[51,1],[52,0],[52,2],[53,0],[53,1],[56,0],[56,2],[59,0],[59,1],[61,0],[61,1],[63,0],[63,1],[64,0],[64,1],[65,0],[65,1],[66,0],[66,1],[70,1],[70,2],[76,1],[76,2],[79,1],[79,2],[92,0],[92,2],[94,0],[94,2],[95,1],[95,2],[96,0],[96,2],[102,1],[102,2],[104,0],[104,4],[106,0],[106,2],[108,0],[108,1],[109,0],[109,1],[110,1],[110,1],[111,0],[111,1],[113,1],[113,1],[113,1],[114,0],[114,1],[118,0],[118,1],[124,0],[124,1],[126,0],[126,1],[127,0],[127,2],[128,0],[128,1],[130,0],[130,1],[131,0],[131,2],[136,0],[136,1],[142,0],[142,1],[143,1],[143,1],[143,1],[144,0],[144,1],[145,0],[145,2],[147,1],[147,1],[148,0],[148,1],[149,0],[149,1],[150,0],[150,1],[152,0],[152,3],[154,0],[154,1],[156,0],[156,1],[157,0],[157,2],[160,0],[160,1],[161,0],[161,1],[163,0],[163,3],[165,0],[165,1],[166,0],[166,3],[169,1],[169,1],[171,0],[171,1],[172,1],[172,1],[175,0],[175,1],[176,0],[176,3],[178,0],[178,3],[179,0],[179,1],[181,0],[181,3],[182,0],[182,1],[183,1],[183,1],[187,0],[187,1],[189,0],[189,2],[192,0],[192,1],[196,0],[196,3],[199,0],[199,3],[201,1],[201,1],[204,0],[204,1],[205,1],[205,1],[206,0],[206,3],[207,0],[207,2],[209,1],[209,1],[211,0],[211,3],[213,0],[213,3],[332,1],[332,1],[332,1],[217,0],[217,1],[218,0],[218,1],[222,0],[222,3],[223,0],[223,1],[225,1],[225,2],[228,1],[228,2],[229,1],[229,1],[230,1],[230,1],[232,1],[232,1],[233,1],[233,1],[234,1],[234,1],[236,1],[236,1],[237,1],[237,1],[238,1],[238,1],[239,1],[239,1],[240,1],[240,1],[241,1],[241,1],[242,1],[242,1],[248,0],[248,2],[252,0],[252,2],[256,1],[256,1],[256,1],[256,1],[256,1],[256,1],[257,0],[257,1],[260,0],[260,2],[262,1],[262,1],[264,0],[264,2],[266,0],[266,2],[268,0],[268,2],[270,1],[270,1],[271,0],[271,1],[280,1],[280,1],[280,1],[280,1],[280,1],[283,0],[283,1],[286,0],[286,1],[287,1],[287,1],[289,0],[289,1],[291,0],[291,1],[292,0],[292,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

      // Set parser options
      $$[$0-1] = $$[$0-1] || {};
      if (Parser.base)
        $$[$0-1].base = Parser.base;
      Parser.base = '';
      $$[$0-1].prefixes = Parser.prefixes;
      Parser.prefixes = null;

      // Ensure that blank nodes are not used across INSERT DATA clauses
      if ($$[$0-1].type === 'update') {
        const insertBnodesAll = {};
        for (const update of $$[$0-1].updates) {
          if (update.updateType === 'insert') {
            // Collect bnodes for current insert clause
            const insertBnodes = {};
            for (const operation of update.insert) {
              if (operation.type === 'bgp' || operation.type === 'graph') {
                for (const triple of operation.triples) {
                  if (triple.subject.termType === 'BlankNode')
                    insertBnodes[triple.subject.value] = true;
                  if (triple.predicate.termType === 'BlankNode')
                    insertBnodes[triple.predicate.value] = true;
                  if (triple.object.termType === 'BlankNode')
                    insertBnodes[triple.object.value] = true;
                }
              }
            }

            // Check if the inserting bnodes don't clash with bnodes from a previous insert clause
            for (const bnode of Object.keys(insertBnodes)) {
              if (insertBnodesAll[bnode]) {
                throw new Error('Detected reuse blank node across different INSERT DATA clauses');
              }
              insertBnodesAll[bnode] = true;
            }
          }
        }
      }

      return $$[$0-1];
    
break;
case 3:
this.$ = extend($$[$0-1], $$[$0], { type: 'query' });
break;
case 4:

      Parser.base = resolveIRI($$[$0])
    
break;
case 5:

      if (!Parser.prefixes) Parser.prefixes = {};
      $$[$0-1] = $$[$0-1].substr(0, $$[$0-1].length - 1);
      $$[$0] = resolveIRI($$[$0]);
      Parser.prefixes[$$[$0-1]] = $$[$0];
    
break;
case 6:
this.$ = extend($$[$0-3], groupDatasets($$[$0-2]), $$[$0-1], $$[$0]);
break;
case 7:

      // Check for projection of ungrouped variable
      if (!Parser.skipUngroupedVariableCheck) {
        const counts = flatten($$[$0-3].variables.map(vars => getAggregatesOfExpression(vars.expression)))
          .some(agg => agg.aggregation === "count" && !(agg.expression instanceof Wildcard));
        if (counts || $$[$0].group) {
          for (const selectVar of $$[$0-3].variables) {
            if (selectVar.termType === "Variable") {
              if (!$$[$0].group || !$$[$0].group.map(groupVar => getExpressionId(groupVar)).includes(getExpressionId(selectVar))) {
                throw Error("Projection of ungrouped variable (?" + getExpressionId(selectVar) + ")");
              }
            } else if (getAggregatesOfExpression(selectVar.expression).length === 0) {
              const usedVars = getVariablesFromExpression(selectVar.expression);
              for (const usedVar of usedVars) {
                if (!$$[$0].group.map(groupVar => getExpressionId(groupVar)).includes(getExpressionId(usedVar))) {
                  throw Error("Use of ungrouped variable in projection of operation (?" + getExpressionId(usedVar) + ")");
                }
              }
            }
          }
        }
      }
      // Check if id of each AS-selected column is not yet bound by subquery
      const subqueries = $$[$0-1].where.filter(w => w.type === "query");
      if (subqueries.length > 0) {
        const selectedVarIds = $$[$0-3].variables.filter(v => v.variable && v.variable.value).map(v => v.variable.value);
        const subqueryIds = flatten(subqueries.map(sub => sub.variables)).map(v => v.value || v.variable.value);
        for (const selectedVarId of selectedVarIds) {
          if (subqueryIds.indexOf(selectedVarId) >= 0) {
            throw Error("Target id of 'AS' (?" + selectedVarId + ") already used in subquery");
          }
        }
      }
      this.$ = extend($$[$0-3], groupDatasets($$[$0-2]), $$[$0-1], $$[$0])
    
break;
case 8:
this.$ = extend($$[$0-1], {variables: [new Wildcard()]});
break;
case 9:

      // Check if id of each selected column is different
      const selectedVarIds = $$[$0].map(v => v.value || v.variable.value);
      const duplicates = getDuplicatesInArray(selectedVarIds);
      if (duplicates.length > 0) {
        throw Error("Two or more of the resulting columns have the same name (?" + duplicates[0] + ")");
      }

      this.$ = extend($$[$0-1], { variables: $$[$0] })
    
break;
case 10:
this.$ = extend({ queryType: 'SELECT'}, $$[$0] && ($$[$0-1] = lowercase($$[$0]), $$[$0] = {}, $$[$0][$$[$0-1]] = true, $$[$0]));
break;
case 11: case 12:
this.$ = extend($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], { type: 'query' });
break;
case 13: case 100: case 137: case 165:
this.$ = toVar($$[$0]);
break;
case 14: case 28:
this.$ = expression($$[$0-3], { variable: toVar($$[$0-1]) });
break;
case 15:
this.$ = ensureSparqlStar(expression($$[$0-3], { variable: toVar($$[$0-1]) }));
break;
case 16:
this.$ = extend({ queryType: 'CONSTRUCT', template: $$[$0-3] }, groupDatasets($$[$0-2]), $$[$0-1], $$[$0]);
break;
case 17:
this.$ = extend({ queryType: 'CONSTRUCT', template: $$[$0-2] = ($$[$0-2] ? $$[$0-2].triples : []) }, groupDatasets($$[$0-5]), { where: [ { type: 'bgp', triples: appendAllTo([], $$[$0-2]) } ] }, $$[$0]);
break;
case 18:
this.$ = extend({ queryType: 'DESCRIBE', variables: $$[$0-3] === '*' ? [new Wildcard()] : $$[$0-3].map(toVar) }, groupDatasets($$[$0-2]), $$[$0-1], $$[$0]);
break;
case 19:
this.$ = extend({ queryType: 'ASK' }, groupDatasets($$[$0-2]), $$[$0-1], $$[$0]);
break;
case 20: case 61:
this.$ = { iri: $$[$0], named: !!$$[$0-1] };
break;
case 21:
this.$ = { where: $$[$0].patterns };
break;
case 22:
this.$ = extend($$[$0-1], $$[$0]);
break;
case 23:
this.$ = extend($$[$0-2], $$[$0-1], $$[$0]);
break;
case 24:
this.$ = { group: $$[$0] };
break;
case 25: case 26: case 32: case 34:
this.$ = expression($$[$0]);
break;
case 27:
this.$ = expression($$[$0-1]);
break;
case 29: case 35:
this.$ = expression(toVar($$[$0]));
break;
case 30:
this.$ = { having: $$[$0] };
break;
case 31:
this.$ = { order: $$[$0] };
break;
case 33:
this.$ = expression($$[$0], { descending: true });
break;
case 36:
this.$ = { limit:  toInt($$[$0]) };
break;
case 37:
this.$ = { offset: toInt($$[$0]) };
break;
case 38:
this.$ = { limit: toInt($$[$0-2]), offset: toInt($$[$0]) };
break;
case 39:
this.$ = { limit: toInt($$[$0]), offset: toInt($$[$0-2]) };
break;
case 40:
this.$ = { type: 'values', values: $$[$0] };
break;
case 41:

      this.$ = $$[$0-1].map(function(v) { var o = {}; o[$$[$0-3]] = v; return o; })
    
break;
case 42:

      this.$ = $$[$0-1].map(function() { return {}; })
    
break;
case 43:

      var length = $$[$0-4].length;
      $$[$0-4] = $$[$0-4].map(toVar);
      this.$ = $$[$0-1].map(function (values) {
        if (values.length !== length)
          throw Error('Inconsistent VALUES length');
        var valuesObject = {};
        for(var i = 0; i<length; i++)
          valuesObject['?' + $$[$0-4][i].value] = values[i];
        return valuesObject;
      });
    
break;
case 46:
this.$ = ensureSparqlStar($$[$0]);
break;
case 47:
this.$ = undefined;
break;
case 48: case 92: case 117: case 166:
this.$ = $$[$0-1];
break;
case 49:
this.$ = { type: 'update', updates: appendTo($$[$0-2], $$[$0-1]) };
break;
case 50:
this.$ = extend({ type: 'load', silent: !!$$[$0-2], source: $$[$0-1] }, $$[$0] && { destination: $$[$0] });
break;
case 51:
this.$ = { type: lowercase($$[$0-2]), silent: !!$$[$0-1], graph: $$[$0] };
break;
case 52:
this.$ = { type: lowercase($$[$0-4]), silent: !!$$[$0-3], source: $$[$0-2], destination: $$[$0] };
break;
case 53:
this.$ = { type: 'create', silent: !!$$[$0-2], graph: { type: 'graph', name: $$[$0] } };
break;
case 54:
this.$ = { updateType: 'insert',      insert: ensureNoVariables($$[$0])                 };
break;
case 55:
this.$ = { updateType: 'delete',      delete: ensureNoBnodes(ensureNoVariables($$[$0])) };
break;
case 56:
this.$ = { updateType: 'deletewhere', delete: ensureNoBnodes($$[$0])                    };
break;
case 57:
this.$ = extend({ updateType: 'insertdelete' }, $$[$0-5], { insert: $$[$0-4] || [] }, { delete: $$[$0-3] || [] }, groupDatasets($$[$0-2], 'using'), { where: $$[$0].patterns });
break;
case 58:
this.$ = extend({ updateType: 'insertdelete' }, $$[$0-5], { delete: $$[$0-4] || [] }, { insert: $$[$0-3] || [] }, groupDatasets($$[$0-2], 'using'), { where: $$[$0].patterns });
break;
case 59:
this.$ = ensureNoBnodes($$[$0]);
break;
case 60: case 63: case 157: case 180:
this.$ = $$[$0];
break;
case 62:
this.$ = { graph: $$[$0] };
break;
case 64:
this.$ = { type: 'graph', default: true };
break;
case 65: case 66:
this.$ = { type: 'graph', name: $$[$0] };
break;
case 67:
 this.$ = {}; this.$[lowercase($$[$0])] = true; 
break;
case 68:
this.$ = $$[$0-2] ? unionAll($$[$0-1], [$$[$0-2]]) : unionAll($$[$0-1]);
break;
case 69:

      var graph = extend($$[$0-3] || { triples: [] }, { type: 'graph', name: toVar($$[$0-5]) });
      this.$ = $$[$0] ? [graph, $$[$0]] : [graph];
    
break;
case 70: case 75:
this.$ = { type: 'bgp', triples: unionAll($$[$0-2], [$$[$0-1]]) };
break;
case 71:
this.$ = { type: 'group', patterns: [ $$[$0-1] ] };
break;
case 72:

      // For every binding
      for (const binding of $$[$0-1].filter(el => el.type === "bind")) {
        const index = $$[$0-1].indexOf(binding);
        const boundVars = new Set();
        //Collect all bounded variables before the binding
        for (const el of $$[$0-1].slice(0, index)) {
          if (el.type === "group" || el.type === "bgp") {
            getBoundVarsFromGroupGraphPattern(el).forEach(boundVar => boundVars.add(boundVar));
          }
        }
        // If binding with a non-free variable, throw error
        if (boundVars.has(binding.variable.value)) {
          throw Error("Variable used to bind is already bound (?" + binding.variable.value + ")");
        }
      }
      this.$ = { type: 'group', patterns: $$[$0-1] }
    
break;
case 73:
this.$ = $$[$0-1] ? unionAll([$$[$0-1]], $$[$0]) : unionAll($$[$0]);
break;
case 74:
this.$ = $$[$0] ? [$$[$0-2], $$[$0]] : $$[$0-2];
break;
case 76:

      if ($$[$0-1].length)
        this.$ = { type: 'union', patterns: unionAll($$[$0-1].map(degroupSingle), [degroupSingle($$[$0])]) };
      else
        this.$ = $$[$0];
    
break;
case 77:
this.$ = extend($$[$0], { type: 'optional' });
break;
case 78:
this.$ = extend($$[$0], { type: 'minus' });
break;
case 79:
this.$ = extend($$[$0], { type: 'graph', name: toVar($$[$0-1]) });
break;
case 80:
this.$ = extend($$[$0], { type: 'service', name: toVar($$[$0-1]), silent: !!$$[$0-2] });
break;
case 81:
this.$ = { type: 'filter', expression: $$[$0] };
break;
case 82:
this.$ = { type: 'bind', variable: toVar($$[$0-1]), expression: $$[$0-3] };
break;
case 83:
this.$ = ensureSparqlStar({ type: 'bind', variable: toVar($$[$0-1]), expression: $$[$0-3] });
break;
case 88:
this.$ = { type: 'functionCall', function: $$[$0-1], args: [] };
break;
case 89:
this.$ = { type: 'functionCall', function: $$[$0-5], args: appendTo($$[$0-2], $$[$0-1]), distinct: !!$$[$0-3] };
break;
case 90: case 108: case 119: case 209: case 217: case 219: case 231: case 233: case 243: case 247: case 267: case 269: case 273: case 277: case 300: case 306: case 317: case 327: case 333: case 339: case 343: case 353: case 355: case 359: case 367: case 371: case 373: case 381: case 383: case 387: case 389: case 398: case 430: case 432: case 442: case 446: case 448: case 450:
this.$ = [];
break;
case 91:
this.$ = appendTo($$[$0-2], $$[$0-1]);
break;
case 93:
this.$ = unionAll($$[$0-2], [$$[$0-1]]);
break;
case 94: case 105:
this.$ = $$[$0].map(function (t) { return extend(triple($$[$0-1]), t); });
break;
case 95:
this.$ = appendAllTo($$[$0].map(function (t) { return extend(triple($$[$0-1].entity), t); }), $$[$0-1].triples) /* the subject is a blank node, possibly with more triples */;
break;
case 97:
this.$ = unionAll([$$[$0-1]], $$[$0]);
break;
case 98:
this.$ = unionAll($$[$0]);
break;
case 99:
this.$ = objectListToTriples($$[$0-1], $$[$0]);
break;
case 102: case 115: case 122:
this.$ = Parser.factory.namedNode(RDF_TYPE);
break;
case 103: case 104:
this.$ = appendTo($$[$0-1], $$[$0]);
break;
case 106:
this.$ = !$$[$0] ? $$[$0-1].triples : appendAllTo($$[$0].map(function (t) { return extend(triple($$[$0-1].entity), t); }), $$[$0-1].triples) /* the subject is a blank node, possibly with more triples */;
break;
case 107:
this.$ = objectListToTriples(toVar($$[$0-3]), appendTo($$[$0-2], $$[$0-1]), $$[$0]);
break;
case 109:
this.$ = objectListToTriples(toVar($$[$0-1]), $$[$0]);
break;
case 110:
this.$ = $$[$0-1].length ? path('|',appendTo($$[$0-1], $$[$0])) : $$[$0];
break;
case 111:
this.$ = $$[$0-1].length ? path('/', appendTo($$[$0-1], $$[$0])) : $$[$0];
break;
case 112:
this.$ = $$[$0] ? path($$[$0], [$$[$0-1]]) : $$[$0-1];
break;
case 113:
this.$ = $$[$0-1] ? path($$[$0-1], [$$[$0]]) : $$[$0];;
break;
case 116: case 123:
this.$ = path($$[$0-1], [$$[$0]]);
break;
case 120:
this.$ = path('|', appendTo($$[$0-2], $$[$0-1]));
break;
case 124:
this.$ = path($$[$0-1], [Parser.factory.namedNode(RDF_TYPE)]);
break;
case 125: case 127:
this.$ = createList($$[$0-1]);
break;
case 126: case 128:
this.$ = createAnonymousObject($$[$0-1]);
break;
case 129:
this.$ = { entity: $$[$0], triples: [] } /* for consistency with TriplesNode */;
break;
case 131:
this.$ = { entity: $$[$0], triples: [] } /* for consistency with TriplesNodePath */;
break;
case 133: case 135:
this.$ = ensureSparqlStar(Parser.factory.quad($$[$0-4], $$[$0-3], $$[$0-2], toVar($$[$0-6])));
break;
case 134: case 136:
this.$ = ensureSparqlStar(Parser.factory.quad($$[$0-3], $$[$0-2], $$[$0-1]));
break;
case 141:
this.$ = blank($$[$0].replace(/^(_:)/,''));;
break;
case 142:
this.$ = blank();
break;
case 143:
this.$ = Parser.factory.namedNode(RDF_NIL);
break;
case 144: case 146: case 151: case 155:
this.$ = createOperationTree($$[$0-1], $$[$0]);
break;
case 145:
this.$ = ['||', $$[$0]];
break;
case 147:
this.$ = ['&&', $$[$0]];
break;
case 149:
this.$ = operation($$[$0-1], [$$[$0-2], $$[$0]]);
break;
case 150:
this.$ = operation($$[$0-2] ? 'notin' : 'in', [$$[$0-3], $$[$0]]);
break;
case 152: case 156:
this.$ = [$$[$0-1], $$[$0]];
break;
case 153:
this.$ = ['+', createOperationTree($$[$0-1], $$[$0])];
break;
case 154:

      var negatedLiteral = createTypedLiteral($$[$0-1].value.replace('-', ''), $$[$0-1].datatype);
      this.$ = ['-', createOperationTree(negatedLiteral, $$[$0])];
    
break;
case 158:
this.$ = operation($$[$0-1], [$$[$0]]);
break;
case 159:
this.$ = operation('UMINUS', [$$[$0]]);
break;
case 168:
this.$ = operation(lowercase($$[$0-1]));
break;
case 169:
this.$ = operation(lowercase($$[$0-3]), [$$[$0-1]]);
break;
case 170:
this.$ = operation(lowercase($$[$0-5]), [$$[$0-3], $$[$0-1]]);
break;
case 171:
this.$ = operation(lowercase($$[$0-7]), [$$[$0-5], $$[$0-3], $$[$0-1]]);
break;
case 172:
this.$ = operation(lowercase($$[$0-1]), $$[$0]);
break;
case 173:
this.$ = operation('bound', [toVar($$[$0-1])]);
break;
case 174:
this.$ = operation($$[$0-1], []);
break;
case 175:
this.$ = operation($$[$0-3], [$$[$0-1]]);
break;
case 176:
this.$ = operation($$[$0-2] ? 'notexists' :'exists', [degroupSingle($$[$0])]);
break;
case 177: case 178:
this.$ = expression($$[$0-1], { type: 'aggregate', aggregation: lowercase($$[$0-4]), distinct: !!$$[$0-2] });
break;
case 179:
this.$ = expression($$[$0-2], { type: 'aggregate', aggregation: lowercase($$[$0-5]), distinct: !!$$[$0-3], separator: $$[$0-1] || ' ' });
break;
case 181:
this.$ = createTypedLiteral($$[$0]);
break;
case 182:
this.$ = createLangLiteral($$[$0-1], lowercase($$[$0].substr(1)));
break;
case 183:
this.$ = createTypedLiteral($$[$0-2], $$[$0]);
break;
case 184: case 197:
this.$ = createTypedLiteral($$[$0], XSD_INTEGER);
break;
case 185: case 198:
this.$ = createTypedLiteral($$[$0], XSD_DECIMAL);
break;
case 186: case 199:
this.$ = createTypedLiteral(lowercase($$[$0]), XSD_DOUBLE);
break;
case 189:
this.$ = createTypedLiteral($$[$0].toLowerCase(), XSD_BOOLEAN);
break;
case 190: case 191:
this.$ = unescapeString($$[$0], 1);
break;
case 192: case 193:
this.$ = unescapeString($$[$0], 3);
break;
case 194:
this.$ = createTypedLiteral($$[$0].substr(1), XSD_INTEGER);
break;
case 195:
this.$ = createTypedLiteral($$[$0].substr(1), XSD_DECIMAL);
break;
case 196:
this.$ = createTypedLiteral($$[$0].substr(1).toLowerCase(), XSD_DOUBLE);
break;
case 200:
this.$ = Parser.factory.namedNode(resolveIRI($$[$0]));
break;
case 201:

      var namePos = $$[$0].indexOf(':'),
          prefix = $$[$0].substr(0, namePos),
          expansion = Parser.prefixes[prefix];
      if (!expansion) throw new Error('Unknown prefix: ' + prefix);
      var uriString = resolveIRI(expansion + $$[$0].substr(namePos + 1));
      this.$ = Parser.factory.namedNode(uriString);
    
break;
case 202:

      $$[$0] = $$[$0].substr(0, $$[$0].length - 1);
      if (!($$[$0] in Parser.prefixes)) throw new Error('Unknown prefix: ' + $$[$0]);
      var uriString = resolveIRI(Parser.prefixes[$$[$0]]);
      this.$ = Parser.factory.namedNode(uriString);
    
break;
case 210: case 218: case 220: case 222: case 232: case 234: case 240: case 244: case 248: case 262: case 264: case 266: case 268: case 270: case 272: case 274: case 276: case 301: case 307: case 318: case 334: case 368: case 384: case 403: case 405: case 431: case 433: case 443: case 447: case 449: case 451:
$$[$0-1].push($$[$0]);
break;
case 221: case 239: case 261: case 263: case 265: case 271: case 275: case 402: case 404:
this.$ = [$$[$0]];
break;
case 278:
$$[$0-3].push($$[$0-2]);
break;
case 328: case 340: case 344: case 354: case 356: case 360: case 372: case 374: case 382: case 388: case 390: case 399:
$$[$0-2].push($$[$0-1]);
break;
}
},
table: [o($V0,$V1,{3:1,4:2,7:3}),{1:[3]},o($V2,[2,277],{5:4,8:5,313:6,9:7,103:8,17:9,40:10,49:11,54:12,104:13,18:14,22:15,25:19,6:[2,203],28:$V3,41:[1,16],50:[1,17],55:[1,18]}),o([6,28,41,50,55,107,117,120,122,123,132,133,138,322,323,324,325,326],[2,2],{314:21,11:22,14:23,12:[1,24],15:[1,25]}),{6:[1,26]},{6:[2,205]},{6:[2,206]},{6:[2,215],10:27,89:28,90:$V4},{6:[2,204]},o($V5,[2,211]),o($V5,[2,212]),o($V5,[2,213]),o($V5,[2,214]),{105:30,107:[1,31],110:32,113:33,117:[1,34],120:[1,35],122:[1,36],123:[1,37],124:38,128:39,132:[2,302],133:[2,296],137:45,138:[1,46],322:[1,40],323:[1,41],324:[1,42],325:[1,43],326:[1,44]},o($V6,[2,217],{19:47}),o($V6,[2,219],{23:48}),o($V7,[2,233],{42:49,44:50,46:[1,51]}),{13:$V8,16:$V9,26:[1,54],34:$Va,51:52,60:57,312:$Vb,318:55,319:53},o($V6,[2,247],{56:61}),{26:[1,62],27:63,33:64,34:$Vc,35:$Vd},o($Ve,[2,225],{29:67,315:68,316:[1,69],317:[1,70]}),o($V0,[2,210]),o($V0,[2,207]),o($V0,[2,208]),{13:[1,71]},{16:[1,72]},{1:[2,1]},{6:[2,3]},{6:[2,216]},{34:[1,74],35:[1,76],91:73,93:[1,75]},{6:[2,279],106:77,191:[1,78]},o($Vf,[2,281],{108:79,321:[1,80]}),o($Vg,[2,287],{111:81,321:[1,82]}),o($Vh,[2,292],{114:83,321:[1,84]}),{118:85,119:[2,294],321:[1,86]},{46:$Vi,121:87},{46:$Vi,121:89},{46:$Vi,121:90},{125:91,133:$Vj},{129:93,132:$Vk},o($Vl,[2,285]),o($Vl,[2,286]),o($Vm,[2,289]),o($Vm,[2,290]),o($Vm,[2,291]),{132:[2,303],133:[2,297]},{13:$V8,16:$V9,60:95,312:$Vb},{20:96,45:$Vn,46:$Vo,57:97,58:$Vp,61:98},{20:101,45:$Vn,46:$Vo,57:102,58:$Vp,61:98},o($V6,[2,231],{43:103}),{45:[1,104],57:105,58:$Vp},o($Vq,[2,359],{179:106,180:107,181:108,48:[2,357]}),o($Vr,[2,243],{52:109}),o($Vr,[2,241],{60:57,318:110,13:$V8,16:$V9,34:$Va,312:$Vb}),o($Vr,[2,242]),o($Vs,[2,239]),o($Vs,[2,237]),o($Vs,[2,238]),o($Vt,[2,200]),o($Vt,[2,201]),o($Vt,[2,202]),{20:111,45:$Vn,46:$Vo,57:112,58:$Vp,61:98},o($V6,[2,8]),o($V6,[2,9],{33:113,34:$Vc,35:$Vd}),o($Vu,[2,221]),o($Vu,[2,13]),o($Vv,$Vw,{36:114,39:115,247:116,251:118,255:119,259:120,267:121,271:122,219:$Vx,231:$Vy,273:$Vz,334:$VA}),o($Ve,[2,10]),o($Ve,[2,226]),o($Ve,[2,223]),o($Ve,[2,224]),o($V0,[2,4]),{13:[1,126]},o($VB,[2,40]),{46:[1,127]},{46:[1,128]},{34:[1,130],95:129},{6:[2,49]},o($V0,$V1,{7:3,4:131}),{13:$V8,16:$V9,60:132,312:$Vb},o($Vf,[2,282]),{112:133,119:[1,134],141:[1,136],143:135,320:[1,137],327:[1,138]},o($Vg,[2,288]),o($Vf,$VC,{115:139,142:141,119:$VD,141:$VE}),o($Vh,[2,293]),{119:[1,143]},{119:[2,295]},o($VF,[2,54]),o($Vq,$VG,{144:144,151:145,152:146,48:$VH,119:$VH}),o($VF,[2,55]),o($VF,[2,56]),o($VI,[2,298],{126:147,129:148,132:$Vk}),{46:$Vi,121:149},o($VI,[2,304],{130:150,125:151,133:$Vj}),{46:$Vi,121:152},o([132,133],[2,62]),o($VJ,$VK,{21:153,64:154,74:155,75:$VL}),o($V6,[2,218]),{46:$VM,62:157},o($Vf,[2,249],{59:159,320:[1,160]}),{46:[2,252]},o($VN,$VO,{24:161,63:162,67:163,68:$VP}),o($V6,[2,220]),{20:165,45:$Vn,46:$Vo,57:166,58:$Vp,61:98},{46:[1,167]},o($V7,[2,234]),{48:[1,168]},{48:[2,358]},{13:$V8,16:$V9,34:$VQ,35:$VR,39:173,60:178,87:$VS,93:$VT,98:179,153:169,183:170,185:171,226:$VU,231:$Vy,243:172,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($V81,[2,245],{61:98,53:200,57:201,20:202,45:$Vn,46:$Vo,58:$Vp}),o($Vs,[2,240]),o($VN,$VO,{63:162,67:163,24:203,68:$VP}),o($V6,[2,248]),o($Vu,[2,222]),{37:[1,204]},{37:[1,205]},o($V91,[2,430],{248:206}),{13:$V8,16:$V9,34:$VQ,39:209,60:178,87:$VS,93:$VT,98:179,119:[1,207],231:$Vy,236:208,243:210,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Va1,[2,432],{252:211}),o($Va1,[2,148],{256:212,257:213,258:[2,440],295:[1,214],335:[1,215],336:[1,216],337:[1,217],338:[1,218],339:[1,219],340:[1,220]}),o($Vb1,[2,442],{260:221}),o($Vc1,[2,450],{268:222}),{13:$V8,16:$V9,34:$Vd1,35:$Ve1,60:226,72:225,73:227,82:224,87:$VS,98:228,263:187,265:188,272:223,274:231,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,280:236,281:$Vj1,282:$Vk1,283:239,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1},{13:$V8,16:$V9,34:$Vd1,35:$Ve1,60:226,72:225,73:227,82:224,87:$VS,98:228,263:187,265:188,272:249,274:231,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,280:236,281:$Vj1,282:$Vk1,283:239,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1},{13:$V8,16:$V9,34:$Vd1,35:$Ve1,60:226,72:225,73:227,82:224,87:$VS,98:228,263:187,265:188,272:250,274:231,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,280:236,281:$Vj1,282:$Vk1,283:239,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1},o($Vv,[2,455]),o($V0,[2,5]),o($Vv1,[2,267],{92:251}),o($Vw1,[2,269],{94:252}),{34:[1,254],38:[1,253]},o($Vx1,[2,271]),o($V2,[2,278],{6:[2,280]}),o($VF,[2,283],{109:255,139:256,140:[1,257]}),o($VF,[2,51]),{13:$V8,16:$V9,60:258,312:$Vb},o($VF,[2,67]),o($VF,[2,312]),o($VF,[2,313]),o($VF,[2,314]),{116:[1,259]},o($Vy1,[2,64]),{13:$V8,16:$V9,60:260,312:$Vb},o($Vf,[2,311]),{13:$V8,16:$V9,60:261,312:$Vb},o($Vz1,[2,317],{145:262}),o($Vz1,[2,316]),{13:$V8,16:$V9,34:$VQ,35:$VR,39:173,60:178,87:$VS,93:$VT,98:179,153:263,183:170,185:171,226:$VU,231:$Vy,243:172,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($VI,[2,300],{127:264}),o($VI,[2,299]),o([45,132,135],[2,60]),o($VI,[2,306],{131:265}),o($VI,[2,305]),o([45,133,135],[2,59]),o($V5,[2,6]),o($VA1,[2,257],{65:266,77:267,78:[1,268]}),o($VJ,[2,256]),{13:$V8,16:$V9,35:$Ve1,60:274,72:272,73:273,76:269,82:271,84:270,274:231,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,280:236,281:$Vj1,282:$Vk1,283:239,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1},o([6,48,68,75,78,86,88,90],[2,21]),o($Vq,$VB1,{25:19,30:275,155:276,18:277,22:278,156:279,162:280,163:281,28:$V3,46:$VC1,48:$VC1,90:$VC1,119:$VC1,167:$VC1,168:$VC1,170:$VC1,173:$VC1,174:$VC1}),{13:$V8,16:$V9,60:282,312:$Vb},o($Vf,[2,250]),o($V5,[2,7]),o($VJ,$VK,{64:154,74:155,21:283,75:$VL}),o($VN,[2,254]),{69:[1,284]},o($VN,$VO,{63:162,67:163,24:285,68:$VP}),o($V6,[2,232]),o($Vq,$VG,{152:146,47:286,151:287,48:[2,235]}),o($V6,[2,92]),{48:[2,361],182:288,328:[1,289]},{13:$V8,16:$V9,34:$VD1,60:294,184:290,188:291,193:292,195:$VE1,312:$Vb},o($VF1,[2,365],{188:291,193:292,60:294,186:296,187:297,184:298,13:$V8,16:$V9,34:$VD1,195:$VE1,312:$Vb}),o($VG1,[2,363]),o($VG1,[2,364]),{13:$V8,16:$V9,34:$VQ,35:$VR,39:304,60:178,87:$VS,93:$VT,98:179,185:302,197:300,225:299,226:$VU,229:301,231:$Vy,243:303,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},{13:$V8,16:$V9,34:$VD1,60:294,184:305,188:291,193:292,195:$VE1,312:$Vb},o($VH1,[2,137]),o($VH1,[2,138]),o($VH1,[2,139]),o($VH1,[2,140]),o($VH1,[2,141]),o($VH1,[2,142]),o($VH1,[2,143]),o($VI1,[2,181],{297:[1,306],298:[1,307]}),o($VI1,[2,184]),o($VI1,[2,185]),o($VI1,[2,186]),o($VI1,[2,187]),o($VI1,[2,188]),o($VI1,[2,189]),o($VJ1,[2,190]),o($VJ1,[2,191]),o($VJ1,[2,192]),o($VJ1,[2,193]),o($VI1,[2,194]),o($VI1,[2,195]),o($VI1,[2,196]),o($VI1,[2,197]),o($VI1,[2,198]),o($VI1,[2,199]),o($VN,$VO,{63:162,67:163,24:308,68:$VP}),o($Vr,[2,244]),o($V81,[2,246]),o($V5,[2,19]),{34:[1,309]},{34:[1,310]},o([37,38,191,278],[2,144],{249:311,250:[1,312]}),{13:$V8,16:$V9,34:[1,314],60:315,232:313,312:$Vb},{13:$V8,16:$V9,34:$VD1,60:294,193:316,195:$VE1,312:$Vb},o($VG1,[2,416]),o($VG1,[2,417]),o($V91,[2,146],{253:317,254:[1,318]}),o($Vv,$Vw,{259:120,267:121,271:122,255:319,219:$Vx,273:$Vz,334:$VA}),{258:[1,320]},o($VK1,[2,434]),o($VK1,[2,435]),o($VK1,[2,436]),o($VK1,[2,437]),o($VK1,[2,438]),o($VK1,[2,439]),{258:[2,441]},o([37,38,191,250,254,258,278,295,335,336,337,338,339,340],[2,151],{261:321,262:322,263:323,265:324,273:[1,326],306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,334:[1,325]}),o($Vb1,[2,155],{269:327,270:328,26:$VL1,331:$VM1}),o($Vc1,[2,157]),o($Vc1,[2,160]),o($Vc1,[2,161]),o($Vc1,[2,162],{35:$VN1,93:$VO1}),o($Vc1,[2,163]),o($Vc1,[2,164]),o($Vc1,[2,165]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:333,219:$Vx,273:$Vz,334:$VA}),o($VP1,[2,167]),{93:[1,334]},{35:[1,335]},{35:[1,336]},{35:[1,337]},{35:$VQ1,93:$VR1,177:338},{35:[1,341]},{35:[1,343],93:[1,342]},{284:[1,344]},{35:[1,345]},{35:[1,346]},{35:[1,347]},o($VS1,[2,456]),o($VS1,[2,457]),o($VS1,[2,458]),o($VS1,[2,459]),o($VS1,[2,460]),{284:[2,462]},o($Vc1,[2,158]),o($Vc1,[2,159]),{13:$V8,16:$V9,48:[1,348],60:350,87:$VS,97:349,98:351,99:352,100:$VT1,231:$VU1,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},{48:[1,355],93:[1,356]},{46:[1,357]},o($Vx1,[2,272]),o($VF,[2,50]),o($VF,[2,284]),{119:[1,358]},o($VF,[2,66]),o($Vf,$VC,{142:141,115:359,119:$VD,141:$VE}),o($Vy1,[2,65]),o($VF,[2,53]),{48:[1,360],119:[1,362],146:361},o($Vz1,[2,329],{154:363,328:[1,364]}),{45:[1,365],134:366,135:$VV1},{45:[1,368],134:369,135:$VV1},o($VW1,[2,259],{66:370,85:371,86:[1,372],88:[1,373]}),o($VA1,[2,258]),{69:[1,374]},o($VJ,[2,30],{274:231,280:236,283:239,82:271,72:272,73:273,60:274,84:375,13:$V8,16:$V9,35:$Ve1,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,281:$Vj1,282:$Vk1,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1}),o($VX1,[2,263]),o($VY1,[2,85]),o($VY1,[2,86]),o($VY1,[2,87]),{35:$VN1,93:$VO1},{48:[1,376]},{48:[1,377]},{20:378,45:$Vn,46:$Vo,61:98},{20:379,45:$Vn,46:$Vo,61:98},o($VZ1,[2,333],{157:380}),o($VZ1,[2,332]),{13:$V8,16:$V9,34:$VQ,35:$V_1,39:385,60:178,87:$VS,93:$VT,98:179,164:381,201:382,203:383,226:$V$1,231:$Vy,243:384,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Vr,[2,20]),o($VW1,[2,22]),{13:$V8,16:$V9,34:$V02,35:$V12,60:274,70:388,71:389,72:390,73:391,274:231,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,280:236,281:$Vj1,282:$Vk1,283:239,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1},o($V5,[2,16]),{48:[1,394]},{48:[2,236]},{48:[2,93]},o($Vq,[2,360],{48:[2,362]}),o($VF1,[2,94]),o($V22,[2,367],{189:395}),o($Vq,[2,371],{194:396,196:397}),o($Vq,[2,100]),o($Vq,[2,101]),o($Vq,[2,102]),o($VF1,[2,95]),o($VF1,[2,96]),o($VF1,[2,366]),{13:$V8,16:$V9,34:$VQ,35:$VR,38:[1,398],39:304,60:178,87:$VS,93:$VT,98:179,185:302,197:399,226:$VU,229:301,231:$Vy,243:303,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($V32,[2,402]),o($V42,[2,129]),o($V42,[2,130]),o($V42,[2,406]),o($V42,[2,407]),{227:[1,400]},o($VI1,[2,182]),{13:$V8,16:$V9,60:401,312:$Vb},o($V5,[2,18]),{38:[1,402]},{38:[1,403]},o($V91,[2,431]),o($Vv,$Vw,{251:118,255:119,259:120,267:121,271:122,247:404,219:$Vx,273:$Vz,334:$VA}),{46:[1,405]},{46:[2,410]},{46:[2,411]},{13:$V8,16:$V9,34:$VQ,39:407,60:178,87:$VS,93:$VT,98:179,231:$Vy,237:406,243:408,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Va1,[2,433]),o($Vv,$Vw,{255:119,259:120,267:121,271:122,251:409,219:$Vx,273:$Vz,334:$VA}),o($Va1,[2,149]),{35:$VQ1,93:$VR1,177:410},o($Vb1,[2,443]),o($Vv,$Vw,{267:121,271:122,259:411,219:$Vx,273:$Vz,334:$VA}),o($Vc1,[2,446],{264:412}),o($Vc1,[2,448],{266:413}),o($VK1,[2,444]),o($VK1,[2,445]),o($Vc1,[2,451]),o($Vv,$Vw,{271:122,267:414,219:$Vx,273:$Vz,334:$VA}),o($VK1,[2,452]),o($VK1,[2,453]),o($VP1,[2,88]),o($VK1,[2,351],{175:415,316:[1,416]}),{38:[1,417]},o($VP1,[2,168]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:418,219:$Vx,273:$Vz,334:$VA}),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:419,219:$Vx,273:$Vz,334:$VA}),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:420,219:$Vx,273:$Vz,334:$VA}),o($VP1,[2,172]),o($VP1,[2,90]),o($VK1,[2,355],{178:421}),{34:[1,422]},o($VP1,[2,174]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:423,219:$Vx,273:$Vz,334:$VA}),{46:$VM,62:424},o($V52,[2,463],{286:425,316:[1,426]}),o($VK1,[2,467],{289:427,316:[1,428]}),o($VK1,[2,469],{291:429,316:[1,430]}),o($VB,[2,41]),o($Vv1,[2,268]),o($V62,[2,44]),o($V62,[2,45]),o($V62,[2,46]),o($V62,[2,47]),{13:$V8,16:$V9,60:178,87:$VS,93:$VT,98:179,99:433,119:[1,431],231:$VU1,241:432,244:434,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($VB,[2,42]),o($Vw1,[2,270]),o($V72,[2,273],{96:435}),{13:$V8,16:$V9,60:436,312:$Vb},o($VF,[2,52]),o([6,45,132,133,135,191],[2,68]),o($Vz1,[2,318]),{13:$V8,16:$V9,34:[1,438],60:439,147:437,312:$Vb},o($Vz1,[2,70]),o($Vq,[2,328],{48:$V82,119:$V82}),{46:$VM,62:440},o($VI,[2,301]),o($Vf,[2,308],{136:441,320:[1,442]}),{46:$VM,62:443},o($VI,[2,307]),o($VW1,[2,23]),o($VW1,[2,260]),{87:[1,444]},{87:[1,445]},{13:$V8,16:$V9,34:$V92,35:$Ve1,60:274,72:272,73:273,79:446,80:447,81:$Va2,82:271,83:$Vb2,84:450,274:231,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,280:236,281:$Vj1,282:$Vk1,283:239,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1},o($VX1,[2,264]),o($Vc2,[2,71]),o($Vc2,[2,72]),o($VJ,$VK,{64:154,74:155,21:452,75:$VL}),o($VN,$VO,{63:162,67:163,24:453,68:$VP}),{46:[2,343],48:[2,73],89:463,90:$V4,119:[1,459],158:454,159:455,166:456,167:[1,457],168:[1,458],170:[1,460],173:[1,461],174:[1,462]},o($VZ1,[2,341],{165:464,328:[1,465]}),o($Vd2,$Ve2,{202:466,205:467,210:468,211:470,34:$Vf2}),o($Vg2,[2,377],{205:467,210:468,211:470,204:471,202:472,13:$Ve2,16:$Ve2,35:$Ve2,195:$Ve2,219:$Ve2,224:$Ve2,312:$Ve2,34:$Vf2}),o($Vh2,[2,375]),o($Vh2,[2,376]),{13:$V8,16:$V9,34:$VQ,35:$V_1,39:478,60:178,87:$VS,93:$VT,98:179,200:474,203:476,226:$V$1,228:473,230:475,231:$Vy,243:477,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Vd2,$Ve2,{205:467,210:468,211:470,202:479,34:$Vf2}),o($VN,[2,24],{274:231,280:236,283:239,60:274,72:390,73:391,71:480,13:$V8,16:$V9,34:$V02,35:$V12,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,281:$Vj1,282:$Vk1,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1}),o($Vi2,[2,261]),o($Vi2,[2,25]),o($Vi2,[2,26]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:481,219:$Vx,273:$Vz,334:$VA}),o($Vi2,[2,29]),o($VN,$VO,{63:162,67:163,24:482,68:$VP}),o([48,119,227,328],[2,97],{190:483,191:[1,484]}),o($V22,[2,99]),{13:$V8,16:$V9,34:$VQ,35:$VR,39:304,60:178,87:$VS,93:$VT,98:179,185:302,197:485,226:$VU,229:301,231:$Vy,243:303,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Vj2,[2,125]),o($V32,[2,403]),o($Vj2,[2,126]),o($VI1,[2,183]),o($Vu,[2,14]),o($Vu,[2,15]),o($V91,[2,145]),{13:$V8,16:$V9,34:$VQ,39:487,60:178,87:$VS,93:$VT,98:179,231:$Vy,233:486,243:488,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},{235:[1,489]},{235:[2,418]},{235:[2,419]},o($Va1,[2,147]),o($Va1,[2,150]),o($Vb1,[2,152]),o($Vb1,[2,153],{270:328,269:490,26:$VL1,331:$VM1}),o($Vb1,[2,154],{270:328,269:491,26:$VL1,331:$VM1}),o($Vc1,[2,156]),o($VK1,[2,353],{176:492}),o($VK1,[2,352]),o([6,13,16,26,34,35,37,38,46,48,78,81,83,86,87,88,90,93,119,167,168,170,173,174,191,226,231,245,246,250,254,258,273,275,276,277,278,279,281,282,284,285,288,290,295,299,300,301,302,303,304,305,306,307,308,309,310,311,312,328,331,334,335,336,337,338,339,340,341,342,343,344,345],[2,166]),{38:[1,493]},{278:[1,494]},{278:[1,495]},o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:496,219:$Vx,273:$Vz,334:$VA}),{38:[1,497]},{38:[1,498]},o($VP1,[2,176]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,287:499,36:501,26:[1,500],219:$Vx,273:$Vz,334:$VA}),o($V52,[2,464]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:502,219:$Vx,273:$Vz,334:$VA}),o($VK1,[2,468]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:503,219:$Vx,273:$Vz,334:$VA}),o($VK1,[2,470]),{13:$V8,16:$V9,34:[1,505],60:506,238:504,312:$Vb},{13:$V8,16:$V9,34:$VD1,60:294,193:507,195:$VE1,312:$Vb},o($VG1,[2,426]),o($VG1,[2,427]),{35:[1,510],48:[1,508],101:509},o($VF,[2,63]),{46:[1,511]},{46:[2,319]},{46:[2,320]},o($VF,[2,57]),{13:$V8,16:$V9,60:512,312:$Vb},o($Vf,[2,309]),o($VF,[2,58]),o($VW1,[2,36],{88:[1,513]}),o($VW1,[2,37],{86:[1,514]}),o($VA1,[2,31],{274:231,280:236,283:239,82:271,72:272,73:273,60:274,84:450,80:515,13:$V8,16:$V9,34:$V92,35:$Ve1,81:$Va2,83:$Vb2,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,281:$Vj1,282:$Vk1,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1}),o($Vk2,[2,265]),{35:$Ve1,82:516},{35:$Ve1,82:517},o($Vk2,[2,34]),o($Vk2,[2,35]),{31:518,48:[2,227],89:519,90:$V4},{32:520,48:[2,229],89:521,90:$V4},o($VZ1,[2,334]),o($Vl2,[2,335],{160:522,328:[1,523]}),{46:$VM,62:524},{46:$VM,62:525},{46:$VM,62:526},{13:$V8,16:$V9,34:[1,528],60:529,169:527,312:$Vb},o($Vm2,[2,347],{171:530,321:[1,531]}),{13:$V8,16:$V9,35:$Ve1,60:274,72:272,73:273,82:271,84:532,274:231,275:$Vf1,276:$Vg1,277:$Vh1,279:$Vi1,280:236,281:$Vj1,282:$Vk1,283:239,284:$Vl1,285:$Vm1,288:$Vn1,290:$Vo1,312:$Vb,340:$Vp1,341:$Vq1,342:$Vr1,343:$Vs1,344:$Vt1,345:$Vu1},{35:[1,533]},o($Vn2,[2,84]),o($VZ1,[2,75]),o($Vq,[2,340],{46:$Vo2,48:$Vo2,90:$Vo2,119:$Vo2,167:$Vo2,168:$Vo2,170:$Vo2,173:$Vo2,174:$Vo2}),o($Vg2,[2,105]),o($Vq,[2,381],{206:534}),o($Vq,[2,379]),o($Vq,[2,380]),o($Vd2,[2,389],{212:535,213:536}),o($Vg2,[2,106]),o($Vg2,[2,378]),{13:$V8,16:$V9,34:$VQ,35:$V_1,38:[1,537],39:478,60:178,87:$VS,93:$VT,98:179,200:538,203:476,226:$V$1,230:475,231:$Vy,243:477,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($V32,[2,404]),o($Vp2,[2,131]),o($Vp2,[2,132]),o($Vp2,[2,408]),o($Vp2,[2,409]),{227:[1,539]},o($Vi2,[2,262]),{37:[1,541],38:[1,540]},o($V5,[2,17]),o($V22,[2,368]),o($V22,[2,369],{193:292,60:294,192:542,188:543,13:$V8,16:$V9,34:$VD1,195:$VE1,312:$Vb}),o($V22,[2,103],{278:[1,544]}),{13:$V8,16:$V9,34:$VD1,60:294,193:545,195:$VE1,312:$Vb},o($VG1,[2,412]),o($VG1,[2,413]),o($Vq2,[2,134]),o($Vc1,[2,447]),o($Vc1,[2,449]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:546,219:$Vx,273:$Vz,334:$VA}),o($VP1,[2,169]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:547,219:$Vx,273:$Vz,334:$VA}),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:548,219:$Vx,273:$Vz,334:$VA}),{38:[1,549],278:[1,550]},o($VP1,[2,173]),o($VP1,[2,175]),{38:[1,551]},{38:[2,465]},{38:[2,466]},{38:[1,552]},{38:[2,471],191:[1,555],292:553,293:554},{46:[1,556]},{46:[2,420]},{46:[2,421]},{13:$V8,16:$V9,60:178,87:$VS,93:$VT,98:179,99:558,231:$VU1,242:557,244:559,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($VB,[2,43]),o($V72,[2,274]),{13:$V8,16:$V9,60:350,87:$VS,97:561,98:351,99:352,100:$VT1,102:560,231:$VU1,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Vq,$VG,{152:146,148:562,151:563,48:[2,321]}),o($VI,[2,61]),{87:[1,564]},{87:[1,565]},o($Vk2,[2,266]),o($Vk2,[2,32]),o($Vk2,[2,33]),{48:[2,11]},{48:[2,228]},{48:[2,12]},{48:[2,230]},o($Vq,$VB1,{163:281,161:566,162:567,46:$Vr2,48:$Vr2,90:$Vr2,119:$Vr2,167:$Vr2,168:$Vr2,170:$Vr2,173:$Vr2,174:$Vr2}),o($Vl2,[2,336]),o($Vn2,[2,76],{329:[1,568]}),o($Vn2,[2,77]),o($Vn2,[2,78]),{46:$VM,62:569},{46:[2,345]},{46:[2,346]},{13:$V8,16:$V9,34:[1,571],60:572,172:570,312:$Vb},o($Vm2,[2,348]),o($Vn2,[2,81]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:573,39:574,219:$Vx,231:$Vy,273:$Vz,334:$VA}),{13:$V8,16:$V9,34:$VQ,35:$V_1,39:478,60:178,87:$VS,93:$VT,98:179,200:575,203:476,226:$V$1,230:475,231:$Vy,243:477,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($V32,[2,110],{330:[1,576]}),o($Vs2,[2,396],{214:577,218:578,224:[1,579]}),o($Vt2,[2,127]),o($V32,[2,405]),o($Vt2,[2,128]),o($Vi2,[2,27]),{34:[1,580]},o($V22,[2,98]),o($V22,[2,370]),o($Vq,[2,372]),{13:$V8,16:$V9,34:$VQ,39:582,60:178,87:$VS,93:$VT,98:179,231:$Vy,234:581,243:583,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},{38:[1,584],278:[1,585]},{38:[1,586]},{278:[1,587]},o($VP1,[2,91]),o($VK1,[2,356]),o($VP1,[2,177]),o($VP1,[2,178]),{38:[1,588]},{38:[2,472]},{294:[1,589]},{13:$V8,16:$V9,60:178,87:$VS,93:$VT,98:179,99:591,231:$VU1,239:590,244:592,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},{235:[1,593]},{235:[2,428]},{235:[2,429]},{13:$V8,16:$V9,38:[1,594],60:350,87:$VS,97:595,98:351,99:352,100:$VT1,231:$VU1,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Vu2,[2,275]),{48:[1,596]},{48:[2,322]},o($VW1,[2,38]),o($VW1,[2,39]),o($VZ1,[2,74]),o($VZ1,[2,338]),{46:[2,344]},o($Vn2,[2,79]),{46:$VM,62:597},{46:[2,349]},{46:[2,350]},{37:[1,598]},{37:[1,599]},o($Vv2,[2,383],{207:600,278:[1,601]}),o($Vd2,[2,388]),o([13,16,34,35,38,87,93,226,231,245,246,299,300,301,302,303,304,305,306,307,308,309,310,311,312,330],[2,111],{331:[1,602]}),{13:$V8,16:$V9,35:[1,608],60:605,195:[1,606],215:603,216:604,219:[1,607],312:$Vb},o($Vs2,[2,397]),{38:[1,609]},{48:[1,610]},{48:[2,414]},{48:[2,415]},o($VP1,[2,89]),o($VK1,[2,354]),o($VP1,[2,170]),o($Vv,$Vw,{247:116,251:118,255:119,259:120,267:121,271:122,36:611,219:$Vx,273:$Vz,334:$VA}),o($VP1,[2,179]),{295:[1,612]},{13:$V8,16:$V9,34:$VD1,60:294,193:613,195:$VE1,312:$Vb},o($VG1,[2,422]),o($VG1,[2,423]),o($Vw2,[2,136]),o($V72,[2,48]),o($Vu2,[2,276]),o($Vx2,[2,323],{149:614,328:[1,615]}),o($Vn2,[2,80]),{34:[1,616]},{34:[1,617]},o([46,48,90,119,167,168,170,173,174,227,328],[2,107],{208:618,191:[1,619]}),o($Vq,[2,382]),o($Vd2,[2,390]),o($Vy2,[2,113]),o($Vy2,[2,394],{217:620,332:621,26:[1,623],333:[1,622],334:[1,624]}),o($Vz2,[2,114]),o($Vz2,[2,115]),{13:$V8,16:$V9,35:[1,628],60:629,93:[1,627],195:$VA2,220:625,221:626,224:$VB2,312:$Vb},o($Vd2,$Ve2,{211:470,210:632}),o($Vi2,[2,28]),{235:[1,633]},{38:[1,634]},{296:635,302:$V_,303:$V$,304:$V01,305:$V11},{13:$V8,16:$V9,60:178,87:$VS,93:$VT,98:179,99:637,231:$VU1,240:636,244:638,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},o($Vq,$VG,{152:146,150:639,151:640,48:$VC2,119:$VC2}),o($Vx2,[2,324]),{38:[1,641]},{38:[1,642]},o($Vv2,[2,384]),o($Vv2,[2,108],{211:470,209:643,210:644,13:$Ve2,16:$Ve2,35:$Ve2,195:$Ve2,219:$Ve2,224:$Ve2,312:$Ve2,34:[1,645]}),o($Vy2,[2,112]),o($Vy2,[2,395]),o($Vy2,[2,391]),o($Vy2,[2,392]),o($Vy2,[2,393]),o($Vz2,[2,116]),o($Vz2,[2,118]),o($Vz2,[2,119]),o($VD2,[2,398],{222:646}),o($Vz2,[2,121]),o($Vz2,[2,122]),{13:$V8,16:$V9,60:647,195:[1,648],312:$Vb},{38:[1,649]},o($Vq2,[2,133]),o($VP1,[2,171]),{38:[2,180]},{48:[1,650]},{48:[2,424]},{48:[2,425]},o($Vz1,[2,69]),o($Vz1,[2,326]),o($Vn2,[2,82]),o($Vn2,[2,83]),o($Vq,[2,373],{198:651,199:652}),o($Vq,[2,385]),o($Vq,[2,386]),{13:$V8,16:$V9,38:[2,400],60:629,195:$VA2,221:654,223:653,224:$VB2,312:$Vb},o($Vz2,[2,123]),o($Vz2,[2,124]),o($Vz2,[2,117]),{235:[1,655]},o($Vv2,[2,109]),{13:$V8,16:$V9,34:$VQ,35:$V_1,39:478,60:178,87:$VS,93:$VT,98:179,200:656,203:476,226:$V$1,230:475,231:$Vy,243:477,244:177,245:$VV,246:$VW,263:187,265:188,296:183,299:$VX,300:$VY,301:$VZ,302:$V_,303:$V$,304:$V01,305:$V11,306:$V21,307:$V31,308:$V41,309:$V51,310:$V61,311:$V71,312:$Vb},{38:[1,657]},{38:[2,401],330:[1,658]},o($Vw2,[2,135]),o($Vv2,[2,104],{278:[1,659]}),o($Vz2,[2,120]),o($VD2,[2,399]),o($Vq,[2,374])],
defaultActions: {5:[2,205],6:[2,206],8:[2,204],26:[2,1],27:[2,3],28:[2,216],77:[2,49],86:[2,295],100:[2,252],107:[2,358],220:[2,441],248:[2,462],287:[2,236],288:[2,93],314:[2,410],315:[2,411],407:[2,418],408:[2,419],438:[2,319],439:[2,320],500:[2,465],501:[2,466],505:[2,420],506:[2,421],518:[2,11],519:[2,228],520:[2,12],521:[2,230],528:[2,345],529:[2,346],554:[2,472],558:[2,428],559:[2,429],563:[2,322],568:[2,344],571:[2,349],572:[2,350],582:[2,414],583:[2,415],635:[2,180],637:[2,424],638:[2,425]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

  /*
    SPARQL parser in the Jison parser generator format.
  */

  var Wildcard = require('./Wildcard').Wildcard;

  // Common namespaces and entities
  var RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      RDF_TYPE  = RDF + 'type',
      RDF_FIRST = RDF + 'first',
      RDF_REST  = RDF + 'rest',
      RDF_NIL   = RDF + 'nil',
      XSD = 'http://www.w3.org/2001/XMLSchema#',
      XSD_INTEGER  = XSD + 'integer',
      XSD_DECIMAL  = XSD + 'decimal',
      XSD_DOUBLE   = XSD + 'double',
      XSD_BOOLEAN  = XSD + 'boolean';

  var base = '', basePath = '', baseRoot = '';

  // Returns a lowercase version of the given string
  function lowercase(string) {
    return string.toLowerCase();
  }

  // Appends the item to the array and returns the array
  function appendTo(array, item) {
    return array.push(item), array;
  }

  // Appends the items to the array and returns the array
  function appendAllTo(array, items) {
    return array.push.apply(array, items), array;
  }

  // Extends a base object with properties of other objects
  function extend(base) {
    if (!base) base = {};
    for (var i = 1, l = arguments.length, arg; i < l && (arg = arguments[i] || {}); i++)
      for (var name in arg)
        base[name] = arg[name];
    return base;
  }

  // Creates an array that contains all items of the given arrays
  function unionAll() {
    var union = [];
    for (var i = 0, l = arguments.length; i < l; i++)
      union = union.concat.apply(union, arguments[i]);
    return union;
  }

  // Resolves an IRI against a base path
  function resolveIRI(iri) {
    // Strip off possible angular brackets
    if (iri[0] === '<')
      iri = iri.substring(1, iri.length - 1);
    // Return absolute IRIs unmodified
    if (/^[a-z]+:/i.test(iri))
      return iri;
    if (!Parser.base)
      throw new Error('Cannot resolve relative IRI ' + iri + ' because no base IRI was set.');
    if (base !== Parser.base) {
      base = Parser.base;
      basePath = base.replace(/[^\/:]*$/, '');
      baseRoot = base.match(/^(?:[a-z]+:\/*)?[^\/]*/)[0];
    }
    switch (iri[0]) {
    // An empty relative IRI indicates the base IRI
    case undefined:
      return base;
    // Resolve relative fragment IRIs against the base IRI
    case '#':
      return base + iri;
    // Resolve relative query string IRIs by replacing the query string
    case '?':
      return base.replace(/(?:\?.*)?$/, iri);
    // Resolve root relative IRIs at the root of the base IRI
    case '/':
      return baseRoot + iri;
    // Resolve all other IRIs at the base IRI's path
    default:
      return basePath + iri;
    }
  }

  // If the item is a variable, ensures it starts with a question mark
  function toVar(variable) {
    if (variable) {
      var first = variable[0];
      if (first === '?' || first === '$') return Parser.factory.variable(variable.substr(1));
    }
    return variable;
  }

  // Creates an operation with the given name and arguments
  function operation(operatorName, args) {
    return { type: 'operation', operator: operatorName, args: args || [] };
  }

  // Creates an expression with the given type and attributes
  function expression(expr, attr) {
    var expression = { expression: expr === '*'? new Wildcard() : expr };
    if (attr)
      for (var a in attr)
        expression[a] = attr[a];
    return expression;
  }

  // Creates a path with the given type and items
  function path(type, items) {
    return { type: 'path', pathType: type, items: items };
  }

  // Transforms a list of operations types and arguments into a tree of operations
  function createOperationTree(initialExpression, operationList) {
    for (var i = 0, l = operationList.length, item; i < l && (item = operationList[i]); i++)
      initialExpression = operation(item[0], [initialExpression, item[1]]);
    return initialExpression;
  }

  // Group datasets by default and named
  function groupDatasets(fromClauses, groupName) {
    var defaults = [], named = [], l = fromClauses.length, fromClause, group = {};
    if (!l)
      return null;
    for (var i = 0; i < l && (fromClause = fromClauses[i]); i++)
      (fromClause.named ? named : defaults).push(fromClause.iri);
    group[groupName || 'from'] = { default: defaults, named: named };
    return group;
  }

  // Converts the string to a number
  function toInt(string) {
    return parseInt(string, 10);
  }

  // Transforms a possibly single group into its patterns
  function degroupSingle(group) {
    return group.type === 'group' && group.patterns.length === 1 ? group.patterns[0] : group;
  }

  // Creates a literal with the given value and type
  function createTypedLiteral(value, type) {
    if (type && type.termType !== 'NamedNode'){
      type = Parser.factory.namedNode(type);
    }
    return Parser.factory.literal(value, type);
  }

  // Creates a literal with the given value and language
  function createLangLiteral(value, lang) {
    return Parser.factory.literal(value, lang);
  }

  // Creates a triple with the given subject, predicate, and object
  function triple(subject, predicate, object) {
    var triple = {};
    if (subject   != null) triple.subject   = subject;
    if (predicate != null) triple.predicate = predicate;
    if (object    != null) triple.object    = object;
    return triple;
  }

  // Creates a new blank node
  function blank(name) {
    if (typeof name === 'string') {  // Only use name if a name is given
      if (name.startsWith('e_')) return Parser.factory.blankNode(name);
      return Parser.factory.blankNode('e_' + name);
    }
    return Parser.factory.blankNode('g_' + blankId++);
  };
  var blankId = 0;
  Parser._resetBlanks = function () { blankId = 0; }

  // Regular expression and replacement strings to escape strings
  var escapeSequence = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{8})|\\(.)/g,
      escapeReplacements = { '\\': '\\', "'": "'", '"': '"',
                             't': '\t', 'b': '\b', 'n': '\n', 'r': '\r', 'f': '\f' },
      partialSurrogatesWithoutEndpoint = /[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/,
      fromCharCode = String.fromCharCode;

  // Translates escape codes in the string into their textual equivalent
  function unescapeString(string, trimLength) {
    string = string.substring(trimLength, string.length - trimLength);
    try {
      string = string.replace(escapeSequence, function (sequence, unicode4, unicode8, escapedChar) {
        var charCode;
        if (unicode4) {
          charCode = parseInt(unicode4, 16);
          if (isNaN(charCode)) throw new Error(); // can never happen (regex), but helps performance
          return fromCharCode(charCode);
        }
        else if (unicode8) {
          charCode = parseInt(unicode8, 16);
          if (isNaN(charCode)) throw new Error(); // can never happen (regex), but helps performance
          if (charCode < 0xFFFF) return fromCharCode(charCode);
          return fromCharCode(0xD800 + ((charCode -= 0x10000) >> 10), 0xDC00 + (charCode & 0x3FF));
        }
        else {
          var replacement = escapeReplacements[escapedChar];
          if (!replacement) throw new Error();
          return replacement;
        }
      });
    }
    catch (error) { return ''; }

    // Test for invalid unicode surrogate pairs
    if (partialSurrogatesWithoutEndpoint.exec(string)) {
      throw new Error('Invalid unicode codepoint of surrogate pair without corresponding codepoint in ' + string);
    }

    return string;
  }

  // Creates a list, collecting its (possibly blank) items and triples associated with those items
  function createList(objects) {
    var list = blank(), head = list, listItems = [], listTriples, triples = [];
    objects.forEach(function (o) { listItems.push(o.entity); appendAllTo(triples, o.triples); });

    // Build an RDF list out of the items
    for (var i = 0, j = 0, l = listItems.length, listTriples = Array(l * 2); i < l;)
      listTriples[j++] = triple(head, Parser.factory.namedNode(RDF_FIRST), listItems[i]),
      listTriples[j++] = triple(head, Parser.factory.namedNode(RDF_REST),  head = ++i < l ? blank() : Parser.factory.namedNode(RDF_NIL));

    // Return the list's identifier, its triples, and the triples associated with its items
    return { entity: list, triples: appendAllTo(listTriples, triples) };
  }

  // Creates a blank node identifier, collecting triples with that blank node as subject
  function createAnonymousObject(propertyList) {
    var entity = blank();
    return {
      entity: entity,
      triples: propertyList.map(function (t) { return extend(triple(entity), t); })
    };
  }

  // Collects all (possibly blank) objects, and triples that have them as subject
  function objectListToTriples(predicate, objectList, otherTriples) {
    var objects = [], triples = [];
    objectList.forEach(function (l) {
      objects.push(triple(null, predicate, l.entity));
      appendAllTo(triples, l.triples);
    });
    return unionAll(objects, otherTriples || [], triples);
  }

  // Simplifies groups by merging adjacent BGPs
  function mergeAdjacentBGPs(groups) {
    var merged = [], currentBgp;
    for (var i = 0, group; group = groups[i]; i++) {
      switch (group.type) {
        // Add a BGP's triples to the current BGP
        case 'bgp':
          if (group.triples.length) {
            if (!currentBgp)
              appendTo(merged, currentBgp = group);
            else
              appendAllTo(currentBgp.triples, group.triples);
          }
          break;
        // All other groups break up a BGP
        default:
          // Only add the group if its pattern is non-empty
          if (!group.patterns || group.patterns.length > 0) {
            appendTo(merged, group);
            currentBgp = null;
          }
      }
    }
    return merged;
  }

  // Return the id of an expression
  function getExpressionId(expression) {
    return expression.variable ? expression.variable.value : expression.value || expression.expression.value;
  }

  // Get all "aggregate"'s from an expression
  function getAggregatesOfExpression(expression) {
    if (!expression) {
      return [];
    }
    if (expression.type === 'aggregate') {
      return [expression];
    } else if (expression.type === "operation") {
      const aggregates = [];
      for (const arg of expression.args) {
        aggregates.push(...getAggregatesOfExpression(arg));
      }
      return aggregates;
    }
    return [];
  }

  // Get all variables used in an expression
  function getVariablesFromExpression(expression) {
    const variables = new Set();
    const visitExpression = function (expr) {
      if (!expr) { return; }
      if (expr.termType === "Variable") {
        variables.add(expr);
      } else if (expr.type === "operation") {
        expr.args.forEach(visitExpression);
      }
    };
    visitExpression(expression);
    return variables;
  }

  // Helper function to flatten arrays
  function flatten(input, depth = 1, stack = []) {
    for (const item of input) {
        if (depth > 0 && item instanceof Array) {
          flatten(item, depth - 1, stack);
        } else {
          stack.push(item);
        }
    }
    return stack;
  }

  function isVariable(term) {
    return term.termType === 'Variable';
  }

  function getBoundVarsFromGroupGraphPattern(pattern) {
    if (pattern.triples) {
      const boundVars = [];
      for (const triple of pattern.triples) {
        if (isVariable(triple.subject)) boundVars.push(triple.subject.value);
        if (isVariable(triple.predicate)) boundVars.push(triple.predicate.value);
        if (isVariable(triple.object)) boundVars.push(triple.object.value);
      }
      return boundVars;
    } else if (pattern.patterns) {
      const boundVars = [];
      for (const pat of pattern.patterns) {
        boundVars.push(...getBoundVarsFromGroupGraphPattern(pat));
      }
      return boundVars;
    }
    return [];
  }

  // Helper function to find duplicates in array
  function getDuplicatesInArray(array) {
    const sortedArray = array.slice().sort();
    const duplicates = [];
    for (let i = 0; i < sortedArray.length - 1; i++) {
      if (sortedArray[i + 1] == sortedArray[i]) {
        duplicates.push(sortedArray[i]);
      }
    }
    return duplicates;
  }

  function ensureSparqlStar(value) {
    if (!Parser.sparqlStar) {
      throw new Error('SPARQL* support is not enabled');
    }
    return value;
  }

  function ensureNoVariables(operations) {
    for (const operation of operations) {
      if (operation.type === 'graph' && operation.name.termType === 'Variable') {
        throw new Error('Detected illegal variable in GRAPH');
      }
      if (operation.type === 'bgp' || operation.type === 'graph') {
        for (const triple of operation.triples) {
          if (triple.subject.termType === 'Variable' ||
              triple.predicate.termType === 'Variable' ||
              triple.object.termType === 'Variable') {
            throw new Error('Detected illegal variable in BGP');
          }
        }
      }
    }
    return operations;
  }

  function ensureNoBnodes(operations) {
    for (const operation of operations) {
      if (operation.type === 'bgp') {
        for (const triple of operation.triples) {
          if (triple.subject.termType === 'BlankNode' ||
              triple.predicate.termType === 'BlankNode' ||
              triple.object.termType === 'BlankNode') {
            throw new Error('Detected illegal blank node in BGP');
          }
        }
      }
    }
    return operations;
  }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true,"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* ignore */
break;
case 1:return 12
break;
case 2:return 15
break;
case 3:return 28
break;
case 4:return 316
break;
case 5:return 317
break;
case 6:return 35
break;
case 7:return 37
break;
case 8:return 38
break;
case 9:return 26
break;
case 10:return 41
break;
case 11:return 45
break;
case 12:return 46
break;
case 13:return 48
break;
case 14:return 50
break;
case 15:return 55
break;
case 16:return 58
break;
case 17:return 320
break;
case 18:return 68
break;
case 19:return 69
break;
case 20:return 75
break;
case 21:return 78
break;
case 22:return 81
break;
case 23:return 83
break;
case 24:return 86
break;
case 25:return 88
break;
case 26:return 90
break;
case 27:return 191
break;
case 28:return 107
break;
case 29:return 321
break;
case 30:return 140
break;
case 31:return 322
break;
case 32:return 323
break;
case 33:return 117
break;
case 34:return 324
break;
case 35:return 116
break;
case 36:return 325
break;
case 37:return 326
break;
case 38:return 120
break;
case 39:return 122
break;
case 40:return 123
break;
case 41:return 138
break;
case 42:return 132
break;
case 43:return 133
break;
case 44:return 135
break;
case 45:return 141
break;
case 46:return 119
break;
case 47:return 327
break;
case 48:return 328
break;
case 49:return 167
break;
case 50:return 170
break;
case 51:return 174
break;
case 52:return 100
break;
case 53:return 168
break;
case 54:return 329
break;
case 55:return 173
break;
case 56:return 231
break;
case 57:return 235
break;
case 58:return 278
break;
case 59:return 195
break;
case 60:return 330
break;
case 61:return 331
break;
case 62:return 224
break;
case 63:return 333
break;
case 64:return 334
break;
case 65:return 219
break;
case 66:return 226
break;
case 67:return 227
break;
case 68:return 250
break;
case 69:return 254
break;
case 70:return 295
break;
case 71:return 335
break;
case 72:return 336
break;
case 73:return 337
break;
case 74:return 338
break;
case 75:return 339
break;
case 76:return 258
break;
case 77:return 340
break;
case 78:return 273
break;
case 79:return 281
break;
case 80:return 282
break;
case 81:return 275
break;
case 82:return 276
break;
case 83:return 277
break;
case 84:return 341
break;
case 85:return 342
break;
case 86:return 279
break;
case 87:return 344
break;
case 88:return 343
break;
case 89:return 345
break;
case 90:return 284
break;
case 91:return 285
break;
case 92:return 288
break;
case 93:return 290
break;
case 94:return 294
break;
case 95:return 298
break;
case 96:return 301
break;
case 97:return 13
break;
case 98:return 16
break;
case 99:return 312
break;
case 100:return 245
break;
case 101:return 34
break;
case 102:return 297
break;
case 103:return 87
break;
case 104:return 299
break;
case 105:return 300
break;
case 106:return 306
break;
case 107:return 307
break;
case 108:return 308
break;
case 109:return 309
break;
case 110:return 310
break;
case 111:return 311
break;
case 112:return 'EXPONENT'
break;
case 113:return 302
break;
case 114:return 303
break;
case 115:return 304
break;
case 116:return 305
break;
case 117:return 93
break;
case 118:return 246
break;
case 119:return 6
break;
case 120:return 'INVALID'
break;
case 121:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:\s+|(#[^\n\r]*))/i,/^(?:BASE)/i,/^(?:PREFIX)/i,/^(?:SELECT)/i,/^(?:DISTINCT)/i,/^(?:REDUCED)/i,/^(?:\()/i,/^(?:AS)/i,/^(?:\))/i,/^(?:\*)/i,/^(?:CONSTRUCT)/i,/^(?:WHERE)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:DESCRIBE)/i,/^(?:ASK)/i,/^(?:FROM)/i,/^(?:NAMED)/i,/^(?:GROUP)/i,/^(?:BY)/i,/^(?:HAVING)/i,/^(?:ORDER)/i,/^(?:ASC)/i,/^(?:DESC)/i,/^(?:LIMIT)/i,/^(?:OFFSET)/i,/^(?:VALUES)/i,/^(?:;)/i,/^(?:LOAD)/i,/^(?:SILENT)/i,/^(?:INTO)/i,/^(?:CLEAR)/i,/^(?:DROP)/i,/^(?:CREATE)/i,/^(?:ADD)/i,/^(?:TO)/i,/^(?:MOVE)/i,/^(?:COPY)/i,/^(?:INSERT((\s+|(#[^\n\r]*)\n\r?)+)DATA)/i,/^(?:DELETE((\s+|(#[^\n\r]*)\n\r?)+)DATA)/i,/^(?:DELETE((\s+|(#[^\n\r]*)\n\r?)+)WHERE)/i,/^(?:WITH)/i,/^(?:DELETE)/i,/^(?:INSERT)/i,/^(?:USING)/i,/^(?:DEFAULT)/i,/^(?:GRAPH)/i,/^(?:ALL)/i,/^(?:\.)/i,/^(?:OPTIONAL)/i,/^(?:SERVICE)/i,/^(?:BIND)/i,/^(?:UNDEF)/i,/^(?:MINUS)/i,/^(?:UNION)/i,/^(?:FILTER)/i,/^(?:<<)/i,/^(?:>>)/i,/^(?:,)/i,/^(?:a)/i,/^(?:\|)/i,/^(?:\/)/i,/^(?:\^)/i,/^(?:\?)/i,/^(?:\+)/i,/^(?:!)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\|\|)/i,/^(?:&&)/i,/^(?:=)/i,/^(?:!=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:IN)/i,/^(?:NOT)/i,/^(?:-)/i,/^(?:BOUND)/i,/^(?:BNODE)/i,/^(?:(RAND|NOW|UUID|STRUUID))/i,/^(?:(LANG|DATATYPE|IRI|URI|ABS|CEIL|FLOOR|ROUND|STRLEN|STR|UCASE|LCASE|ENCODE_FOR_URI|YEAR|MONTH|DAY|HOURS|MINUTES|SECONDS|TIMEZONE|TZ|MD5|SHA1|SHA256|SHA384|SHA512|isIRI|isURI|isBLANK|isLITERAL|isNUMERIC))/i,/^(?:(LANGMATCHES|CONTAINS|STRSTARTS|STRENDS|STRBEFORE|STRAFTER|STRLANG|STRDT|sameTerm))/i,/^(?:CONCAT)/i,/^(?:COALESCE)/i,/^(?:IF)/i,/^(?:REGEX)/i,/^(?:SUBSTR)/i,/^(?:REPLACE)/i,/^(?:EXISTS)/i,/^(?:COUNT)/i,/^(?:SUM|MIN|MAX|AVG|SAMPLE)/i,/^(?:GROUP_CONCAT)/i,/^(?:SEPARATOR)/i,/^(?:\^\^)/i,/^(?:true|false)/i,/^(?:(<(?:[^<>\"\{\}\|\^`\\\u0000-\u0020])*>))/i,/^(?:((([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])(?:(?:(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040])|\.)*(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040]))?)?:))/i,/^(?:(((([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])(?:(?:(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040])|\.)*(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040]))?)?:)((?:((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|:|[0-9]|((%([0-9A-Fa-f])([0-9A-Fa-f]))|(\\(_|~|\.|-|!|\$|&|'|\(|\)|\*|\+|,|;|=|\/|\?|#|@|%))))(?:(?:(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040])|\.|:|((%([0-9A-Fa-f])([0-9A-Fa-f]))|(\\(_|~|\.|-|!|\$|&|'|\(|\)|\*|\+|,|;|=|\/|\?|#|@|%))))*(?:(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040])|:|((%([0-9A-Fa-f])([0-9A-Fa-f]))|(\\(_|~|\.|-|!|\$|&|'|\(|\)|\*|\+|,|;|=|\/|\?|#|@|%)))))?)))/i,/^(?:(_:(?:((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|[0-9])(?:(?:(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040])|\.)*(((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|-|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040]))?))/i,/^(?:([\?\$]((?:((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|[0-9])(?:((?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_))|[0-9]|\u00B7|[\u0300-\u036F\u203F-\u2040])*)))/i,/^(?:(@[a-zA-Z]+(?:-[a-zA-Z0-9]+)*))/i,/^(?:([0-9]+))/i,/^(?:([0-9]*\.[0-9]+))/i,/^(?:([0-9]+\.[0-9]*([eE][+-]?[0-9]+)|\.([0-9])+([eE][+-]?[0-9]+)|([0-9])+([eE][+-]?[0-9]+)))/i,/^(?:(\+([0-9]+)))/i,/^(?:(\+([0-9]*\.[0-9]+)))/i,/^(?:(\+([0-9]+\.[0-9]*([eE][+-]?[0-9]+)|\.([0-9])+([eE][+-]?[0-9]+)|([0-9])+([eE][+-]?[0-9]+))))/i,/^(?:(-([0-9]+)))/i,/^(?:(-([0-9]*\.[0-9]+)))/i,/^(?:(-([0-9]+\.[0-9]*([eE][+-]?[0-9]+)|\.([0-9])+([eE][+-]?[0-9]+)|([0-9])+([eE][+-]?[0-9]+))))/i,/^(?:([eE][+-]?[0-9]+))/i,/^(?:('(?:(?:[^\u0027\u005C\u000A\u000D])|(\\[tbnrf\\\"']|\\u([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])|\\U([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])))*'))/i,/^(?:("(?:(?:[^\u0022\u005C\u000A\u000D])|(\\[tbnrf\\\"']|\\u([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])|\\U([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])))*"))/i,/^(?:('''(?:(?:'|'')?(?:[^'\\]|(\\[tbnrf\\\"']|\\u([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])|\\U([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f]))))*'''))/i,/^(?:("""(?:(?:"|"")?(?:[^\"\\]|(\\[tbnrf\\\"']|\\u([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])|\\U([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f]))))*"""))/i,/^(?:(\((\u0020|\u0009|\u000D|\u000A)*\)))/i,/^(?:(\[(\u0020|\u0009|\u000D|\u000A)*\]))/i,/^(?:$)/i,/^(?:.)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = SparqlParser;
exports.Parser = SparqlParser.Parser;
exports.parse = function () { return SparqlParser.parse.apply(SparqlParser, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"./Wildcard":12,"_process":1,"fs":1,"path":1}],12:[function(require,module,exports){

// Wildcard constructor
class Wildcard {
  constructor() {
    return WILDCARD || this;
  }

  equals(other) {
    return other && (this.termType === other.termType);
  }
}

Object.defineProperty(Wildcard.prototype, 'value', {
  enumerable: true,
  value: '*',
});

Object.defineProperty(Wildcard.prototype, 'termType', {
  enumerable: true,
  value: 'Wildcard',
});


// Wildcard singleton
var WILDCARD = new Wildcard();

module.exports.Wildcard = Wildcard;

},{}],13:[function(require,module,exports){
var Parser = require('./lib/SparqlParser').Parser;
var Generator = require('./lib/SparqlGenerator');
var Wildcard = require("./lib/Wildcard").Wildcard;
var { DataFactory } = require('rdf-data-factory');

module.exports = {
  /**
   * Creates a SPARQL parser with the given pre-defined prefixes and base IRI
   * @param options {
   *   prefixes?: { [prefix: string]: string },
   *   baseIRI?: string,
   *   factory?: import('rdf-js').DataFactory,
   *   sparqlStar?: boolean,
   * }
   */
  Parser: function ({ prefixes, baseIRI, factory, sparqlStar, skipUngroupedVariableCheck } = {}) {
    // Create a copy of the prefixes
    var prefixesCopy = {};
    for (var prefix in prefixes || {})
      prefixesCopy[prefix] = prefixes[prefix];

    // Create a new parser with the given prefixes
    // (Workaround for https://github.com/zaach/jison/issues/241)
    var parser = new Parser();
    parser.parse = function () {
      Parser.base = baseIRI || '';
      Parser.prefixes = Object.create(prefixesCopy);
      Parser.factory = factory || new DataFactory();
      Parser.sparqlStar = Boolean(sparqlStar);
      Parser.skipUngroupedVariableCheck = Boolean(skipUngroupedVariableCheck)
      return Parser.prototype.parse.apply(parser, arguments);
    };
    parser._resetBlanks = Parser._resetBlanks;
    return parser;
  },
  Generator: Generator,
  Wildcard: Wildcard,
};

},{"./lib/SparqlGenerator":10,"./lib/SparqlParser":11,"./lib/Wildcard":12,"rdf-data-factory":2}],14:[function(require,module,exports){

window.parseSPARQLQuery = function(query)
{
  var SparqlParser = require('sparqljs').Parser;
	var parser = new SparqlParser();
  var parsedQuery = parser.parse(query);
  return parsedQuery;
}
},{"sparqljs":13}]},{},[14]);
