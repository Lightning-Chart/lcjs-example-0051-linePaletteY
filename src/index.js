window.lcjsSmallView = window.devicePixelRatio >= 2
if (!window.__lcjsDebugOverlay) {
    window.__lcjsDebugOverlay = document.createElement('div')
    window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
    const attach = () => { if (document.body && !window.__lcjsDebugOverlay.parentNode) document.body.appendChild(window.__lcjsDebugOverlay) }
    attach()
    setInterval(() => {
        attach()
        window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + window.lcjsSmallView
    }, 500)
}
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
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    return t && window.lcjsSmallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.lcjsSmallView ? lcjs.htmlTextRenderer : undefined,
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
