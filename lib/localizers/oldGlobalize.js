'use strict'

exports.__esModule = true
exports.formats = undefined

exports.default = function(globalize) {
  function getCulture(culture) {
    return culture ? globalize.findClosestCulture(culture) : globalize.culture()
  }

  function firstOfWeek(culture) {
    culture = getCulture(culture)
    return (culture && culture.calendar.firstDay) || 0
  }

  return new _localizer.DateLocalizer({
    firstOfWeek: firstOfWeek,
    formats: formats,
    format: function format(value, _format, culture) {
      return globalize.format(value, _format, culture)
    },
  })
}

var _dates = require('../utils/dates')

var _dates2 = _interopRequireDefault(_dates)

var _localizer = require('../localizer')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var dateRangeFormat = function dateRangeFormat(_ref, culture, local) {
  var start = _ref.start,
    end = _ref.end
  return (
    local.format(start, 'd', culture) + ' — ' + local.format(end, 'd', culture)
  )
}

var timeRangeFormat = function timeRangeFormat(_ref2, culture, local) {
  var start = _ref2.start,
    end = _ref2.end
  return (
    local.format(start, 't', culture) + ' — ' + local.format(end, 't', culture)
  )
}

var timeRangeStartFormat = function timeRangeStartFormat(
  _ref3,
  culture,
  local
) {
  var start = _ref3.start,
    end = _ref3.end
  return local.format(start, 't', culture) + ' — '
}

var timeRangeEndFormat = function timeRangeEndFormat(_ref4, culture, local) {
  var start = _ref4.start,
    end = _ref4.end
  return ' — ' + local.format(end, 't', culture)
}

var weekRangeFormat = function weekRangeFormat(_ref5, culture, local) {
  var start = _ref5.start,
    end = _ref5.end
  return (
    local.format(start, 'MMM dd', culture) +
    ' - ' +
    local.format(
      end,
      _dates2.default.eq(start, end, 'month') ? 'dd' : 'MMM dd',
      culture
    )
  )
}

var formats = (exports.formats = {
  dateFormat: 'dd',
  dayFormat: 'ddd dd/MM',
  weekdayFormat: 'ddd',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,
  currentTimeIndicatorFormat: 'HH:mm',

  timeGutterFormat: 't',
  timeGutterHeaderFormat: 'ZZ',

  monthHeaderFormat: 'Y',
  dayHeaderFormat: 'dddd MMM dd',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'ddd MMM dd',
  agendaTimeFormat: 't',
  agendaTimeRangeFormat: timeRangeFormat,
})
