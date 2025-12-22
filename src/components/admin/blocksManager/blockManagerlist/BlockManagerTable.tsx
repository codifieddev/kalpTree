import  { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBlock } from "@/hooks/slices/blocks/BlockSlice";
import { BlockManagerModel } from "../types/BlockManagerModel";
import { BlockForm } from "../form/BlockForm";
import { RootState } from "@/store/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const BlockManagerTable: React.FC = () => {
  const { listBlocks } = useSelector((state: RootState) => state.block);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddBlock = (data: BlockManagerModel) => {
    dispatch(addBlock(data));
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Blocks</h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="btn btn-primary"
        >
          Create New
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Block</DialogTitle>
          </DialogHeader>
          <BlockForm onSubmit={handleAddBlock} submitLabel="Add Block" />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              type="button"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    {  listBlocks && 
    listBlocks.length >0&&<div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {/* <th className="px-4 py-2 border">ID</th> */}
              <th className="px-4 py-2 border">Label</th>
              <th className="px-4 py-2 border">Category</th>
               <th className="px-4 py-2 border">Content</th>
              <th className="px-4 py-2 border">Premium</th>
              <th className="px-4 py-2 border">Icon</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listBlocks.map((block, index) => (
              <tr key={index} className="border-b">
                {/* <td className="px-4 py-2 border">{block.id}</td> */}
                <td className="px-4 py-2 border">{block.label}</td>
                <td className="px-4 py-2 border">{block.category}</td>
                <td className="px-4 py-2 border">
                  <div
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    style={{ maxWidth: 300, overflow: 'auto', whiteSpace: 'pre-wrap' }}
                  />
                </td>
                <td className="px-4 py-2 border">{block.premium ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border">{block.icon}</td>
                <td className="px-4 py-2 border">{/* Actions like edit/delete can go here */}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
};

export default BlockManagerTable;

