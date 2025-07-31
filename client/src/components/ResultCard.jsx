function ResultCard({ results }) {
  if (!results?.success || !results.data) {
    return null;
  }

  let extractedData = null;
  try {
    const match = results.data.match(/```(?:json)?\n([\s\S]*?)```/);
    if (match && match[1]) {
      extractedData = JSON.parse(match[1]);
    }
  } catch (error) {
    console.error("Failed to parse extracted JSON:", error);
  }

  if (!extractedData) {
    return (
      <div className="bg-white shadow-md p-6 mt-6 w-full max-w-2xl rounded text-red-500">
        Could not parse extracted data.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md p-6 mt-6 w-full max-w-2xl rounded">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">📄 Extracted Invoice Data</h2>

      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <strong>Invoice Number:</strong> {extractedData.invoiceNumber?.value} ({extractedData.invoiceNumber?.confidence}%)
        </div>
        <div>
          <strong>Date Issued:</strong> {extractedData.dateIssued?.value} ({extractedData.dateIssued?.confidence}%)
        </div>
        <div>
          <strong>Vendor Name:</strong> {extractedData.vendorSupplierName?.value} ({extractedData.vendorSupplierName?.confidence}%)
        </div>
        <div>
          <strong>Total Amount:</strong> ₹{extractedData.totalAmount?.value} ({extractedData.totalAmount?.confidence}%)
        </div>

        <div>
          <strong>Tax Info:</strong><br />
          Rate: {extractedData.taxInfo?.taxRate}, Amount: ₹{extractedData.taxInfo?.taxAmount} ({extractedData.taxInfo?.confidence}%)
        </div>

        <div>
          <strong className="block mt-4 mb-2">📦 Line Items:</strong>
          <div className="border rounded p-2 bg-gray-50 space-y-2">
            {extractedData.lineItems?.map((item, idx) => (
              <div key={idx} className="border-b pb-2">
                <p><strong>Description:</strong> {item.description}</p>
                {item.quantity && <p><strong>Quantity:</strong> {item.quantity}</p>}
                <p><strong>Unit Price:</strong> ₹{item.unitPrice}</p>
                <p><strong>Amount:</strong> ₹{item.amount}</p>
                <p><strong>Confidence:</strong> {item.confidence}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
