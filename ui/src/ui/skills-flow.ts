export const CREATE_SKILL_BUTTON_LABEL = "Найти или создать скилл";

export function buildCreateSkillChatPrompt(): string {
  return [
    "Помоги подобрать новый скилл для этой задачи.",
    "Сначала проверь community skills через `npx -y clawhub search` и при необходимости дополни поиск в интернете.",
    "Если подходящего community skill нет, предложи создать локальный skill и опиши, что именно он должен делать.",
  ].join(" ");
}
