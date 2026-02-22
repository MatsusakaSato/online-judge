import { Language } from "@/constants/enum";

// Judge0 language_id 映射
// 参考: https://ce.judge0.com/languages
export const LANGUAGE_ID_MAP: Record<Language, number> = {
  [Language.CPP]: 54, // C++ (GCC 9.2.0)
  [Language.JAVA]: 91, // Java (JDK 17.0.6)
  [Language.PYTHON]: 92, // Python (3.11.2)
  [Language.JAVASCRIPT]: 93, // JavaScript (Node.js 18.15.0)
  [Language.TYPESCRIPT]: 94, // TypeScript (5.0.3)
};

// 反向映射：Judge0 language_id -> 项目 Language
export const LANGUAGE_ID_REVERSE_MAP: Record<number, Language> = {
  54: Language.CPP,
  91: Language.JAVA,
  92: Language.PYTHON,
  93: Language.JAVASCRIPT,
  94: Language.TYPESCRIPT,
};
