// https://smart-lab.ru/mobile/topic/1119895/#comment17905643
// Михаил Шардин, https://shardin.name/?utm_source=tradingview

//@version=5
indicator("Сила Тренда", shorttitle="ТрендСила", overlay=false, precision=4)

// Входные параметры
length = input.int(21, title="Период средней", minval=1)
maType = input.string("EMA", title="Тип средней", options=["SMA", "EMA", "WMA", "SMMA", "RMA", "DEMA", "TEMA", "HMA"])
src = input(close, title="Источник цены")
showLabels = input(true, title="Показывать метки на графике?")

// Расчет скользящей средней
maValue = switch maType
    "SMA" => ta.sma(src, length)
    "EMA" => ta.ema(src, length)
    "WMA" => ta.wma(src, length)
    "RMA" => ta.rma(src, length)
    "DEMA" => ta.ema(ta.ema(src, length), length)
    "TEMA" => ta.ema(ta.ema(ta.ema(src, length), length), length)
    "HMA" => ta.hma(src, length)

// Расчет силы тренда
trendStrength = (src - maValue) / maValue * 100  // Умножаем на 100 для процентов

// Визуализация
plot(trendStrength, title="Сила тренда", color=color.new(color.blue, 0), linewidth=2)

// Нулевая линия
hline(0, "Нулевая линия", color=color.new(color.black, 50), linestyle=hline.style_dotted)

// Вывод значений в таблицу
var table infoTable = table.new(position.bottom_right, 1, 1)
if barstate.islast
    table.cell(infoTable, 0, 0, "Сила тренда: " + str.tostring(trendStrength, "#.##%"), 
               bgcolor=color.new(trendStrength > 0 ? color.green : color.red, 90), 
               text_color=color.white)
