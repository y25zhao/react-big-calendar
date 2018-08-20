import PropTypes from 'prop-types'
import elementType from 'react-prop-types/lib/elementType'
import all from 'react-prop-types/lib/all'
import { views as Views } from './constants'

export { elementType }

export let eventComponent = PropTypes.oneOfType([
  elementType,
  PropTypes.shape({
    month: elementType,
    week: elementType,
    day: elementType,
    agenda: elementType,
  }),
])

let viewNames = Object.keys(Views).map(k => Views[k])

export let accessor = PropTypes.oneOfType([PropTypes.string, PropTypes.func])

export let dateFormat = PropTypes.any

export let dateRangeFormat = PropTypes.func

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
export let views = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.oneOf(viewNames)),
  all(PropTypes.object, (props, name, ...args) => {
    let prop = props[name],
      err

    Object.keys(prop).every(key => {
      let isBuiltinView =
        viewNames.indexOf(key) !== -1 && typeof prop[key] === 'boolean'

      return isBuiltinView || !(err = elementType(prop, key, ...args))
    })

    return err || null
  }),
])

export let popupOffsetShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
  }),
])
