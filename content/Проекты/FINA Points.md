---
title: FINA Points
description: Демо-карточка проекта — калькулятор очков FINA.
noindex: true
tags:
  - проект
  - плавание
---

<span class="b-label">Проект</span>

Калькулятор очков FINA по времени заплыва. Живёт на [fina.borozdov.ru](https://fina.borozdov.ru).

<div class="b-actions">
  <a class="b-btn b-btn--primary" href="https://fina.borozdov.ru">Открыть</a>
  <a class="b-btn" href="https://github.com/borozdov/fina-points-calculator">Код</a>
</div>

## Как считаются очки

$$
P = 1000 \cdot \left(\frac{B}{T}\right)^3
$$

где $B$ — базовое время (мировой рекорд на начало сезона), $T$ — результат спортсмена.

| Дистанция | Базовое время | Результат | Очки |
| --- | ---: | ---: | ---: |
| 50 м в/с | 20.91 | 23.41 | 713 |
| 100 м в/с | 46.86 | 51.20 | 767 |
| 400 м в/с | 3:40.07 | 4:00.79 | 766 |

Связано: [[Как устроен этот блог]].
