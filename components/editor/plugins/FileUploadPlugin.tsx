import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical";
import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";
import { useEffect } from "react";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";

export default function FileUploadPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        (async () => {
          const filesResult = await new Promise<FileList | null>((resolve) => {
            if (files.length > 0) {
              const fileList = new DataTransfer();
              files.forEach((file) => fileList.items.add(file));
              resolve(fileList.files);
            } else {
              resolve(null);
            }
          });

          if (filesResult) {
            for (let i = 0; i < filesResult.length; i++) {
              const file = filesResult[i];
              if (file.type.startsWith("image/")) {
                const src = await convertFileToBase64(file);
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  altText: file.name,
                  src,
                });
              }
            }
          }
        })();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
