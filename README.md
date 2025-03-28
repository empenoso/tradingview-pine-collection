# 🚀 Pine Script TradingView Collection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TradingView](https://img.shields.io/badge/Pine_Script-v5-blue)](https://www.tradingview.com/pine-script-docs/en/v5/)

Коллекция полезных индикаторов и стратегий на Pine Script для TradingView. Подходит для торговли фьючерсами, акциями и криптовалютами.

## ⚡ Установка
1. Скопируйте код нужного индикатора/стратегии
2. В TradingView откройте редактор Pine Script (📜)
3. Вставьте код и нажмите "Сохранить"
4. Добавьте на график

## 📊 Список скриптов

### 📈 Индикаторы
- **Trend Strength** - Сила тренда (отклонение цены от MA в %)
- 

### ⚔️ Стратегии
- 

## 🛠 Как использовать
Каждый скрипт содержит настраиваемые параметры:
```pinescript
length = input(21, "Период средней")
maType = input("EMA", "Тип средней", options=["EMA", "SMA", "WMA"])
