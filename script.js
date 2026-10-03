/* ============================================================
   HTMLJORA — interpreter + blocks + i18n (10 languages)
   ============================================================ */

/* ================= STATE ================= */
const editor     = document.getElementById('editor');
const gutter     = document.getElementById('gutter');
const outputEl   = document.getElementById('output');
const statusEl   = document.getElementById('status');
const filenameEl = document.getElementById('filename');

let currentFileName = 'Project.hj';
let blocks = [];

/* ⬇️ English by default */
let currentLang = localStorage.getItem('htmljora.lang') || 'en';

/* ============================================================
   LANGUAGES
   ============================================================ */

const LANGS = [
  { code: 'en', flag: '🇬🇧', name: 'English'   },
  { code: 'ru', flag: '🇷🇺', name: 'Русский'   },
  { code: 'es', flag: '🇪🇸', name: 'Español'   },
  { code: 'fr', flag: '🇫🇷', name: 'Français'  },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch'   },
  { code: 'it', flag: '🇮🇹', name: 'Italiano'  },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'zh', flag: '🇨🇳', name: '中文'      },
  { code: 'ja', flag: '🇯🇵', name: '日本語'    },
  { code: 'ar', flag: '🇸🇦', name: 'العربية'   },
];

const I18N = {
  en: {
    'brand.subtitle': 'programming language in the browser',
    'btn.new': 'New',
    'btn.open': 'Open .hj',
    'btn.save': 'Save',
    'btn.help': '📖 Cheatsheet',
    'btn.run': '▶ Run',
    'tab.code': '💻 Code editor',
    'tab.blocks': '🧩 Blocks',
    'hint.shortcuts': 'Ctrl+Enter — run · Ctrl+S — save',
    'panel.output': '⚡ Program output',
    'panel.clear': 'Clear',
    'output.placeholder': 'Program output will appear here...',
    'blocks.toolbar.title': '🧩 Block builder',
    'blocks.clear': 'Clear',
    'blocks.toCode': '→ To editor',
    'blocks.addBlock': '+ block',
    'blocks.choose': 'Choose a block',
    'blocks.clear.confirm': 'Clear all blocks?',
    'editor.clear.confirm': 'Clear editor?',
    'lang.title': '🌐 Choose language',
    'status.ready': 'Ready',
    'status.running': 'Running...',
    'status.done': 'Done',
    'status.error': 'Error',
    'status.newFile': 'New file',
    'status.saved': 'Saved: Project.hj',
    'status.opened': 'Opened: ',
    'status.fromBlocks': 'Code generated from blocks',
    'status.programDone': '✓ Program finished successfully',
    'status.programErr': '✗ Error: ',
  },
  ru: {
    'brand.subtitle': 'язык программирования в браузере',
    'btn.new': 'Новый',
    'btn.open': 'Открыть .hj',
    'btn.save': 'Сохранить',
    'btn.help': '📖 Шпаргалка',
    'btn.run': '▶ Запустить',
    'tab.code': '💻 Редактор кода',
    'tab.blocks': '🧩 Блоки',
    'hint.shortcuts': 'Ctrl+Enter — запуск · Ctrl+S — сохранить',
    'panel.output': '⚡ Вывод программы',
    'panel.clear': 'Очистить',
    'output.placeholder': 'Здесь появится вывод программы...',
    'blocks.toolbar.title': '🧩 Конструктор блоков',
    'blocks.clear': 'Очистить',
    'blocks.toCode': '→ В редактор',
    'blocks.addBlock': '+ блок',
    'blocks.choose': 'Выберите блок',
    'blocks.clear.confirm': 'Очистить все блоки?',
    'editor.clear.confirm': 'Очистить редактор?',
    'lang.title': '🌐 Выберите язык',
    'status.ready': 'Готово',
    'status.running': 'Выполняется...',
    'status.done': 'Выполнено',
    'status.error': 'Ошибка',
    'status.newFile': 'Новый файл',
    'status.saved': 'Сохранено: Project.hj',
    'status.opened': 'Открыт: ',
    'status.fromBlocks': 'Код сгенерирован из блоков',
    'status.programDone': '✓ Программа завершена успешно',
    'status.programErr': '✗ Ошибка: ',
  },
  es: {
    'brand.subtitle': 'lenguaje de programación en el navegador',
    'btn.new': 'Nuevo',
    'btn.open': 'Abrir .hj',
    'btn.save': 'Guardar',
    'btn.help': '📖 Chuleta',
    'btn.run': '▶ Ejecutar',
    'tab.code': '💻 Editor de código',
    'tab.blocks': '🧩 Bloques',
    'hint.shortcuts': 'Ctrl+Enter — ejecutar · Ctrl+S — guardar',
    'panel.output': '⚡ Salida del programa',
    'panel.clear': 'Limpiar',
    'output.placeholder': 'La salida del programa aparecerá aquí...',
    'blocks.toolbar.title': '🧩 Constructor de bloques',
    'blocks.clear': 'Limpiar',
    'blocks.toCode': '→ Al editor',
    'blocks.addBlock': '+ bloque',
    'blocks.choose': 'Elige un bloque',
    'blocks.clear.confirm': '¿Borrar todos los bloques?',
    'editor.clear.confirm': '¿Limpiar el editor?',
    'lang.title': '🌐 Elige idioma',
    'status.ready': 'Listo',
    'status.running': 'Ejecutando...',
    'status.done': 'Hecho',
    'status.error': 'Error',
    'status.newFile': 'Nuevo archivo',
    'status.saved': 'Guardado: Project.hj',
    'status.opened': 'Abierto: ',
    'status.fromBlocks': 'Código generado desde bloques',
    'status.programDone': '✓ Programa completado con éxito',
    'status.programErr': '✗ Error: ',
  },
  fr: {
    'brand.subtitle': 'langage de programmation dans le navigateur',
    'btn.new': 'Nouveau',
    'btn.open': 'Ouvrir .hj',
    'btn.save': 'Enregistrer',
    'btn.help': '📖 Aide-mémoire',
    'btn.run': '▶ Exécuter',
    'tab.code': '💻 Éditeur de code',
    'tab.blocks': '🧩 Blocs',
    'hint.shortcuts': 'Ctrl+Entrée — exécuter · Ctrl+S — enregistrer',
    'panel.output': '⚡ Sortie du programme',
    'panel.clear': 'Effacer',
    'output.placeholder': 'La sortie du programme apparaîtra ici...',
    'blocks.toolbar.title': '🧩 Constructeur de blocs',
    'blocks.clear': 'Effacer',
    'blocks.toCode': "→ Vers l'éditeur",
    'blocks.addBlock': '+ bloc',
    'blocks.choose': 'Choisissez un bloc',
    'blocks.clear.confirm': 'Effacer tous les blocs ?',
    'editor.clear.confirm': "Effacer l'éditeur ?",
    'lang.title': '🌐 Choisir la langue',
    'status.ready': 'Prêt',
    'status.running': 'Exécution...',
    'status.done': 'Terminé',
    'status.error': 'Erreur',
    'status.newFile': 'Nouveau fichier',
    'status.saved': 'Enregistré : Project.hj',
    'status.opened': 'Ouvert : ',
    'status.fromBlocks': 'Code généré à partir des blocs',
    'status.programDone': '✓ Programme terminé avec succès',
    'status.programErr': '✗ Erreur : ',
  },
  de: {
    'brand.subtitle': 'Programmiersprache im Browser',
    'btn.new': 'Neu',
    'btn.open': '.hj öffnen',
    'btn.save': 'Speichern',
    'btn.help': '📖 Spickzettel',
    'btn.run': '▶ Ausführen',
    'tab.code': '💻 Code-Editor',
    'tab.blocks': '🧩 Blöcke',
    'hint.shortcuts': 'Strg+Enter — starten · Strg+S — speichern',
    'panel.output': '⚡ Programmausgabe',
    'panel.clear': 'Leeren',
    'output.placeholder': 'Programmausgabe erscheint hier...',
    'blocks.toolbar.title': '🧩 Block-Designer',
    'blocks.clear': 'Leeren',
    'blocks.toCode': '→ Zum Editor',
    'blocks.addBlock': '+ Block',
    'blocks.choose': 'Block auswählen',
    'blocks.clear.confirm': 'Alle Blöcke löschen?',
    'editor.clear.confirm': 'Editor leeren?',
    'lang.title': '🌐 Sprache wählen',
    'status.ready': 'Bereit',
    'status.running': 'Läuft...',
    'status.done': 'Fertig',
    'status.error': 'Fehler',
    'status.newFile': 'Neue Datei',
    'status.saved': 'Gespeichert: Project.hj',
    'status.opened': 'Geöffnet: ',
    'status.fromBlocks': 'Code aus Blöcken erzeugt',
    'status.programDone': '✓ Programm erfolgreich beendet',
    'status.programErr': '✗ Fehler: ',
  },
  it: {
    'brand.subtitle': 'linguaggio di programmazione nel browser',
    'btn.new': 'Nuovo',
    'btn.open': 'Apri .hj',
    'btn.save': 'Salva',
    'btn.help': '📖 Cheatsheet',
    'btn.run': '▶ Esegui',
    'tab.code': '💻 Editor di codice',
    'tab.blocks': '🧩 Blocchi',
    'hint.shortcuts': 'Ctrl+Invio — esegui · Ctrl+S — salva',
    'panel.output': '⚡ Output del programma',
    'panel.clear': 'Pulisci',
    'output.placeholder': "L'output apparirà qui...",
    'blocks.toolbar.title': '🧩 Costruttore di blocchi',
    'blocks.clear': 'Pulisci',
    'blocks.toCode': "→ Nell'editor",
    'blocks.addBlock': '+ blocco',
    'blocks.choose': 'Scegli un blocco',
    'blocks.clear.confirm': 'Cancellare tutti i blocchi?',
    'editor.clear.confirm': "Pulire l'editor?",
    'lang.title': '🌐 Scegli lingua',
    'status.ready': 'Pronto',
    'status.running': 'In esecuzione...',
    'status.done': 'Fatto',
    'status.error': 'Errore',
    'status.newFile': 'Nuovo file',
    'status.saved': 'Salvato: Project.hj',
    'status.opened': 'Aperto: ',
    'status.fromBlocks': 'Codice generato dai blocchi',
    'status.programDone': '✓ Programma completato con successo',
    'status.programErr': '✗ Errore: ',
  },
  pt: {
    'brand.subtitle': 'linguagem de programação no navegador',
    'btn.new': 'Novo',
    'btn.open': 'Abrir .hj',
    'btn.save': 'Salvar',
    'btn.help': '📖 Cola',
    'btn.run': '▶ Executar',
    'tab.code': '💻 Editor de código',
    'tab.blocks': '🧩 Blocos',
    'hint.shortcuts': 'Ctrl+Enter — executar · Ctrl+S — salvar',
    'panel.output': '⚡ Saída do programa',
    'panel.clear': 'Limpar',
    'output.placeholder': 'A saída do programa aparecerá aqui...',
    'blocks.toolbar.title': '🧩 Construtor de blocos',
    'blocks.clear': 'Limpar',
    'blocks.toCode': '→ Para o editor',
    'blocks.addBlock': '+ bloco',
    'blocks.choose': 'Escolha um bloco',
    'blocks.clear.confirm': 'Apagar todos os blocos?',
    'editor.clear.confirm': 'Limpar o editor?',
    'lang.title': '🌐 Escolha o idioma',
    'status.ready': 'Pronto',
    'status.running': 'Executando...',
    'status.done': 'Concluído',
    'status.error': 'Erro',
    'status.newFile': 'Novo arquivo',
    'status.saved': 'Salvo: Project.hj',
    'status.opened': 'Aberto: ',
    'status.fromBlocks': 'Código gerado a partir dos blocos',
    'status.programDone': '✓ Programa concluído com sucesso',
    'status.programErr': '✗ Erro: ',
  },
  zh: {
    'brand.subtitle': '浏览器中的编程语言',
    'btn.new': '新建',
    'btn.open': '打开 .hj',
    'btn.save': '保存',
    'btn.help': '📖 速查表',
    'btn.run': '▶ 运行',
    'tab.code': '💻 代码编辑器',
    'tab.blocks': '🧩 积木',
    'hint.shortcuts': 'Ctrl+Enter — 运行 · Ctrl+S — 保存',
    'panel.output': '⚡ 程序输出',
    'panel.clear': '清空',
    'output.placeholder': '程序输出将显示在这里...',
    'blocks.toolbar.title': '🧩 积木构建器',
    'blocks.clear': '清空',
    'blocks.toCode': '→ 到编辑器',
    'blocks.addBlock': '+ 积木',
    'blocks.choose': '选择积木',
    'blocks.clear.confirm': '清空所有积木？',
    'editor.clear.confirm': '清空编辑器？',
    'lang.title': '🌐 选择语言',
    'status.ready': '就绪',
    'status.running': '运行中...',
    'status.done': '完成',
    'status.error': '错误',
    'status.newFile': '新文件',
    'status.saved': '已保存: Project.hj',
    'status.opened': '已打开: ',
    'status.fromBlocks': '代码已从积木生成',
    'status.programDone': '✓ 程序成功完成',
    'status.programErr': '✗ 错误: ',
  },
  ja: {
    'brand.subtitle': 'ブラウザで動くプログラミング言語',
    'btn.new': '新規',
    'btn.open': '.hj を開く',
    'btn.save': '保存',
    'btn.help': '📖 チートシート',
    'btn.run': '▶ 実行',
    'tab.code': '💻 コードエディタ',
    'tab.blocks': '🧩 ブロック',
    'hint.shortcuts': 'Ctrl+Enter — 実行 · Ctrl+S — 保存',
    'panel.output': '⚡ プログラム出力',
    'panel.clear': 'クリア',
    'output.placeholder': 'プログラムの出力がここに表示されます...',
    'blocks.toolbar.title': '🧩 ブロックビルダー',
    'blocks.clear': 'クリア',
    'blocks.toCode': '→ エディタへ',
    'blocks.addBlock': '+ ブロック',
    'blocks.choose': 'ブロックを選択',
    'blocks.clear.confirm': 'すべてのブロックを削除しますか？',
    'editor.clear.confirm': 'エディタをクリアしますか？',
    'lang.title': '🌐 言語を選択',
    'status.ready': '準備完了',
    'status.running': '実行中...',
    'status.done': '完了',
    'status.error': 'エラー',
    'status.newFile': '新規ファイル',
    'status.saved': '保存しました: Project.hj',
    'status.opened': '開きました: ',
    'status.fromBlocks': 'ブロックからコードを生成しました',
    'status.programDone': '✓ プログラムが正常に終了しました',
    'status.programErr': '✗ エラー: ',
  },
  ar: {
    'brand.subtitle': 'لغة برمجة في المتصفح',
    'btn.new': 'جديد',
    'btn.open': 'فتح .hj',
    'btn.save': 'حفظ',
    'btn.help': '📖 المرجع',
    'btn.run': '▶ تشغيل',
    'tab.code': '💻 محرر الكود',
    'tab.blocks': '🧩 الكتل',
    'hint.shortcuts': 'Ctrl+Enter — تشغيل · Ctrl+S — حفظ',
    'panel.output': '⚡ مخرجات البرنامج',
    'panel.clear': 'مسح',
    'output.placeholder': 'ستظهر مخرجات البرنامج هنا...',
    'blocks.toolbar.title': '🧩 منشئ الكتل',
    'blocks.clear': 'مسح',
    'blocks.toCode': '← إلى المحرر',
    'blocks.addBlock': '+ كتلة',
    'blocks.choose': 'اختر كتلة',
    'blocks.clear.confirm': 'مسح جميع الكتل؟',
    'editor.clear.confirm': 'مسح المحرر؟',
    'lang.title': '🌐 اختر اللغة',
    'status.ready': 'جاهز',
    'status.running': 'قيد التشغيل...',
    'status.done': 'تم',
    'status.error': 'خطأ',
    'status.newFile': 'ملف جديد',
    'status.saved': 'تم الحفظ: Project.hj',
    'status.opened': 'تم الفتح: ',
    'status.fromBlocks': 'تم توليد الكود من الكتل',
    'status.programDone': '✓ اكتمل البرنامج بنجاح',
    'status.programErr': '✗ خطأ: ',
  },
};

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

/* ============================================================
   CHEATSHEET CONTENT
   ============================================================ */

const CHEAT = {
  en: {
    title: '📖 HTMLJORA Cheatsheet',
    sections: [
      { h: '💬 Comments', code: '# this is a comment\n// and this too' },
      { h: '📦 Variables', code: 'пусть имя = "Anna"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "John"\nвозраст = возраст + 1' },
      { h: '🖨️ Output and input', code: 'вывести("Hello, world!")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("How old?")' },
      { h: '🔢 Data types', list: [
        'Numbers: 42, 3.14, -7',
        'Strings: "text", \'text\'',
        'Booleans: истина, ложь',
      ]},
      { h: '➗ Operators', list: [
        'Arithmetic: + − * / %',
        'Comparison: == != < > <= >=',
        'Logic: и, или, не',
      ]},
      { h: '🔀 Conditions', code: 'если x > 10 {\n    вывести("many")\n} иначе если x > 5 {\n    вывести("mid")\n} иначе {\n    вывести("few")\n}' },
      { h: '🔁 Loops', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ Loop control', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 Functions', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ Built-in functions', table: [
        ['длина(x)',       'string length'],
        ['строка(x)',      'to string'],
        ['число(x)',       'to number'],
        ['случайное(a,b)', 'random int'],
        ['вопрос(text)',   'ask user'],
        ['верхний(x)',     'UPPERCASE'],
        ['нижний(x)',      'lowercase'],
        ['абсолют(x)',     'absolute'],
        ['максимум(a,b)',  'maximum'],
        ['минимум(a,b)',   'minimum'],
        ['округлить(x)',   'round'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ Shortcuts', list: [
        'Ctrl + Enter — run',
        'Ctrl + S — save Project.hj',
      ]},
    ],
  },
  ru: {
    title: '📖 Шпаргалка HTMLJORA',
    sections: [
      { h: '💬 Комментарии', code: '# это комментарий\n// и это тоже комментарий' },
      { h: '📦 Переменные', code: 'пусть имя = "Аня"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "Иван"\nвозраст = возраст + 1' },
      { h: '🖨️ Вывод и ввод', code: 'вывести("Привет, мир!")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("Сколько лет?")' },
      { h: '🔢 Типы данных', list: [
        'Числа: 42, 3.14, -7',
        'Строки: "текст", \'текст\'',
        'Логические: истина, ложь',
      ]},
      { h: '➗ Операторы', list: [
        'Арифметика: + − * / %',
        'Сравнение: == != < > <= >=',
        'Логика: и, или, не',
      ]},
      { h: '🔀 Условия', code: 'если x > 10 {\n    вывести("много")\n} иначе если x > 5 {\n    вывести("средне")\n} иначе {\n    вывести("мало")\n}' },
      { h: '🔁 Циклы', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ Управление циклом', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 Функции', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ Встроенные функции', table: [
        ['длина(x)',       'длина строки'],
        ['строка(x)',      'в строку'],
        ['число(x)',       'в число'],
        ['случайное(a,b)', 'случайное целое'],
        ['вопрос(текст)',  'спросить'],
        ['верхний(x)',     'ВЕРХНИЙ'],
        ['нижний(x)',      'нижний'],
        ['абсолют(x)',     'модуль'],
        ['максимум(a,b)',  'наибольшее'],
        ['минимум(a,b)',   'наименьшее'],
        ['округлить(x)',   'округление'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ Горячие клавиши', list: [
        'Ctrl + Enter — запустить',
        'Ctrl + S — сохранить Project.hj',
      ]},
    ],
  },
  es: {
    title: '📖 Chuleta HTMLJORA',
    sections: [
      { h: '💬 Comentarios', code: '# esto es un comentario\n// y esto también' },
      { h: '📦 Variables', code: 'пусть имя = "Ana"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "Juan"\nвозраст = возраст + 1' },
      { h: '🖨️ Salida y entrada', code: 'вывести("¡Hola, mundo!")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("¿Cuántos años?")' },
      { h: '🔢 Tipos de datos', list: [
        'Números: 42, 3.14, -7',
        'Cadenas: "texto", \'texto\'',
        'Booleanos: истина, ложь',
      ]},
      { h: '➗ Operadores', list: [
        'Aritmética: + − * / %',
        'Comparación: == != < > <= >=',
        'Lógica: и, или, не',
      ]},
      { h: '🔀 Condiciones', code: 'если x > 10 {\n    вывести("mucho")\n} иначе если x > 5 {\n    вывести("medio")\n} иначе {\n    вывести("poco")\n}' },
      { h: '🔁 Bucles', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ Control de bucle', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 Funciones', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ Funciones integradas', table: [
        ['длина(x)',       'longitud'],
        ['строка(x)',      'a cadena'],
        ['число(x)',       'a número'],
        ['случайное(a,b)', 'aleatorio'],
        ['вопрос(t)',      'preguntar'],
        ['верхний(x)',     'MAYÚSCULAS'],
        ['нижний(x)',      'minúsculas'],
        ['абсолют(x)',     'valor absoluto'],
        ['максимум(a,b)',  'máximo'],
        ['минимум(a,b)',   'mínimo'],
        ['округлить(x)',   'redondear'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ Atajos', list: [
        'Ctrl + Enter — ejecutar',
        'Ctrl + S — guardar Project.hj',
      ]},
    ],
  },
  fr: {
    title: '📖 Aide-mémoire HTMLJORA',
    sections: [
      { h: '💬 Commentaires', code: '# ceci est un commentaire\n// et ça aussi' },
      { h: '📦 Variables', code: 'пусть имя = "Anna"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "Jean"\nвозраст = возраст + 1' },
      { h: '🖨️ Sortie et entrée', code: 'вывести("Bonjour, monde !")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("Quel âge ?")' },
      { h: '🔢 Types de données', list: [
        'Nombres : 42, 3.14, -7',
        'Chaînes : "texte", \'texte\'',
        'Booléens : истина, ложь',
      ]},
      { h: '➗ Opérateurs', list: [
        'Arithmétique : + − * / %',
        'Comparaison : == != < > <= >=',
        'Logique : и, или, не',
      ]},
      { h: '🔀 Conditions', code: 'если x > 10 {\n    вывести("beaucoup")\n} иначе если x > 5 {\n    вывести("moyen")\n} иначе {\n    вывести("peu")\n}' },
      { h: '🔁 Boucles', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ Contrôle de boucle', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 Fonctions', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ Fonctions intégrées', table: [
        ['длина(x)',       'longueur'],
        ['строка(x)',      'en chaîne'],
        ['число(x)',       'en nombre'],
        ['случайное(a,b)', 'aléatoire'],
        ['вопрос(t)',      'demander'],
        ['верхний(x)',     'MAJUSCULES'],
        ['нижний(x)',      'minuscules'],
        ['абсолют(x)',     'absolu'],
        ['максимум(a,b)',  'maximum'],
        ['минимум(a,b)',   'minimum'],
        ['округлить(x)',   'arrondir'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ Raccourcis', list: [
        'Ctrl + Entrée — exécuter',
        'Ctrl + S — enregistrer Project.hj',
      ]},
    ],
  },
  de: {
    title: '📖 HTMLJORA Spickzettel',
    sections: [
      { h: '💬 Kommentare', code: '# das ist ein Kommentar\n// und das auch' },
      { h: '📦 Variablen', code: 'пусть имя = "Anna"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "Hans"\nвозраст = возраст + 1' },
      { h: '🖨️ Ausgabe und Eingabe', code: 'вывести("Hallo, Welt!")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("Wie alt?")' },
      { h: '🔢 Datentypen', list: [
        'Zahlen: 42, 3.14, -7',
        'Strings: "Text", \'Text\'',
        'Booleans: истина, ложь',
      ]},
      { h: '➗ Operatoren', list: [
        'Arithmetik: + − * / %',
        'Vergleich: == != < > <= >=',
        'Logik: и, или, не',
      ]},
      { h: '🔀 Bedingungen', code: 'если x > 10 {\n    вывести("viel")\n} иначе если x > 5 {\n    вывести("mittel")\n} иначе {\n    вывести("wenig")\n}' },
      { h: '🔁 Schleifen', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ Schleifensteuerung', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 Funktionen', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ Eingebaute Funktionen', table: [
        ['длина(x)',       'Länge'],
        ['строка(x)',      'zu String'],
        ['число(x)',       'zu Zahl'],
        ['случайное(a,b)', 'zufällig'],
        ['вопрос(t)',      'fragen'],
        ['верхний(x)',     'GROSSBUCHST.'],
        ['нижний(x)',      'kleinbuchst.'],
        ['абсолют(x)',     'Betrag'],
        ['максимум(a,b)',  'Maximum'],
        ['минимум(a,b)',   'Minimum'],
        ['округлить(x)',   'runden'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ Tastenkürzel', list: [
        'Strg + Enter — ausführen',
        'Strg + S — Project.hj speichern',
      ]},
    ],
  },
  it: {
    title: '📖 Cheatsheet HTMLJORA',
    sections: [
      { h: '💬 Commenti', code: '# questo è un commento\n// anche questo' },
      { h: '📦 Variabili', code: 'пусть имя = "Anna"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "Marco"\nвозраст = возраст + 1' },
      { h: '🖨️ Output e input', code: 'вывести("Ciao, mondo!")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("Quanti anni?")' },
      { h: '🔢 Tipi di dati', list: [
        'Numeri: 42, 3.14, -7',
        'Stringhe: "testo", \'testo\'',
        'Booleani: истина, ложь',
      ]},
      { h: '➗ Operatori', list: [
        'Aritmetica: + − * / %',
        'Confronto: == != < > <= >=',
        'Logica: и, или, не',
      ]},
      { h: '🔀 Condizioni', code: 'если x > 10 {\n    вывести("molto")\n} иначе если x > 5 {\n    вывести("medio")\n} иначе {\n    вывести("poco")\n}' },
      { h: '🔁 Cicli', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ Controllo ciclo', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 Funzioni', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ Funzioni integrate', table: [
        ['длина(x)',       'lunghezza'],
        ['строка(x)',      'a stringa'],
        ['число(x)',       'a numero'],
        ['случайное(a,b)', 'casuale'],
        ['вопрос(t)',      'chiedi'],
        ['верхний(x)',     'MAIUSCOLO'],
        ['нижний(x)',      'minuscolo'],
        ['абсолют(x)',     'assoluto'],
        ['максимум(a,b)',  'massimo'],
        ['минимум(a,b)',   'minimo'],
        ['округлить(x)',   'arrotonda'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ Scorciatoie', list: [
        'Ctrl + Invio — esegui',
        'Ctrl + S — salva Project.hj',
      ]},
    ],
  },
  pt: {
    title: '📖 Cola HTMLJORA',
    sections: [
      { h: '💬 Comentários', code: '# isto é um comentário\n// e isto também' },
      { h: '📦 Variáveis', code: 'пусть имя = "Ana"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "João"\nвозраст = возраст + 1' },
      { h: '🖨️ Saída e entrada', code: 'вывести("Olá, mundo!")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("Quantos anos?")' },
      { h: '🔢 Tipos de dados', list: [
        'Números: 42, 3.14, -7',
        'Strings: "texto", \'texto\'',
        'Booleanos: истина, ложь',
      ]},
      { h: '➗ Operadores', list: [
        'Aritmética: + − * / %',
        'Comparação: == != < > <= >=',
        'Lógica: и, или, не',
      ]},
      { h: '🔀 Condições', code: 'если x > 10 {\n    вывести("muito")\n} иначе если x > 5 {\n    вывести("médio")\n} иначе {\n    вывести("pouco")\n}' },
      { h: '🔁 Loops', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ Controle de loop', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 Funções', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ Funções embutidas', table: [
        ['длина(x)',       'comprimento'],
        ['строка(x)',      'para string'],
        ['число(x)',       'para número'],
        ['случайное(a,b)', 'aleatório'],
        ['вопрос(t)',      'perguntar'],
        ['верхний(x)',     'MAIÚSCULO'],
        ['нижний(x)',      'minúsculo'],
        ['абсолют(x)',     'absoluto'],
        ['максимум(a,b)',  'máximo'],
        ['минимум(a,b)',   'mínimo'],
        ['округлить(x)',   'arredondar'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ Atalhos', list: [
        'Ctrl + Enter — executar',
        'Ctrl + S — salvar Project.hj',
      ]},
    ],
  },
  zh: {
    title: '📖 HTMLJORA 速查表',
    sections: [
      { h: '💬 注释', code: '# 这是注释\n// 这也是注释' },
      { h: '📦 变量', code: 'пусть имя = "小明"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "小红"\nвозраст = возраст + 1' },
      { h: '🖨️ 输出与输入', code: 'вывести("你好，世界！")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("你几岁？")' },
      { h: '🔢 数据类型', list: [
        '数字: 42, 3.14, -7',
        '字符串: "文本", \'文本\'',
        '布尔值: истина, ложь',
      ]},
      { h: '➗ 运算符', list: [
        '算术: + − * / %',
        '比较: == != < > <= >=',
        '逻辑: и, или, не',
      ]},
      { h: '🔀 条件', code: 'если x > 10 {\n    вывести("多")\n} иначе если x > 5 {\n    вывести("中")\n} иначе {\n    вывести("少")\n}' },
      { h: '🔁 循环', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ 循环控制', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 函数', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ 内置函数', table: [
        ['длина(x)',       '字符串长度'],
        ['строка(x)',      '转字符串'],
        ['число(x)',       '转数字'],
        ['случайное(a,b)', '随机整数'],
        ['вопрос(文本)',   '询问'],
        ['верхний(x)',     '大写'],
        ['нижний(x)',      '小写'],
        ['абсолют(x)',     '绝对值'],
        ['максимум(a,b)',  '最大值'],
        ['минимум(a,b)',   '最小值'],
        ['округлить(x)',   '四舍五入'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ 快捷键', list: [
        'Ctrl + Enter — 运行',
        'Ctrl + S — 保存 Project.hj',
      ]},
    ],
  },
  ja: {
    title: '📖 HTMLJORA チートシート',
    sections: [
      { h: '💬 コメント', code: '# これはコメント\n// これもコメント' },
      { h: '📦 変数', code: 'пусть имя = "太郎"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "花子"\nвозраст = возраст + 1' },
      { h: '🖨️ 出力と入力', code: 'вывести("こんにちは、世界！")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("何歳？")' },
      { h: '🔢 データ型', list: [
        '数値: 42, 3.14, -7',
        '文字列: "テキスト", \'テキスト\'',
        '真偽値: истина, ложь',
      ]},
      { h: '➗ 演算子', list: [
        '算術: + − * / %',
        '比較: == != < > <= >=',
        '論理: и, или, не',
      ]},
      { h: '🔀 条件', code: 'если x > 10 {\n    вывести("多い")\n} иначе если x > 5 {\n    вывести("普通")\n} иначе {\n    вывести("少ない")\n}' },
      { h: '🔁 ループ', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ ループ制御', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 関数', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ 組み込み関数', table: [
        ['длина(x)',       '文字列長'],
        ['строка(x)',      '文字列化'],
        ['число(x)',       '数値化'],
        ['случайное(a,b)', 'ランダム'],
        ['вопрос(t)',      '質問'],
        ['верхний(x)',     '大文字'],
        ['нижний(x)',      '小文字'],
        ['абсолют(x)',     '絶対値'],
        ['максимум(a,b)',  '最大値'],
        ['минимум(a,b)',   '最小値'],
        ['округлить(x)',   '四捨五入'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ ショートカット', list: [
        'Ctrl + Enter — 実行',
        'Ctrl + S — 保存 Project.hj',
      ]},
    ],
  },
  ar: {
    title: '📖 ورقة مرجعية HTMLJORA',
    sections: [
      { h: '💬 التعليقات', code: '# هذا تعليق\n// وهذا أيضًا' },
      { h: '📦 المتغيرات', code: 'пусть имя = "أحمد"\nпусть возраст = 16\nпусть пи = 3.14\nпусть флаг = истина\n\nимя = "علي"\nвозраст = возраст + 1' },
      { h: '🖨️ الإدخال والإخراج', code: 'вывести("مرحبًا بالعالم!")\nвывести("x =", x)\nвывести(1, 2, 3)\n\nпусть ответ = вопрос("كم عمرك؟")' },
      { h: '🔢 أنواع البيانات', list: [
        'أرقام: 42, 3.14, -7',
        'نصوص: "نص", \'نص\'',
        'منطقية: истина, ложь',
      ]},
      { h: '➗ العمليات', list: [
        'حسابية: + − * / %',
        'مقارنة: == != < > <= >=',
        'منطقية: и, или, не',
      ]},
      { h: '🔀 الشروط', code: 'если x > 10 {\n    вывести("كثير")\n} иначе если x > 5 {\n    вывести("متوسط")\n} иначе {\n    вывести("قليل")\n}' },
      { h: '🔁 الحلقات', code: 'пока n > 0 {\n    вывести(n)\n    n = n - 1\n}\n\nдля i от 1 до 10 {\n    вывести(i)\n}\n\nдля i от 10 до 0 шаг -2 {\n    вывести(i)\n}' },
      { h: '⏸️ التحكم بالحلقة', code: 'пока истина {\n    если x == 0 { прервать }\n    если x % 2 == 0 { продолжить }\n    вывести(x)\n}' },
      { h: '🧩 الدوال', code: 'функция квадрат(x) {\n    вернуть x * x\n}\n\nвывести(квадрат(7))' },
      { h: '🛠️ الدوال المدمجة', table: [
        ['длина(x)',       'طول النص'],
        ['строка(x)',      'إلى نص'],
        ['число(x)',       'إلى رقم'],
        ['случайное(a,b)', 'عشوائي'],
        ['вопрос(t)',      'اسأل'],
        ['верхний(x)',     'أحرف كبيرة'],
        ['нижний(x)',      'أحرف صغيرة'],
        ['абсолют(x)',     'قيمة مطلقة'],
        ['максимум(a,b)',  'الأكبر'],
        ['минимум(a,b)',   'الأصغر'],
        ['округлить(x)',   'تقريب'],
        ['корень(x)',      '√x'],
        ['степень(x,y)',   'x^y'],
      ]},
      { h: '⌨️ اختصارات', list: [
        'Ctrl + Enter — تشغيل',
        'Ctrl + S — حفظ Project.hj',
      ]},
    ],
  },
};

/* ============================================================
   CHEATSHEET RENDERING
   ============================================================ */

function renderCheatsheet() {
  const data = CHEAT[currentLang] || CHEAT.en;
  document.getElementById('cheat-title').textContent = data.title;

  const body = document.getElementById('cheat-body');
  body.innerHTML = '';

  data.sections.forEach(sec => {
    const wrap = document.createElement('div');
    wrap.className = 'cheat-section';

    const h3 = document.createElement('h3');
    h3.textContent = sec.h;
    wrap.appendChild(h3);

    if (sec.code) {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = sec.code;
      pre.appendChild(code);
      wrap.appendChild(pre);
    }

    if (sec.list) {
      const ul = document.createElement('ul');
      sec.list.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    }

    if (sec.table) {
      const table = document.createElement('table');
      table.className = 'cheat-table';
      sec.table.forEach(([fn, desc]) => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const c = document.createElement('code');
        c.textContent = fn;
        td1.appendChild(c);
        const td2 = document.createElement('td');
        td2.textContent = desc;
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
      });
      wrap.appendChild(table);
    }

    body.appendChild(wrap);
  });
}

/* ============================================================
   APPLY LANGUAGE
   ============================================================ */

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  outputEl.setAttribute('data-placeholder', t('output.placeholder'));

  document.getElementById('lang-title').textContent = t('lang.title');
  document.getElementById('palette-title').textContent = t('blocks.choose');

  renderCheatsheet();

  const langInfo = LANGS.find(l => l.code === currentLang) || LANGS[0];
  document.getElementById('lang-flag').textContent = langInfo.flag;
  document.getElementById('lang-code').textContent = langInfo.code.toUpperCase();

  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;

  if (!document.getElementById('panel-blocks').classList.contains('hidden')) {
    renderBlockEditor();
  }

  setStatus(t('status.ready'));
}

/* ============================================================
   LANGUAGE MODAL
   ============================================================ */

const langModal = document.getElementById('lang-modal');
const langList  = document.getElementById('lang-list');

function renderLangList() {
  langList.innerHTML = '';
  LANGS.forEach(l => {
    const btn = document.createElement('button');
    btn.className = 'lang-item' + (l.code === currentLang ? ' active' : '');
    btn.innerHTML = `<span class="flag">${l.flag}</span><span>${l.name}</span><span class="code">${l.code}</span>`;
    btn.onclick = () => {
      currentLang = l.code;
      localStorage.setItem('htmljora.lang', currentLang);
      langModal.hidden = true;
      applyLanguage();
    };
    langList.appendChild(btn);
  });
}

document.getElementById('btn-lang').onclick = () => {
  renderLangList();
  langModal.hidden = false;
};

document.getElementById('lang-close').onclick = () => { langModal.hidden = true; };

langModal.addEventListener('click', (e) => {
  if (e.target === langModal) langModal.hidden = true;
});

/* ============================================================
   TRANSLATOR: HTMLJORA → JavaScript
   ============================================================ */

function translateToJS(src) {
  const strings = [];

  let s = src.replace(/(["'])(?:\\.|(?!\1)[^\\\n])*\1/g, (m) => {
    strings.push(m);
    return `\u0000${strings.length - 1}\u0000`;
  });

  s = s.replace(/#[^\n]*/g, '');
  s = s.replace(/\/\/[^\n]*/g, '');

  const W = (str, from, to) => {
    const re = new RegExp(
      `(?<![A-Za-zА-Яа-яЁё0-9_])${from}(?![A-Za-zА-Яа-яЁё0-9_])`, 'g'
    );
    return str.replace(re, to);
  };

  s = s.replace(
    /(?<![A-Za-zА-Яа-яЁё0-9_])для\s+([A-Za-zА-Яа-яЁё_][A-Za-zА-Яа-яЁё0-9_]*)\s+от\s+([^\n{]+?)\s+до\s+([^\n{]+?)(?:\s+шаг\s+([^\n{]+?))?\s*\{/g,
    (m, v, a, b, st) =>
      `for (let ${v} = ${a.trim()}; ${v} <= ${b.trim()}; ${v} += ${(st || '1').trim()}) {`
  );

  s = s.replace(
    /(?<![A-Za-zА-Яа-яЁё0-9_])иначе\s+если\s+([^\n{]+?)\s*\{/g,
    (m, c) => `else if (${c.trim()}) {`
  );

  s = s.replace(
    /(?<![A-Za-zА-Яа-яЁё0-9_])если\s+([^\n{]+?)\s*\{/g,
    (m, c) => `if (${c.trim()}) {`
  );

  s = s.replace(
    /(?<![A-Za-zА-Яа-яЁё0-9_])пока\s+([^\n{]+?)\s*\{/g,
    (m, c) => `while (${c.trim()}) {`
  );

  s = s.replace(/(?<![A-Za-zА-Яа-яЁё0-9_])иначе\s*\{/g, 'else {');

  const KWS = [
    ['пусть',     'let'],
    ['функция',   'function'],
    ['вернуть',   'return'],
    ['прервать',  'break'],
    ['продолжить','continue'],
    ['истина',    'true'],
    ['ложь',      'false'],
  ];
  for (const [k, v] of KWS) s = W(s, k, v);

  s = W(s, 'и',   '&&');
  s = W(s, 'или', '||');
  s = W(s, 'не',  '!');

  const FNS = {
    'вывести':   '__print',
    'вопрос':    '__ask',
    'длина':     '__len',
    'строка':    '__str',
    'число':     '__num',
    'случайное': '__rand',
    'верхний':   '__upper',
    'нижний':    '__lower',
    'абсолют':   '__abs',
    'максимум':  '__max',
    'минимум':   '__min',
    'округлить': '__round',
    'корень':    '__sqrt',
    'степень':   '__pow',
  };
  for (const [k, v] of Object.entries(FNS)) s = W(s, k, v);

  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => strings[+i]);

  return s;
}

/* ============================================================
   RUN
   ============================================================ */

function printLine(text, cls = '') {
  const line = document.createElement('div');
  line.className = 'out-line ' + cls;
  line.textContent = text;
  outputEl.appendChild(line);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function clearOutput() { outputEl.innerHTML = ''; }

function setStatus(text, cls = '') {
  statusEl.textContent = text;
  statusEl.className = 'status ' + cls;
}

function runProgram() {
  clearOutput();
  setStatus(t('status.running'));

  const src = editor.value;

  try {
    const js = translateToJS(src);

    const __print = (...args) => {
      const text = args.map(v => (typeof v === 'string' ? v : String(v))).join(' ');
      printLine(text);
    };

    const __ask = (msg) => {
      printLine('? ' + msg, 'dim');
      const r = prompt(msg);
      if (r !== null) printLine('> ' + r, 'dim');
      return r === null ? '' : r;
    };

    const __len     = x => (x == null ? 0 : String(x).length);
    const __str     = x => String(x);
    const __num     = x => Number(x);
    const __rand    = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const __upper   = x => String(x).toUpperCase();
    const __lower   = x => String(x).toLowerCase();
    const __abs     = x => Math.abs(x);
    const __max     = (...a) => Math.max(...a);
    const __min     = (...a) => Math.min(...a);
    const __round   = x => Math.round(x);
    const __sqrt    = x => Math.sqrt(x);
    const __pow     = (x, y) => Math.pow(x, y);

    const fn = new Function(
      '__print', '__ask', '__len', '__str', '__num', '__rand',
      '__upper', '__lower', '__abs', '__max', '__min',
      '__round', '__sqrt', '__pow',
      js
    );

    fn(
      __print, __ask, __len, __str, __num, __rand,
      __upper, __lower, __abs, __max, __min,
      __round, __sqrt, __pow
    );

    printLine('');
    printLine(t('status.programDone'), 'ok');
    setStatus(t('status.done'), 'ok');

  } catch (e) {
    printLine(t('status.programErr') + e.message, 'err');
    setStatus(t('status.error'), 'err');
  }
}

/* ============================================================
   BLOCK PROGRAMMING
   ============================================================ */

let blockIdSeq = 1;

const BLOCK_DEFS = {
  print: {
    color: 'purple',
    parts: [ 'вывести(', { key: 'expr', def: '"Hello!"', w: 180 }, ')' ],
    gen: (f, ind) => `${ind}вывести(${f.expr})`,
    i18nLabel: { ru: 'вывести', en: 'print', es: 'imprimir', fr: 'afficher', de: 'drucken', it: 'stampa', pt: 'imprimir', zh: '输出', ja: '表示', ar: 'اطبع' },
  },
  let: {
    color: 'cyan',
    parts: [ 'пусть', { key: 'name', def: 'x', w: 70 }, '=', { key: 'expr', def: '5', w: 130 } ],
    gen: (f, ind) => `${ind}пусть ${f.name} = ${f.expr}`,
    i18nLabel: { ru: 'пусть', en: 'let', es: 'var', fr: 'soit', de: 'sei', it: 'sia', pt: 'seja', zh: '令', ja: '変数', ar: 'ليكن' },
  },
  assign: {
    color: 'cyan',
    parts: [ { key: 'name', def: 'x', w: 70 }, '=', { key: 'expr', def: '10', w: 130 } ],
    gen: (f, ind) => `${ind}${f.name} = ${f.expr}`,
    i18nLabel: { ru: 'присвоить', en: 'assign', es: 'asignar', fr: 'affecter', de: 'zuweisen', it: 'assegna', pt: 'atribuir', zh: '赋值', ja: '代入', ar: 'عيّن' },
  },
  if: {
    color: 'orange',
    parts: [ 'если', { key: 'cond', def: 'x > 10', w: 180 }, '{' ],
    body: true, elseBody: true,
    gen: (f, body, elseBody, ind) => {
      let s = `${ind}если ${f.cond} {\n${body}\n${ind}}`;
      if (elseBody.trim()) s += ` иначе {\n${elseBody}\n${ind}}`;
      return s;
    },
    i18nLabel: { ru: 'если', en: 'if', es: 'si', fr: 'si', de: 'wenn', it: 'se', pt: 'se', zh: '如果', ja: 'もし', ar: 'إذا' },
  },
  while: {
    color: 'pink',
    parts: [ 'пока', { key: 'cond', def: 'n > 0', w: 180 }, '{' ],
    body: true,
    gen: (f, body, _else, ind) => `${ind}пока ${f.cond} {\n${body}\n${ind}}`,
    i18nLabel: { ru: 'пока', en: 'while', es: 'mientras', fr: 'tantque', de: 'solange', it: 'mentre', pt: 'enquanto', zh: '当', ja: 'ながら', ar: 'بينما' },
  },
  for: {
    color: 'blue',
    parts: [ 'для', { key: 'var', def: 'i', w: 45 }, 'от', { key: 'from', def: '1', w: 55 }, 'до', { key: 'to', def: '10', w: 55 }, 'шаг', { key: 'step', def: '1', w: 45 }, '{' ],
    body: true,
    gen: (f, body, _else, ind) => {
      const step = (f.step || '').trim();
      if (step === '' || step === '1')
        return `${ind}для ${f.var} от ${f.from} до ${f.to} {\n${body}\n${ind}}`;
      return `${ind}для ${f.var} от ${f.from} до ${f.to} шаг ${f.step} {\n${body}\n${ind}}`;
    },
    i18nLabel: { ru: 'для', en: 'for', es: 'para', fr: 'pour', de: 'für', it: 'per', pt: 'para', zh: '对于', ja: 'から', ar: 'لأجل' },
  },
  func: {
    color: 'green',
    parts: [ 'функция', { key: 'name', def: 'myFunc', w: 110 }, '(', { key: 'params', def: 'x, y', w: 100 }, ')', '{' ],
    body: true,
    gen: (f, body, _else, ind) => `${ind}функция ${f.name}(${f.params}) {\n${body}\n${ind}}`,
    i18nLabel: { ru: 'функция', en: 'function', es: 'función', fr: 'fonction', de: 'funktion', it: 'funzione', pt: 'função', zh: '函数', ja: '関数', ar: 'دالة' },
  },
  return: {
    color: 'green',
    parts: [ 'вернуть', { key: 'expr', def: 'x * x', w: 130 } ],
    gen: (f, ind) => `${ind}вернуть ${f.expr}`,
    i18nLabel: { ru: 'вернуть', en: 'return', es: 'devolver', fr: 'retourner', de: 'zurück', it: 'ritorna', pt: 'retornar', zh: '返回', ja: '戻す', ar: 'أرجِع' },
  },
  break: {
    color: 'red', parts: [ 'прервать' ],
    gen: (_f, ind) => `${ind}прервать`,
    i18nLabel: { ru: 'прервать', en: 'break', es: 'romper', fr: 'casser', de: 'abbrechen', it: 'interrompi', pt: 'quebrar', zh: '中断', ja: '抜ける', ar: 'اقطع' },
  },
  continue: {
    color: 'red', parts: [ 'продолжить' ],
    gen: (_f, ind) => `${ind}продолжить`,
    i18nLabel: { ru: 'продолжить', en: 'continue', es: 'continuar', fr: 'continuer', de: 'weiter', it: 'continua', pt: 'continuar', zh: '继续', ja: '続ける', ar: 'استمر' },
  },
  call: {
    color: 'purple',
    parts: [ { key: 'name', def: 'myFunc', w: 110 }, '(', { key: 'args', def: '"value"', w: 130 }, ')' ],
    gen: (f, ind) => `${ind}${f.name}(${f.args})`,
    i18nLabel: { ru: 'вызов', en: 'call', es: 'llamar', fr: 'appeler', de: 'ruf', it: 'chiama', pt: 'chamar', zh: '调用', ja: '呼出', ar: 'استدعِ' },
  },
};

function blockLabel(def) {
  return (def.i18nLabel && def.i18nLabel[currentLang]) || (def.i18nLabel && def.i18nLabel.en) || '?';
}

function createBlock(type, overrides = {}) {
  const def = BLOCK_DEFS[type];
  const fields = {};
  def.parts.forEach(p => {
    if (typeof p === 'object' && p.key) {
      fields[p.key] = overrides[p.key] !== undefined ? overrides[p.key] : p.def;
    }
  });
  const b = { id: 'b' + (blockIdSeq++), type, fields };
  if (def.body)     b.body = [];
  if (def.elseBody) b.elseBody = [];
  return b;
}

function initBlocks() {
  blocks = [
    createBlock('let',   { name: 'name', expr: '"world"' }),
    createBlock('print', { expr: '"Hello, " + name + "!"' }),
  ];
}

const IND = '    ';
function genList(list, indent) { return list.map(b => genBlock(b, indent)).join('\n'); }
function genBlock(b, indent) {
  const def = BLOCK_DEFS[b.type];
  const pad = IND.repeat(indent);
  const body     = b.body     ? genList(b.body, indent + 1)     : '';
  const elseBody = b.elseBody ? genList(b.elseBody, indent + 1) : '';
  return def.gen(b.fields, body, elseBody, pad);
}
function generateCode() { return genList(blocks, 0) + '\n'; }

const blockCanvas = document.getElementById('block-canvas');

function renderBlockEditor() {
  blockCanvas.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'block-list';
  renderListInto(blocks, root);
  blockCanvas.appendChild(root);
}

function renderListInto(list, container) {
  list.forEach((b, i) => container.appendChild(renderBlock(b, list, i)));

  const add = document.createElement('button');
  add.className = 'block-add';
  add.textContent = t('blocks.addBlock');
  add.onclick = () => openPalette((type) => {
    list.push(createBlock(type));
    renderBlockEditor();
  });
  container.appendChild(add);
}

function renderBlock(b, list, index) {
  const def = BLOCK_DEFS[b.type];

  const el = document.createElement('div');
  el.className = 'block block-' + (def.color || 'purple');

  const head = document.createElement('div');
  head.className = 'block-head';

  const name = document.createElement('span');
  name.className = 'block-name';
  name.textContent = blockLabel(def);
  head.appendChild(name);

  const del = document.createElement('button');
  del.className = 'block-del';
  del.textContent = '×';
  del.onclick = () => { list.splice(index, 1); renderBlockEditor(); };
  head.appendChild(del);
  el.appendChild(head);

  const content = document.createElement('div');
  content.className = 'block-content';

  def.parts.forEach(part => {
    if (typeof part === 'string') {
      const span = document.createElement('span');
      span.className = 'block-txt';
      span.textContent = part;
      content.appendChild(span);
    } else if (part.key) {
      const input = document.createElement('input');
      input.className = 'block-input';
      input.value = b.fields[part.key] ?? '';
      input.placeholder = part.def ?? '';
      input.style.width = (part.w || 100) + 'px';
      input.spellcheck = false;
      input.oninput = () => { b.fields[part.key] = input.value; };
      content.appendChild(input);
    }
  });
  el.appendChild(content);

  if (def.body) {
    if (!b.body) b.body = [];
    const bodyEl = document.createElement('div');
    bodyEl.className = 'block-body';
    renderListInto(b.body, bodyEl);
    el.appendChild(bodyEl);
  }

  if (def.elseBody) {
    const label = document.createElement('div');
    label.className = 'block-else-label';
    label.textContent = (currentLang === 'ru') ? 'иначе' : 'else';
    el.appendChild(label);

    if (!b.elseBody) b.elseBody = [];
    const elseEl = document.createElement('div');
    elseEl.className = 'block-body';
    renderListInto(b.elseBody, elseEl);
    el.appendChild(elseEl);
  }

  return el;
}

/* -------- palette -------- */
const paletteModal = document.getElementById('palette-modal');
const paletteList  = document.getElementById('palette-list');
let paletteCallback = null;

function openPalette(callback) {
  paletteCallback = callback;
  paletteList.innerHTML = '';

  Object.entries(BLOCK_DEFS).forEach(([type, def]) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn palette-' + def.color;
    btn.textContent = blockLabel(def);
    btn.onclick = () => {
      paletteModal.hidden = true;
      if (paletteCallback) paletteCallback(type);
      paletteCallback = null;
    };
    paletteList.appendChild(btn);
  });

  paletteModal.hidden = false;
}

document.getElementById('palette-close').onclick = () => {
  paletteModal.hidden = true;
  paletteCallback = null;
};

paletteModal.addEventListener('click', (e) => {
  if (e.target === paletteModal) {
    paletteModal.hidden = true;
    paletteCallback = null;
  }
});

/* ============================================================
   FILES
   ============================================================ */

function saveFile() {
  const blob = new Blob([editor.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Project.hj';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  setStatus(t('status.saved'), 'ok');
}

function openFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    editor.value = e.target.result;
    currentFileName = file.name;
    filenameEl.textContent = file.name;
    updateGutter();
    setStatus(t('status.opened') + file.name, 'ok');
  };
  reader.readAsText(file);
}

/* ============================================================
   GUTTER
   ============================================================ */

function updateGutter() {
  const lines = editor.value.split('\n').length;
  let s = '';
  for (let i = 1; i <= lines; i++) s += i + '\n';
  gutter.textContent = s;
  gutter.scrollTop = editor.scrollTop;
}

/* ============================================================
   UI
   ============================================================ */

document.getElementById('btn-run').onclick   = runProgram;
document.getElementById('btn-save').onclick  = saveFile;
document.getElementById('btn-clear').onclick = clearOutput;

document.getElementById('btn-new').onclick = () => {
  if (editor.value.trim() && !confirm(t('editor.clear.confirm'))) return;
  editor.value = '';
  currentFileName = 'Project.hj';
  filenameEl.textContent = 'Project.hj';
  updateGutter();
  clearOutput();
  setStatus(t('status.newFile'));
};

document.getElementById('btn-open').onclick = () => {
  document.getElementById('file-input').click();
};

document.getElementById('file-input').onchange = (e) => {
  const file = e.target.files[0];
  if (file) openFile(file);
  e.target.value = '';
};

const cheatsheet = document.getElementById('cheatsheet');
document.getElementById('btn-help').onclick = () => { cheatsheet.hidden = false; };
document.getElementById('btn-help-close').onclick = () => { cheatsheet.hidden = true; };

document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.tab;
    document.getElementById('panel-code').classList.toggle('hidden', target !== 'code');
    document.getElementById('panel-blocks').classList.toggle('hidden', target !== 'blocks');

    if (target === 'blocks') renderBlockEditor();
  };
});

document.getElementById('btn-blocks-clear').onclick = () => {
  if (!confirm(t('blocks.clear.confirm'))) return;
  blocks = [];
  renderBlockEditor();
};

document.getElementById('btn-blocks-to-code').onclick = () => {
  editor.value = generateCode();
  updateGutter();
  currentFileName = 'Project.hj';
  filenameEl.textContent = 'Project.hj';

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab[data-tab="code"]').classList.add('active');
  document.getElementById('panel-code').classList.remove('hidden');
  document.getElementById('panel-blocks').classList.add('hidden');

  setStatus(t('status.fromBlocks'), 'ok');
};

editor.addEventListener('input', updateGutter);
editor.addEventListener('scroll', () => { gutter.scrollTop = editor.scrollTop; });

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runProgram();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveFile();
  }
  if (e.key === 'Escape') {
    cheatsheet.hidden = true;
    paletteModal.hidden = true;
    langModal.hidden = true;
  }
});

/* ============================================================
   START
   ============================================================ */

const DEFAULT_CODE = `# Welcome to HTMLJORA!
# Press ▶ Run or Ctrl+Enter

пусть name = "world"
вывести("Hello, " + name + "!")

функция square(x) {
    вернуть x * x
}

для i от 1 до 5 {
    вывести(i + "² = " + square(i))
}

если square(3) > 8 {
    вывести("3² is greater than 8 — correct!")
} иначе {
    вывести("Something is wrong")
}
`;

editor.value = DEFAULT_CODE;
updateGutter();
initBlocks();
applyLanguage();