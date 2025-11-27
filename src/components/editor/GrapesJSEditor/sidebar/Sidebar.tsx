// "use client";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Box, MousePointer, Palette } from "lucide-react";

// const Sidebar = () => {

//   // ...extract props and render sidebar logic...
//   return (
//       <div className="w-[25%] border-l border-slate-800 flex flex-col h-full transition-all duration-300 ease-in-out">
//         <Tabs defaultValue="style" className="flex flex-col h-full">
//           <TabsList className="grid w-full h-10 grid-cols-3 border-b rounded-none bg-slate-900 border-slate-800">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <TabsTrigger value="style" className="text-xs font-medium">
//                   <Palette className="w-4 h-4" />
//                   <span className="sr-only">Style</span>
//                 </TabsTrigger>
//               </TooltipTrigger>
//               <TooltipContent side="bottom">Style</TooltipContent>
//             </Tooltip>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <TabsTrigger value="attributes" className="text-xs font-medium">
//                   <Box className="w-4 h-4" />
//                   <span className="sr-only">Attributes</span>
//                 </TabsTrigger>
//               </TooltipTrigger>
//               <TooltipContent side="bottom">Attributes</TooltipContent>
//             </Tooltip>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <TabsTrigger
//                   value="interactivity"
//                   className="text-xs font-medium"
//                 >
//                   <MousePointer className="w-4 h-4" />
//                   <span className="sr-only">Interactivity</span>
//                 </TabsTrigger>
//               </TooltipTrigger>
//               <TooltipContent side="bottom">Interactivity</TooltipContent>
//             </Tooltip>
//             {/* <Tooltip>
//               <TooltipTrigger asChild>
//                 <TabsTrigger value="settings" className="text-xs font-medium">
//                   <Settings className="w-4 h-4" />
//                   <span className="sr-only">Settings</span>
//                 </TabsTrigger>
//               </TooltipTrigger>
//               <TooltipContent side="bottom">Settings</TooltipContent>
//             </Tooltip> */}
//           </TabsList>

//           <TabsContent value="style" className="flex-1 p-3 overflow-y-auto">
//             {renderStyleTab()}
//           </TabsContent>

//           <TabsContent
//             value="attributes"
//             className="flex-1 p-3 overflow-y-auto"
//           >
//             {renderAttributesTab()}
//           </TabsContent>

//           <TabsContent
//             value="interactivity"
//             className="flex-1 p-3 overflow-y-auto"
//           >
//             {renderInteractivityTab()}
//           </TabsContent>

//           {/* <TabsContent value="settings" className="flex-1 p-3 overflow-y-auto">
//             {renderSettingsTab()}
//           </TabsContent> */}
//         </Tabs>
//       </div>
//   );
// };
// export default Sidebar;
