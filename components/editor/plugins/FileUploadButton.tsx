import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, File } from "lucide-react";
import { useRef } from "react";

export default function FileUploadButton(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(async (file) => {
        if (file.type.startsWith("image/")) {
          const src = await convertFileToBase64(file);
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            altText: file.name,
            src,
          });
        } else {
          // Handle other file types (documents, etc.)
          console.log("Non-image file:", file.name);
          // You can implement document embedding here
        }
      });
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
      />

      <Button
        type="button"
        onClick={handleUploadClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Upload File
      </Button>

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        Image
      </Button>
    </div>
  );
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
