// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { DataTable as ViewTable } from "@/components/inventory/StockOutItems/CreateStockOut/user-view-table";
// import { getStockOutColumns } from "@/components/inventory/StockOutItems/CreateStockOut/columns";
// import type { StockOut } from "@/components/inventory/StockOutItems/CreateStockOut/columns";

// import {
//   Modal,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalTitle,
//   ModalDescription,
// } from "@/components/ui/modal";

// import EditStockOut from "@/components/inventory/StockOutItems/EditStockOut";
// import StockOutReceipt from "@/components/inventory/StockOutItems/StockOutReceipt";
// import CreateStockOut from "@/components/inventory/StockOutItems/CreateStockOut";

// interface StockOutItemProps {
//   data?: StockOut[];
// }

// export default function StockOutItem({ data = [] }: StockOutItemProps) {
//   const [showStockOutItem, setShowStockOutItem] = useState(false);
//   const [showCreateStockOut, setShowCreateStockOut] = useState(false);
//   const [showEditStockOut, setShowEditStockOut] = useState(false);
//   const [showReceipt, setShowReceipt] = useState(false);
//   const [receiptData, setReceiptData] = useState<any>(null);
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   const dummyData: StockOut[] = [
//     { id: "1", name: "Rice", category: ["PANTRY"], quantity: 100 },
//     { id: "2", name: "Chicken", category: ["FRIDGE"], quantity: 50 },
//     { id: "3", name: "Milk", category: ["FRIDGE", "PANTRY"], quantity: 30 },
//   ];

//   const columns = getStockOutColumns(selectedId, setSelectedId);
//   const selectedItem = dummyData.find((item) => item.id === selectedId);

//   // Save handler for StockDetailsModal
//   const handleSaveStockOutDetails = async (stockDetails: any) => {
//     const dummyReceipt = {
//       message: "Stock-out created successfully",
//       stockOutReceipt: {
//         stockOut: {
//           id: "STOCKOUT123",
//           createdAt: new Date().toISOString(),
//           createdById: "USER1",
//           modifiedAt: new Date().toISOString(),
//           modifiedById: "USER1",
//         },
//         items: [
//           {
//             stockOutId: "STOCKOUT123",
//             itemId: selectedItem?.id,
//             inventoryId: "INV123",
//             uomId: stockDetails?.uomId || "UOM1",
//             quantity: stockDetails?.quantity || 0,
//             convertedQuantity: stockDetails?.quantity || 0,
//             uomName: stockDetails?.uomName || "kg",
//           },
//         ],
//       },
//     };

//     setReceiptData(dummyReceipt.stockOutReceipt);
//     setShowEditStockOut(false);
//     setShowReceipt(true);
//   };

//   return (
//     <>
//       <Button onClick={() => setShowStockOutItem(true)}>Stock Out Items</Button>

//       {/* first modal - stock out items */}
//       <Modal
//         isVisible={showStockOutItem}
//         onClose={() => setShowStockOutItem(false)}
//       >
//         <ModalHeader>
//           <ModalTitle>Stock Out Items</ModalTitle>
//           <ModalDescription>
//             Select an item you want to stock out
//           </ModalDescription>
//         </ModalHeader>

//         <ModalContent className="mb-4">
//           <ViewTable columns={columns} data={dummyData} />
//         </ModalContent>

//         <ModalFooter className="flex gap-2">
//           <Button type="submit" onClick={() => setShowCreateStockOut(true)} disabled={!selectedItem}>
//             Create Stock Out
//           </Button>
//           <Button
//             onClick={() => setShowEditStockOut(true)}
//             disabled={!selectedItem}
//           >
//             Edit
//           </Button>
//           <Button type="submit" onClick={() => setShowStockOutItem(false)}>
//             Cancel
//           </Button>
          
//         </ModalFooter>
//       </Modal>

//       {/* second modal - create stock out */}
//       {showCreateStockOut && (
//       <Modal
//         isVisible={showCreateStockOut}
//         onClose={() => setShowCreateStockOut(false)}
//       >
//         <ModalHeader>
//           <ModalTitle>Create Stock Out</ModalTitle>
//           <ModalDescription>
//             Enter quantity, and unit of measurement
//           </ModalDescription>
//         </ModalHeader>
//         <ModalContent>
//           <CreateStockOut
//             item={dummyData[0]}
//             onClose={() => setShowCreateStockOut(false)}
//             onSave={handleSaveStockOutDetails}
//           />
//         </ModalContent>

//       </Modal>
// )}



//       {/* third modal - edit stock out */}
//       {showEditStockOut && selectedItem && (
//         <Modal
//           isVisible={showEditStockOut}
//           onClose={() => setShowEditStockOut(false)}
//         >
//           <ModalHeader>
//             <ModalTitle>Enter Stock Details for {selectedItem.name}</ModalTitle>
//             <ModalDescription>
//               Enter quantity, unit of measurement, and category
//             </ModalDescription>
//           </ModalHeader>
//           <ModalContent>
//             <EditStockOut 
//               item={selectedItem}
//               onClose={() => setShowEditStockOut(false)}
//               onSave={handleSaveStockOutDetails}
//             />
//           </ModalContent>
//         </Modal>
//       )}

//       {/* fourth modal - receipt modal */}
//       {showReceipt && receiptData && (
//         <Modal isVisible={showReceipt} onClose={() => setShowReceipt(false)}>
//           <ModalHeader>
//             <ModalTitle>Stock-Out Receipt</ModalTitle>
//             <ModalDescription>
//               Review your stock-out details below.
//             </ModalDescription>
//           </ModalHeader>
//           <ModalContent>
//             <StockOutReceipt
//               receiptData={receiptData}
//               onClose={() => setShowReceipt(false)}
//             />
//           </ModalContent>
//           <ModalFooter className="space-y-2 gap-2">
//             <Button type="submit" onClick={() => setShowReceipt(false)}>
//               Done
//             </Button>
//           </ModalFooter>
//         </Modal>
//       )}
//     </>
//   );
// }

