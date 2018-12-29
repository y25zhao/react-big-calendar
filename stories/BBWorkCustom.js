import { storiesOf, action } from '@storybook/react'
import moment from 'moment'
import React from 'react'
import raw from './helpers/BBEvents.json'

import '../src/less/styles.less'
import '../src/addons/dragAndDrop/styles.less'
import createEvents from './helpers/createEvents'

import { Calendar } from './helpers'
// [
//   ...createEvents(0, new Date()),
//   ...createEvents(1, new Date(), true),
// ]

const events = raw.map(event => ({
  ...event,
  start: new Date(event.start),
  end: new Date(event.end),
}))

events.length = 400

storiesOf('BB Work Custom', module).add('demo', () => (
  <Calendar
    popup
    events={events}
    selectable={false}
    overlayOffset={{
      x: 0,
      y: 0,
      width: 320,
    }}
    detailOffset={{
      y: 8,
      x: 8,
      width: 480,
    }}
    isExpandable={{
      x: 240,
      y: 100,
    }}
    smallEventBoundary={120}
    scrollToTime={moment('08', 'hh').toDate()}
    maxAllDayEvents={4}
    onDoubleClickEvent={action('Double clicked')}
    components={{
      detailView: event => {
        return (
          <b className="rbc-popup">
            <div>Boo! {event.label}</div>
            <div>Boo!</div>
            <div>Boo!</div>
            <div>Boo!</div>
            <div>Boo!</div>
            <div>Boo!</div>
          </b>
        )
      },
      timeGutterHeader: ({ label }) => {
        return <b>{label}GMT</b>
      },
      // month: {
      //   event: ({onClick, eventData, title}) => <div className='rbc-inline-event' onClick={onClick}>{title}</div>,
      // },
      // week: {
      //   event: ({onClick, eventData, title}) => <div className='rbc-inline-event' onClick={onClick}>{title}</div>,
      // },
      // day: {
      //   event: ({onClick, eventData, title}) => <div className='rbc-inline-event' onClick={onClick}>{title}</div>,
      //   allDayEvent: () => <b>Boo!</b>,
      // },
    }}
  />
))
