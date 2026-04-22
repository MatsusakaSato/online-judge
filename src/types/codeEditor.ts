export type Language = "cpp" | "java" | "python" | "javascript" | "typescript";

export interface LanguageOption {
  value: Language;
  label: string;
}

export interface CodeTemplate {
  [key: string]: string;
}

export interface MonacoDiagnosticsOptions {
  noSuggestionDiagnostics: boolean;
  noSemanticValidation: boolean;
  noSyntaxValidation: boolean;
}

export interface EditorOptions {
  fontSize: number;
  minimap: {
    enabled: boolean;
  };
  scrollBeyondLastLine: boolean;
  automaticLayout: boolean;
  renderValidationDecorations: "off";
  hover: {
    enabled: boolean;
  };
}

export interface CodeEditorState {
  selectedLanguage: Language;
  code: string;
  editorMounted: boolean;
  isSubmitting: boolean;
}

export interface CodeEditorHandlers {
  handleEditorChange: (value: string | undefined) => void;
  handleLanguageChange: (language: Language) => void;
  handleSubmit: () => Promise<void>;
  handleEditorMount: (editor: any, monaco: any) => void;
}
