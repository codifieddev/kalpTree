// // Main GrapesJSEditor component
// import TopToolbar from "./toolbars/TopToolbar";
// import BottomToolbar from "./toolbars/BottomToolbar";
// import Sidebar from "./sidebar/Sidebar";
// import useEditorInitialization from "./hooks/useEditorInitialization";

// export default function GrapesJSEditor() {
//   // Use custom hooks for logic
//   const {
//     state,
//     actions,
//     containerRef,
//     showSidebar,
//     setShowSidebar,
//     isPreviewMode,
//     setIsPreviewMode,
//     showResponsivePanel,
//     setShowResponsivePanel,
//     customDevices,
//     setCustomDevices,
//     editorHtml,
//     setEditorHtml,
//     editorCss,
//     setEditorCss,
//     editorJs,
//     setEditorJs,
//     recentBlocks,
//     setRecentBlocks,
//     favoriteBlocks,
//     setFavoriteBlocks,
//     allDevices,
//     initializeEditor,
//     setupResizeListener,
//   } = useEditorInitialization();

//   // ...existing code for rendering, using extracted components...
//   return (
//     <div className="h-screen bg-[#0F172A] text-white overflow-hidden flex flex-col">
//       {/* Top Toolbar */}
//       <TopToolbar {...{ state, actions, recentBlocks, setRecentBlocks, favoriteBlocks, setFavoriteBlocks, editorHtml, editorCss, editorJs, setEditorHtml, setEditorCss, setEditorJs, isPreviewMode, setIsPreviewMode, showSidebar, setShowSidebar }} />
//       {/* Main Content Area with Sidebar */}
//       <div className="relative flex flex-1 overflow-hidden">
//         {/* Main Canvas */}
//         <div className={`${showSidebar ? "w-[90%]" : "w-full"} transition-all duration-300 ease-in-out relative`}>
//           {state?.isLoading && (
//             <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80">
//               <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
//             </div>
//           )}
//           <div id="gjs-editor" className="w-full h-full" ref={containerRef} />
//         </div>
//         {/* Right Sidebar */}
//         <Sidebar {...{ showSidebar, state, actions, setShowSidebar }} />
//       </div>
//       {/* Bottom Toolbar */}
//       <BottomToolbar {...{ showResponsivePanel, setShowResponsivePanel, allDevices, state, actions, customDevices, setCustomDevices }} />
//     </div>
//   );
// }
