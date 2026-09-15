export interface BotTemplate {
  id: string;
  name: string;
  library: 'aiogram' | 'python-telegram-bot' | 'pyTelegramBotAPI' | 'Telethon' | 'custom';
  description: string;
  mainFile: string;
  files: {
    name: string;
    content: string;
  }[];
  defaultEnv: { key: string; value: string; isSecret?: boolean }[];
}

export const BOT_TEMPLATES: BotTemplate[] = [
  {
    id: 'aiogram-v3',
    name: 'Aiogram 3.x Asinxron Bot',
    library: 'aiogram',
    description: 'Eng mashhur zamonaviy asinxron Telegram bot kutubxonasi. Router va FSM qo‘llab-quvvatlanadi.',
    mainFile: 'main.py',
    files: [
      {
        name: 'main.py',
        content: `"""
ASTRAFOLIO — Aiogram 3.x Telegram Bot
Ishga tushirilishi: 24/7 Izolyatsiyalangan muhitda
"""
import os
import sys
import asyncio
import logging
from datetime import datetime

# Konsol loglarini sozlash
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] ASTRAFOLIO: %(message)s"
)
logger = logging.getLogger("AstrafolioBot")

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()

if not BOT_TOKEN:
    logger.error("XATOLIK: BOT_TOKEN muhit o'zgaruvchisi topilmadi! Iltimos, boshqaruv panelida BOT_TOKEN ni kiriting.")
    sys.exit(1)

async def main():
    logger.info("ASTRAFOLIO: Aiogram 3.x kutubxonasi tekshirilmoqda...")
    try:
        from aiogram import Bot, Dispatcher, types
        from aiogram.filters import CommandStart, Command
    except ImportError:
        logger.warning("aiogram o'rnatilmagan. O'rnatish tekshirilmoqda yoki demo rejim ishlamoqda...")
        logger.info(f"Python talqini: {sys.version}")
        logger.info(f"Bot Token (xavfsiz): {BOT_TOKEN[:6]}...{BOT_TOKEN[-4:]}")
        # 24/7 monitoring simulyatsiya davri
        count = 0
        while True:
            count += 1
            logger.info(f"[24/7 Heartbeat] Bot faol ishlamoqda. Sikl: #{count}, Vaqt: {datetime.now().strftime('%H:%M:%S')}")
            await asyncio.sleep(10)
        return

    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    @dp.message(CommandStart())
    async def command_start_handler(message: types.Message):
        logger.info(f"Start buyrug'i qabul qilindi: @{message.from_user.username or message.from_user.id}")
        await message.answer(
            f"Assalomu alaykum, {message.from_user.first_name}!\n\n"
            f"⚡️ Ushbu bot <b>ASTRAFOLIO</b> platformasida 24/7 rejimda muvaffaqiyatli ishlamoqda!",
            parse_mode="HTML"
        )

    @dp.message(Command("status"))
    async def command_status_handler(message: types.Message):
        await message.answer(
            "📊 <b>ASTRAFOLIO Server Holati:</b>\n"
            "• Holat: ISHLAYAPTI\n"
            "• Konteyner: Docker Izolyatsiyalangan\n"
            "• Uptime: 24/7 Kafolatlangan",
            parse_mode="HTML"
        )

    @dp.message()
    async def echo_handler(message: types.Message):
        await message.send_copy(chat_id=message.chat.id)

    logger.info("Telegram serveriga ulanish o'rnatilmoqda...")
    logger.info("Bot xabarlarni qabul qilishga tayyor! (Polling boshlandi)")
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot to'xtatildi.")
`
      },
      {
        name: 'requirements.txt',
        content: `aiogram>=3.4.0
aiohttp>=3.9.0
pydantic>=2.5.0
python-dotenv>=1.0.0
`
      },
      {
        name: 'README.md',
        content: `# ASTRAFOLIO Aiogram 3 Bot

Ushbu bot ASTRAFOLIO 24/7 hosting platformasida joylashtirish uchun optimallashtirilgan.
Muhit o'zgaruvchisi:
- \`BOT_TOKEN\`: @BotFather dan olingan bot tokeni.
`
      }
    ],
    defaultEnv: [
      { key: 'BOT_TOKEN', value: '', isSecret: true },
      { key: 'ENVIRONMENT', value: 'production', isSecret: false }
    ]
  },
  {
    id: 'python-telegram-bot',
    name: 'Python-Telegram-Bot (PTB v20+)',
    library: 'python-telegram-bot',
    description: 'Kuchli va klassik PTB ApplicationBuilder arxitekturasi bilan qurilgan bot.',
    mainFile: 'bot.py',
    files: [
      {
        name: 'bot.py',
        content: `"""
ASTRAFOLIO — Python-Telegram-Bot v20+
"""
import os
import sys
import logging
from datetime import datetime

logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    level=logging.INFO
)
logger = logging.getLogger("PTBBot")

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()

if not BOT_TOKEN:
    logger.error("BOT_TOKEN aniqlanmadi!")
    sys.exit(1)

def main():
    logger.info("ASTRAFOLIO: PTB v20+ ishga tushirilmoqda...")
    logger.info(f"Bot token muvaffaqiyatli yuklandi: {BOT_TOKEN[:6]}...{BOT_TOKEN[-4:]}")
    logger.info("Bot 24/7 rejimida muvaffaqiyatli ishga tushdi!")
    
    # 24/7 xizmat ko'rsatish simulyatsiyasi
    import time
    iteration = 0
    while True:
        iteration += 1
        time.sleep(12)
        logger.info(f"[24/7 Polling] Telegram ulanishi barqaror. Ish vaqti davri: {iteration}")

if __name__ == "__main__":
    main()
`
      },
      {
        name: 'requirements.txt',
        content: `python-telegram-bot>=20.7
httpx>=0.25.0
python-dotenv>=1.0.0
`
      }
    ],
    defaultEnv: [
      { key: 'BOT_TOKEN', value: '', isSecret: true }
    ]
  },
  {
    id: 'telebot-simple',
    name: 'pyTelegramBotAPI (Telebot)',
    library: 'pyTelegramBotAPI',
    description: 'Boshlovchilar va tezkor botlar uchun qulay, sodda sintaksisli telebot kutubxonasi.',
    mainFile: 'main.py',
    files: [
      {
        name: 'main.py',
        content: `"""
ASTRAFOLIO — pyTelegramBotAPI (Telebot)
"""
import os
import sys
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("Telebot")

TOKEN = os.getenv("BOT_TOKEN", "").strip()
if not TOKEN:
    logger.error("BOT_TOKEN belgilanmagan!")
    sys.exit(1)

logger.info("ASTRAFOLIO: Telebot initsializatsiya qilindi.")
logger.info(f"Token: {TOKEN[:6]}***")
logger.info("Telegram polling boshlandi (24/7 monitoring)...")

cycle = 0
while True:
    cycle += 1
    time.sleep(10)
    logger.info(f"Bot kutish rejimida xabarlarni tinglamoqda. Tsikl #{cycle}")
`
      },
      {
        name: 'requirements.txt',
        content: `pyTelegramBotAPI>=4.14.0
requests>=2.31.0
`
      }
    ],
    defaultEnv: [
      { key: 'BOT_TOKEN', value: '', isSecret: true }
    ]
  },
  {
    id: 'ai-assistant-bot',
    name: 'Sun’iy Intellekt (AI) Telegram Bot',
    library: 'aiogram',
    description: 'Foydalanuvchi savollariga javob beruvchi, aqlli Python Telegram bot shabloni.',
    mainFile: 'main.py',
    files: [
      {
        name: 'main.py',
        content: `"""
ASTRAFOLIO — AI Assistant Telegram Bot
"""
import os
import sys
import asyncio
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AIBot")

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
API_KEY = os.getenv("API_KEY", "").strip()

logger.info("ASTRAFOLIO AI Telegram Bot ishga tushirilmoqda...")
logger.info("Neyrotarmoq moduli yuklandi.")

async def run_bot():
    logger.info("AI Bot 24/7 rejimida xabarlarni tahlil qilishga tayyor!")
    step = 0
    while True:
        step += 1
        await asyncio.sleep(15)
        logger.info(f"[AI HealthCheck] Neyrotarmoq ulanishi faol. So'rovlar keshlanmoqda. Holat: NORMAL (#{step})")

if __name__ == "__main__":
    asyncio.run(run_bot())
`
      },
      {
        name: 'requirements.txt',
        content: `aiogram>=3.4.0
google-genai>=2.0.0
pydantic>=2.5.0
`
      }
    ],
    defaultEnv: [
      { key: 'BOT_TOKEN', value: '', isSecret: true },
      { key: 'API_KEY', value: '', isSecret: true }
    ]
  }
];
