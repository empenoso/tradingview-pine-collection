// https://smart-lab.ru/mobile/topic/1119895/#comment18037622
// Михаил Шардин, https://shardin.name/?utm_source=tradingview

//@version=5
indicator("Усовершенствованная Сила Тренда", shorttitle="ТрендСила Pro", overlay=false, precision=4)

// Входные параметры
fastLength = input.int(9, title="Быстрый период", minval=1)
slowLength = input.int(21, title="Медленный период", minval=1)
maType = input.string("EMA", title="Тип средней", options=["SMA", "EMA", "WMA", "HMA"])
showHistogram = input(true, title="Показывать гистограмму?")
showZeroLine = input(true, title="Показывать нулевую линию?")

// Расчет скользящих средних
ma(source, length, type) =>
    switch type
        "SMA" => ta.sma(source, length)
        "EMA" => ta.ema(source, length)
        "WMA" => ta.wma(source, length)
        "HMA" => ta.hma(source, length)

fastMA = ma(close, fastLength, maType)
slowMA = ma(close, slowLength, maType)

// Улучшенный расчет силы тренда (относительное отклонение быстрой MA от медленной)
trendStrength = (fastMA - slowMA) / slowMA * 100  // В процентах

// Визуализация
plot(showHistogram ? trendStrength : na, title="Сила тренда", 
     style=plot.style_columns, 
     color=trendStrength >= 0 ? color.new(color.green, 20) : color.new(color.red, 20))

plot(trendStrength, title="Линия силы", color=color.new(color.blue, 0), linewidth=2)

// Нулевая линия
hline(0, "Нулевая линия", color=color.new(color.black, 50), linestyle=hline.style_dotted)

// Информационная панель
var table infoTable = table.new(position.bottom_right, 1, 1)
if barstate.islast
    table.cell(infoTable, 0, 0, "Сила тренда: " + str.tostring(trendStrength, "#.##%") + 
               "\nFast MA: " + str.tostring(fastMA, format.volume) +
               "\nSlow MA: " + str.tostring(slowMA, format.volume),
               bgcolor=color.new(color.gray, 90), 
               text_color=color.black)