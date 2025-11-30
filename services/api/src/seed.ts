import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const compliments = [
    "Ты озаряешь моё утро",
    "Твоя улыбка делает мир теплее",
    "С тобой всё кажется возможным",
    "Ты — лучшее в моей жизни",
    "Твоя доброта вдохновляет"
  ];
  for (const text of compliments) {
    await prisma.compliment.create({ data: { text } });
  }

  // Примеры memory (по 5 дней)
  await prisma.memory.createMany({
    data: [
      { day: 1, title: "Наше первое свидание", text: "Помнишь, как мы встретились у кофейни?", imagePath: null },
      { day: 2, title: "Прогулка у озера", text: "Мы стояли и смотрели на закат...", imagePath: null },
      { day: 3, title: "Концерт", text: "Твой смех в толпе — я никогда не забуду", imagePath: null },
      { day: 4, title: null, text: "Тот тёплый вечер с пледом", imagePath: null },
      { day: 5, title: "Фото в дождь", text: "Ты танцевала под дождём", imagePath: null }
    ]
  });

  console.log("Seed finished");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
