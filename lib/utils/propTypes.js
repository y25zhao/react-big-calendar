'use strict'

exports.__esModule = true
exports.popupOffsetShape = exports.views = exports.dateRangeFormat = exports.dateFormat = exports.accessor = exports.eventComponent = exports.elementType = undefined

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _elementType = require('react-prop-types/lib/elementType')

var _elementType2 = _interopRequireDefault(_elementType)

var _all = require('react-prop-types/lib/all')

var _all2 = _interopRequireDefault(_all)

var _constants = require('./constants')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.elementType = _elementType2.default
var eventComponent = (exports.eventComponent = _propTypes2.default.oneOfType([
  _elementType2.default,
  _propTypes2.default.shape({
    month: _elementType2.default,
    week: _elementType2.default,
    day: _elementType2.default,
    agenda: _elementType2.default,
  }),
]))

var viewNames = Object.keys(_constants.views).map(function(k) {
  return _constants.views[k]
})

var accessor = (exports.accessor = _propTypes2.default.oneOfType([
  _propTypes2.default.string,
  _propTypes2.default.func,
]))

var dateFormat = (exports.dateFormat = _propTypes2.default.any)

var dateRangeFormat = (exports.dateRangeFormat = _propTypes2.default.func)

/**
 * accepts either an array of builtin view names:
 *
 * ```
 * views={['month', 'day', 'agenda']}
 * ```
 *
 * or an object hash of the view name and the component (or boolean for builtin)
 *
 * ```
 * views={{
 *   month: true,
 *   week: false,
 *   workweek: WorkWeekViewComponent,
 * }}
 * ```
 */
var views = (exports.views = _propTypes2.default.oneOfType([
  _propTypes2.default.arrayOf(_propTypes2.default.oneOf(viewNames)),
  (0, _all2.default)(_propTypes2.default.object, function(props, name) {
    for (
      var _len = arguments.length,
        args = Array(_len > 2 ? _len - 2 : 0),
        _key = 2;
      _key < _len;
      _key++
    ) {
      args[_key - 2] = arguments[_key]
    }

    var prop = props[name],
      err = void 0

    Object.keys(prop).every(function(key) {
      var isBuiltinView =
        viewNames.indexOf(key) !== -1 && typeof prop[key] === 'boolean'

      return (
        isBuiltinView ||
        !(err = _elementType2.default.apply(
          undefined,
          [prop, key].concat(args)
        ))
      )
    })

    return err || null
  }),
]))

var popupOffsetShape = (exports.popupOffsetShape = _propTypes2.default.oneOfType(
  [
    _propTypes2.default.number,
    _propTypes2.default.shape({
      x: _propTypes2.default.number,
      y: _propTypes2.default.number,
      maxWidth: _propTypes2.default.number,
    }),
  ]
))
