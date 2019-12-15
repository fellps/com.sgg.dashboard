import React from 'react'

import { ResponsiveLine } from '@nivo/line'

const commonProperties = {
  // width: 900,
  // height: 400,
  // margin: { top: 20, right: 20, bottom: 60, left: 80 },
  // data,
  animate: true,
  enableSlices: 'x',
}

export default function LineChart ({ data, ...restProps }) {
  return (
    <ResponsiveLine
      {...commonProperties}
      curve='monotoneX'
      data={[data]}
      margin={{
        top: 50,
        right: 50,
        bottom: 50,
        left: 100
      }}
      xScale={{
        type: 'point'
      }}
      yScale={{
        type: 'linear',
        stacked: true,
        min: 'auto',
        max: 'auto'
      }}
      minY='auto'
      maxY='auto'
      stacked
      axisTop={null}
      axisRight={null}
      // axisBottom={{
      //     'orient': 'bottom',
      //     'tickSize': 5,
      //     'tickPadding': 5,
      //     'tickRotation': 0,
      //     'legend': 'transportation',
      //     'legendOffset': 36,
      //     'legendPosition': 'middle'
      // }}
      // axisLeft={{
      //     'orient': 'left',
      //     'tickSize': 5,
      //     'tickPadding': 5,
      //     'tickRotation': 0,
      //     'legend': 'count',
      //     'legendOffset': -50,
      //     'legendPosition': 'middle'
      // }}
      dotSize={20}
      dotColor='inherit:darker(0.3)'
      dotBorderWidth={2}
      dotBorderColor='#ffffff'
      enableDotLabel
      dotLabel='y'
      dotLabelYOffset={-12}
      animate
      motionStiffness={90}
      motionDamping={15}
      lineWidth={5}
      {...restProps}
    />
  )
}
