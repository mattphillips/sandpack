import { useClasser } from "@code-hike/classer";
import type { Extension } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";
import * as React from "react";

import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { THEME_PREFIX } from "../../styles";
import type { SandpackInitMode } from "../../types";
import { classNames } from "../../utils/classNames";
import { FileTabs } from "../FileTabs";

import { CodeMirror } from "./CodeMirror";
import type { CodeMirrorRef } from "./CodeMirror";
import { editorClassName } from "./styles";

/**
 * @category Components
 */
export type CodeEditorRef = CodeMirrorRef;

/**
 * @category Components
 */
export interface CodeEditorProps {
  style?: React.CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
  showRunButton?: boolean;
  wrapContent?: boolean;
  closableTabs?: boolean;

  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  /**
   * CodeMirror extensions for the editor state, which can
   * provide extra features and functionalities to the editor component.
   */
  extensions?: Extension[];
  /**
   * Property to register CodeMirror extension keymap.
   */
  extensionsKeymap?: KeyBinding[];
  /**
   * By default, Sandpack generates a random value to use as an id.
   * Use this to override this value if you need predictable values.
   */
  id?: string;
  /**
   * This disables editing of the editor content by the user.
   */
  readOnly?: boolean;
  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   */
  showReadOnly?: boolean;
}

export { CodeMirror as CodeEditor };

/**
 * @category Components
 */
export const SandpackCodeEditor = React.forwardRef<
  CodeMirrorRef,
  CodeEditorProps
>(
  (
    {
      style,
      showTabs,
      showLineNumbers = false,
      showInlineErrors = false,
      showRunButton = true,
      wrapContent = false,
      closableTabs = false,
      initMode,
      extensions,
      extensionsKeymap,
      id,
      readOnly,
      showReadOnly,
    },
    ref
  ) => {
    const { sandpack } = useSandpack();
    const { code, updateCode, readOnly: readOnlyFile } = useActiveCode();
    const { activeFile, status, editorState } = sandpack;
    const shouldShowTabs = showTabs ?? sandpack.visibleFiles.length > 1;

    const c = useClasser(THEME_PREFIX);

    const handleCodeUpdate = (newCode: string): void => {
      updateCode(newCode);
    };

    return (
      <SandpackStack className={c("editor")} style={style}>
        {shouldShowTabs && <FileTabs closableTabs={closableTabs} />}

        <div className={classNames(c("code-editor"), editorClassName)}>
          <CodeMirror
            key={activeFile}
            ref={ref}
            code={code}
            editorState={editorState}
            extensions={extensions}
            extensionsKeymap={extensionsKeymap}
            filePath={activeFile}
            id={id}
            initMode={initMode || sandpack.initMode}
            onCodeUpdate={handleCodeUpdate}
            readOnly={readOnly || readOnlyFile}
            showInlineErrors={showInlineErrors}
            showLineNumbers={showLineNumbers}
            showReadOnly={showReadOnly}
            wrapContent={wrapContent}
          />

          {showRunButton && status === "idle" ? <RunButton /> : null}
        </div>
      </SandpackStack>
    );
  }
);
