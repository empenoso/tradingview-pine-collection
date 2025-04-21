// === Описание стратегии ===
// Эта стратегия основана на случайных входах в рынок с использованием трейлинг-стопов для управления рисками.
// Основные особенности:
// 1. Случайные входы: Стратегия генерирует случайные сигналы для входа в длинные (Long) или короткие (Short) позиции
//    с заданной вероятностью. Частота входов регулируется параметром "Частота входов (каждые N баров)".
// 2. Трейлинг-стоп: Для управления рисками используется трейлинг-стоп, который рассчитывается на основе ATR (Average True Range)
//    и заданного множителя. Трейлинг-стоп автоматически обновляется при движении цены в пользу позиции.
// 3. Гибкость настроек: Пользователь может настроить вероятность входа в длинную позицию, период ATR и множитель для трейлинг-стопа.

// Михаил Шардин, https://shardin.name/?utm_source=tradingview

//@version=6
strategy("Случайные входы + ATR трейлинг стоп", overlay=true, commission_type=strategy.commission.percent, commission_value=0.2)

// === Параметры ===
entryFrequency = input.int(24, "Частота входов (каждые N баров)", minval=1)
longProbability = input.int(50, "Вероятность входа в Long (%)", minval=0, maxval=100)
atrPeriod = input.int(14, "Период ATR")
atrMultiplier = input.float(2.0, "Множитель ATR", minval=0.1)

// === ATR для трейлинг-стопов ===
atr = ta.atr(atrPeriod)

// === Сигнал на вход ===
entrySignal = bar_index % entryFrequency == 0 and bar_index > 0  // Игнорируем первый бар

// === Гарантированный рандом ===  
randValue = math.random(0, 100)  // Генерация случайного числа от 0 до 100
randDirection = randValue < longProbability ? 1 : -1  // 1 = Long, -1 = Short

// === Условие входа ===
longCondition = entrySignal and randDirection == 1 and strategy.position_size == 0
shortCondition = entrySignal and randDirection == -1 and strategy.position_size == 0

// === Переменные для трейлинг-стопов ===
var float trailingStopLong = na
var float trailingStopShort = na

// === Вход в позиции ===
if (longCondition)
    strategy.entry("Long", strategy.long)
    trailingStopLong := close - atr * atrMultiplier
    // label.new(bar_index, high, "Открыт LONG", color=color.green, style=label.style_label_down, textcolor=color.white)

if (shortCondition)
    strategy.entry("Short", strategy.short)
    trailingStopShort := close + atr * atrMultiplier
    // label.new(bar_index, low, "Открыт SHORT", color=color.red, style=label.style_label_up, textcolor=color.white)

// === Обновление трейлинг-стопа ===
if (strategy.position_size > 0)  // Если открыта длинная позиция
    trailingStopLong := math.max(trailingStopLong, close - atr * atrMultiplier)
    if (close <= trailingStopLong)  // Закрытие по трейлинг-стопу
        strategy.close("Long")
        // label.new(bar_index, high, "Закрыт LONG", color=color.green, style=label.style_label_down, textcolor=color.white)

if (strategy.position_size < 0)  // Если открыта короткая позиция
    trailingStopShort := math.min(trailingStopShort, close + atr * atrMultiplier)
    if (close >= trailingStopShort)  // Закрытие по трейлинг-стопу
        strategy.close("Short")
        // label.new(bar_index, low, "Закрыт SHORT", color=color.red, style=label.style_label_up, textcolor=color.white)

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