# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## MCP Серверы

MCP (Model Context Protocol) серверы расширяют возможности через внешние инструменты.

### Как подключить новый MCP-сервер:

1. **Найди пакет на npm:**
   ```bash
   web_search("mcp <название> npm package")
   # или
   exec("npm search <название>-mcp")
   ```

2. **Добавь в конфиг через config.patch:**
   ```json
   {
     "mcpServers": {
       "<имя>": {
         "command": "npx",
         "args": ["-y", "<package-name>"],
         "env": {
           "API_KEY": "..." // если нужно
         }
       }
     }
   }
   ```

3. **Gateway перезапустится автоматически**

### Популярные MCP-серверы:

| Название | Пакет | Описание |
|----------|-------|----------|
| Google Sheets | @modelcontextprotocol/server-google-sheets | Работа с таблицами |
| Miro | miro-mcp-server | Доски и дизайн |
| Notion | @modelcontextprotocol/server-notion | База знаний |
| Slack | @modelcontextprotocol/server-slack | Мессенджер |
| GitHub | @modelcontextprotocol/server-github | Репозитории |
| Gmail | @modelcontextprotocol/server-gmail | Почта |
| Google Drive | @modelcontextprotocol/server-gdrive | Файлы |

### Важно:

- Проверяй реальное имя пакета на npm (не придумывай!)
- Если нужен API-ключ/OAuth — объясни как получить
- Некоторые серверы требуют дополнительных env переменных
