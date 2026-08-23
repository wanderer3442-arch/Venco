import { NextResponse } from "next/server";

export async function GET() {
  // Pro-gated in real app — return placeholder PDF
  const pdf = `%PDF-1.4 placeholder VencoFit checkup`;
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=VencoFit-checkup.pdf",
    },
  });
}
