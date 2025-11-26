Import should be correct as per latest observed path.

Incorrect:
import type { StyleState } from "@/types/editor";

Correct: 
import { StyleState } from "../../../../types/editor";

Install the unavailable modules using npm