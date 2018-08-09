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

storiesOf('BB Work Custom', module).add('demo', () => (
  <Calendar
    popup
    events={events}
    onSelectEvent={action('event selected')}
    popupOffset={{
      x: 0,
      y: 0,
      maxWidth: 320,
    }}
    isExpandable={{
      x: 240,
      y: 100,
    }}
    smallEventBoundary={120}
    scrollToTime={moment('08', 'hh').toDate()}
    maxAllDayEvents={4}
    components={{
      timeGutterHeader: ({ label }) => {
        return <b>{label}GMT</b>
      },
      day: {
        event: () => <span>Foo!</span>,
        allDayEvent: () => <b>Boo!</b>,
      },
    }}
  />
))
