import { Id } from "@/convex/_generated/dataModel";

export interface Step {
    name: string;
    enabled: boolean;
}

export interface SetupOpts {
    name: string;
    slug: string;
    imageStorageId?: Id<"_storage">;
}
