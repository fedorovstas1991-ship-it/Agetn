# Agetn

Локальный рабочий репозиторий проекта YAgent/OpenClaw с актуальным кодом, скриптами запуска и историей изменений.

## Главный контекст

Перед любой работой сначала откройте:

- [`YANDEXAGETN.md`](./YANDEXAGETN.md)

Это основной журнал проекта: текущий статус, что уже исправлено, бэклог, сценарии запуска и known issues.

## Репозиторий

- GitHub: `https://github.com/fedorovstas1991-ship-it/Agetn`
- Локальный путь: путь вашего локального clone (определяйте через `pwd` в корне репозитория)

## Быстрый старт (локально)

```bash
cd <path-to-Agetn>
pnpm install
./scripts/sync-skills.sh
./scripts/build-autonomous.sh
./yagent-onboard-ui.command
```

## Куда смотреть в коде

- `src/` — backend/gateway/агенты/интеграции
- `ui/` — Control UI
- `extensions/` — локальные плагины (например, `memory-core`, `telegram`)
- `scripts/` — запуск, сборка, диагностика, e2e/integration сценарии
- `skills/` — bundled skills для автономной локальной работы
- `docs/plans/` — дизайн/планы внедрений
- `test/` — integration/e2e тесты

## Операционный минимум для следующего агента

1. Прочитать `YANDEXAGETN.md` целиком.
2. Проверить текущую ветку и рабочее дерево:
   - `git status --short --branch`
3. Работать из этого репозитория (`Agetn`), не из старого `YandexAgetn`.
4. После значимых изменений обновлять `YANDEXAGETN.md`.

## Полезные команды

```bash
# Unit/UI
pnpm test
pnpm --dir ui test

# Автономная проверка окружения
./scripts/verify-isolation.sh
./scripts/test-autonomous-setup.sh

# Логи gateway (runtime)
tail -f ~/.yagent-yagent/logs/gateway.log
```

## Примечание

Старый репозиторий `YA-Proj` больше не использовать как основную точку работы. Актуальная база разработки — `Agetn`.
