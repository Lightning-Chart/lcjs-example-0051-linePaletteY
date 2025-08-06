/**
 * Example showcasing Line Series feature for coloring line dynamically based on Y coordinates
 */

const lcjs = require('@lightningchart/lcjs')
const { lightningChart, PalettedFill, LUT, ColorRGBA, SolidFill, emptyFill, Themes } = lcjs

const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        legend: { visible: false },
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Line Chart with dynamic good/bad values highlighting')

const thresholdBadY = -30000
const thresholdGoodY = 10000
const colorBad = ColorRGBA(255, 0, 0)
const colorGood = ColorRGBA(0, 255, 0)

const axisX = chart.getDefaultAxisX()
const axisY = chart.getDefaultAxisY()

axisY
    .addConstantLine()
    .setPointerEvents(false)
    .setValue(thresholdBadY)
    .setStrokeStyle((stroke) => stroke.setFillStyle(new SolidFill({ color: colorBad.setA(50) })))

axisY
    .addConstantLine()
    .setPointerEvents(false)
    .setValue(thresholdGoodY)
    .setStrokeStyle((stroke) => stroke.setFillStyle(new SolidFill({ color: colorGood.setA(50) })))

fetch(new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'examples/assets/0051/data.json')
    .then((r) => r.json())
    .then((valuesY) => {
        const lineSeries = chart.addLineSeries().appendSamples({ yValues: valuesY })

        const colorNormal = lineSeries.getStrokeStyle().getFillStyle().getColor()
        const yMin = lineSeries.getYMin()
        const yPalette = new PalettedFill({
            lookUpProperty: 'y',
            lut: new LUT({
                interpolate: false,
                steps: [
                    { value: yMin, color: colorBad },
                    { value: thresholdBadY, color: colorNormal },
                    { value: thresholdGoodY, color: colorGood },
                ],
            }),
        })

        lineSeries.setStrokeStyle((stroke) => stroke.setFillStyle(yPalette))
        axisY.setStrokeStyle((stroke) => stroke.setFillStyle(yPalette))
    })
