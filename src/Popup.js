import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import dates from './utils/dates'

import Header from './Header'
import EventCell from './EventCell'
import { isSelected } from './utils/selection'

export default class Popup extends React.Component {
  static propTypes = {
    getNow: PropTypes.func.isRequired,
    events: PropTypes.array,
    selected: PropTypes.object,
    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,
    localizer: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    slotStart: PropTypes.instanceOf(Date),
    slotEnd: PropTypes.instanceOf(Date),
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
      onClick,
      slotStart,
      getNow,
      slotEnd,
      localizer,
    } = this.props

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
      <div className="rbc-popup">
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
              onClick={onClick}
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
