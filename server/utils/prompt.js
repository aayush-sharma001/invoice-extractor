export function generatePrompt(extractedText) {
  return `
You are an intelligent invoice parser.

Your task is to extract structured information from the provided invoice text. For each field, return both the extracted value and a confidence score (0–100). If a field is not found, return null as the value and 0 as the confidence.

### Fields to extract:
- invoiceNumber: The unique invoice number
- dateIssued: The date when the invoice was issued
- vendorSupplierName: The name of the vendor or supplier
- totalAmount: The total payable amount
- taxInfo: An object with taxRate and taxAmount
- lineItems: An array of objects with:
    - description
    - quantity
    - unitPrice
    - amount
    - confidence (for the whole line item)

### Format:
Respond ONLY in the following JSON format inside triple backticks:

\`\`\`json
{
  "invoiceNumber": { "value": "12345", "confidence": 95 },
  "dateIssued": { "value": "2023-12-01", "confidence": 92 },
  "vendorSupplierName": { "value": "ABC Pvt. Ltd.", "confidence": 97 },
  "totalAmount": { "value": "1250.50", "confidence": 90 },
  "taxInfo": { "taxRate": "18%", "taxAmount": "190.50", "confidence": 88 },
  "lineItems": [
    {
      "description": "Item A",
      "quantity": "2",
      "unitPrice": "500.00",
      "amount": "1000.00",
      "confidence": 91
    },
    {
      "description": "Item B",
      "quantity": "1",
      "unitPrice": "250.00",
      "amount": "250.00",
      "confidence": 89
    }
  ]
}
\`\`\`

### Invoice Text:
${extractedText}
`;
}
