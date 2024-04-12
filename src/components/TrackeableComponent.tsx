import React from 'react'

import { withTracking } from '../withTracking'

const Component = (): JSX.Element => {
  return (
    <div>TrackeableComponent</div>
  )
}

export const TrackeableComponent = withTracking(Component)
