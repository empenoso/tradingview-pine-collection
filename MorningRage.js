// Михаил Шардин, https://shardin.name/?utm_source=tradingview
// 21.03.2025

//@version=6
indicator("Morning Rage Indicator", overlay=true)

// Параметры временных диапазонов
rangeStartHour = input.int(8, "Начало диапазона - час")
rangeStartMinute = input.int(45, "Начало диапазона - минута")
rangeEndHour = input.int(10, "Конец диапазона - час")
rangeEndMinute = input.int(45, "Конец диапазона - минута")

// Источники данных для расчета High/Low диапазона
rangeHighSource = input.source(high, "Источник для Range High")
rangeLowSource = input.source(low, "Источник для Range Low")

// Проверка нового дня
isNewDay = year != year[1] or month != month[1] or dayofmonth != dayofmonth[1]

// Функция для проверки времени
isTime(h, m) =>
    hour == h and minute == m

// Определение периода формирования диапазона
isRangePeriod = (hour > rangeStartHour or (hour == rangeStartHour and minute >= rangeStartMinute)) and (hour < rangeEndHour or (hour == rangeEndHour and minute <= rangeEndMinute))

// Расчет максимума и минимума диапазона
var float rangeHigh = 0.0
var float rangeLow = 10e10
var bool rangeCalculated = false

// Сброс диапазона в начале нового дня
if isNewDay
    rangeHigh := rangeHighSource
    rangeLow := rangeLowSource
    rangeCalculated := false

// Обновление диапазона только в указанный период
if isRangePeriod and not rangeCalculated
    rangeHigh := math.max(rangeHigh, rangeHighSource)
    rangeLow := math.min(rangeLow, rangeLowSource)
    
    // Помечаем диапазон как рассчитанный после окончания периода
    if hour == rangeEndHour and minute == rangeEndMinute
        rangeCalculated := true

// Получаем цену закрытия в момент окончания диапазона
var float rangeClose = na
if hour == rangeEndHour and minute == rangeEndMinute
    rangeClose := close

// Визуализация на графике
bgcolor(isRangePeriod and not rangeCalculated ? color.new(color.blue, 90) : na)

// Рисуем уровни диапазона
plot(rangeCalculated ? rangeHigh : na, "Range High", color.green, 2, plot.style_circles)
plot(rangeCalculated ? rangeLow : na, "Range Low", color.red, 2, plot.style_circles)

// Выводим метки с информацией
var table infoTable = table.new(position.top_right, 1, 1)
if barstate.islast
    table.cell(infoTable, 0, 0, "Range High: " + str.tostring(rangeHigh) + 
               "\nRange Low: " + str.tostring(rangeLow), 
               bgcolor=color.new(color.gray, 80))