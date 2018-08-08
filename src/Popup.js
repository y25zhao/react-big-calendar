import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import getOffset from 'dom-helpers/query/offset'
import getScrollTop from 'dom-helpers/query/scrollTop'
import getScrollLeft from 'dom-helpers/query/scrollLeft'
import dates from './utils/dates'

import Header from './Header'
import EventCell from './EventCell'
import { isSelected } from './utils/selection'

const propTypes = {
  position: PropTypes.object,
  getNow: PropTypes.func.isRequired,
  popupOffset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      maxWidth: PropTypes.number,
    }),
  ]),
  events: PropTypes.array,
  selected: PropTypes.object,
  maxWidth: PropTypes.number,

  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,
  slotStart: PropTypes.instanceOf(Date),
  slotEnd: PropTypes.instanceOf(Date),
}

class Popup extends React.Component {
  componentDidMount() {
    let { popupOffset = 5 } = this.props,
      { top, left, width, height } = getOffset(this.refs.root),
      viewBottom = window.innerHeight + getScrollTop(window),
      viewRight = window.innerWidth + getScrollLeft(window),
      bottom = top + height,
      right = left + width

    if (bottom > viewBottom || right > viewRight) {
      let topOffset, leftOffset

      if (bottom > viewBottom)
        topOffset = bottom - viewBottom + (popupOffset.y || +popupOffset || 0)
      if (right > viewRight)
        leftOffset = right - viewRight + (popupOffset.x || +popupOffset || 0)

      this.setState({ topOffset, leftOffset }) //eslint-disable-line
    }
  }

  render() {
    let {
      events,
      selected,
      getters,
      accessors,
      components,
      onSelect,
      onDoubleClick,
      slotStart,
      getNow,
      slotEnd,
      popupOffset = {},
      localizer,
    } = this.props

    let { left, width, top } = this.props.position,
      topOffset = (this.state || {}).topOffset || 0,
      leftOffset = (this.state || {}).leftOffset || 0

    let style = {
      top: Math.max(0, top - topOffset),
      left: left - leftOffset,
      minWidth: Math.min(popupOffset.maxWidth || Infinity, width + width / 2),
      maxWidth: popupOffset.maxWidth || 'auto',
    }

    let { popupHeader, ...eventComponents } = components

    let HeaderComponent = popupHeader || Header

    let today = getNow()

    let header = (
      <HeaderComponent
        date={slotStart}
        label={localizer.format(slotStart, 'dayHeaderFormat')}
        localizer={localizer}
      />
    )

    return (
      <div ref="root" style={style} className="rbc-overlay">
        <div
          className={cn('rbc-overlay-header', {
            'rbc-today': dates.eq(slotStart, today, 'day'),
          })}
        >
          {header}
        </div>
        <div className="rbc-overlay-content">
          {events.map((event, idx) => (
            <EventCell
              key={idx}
              type="popup"
              event={event}
              getters={getters}
              onSelect={onSelect}
              accessors={accessors}
              components={eventComponents}
              localizer={localizer}
              onDoubleClick={onDoubleClick}
              continuesPrior={dates.lt(accessors.end(event), slotStart, 'day')}
              continuesAfter={dates.gte(accessors.start(event), slotEnd, 'day')}
              selected={isSelected(event, selected)}
            />
          ))}
        </div>
      </div>
    )
  }
}

Popup.propTypes = propTypes

export default Popup
