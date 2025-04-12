// This Pine Script® code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © Михаил Шардин, https://shardin.name/?utm_source=tradingview

//@version=6
indicator("Пример скользящих средних", overlay=true)

// Входные параметры
lengthMA = input.int(20, title="Период скользящих средних")
src = input(close, title="Источник данных")

// 1. Простая скользящая средняя (SMA)
smaValue = ta.sma(src, lengthMA)
plot(smaValue, "SMA", color=color.blue, linewidth=2)

// 2. Экспоненциальная скользящая средняя (EMA)
emaValue = ta.ema(src, lengthMA)
plot(emaValue, "EMA", color=color.red, linewidth=2)

// 3. Взвешенная скользящая средняя (WMA)
wmaValue = ta.wma(src, lengthMA)
plot(wmaValue, "WMA", color=color.green, linewidth=2)

// 4. Сглаженная скользящая средняя (SMMA)
smmaValue = ta.rma(src, lengthMA)
plot(smmaValue, "SMMA", color=color.purple, linewidth=2)

// Отображение цены для сравнения
plot(close, "Цена", color=color.black, linewidth=1)

// Легенда для отображения текущих значений
var table legendTable = table.new(position.top_right, 1, 6)
if barstate.islast
    table.cell(legendTable, 0, 0, "Тип MA", bgcolor=color.gray)
    table.cell(legendTable, 0, 1, "SMA: " + str.tostring(smaValue, format.mintick), bgcolor=color.blue)
    table.cell(legendTable, 0, 2, "EMA: " + str.tostring(emaValue, format.mintick), bgcolor=color.red)
    table.cell(legendTable, 0, 3, "WMA: " + str.tostring(wmaValue, format.mintick), bgcolor=color.green)
    table.cell(legendTable, 0, 4, "SMMA: " + str.tostring(smmaValue, format.mintick), bgcolor=color.purple)