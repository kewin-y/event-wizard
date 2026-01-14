import { Id } from "../convex/_generated/dataModel";

export type DocumentItem =
  | {
      id: string;
      name: string;
      type: "folder";
      children: DocumentItem[];
    }
  | {
      id: string;
      name: string;
      type: "file";
      value: File;
    }
  | {
      id: string;
      name: string;
      type: "link";
      value: string;
    };

export type TransformedDocumentItem =
  | {
      id: string;
      name: string;
      type: "folder";
      children: TransformedDocumentItem[];
    }
  | {
      id: string;
      name: string;
      type: "file";
      value: Id<"_storage">;
    }
  | {
      id: string;
      name: string;
      type: "link";
      value: string;
    };
