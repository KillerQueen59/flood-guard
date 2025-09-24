/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "json2csv";
import { saveAs } from "file-saver"; // To download the file
import { PDFDocument, rgb } from "pdf-lib";

export const downloadCsv = (data: any) => {
  const fields = [
    { label: "Name", value: "name" },
    { label: "Detail Name", value: "detailName" },
    { label: "ID", value: "id" },
    { label: "Start Date", value: "startDate" },
    { label: "Battery", value: "battery" },
    { label: "Signal", value: "signal" },
    { label: "Sensor", value: "sensor" },
    { label: "Status", value: "status" },
    { label: "Note", value: "note" },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "aws_data.csv");
};

export const downloadPdf = async (data: any) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Set font size and color
  const { height } = page.getSize();
  const fontSize = 12;
  page.drawText("AWS Data", {
    x: 50,
    y: height - 50,
    size: 20,
    color: rgb(0, 0, 0),
  });

  // Draw table headers
  const headers = [
    "Name",
    "Detail Name",
    "ID",
    "Start Date",
    "Battery",
    "Signal",
    "Sensor",
    "Status",
    "Note",
  ];

  headers.forEach((header, index) => {
    page.drawText(header, {
      x: 50 + index * 60,
      y: height - 80,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  });

  // Draw table rows
  data.forEach((item: any, rowIndex: any) => {
    headers.forEach((header, colIndex) => {
      const value = item[header.toLowerCase().replace(" ", "")]; // Adjust key based on your data structure
      page.drawText(value, {
        x: 50 + colIndex * 60,
        y: height - 100 - rowIndex * 20,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Create a blob and save the PDF
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  saveAs(blob, "aws_data.pdf");
};

export const downloadCsvAwl = (data: any) => {
  const fields = [
    { label: "Name", value: "name" },
    { label: "Detail Name", value: "detailName" },
    { label: "ID", value: "id" },
    { label: "Start Date", value: "startDate" },
    { label: "Battery", value: "battery" },
    { label: "Signal", value: "signal" },
    { label: "Data", value: "data" },
    { label: "Status", value: "status" },
    { label: "Note", value: "note" },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "awl_data.csv");
};

export const downloadPdfAwl = async (data: any) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Set font size and color
  const { height } = page.getSize();
  const fontSize = 12;
  page.drawText("AWS Data", {
    x: 50,
    y: height - 50,
    size: 20,
    color: rgb(0, 0, 0),
  });

  // Draw table headers
  const headers = [
    "Name",
    "Detail Name",
    "ID",
    "Start Date",
    "Battery",
    "Signal",
    "Data",
    "Status",
    "Note",
  ];

  headers.forEach((header, index) => {
    page.drawText(header, {
      x: 50 + index * 60,
      y: height - 80,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  });

  // Draw table rows
  data.forEach((item: any, rowIndex: any) => {
    headers.forEach((header, colIndex) => {
      const value = item[header.toLowerCase().replace(" ", "")]; // Adjust key based on your data structure
      page.drawText(value, {
        x: 50 + colIndex * 60,
        y: height - 100 - rowIndex * 20,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Create a blob and save the PDF
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  saveAs(blob, "awl_data.pdf");
};
