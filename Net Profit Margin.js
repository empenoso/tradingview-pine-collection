// Net Profit Margin — чистая рентабельность
// Процент выручки, остающийся после вычета всех расходов, включая налоги и проценты.
// 🟰> 10%, в идеале > 15%: высокая чистая маржа показывает сильную прибыльность после учета всех расходов, включая проценты и налоги.

// 09.04.2025

// Михаил Шардин, https://shardin.name/?utm_source=tradingview
//@version=6
indicator("Net Profit Margin: чистая рентабельность", overlay=false)

// Получение последних доступных данных NPM
NPM_quarterly = request.financial(syminfo.tickerid, 'NET_MARGIN', 'FQ')
// TTM — последние двенадцать месяцев, FY — финансовый год, FQ — финансовый квартал и FH — полугодовой

// Определение цвета фона
bg_color = NPM_quarterly >= 10 ? color.new(color.green, 90) : color.new(color.red, 90)

// Установка фона
bgcolor(bg_color, title="Фон рентабельности")

// Построение графика
plot(NPM_quarterly, 
     title="Net Profit Margin — чистая рентабельность", 
     color=color.yellow, 
     linewidth=2, 
     style=plot.style_line)

// Горизонтальные линии для уровней
hline(10, "10% уровень", color=color.silver, linestyle=hline.style_dotted)
hline(15, "15% уровень", color=color.silver, linestyle=hline.style_dotted)

// Вывод значения в данных
plotchar(NPM_quarterly, "NPM", "", location=location.top)