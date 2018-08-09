import { storiesOf, action } from '@storybook/react'
import moment from 'moment'
import React from 'react'

import '../src/less/styles.less'
import '../src/addons/dragAndDrop/styles.less'
import createEvents from './helpers/createEvents'

import { events, Calendar } from './helpers'

storiesOf('BB Work Custom', module).add('demo', () => (
  <Calendar
    popup
    events={[
      ...createEvents(0, new Date()),
      ...createEvents(1, new Date(), true),
    ]}
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
