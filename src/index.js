/**
 * Example showcasing Line Series feature for coloring line dynamically based on Y coordinates
 */

const lcjs = require('@arction/lcjs')
const { lightningChart, PalettedFill, LUT, ColorRGBA, SolidFill, Themes } = lcjs

const chart = lightningChart()
    .ChartXY({
        // theme: Themes.darkGold
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
    .setMouseInteractions(false)
    .setValue(thresholdBadY)
    .setStrokeStyle((stroke) => stroke.setFillStyle(new SolidFill({ color: colorBad.setA(50) })))

axisY
    .addConstantLine()
    .setMouseInteractions(false)
    .setValue(thresholdGoodY)
    .setStrokeStyle((stroke) => stroke.setFillStyle(new SolidFill({ color: colorGood.setA(50) })))

fetch(document.head.baseURI + 'examples/assets/0051/data.json')
    .then((r) => r.json())
    .then((valuesY) => {
        const lineSeries = chart
            .addLineSeries({
                dataPattern: {
                    pattern: 'ProgressiveX',
                },
            })
            .addArrayY(valuesY)

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
