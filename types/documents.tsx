type DocumentItem =
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
