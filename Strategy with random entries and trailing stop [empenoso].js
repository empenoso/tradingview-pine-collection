// === Описание стратегии ===
// Эта стратегия основана на случайных входах в рынок с использованием простого трейлинг-стопа для управления рисками.
// Основные особенности:
// 1. Случайные входы: Стратегия совершает входы в длинные (Long) или короткие (Short) позиции с заданной вероятностью
//    каждые N баров. Частота входов регулируется параметром "Частота входов (каждые N баров)".
// 2. Генерация направлений: Для определения направления входа используется генератор случайных чисел. 
//    Если случайное значение меньше установленной вероятности входа в Long, открывается длинная позиция, иначе — короткая.
// 3. Простой трейлинг-стоп: После входа в позицию устанавливается трейлинг-стоп на заданном расстоянии в процентах от цены.
//    Трейлинг-стоп обновляется при движении цены в благоприятную сторону, защищая прибыль и минимизируя убытки.
// 4. Гибкость настроек: Пользователь может задать вероятность входа в Long, частоту входов и размер трейлинг-стопа.
// 5. Отображение трейлинг-стопа: На графике отображаются уровни трейлинг-стопов для активных позиций, что позволяет
//    визуально контролировать ход торговли.

// Михаил Шардин, https://shardin.name/?utm_source=tradingview

//@version=6
strategy("Случайные входы + простой трейлинг стоп", overlay=true, commission_type=strategy.commission.percent, commission_value=0.2)

// === Параметры ===
entryFrequency = input.int(24, "Частота входов (каждые N баров)", minval=1)
longProbability = input.int(50, "Вероятность входа в Long (%)", minval=0, maxval=100)
trailingStopOffset = input.float(1.6, "Отступ трейлинг-стопа (%)", step=0.1, minval=0.1)

// === Сигнал на вход ===
entrySignal = bar_index % entryFrequency == 0 and bar_index > 0  // Игнорируем первый бар

// === Гарантированный рандом ===  
randValue = math.random(0, 100)  // Генерация случайного числа от 0 до 100
randDirection = randValue < longProbability ? 1 : -1  // 1 = Long, -1 = Short

// === Переменные для трейлинг-стопов ===
var float highestLongPrice = na
var float lowestShortPrice = na
var float trailingStopLong = na
var float trailingStopShort = na

// === Условие входа ===
longCondition = entrySignal and randDirection == 1 and strategy.position_size == 0
shortCondition = entrySignal and randDirection == -1 and strategy.position_size == 0

// === Вход в позиции ===
if (longCondition)
    strategy.entry("Long", strategy.long)
    highestLongPrice := close
    trailingStopLong := close * (1 - trailingStopOffset / 100)

if (shortCondition)
    strategy.entry("Short", strategy.short)
    lowestShortPrice := close
    trailingStopShort := close * (1 + trailingStopOffset / 100)

// === Обновление трейлинг-стопа ===
if (strategy.position_size > 0)  // Если открыта длинная позиция
    highestLongPrice := math.max(highestLongPrice, close)
    trailingStopLong := highestLongPrice * (1 - trailingStopOffset / 100)
    
    if (close <= trailingStopLong)  // Закрытие по трейлинг-стопу
        strategy.close("Long")

if (strategy.position_size < 0)  // Если открыта короткая позиция
    lowestShortPrice := math.min(lowestShortPrice, close)
    trailingStopShort := lowestShortPrice * (1 + trailingStopOffset / 100)
    
    if (close >= trailingStopShort)  // Закрытие по трейлинг-стопу
        strategy.close("Short")

// === Отображение трейлинг-стопов ===
plot(strategy.position_size > 0 ? trailingStopLong : na, title="Лонг трейлинг-стоп", color=color.green, linewidth=2, style=plot.style_linebr)
plot(strategy.position_size < 0 ? trailingStopShort : na, title="Шорт трейлинг-стоп", color=color.red, linewidth=2, style=plot.style_linebr)

// === Информация для отладки ===
if (barstate.islast)
    label.new(bar_index, high, 
         "Текущий индекс бара: " + str.tostring(bar_index) + 
         "\nСледующая сделка через: " + str.tostring(entryFrequency - (bar_index % entryFrequency)) + " баров" +
         "\nНаправление следующей: " + (randDirection == 1 ? "LONG" : "SHORT") +
         "\nТекущая позиция: " + (strategy.position_size > 0 ? "LONG" : strategy.position_size < 0 ? "SHORT" : "НЕТ"), 
         color=color.blue, style=label.style_label_down)