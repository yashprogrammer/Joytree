export default function OrderSummaryPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Order Summary</h1>
      <p className="text-sm text-gray-500">Order ID: {params.id}</p>
    </div>
  );
}


