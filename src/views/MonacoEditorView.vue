<template>
  <div ref="editor" class="monaco-editor"></div>
</template>

<script>
import * as monaco from "monaco-editor";
export default {
  name: "MonacoEditor",
  data() {
    return {
      editor: null,
      theme: "vs",
      isLineNumber: true,
      completionProvide: undefined,
      validator: undefined,
      model: undefined,
      modelUri: monaco.Uri.parse("a://b/foo.json"),
      value: "{}",
      language: "json",
      customValidator: true,
    };
  },
  mounted() {
    this.initEditor();
  },
  beforeDestroy() {
    // for reuse, destroy model, otherwise duplicate suggestions
    if (this.model) {
      this.model.dispose();
    }
    if (this.completionProvide) {
      this.completionProvide.dispose();
      this.editor.dispose();
    }
  },
  methods: {
    initEditor() {
      if (this.$refs.editor && !this.editor) {
        if (!this.model) {
          this.model = monaco.editor.createModel(
            this.value,
            this.language,
            this.modelUri
          );
        }
        if (this.customValidator) {
          this.setValidator();
        } else {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [],
          });
        }
        this.editor = monaco.editor.create(this.$refs.editor, {
          model: this.model,
          value: this.value,
          language: this.language,
          automaticLayout: true,
          theme: this.theme,
          minimap: {
            enabled: false,
          },
        });
      }
    },
    // set customer completion suggestions
    setCompletionSuggestions() {
      this.completionProvide = monaco.languages.registerCompletionItemProvider(
        "json",
        {
          provideCompletionItems: (model, position) => {
            const { lineNumber, column } = position;
            const content = model.getLineContent(lineNumber);
            const text = content.split(/\t/).pop();
            let suggestions = [];
            if (text.includes("Type:")) {
              suggestions.push(
                {
                  lable: "",
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: "Type: theory",
                  detail: "theory type",
                },
                {
                  lable: "",
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: "Type: technology",
                  detail: "technology type",
                }
              );
            }
          },
        }
      );
    },
    // set customer validation
    // valid json format
    /*
    {
        Title:''
        Type: 'theory'/'technology'
        Abstract:'',
        Introduction: {
            Background: '',
            Contributions: []
        },
    }
    */
    setValidator() {
      this.validator = monaco.languages.json.jsonDefaults.setDiagnosticsOptions(
        {
          validate: true,
          schemas: [
            {
              uri: "http://myserver/article-schema.json",
              fileMatch: [String(this.modelUri)],
              schema: {
                type: "object",
                properties: {
                  Title: {
                    type: "string",
                  },
                  Type: {
                    enum: ["theory", "technology"],
                  },
                  Abstract: {
                    type: "string",
                  },
                  Introduction: {
                    type: "object",
                    properties: {
                      Background: {
                        type: "string",
                      },
                      Contributions: {
                        $ref: "http://myserver/contributions",
                      },
                    },
                  },
                },
              },
            },
            {
              uri: "http://myserver/contributions",
              schema: {
                type: "array",
              },
            },
          ],
        }
      );
    },
  },
};
</script>
<style scoped>
.monaco-editor {
  width: 100%;
  height: 1080px;
}
</style>