import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const useCapture = (id: string) => {
  const downloadPdf = (canvas: HTMLCanvasElement, fileName: string) => {
    const pdf = new jsPDF("p", "pt", "a4");

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 595.28; // A4 width in pt
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
  };

  const captureComponent = (name: string) => {
    console.log(`Attempting to capture component for PDF with ID: ${name}`);

    const componentNode = document.getElementById(name);

    if (componentNode) {
      console.log("Component found for PDF:", componentNode);

      const originalWidth = componentNode.scrollWidth;
      const originalHeight = componentNode.scrollHeight;

      console.log(`PDF dimensions: ${originalWidth}x${originalHeight}`);

      const originalOverflow = componentNode.style.overflow;
      componentNode.style.overflow = "visible";
      componentNode.style.width = `${originalWidth}px`;

      html2canvas(componentNode, {
        scrollX: 0,
        scrollY: 0,
        width: originalWidth,
        height: originalHeight,
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => {
          // Skip elements that might cause color parsing issues
          const style = getComputedStyle(element);
          return (
            style.color?.includes("lab(") ||
            style.backgroundColor?.includes("lab(")
          );
        },
      })
        .then((canvas) => {
          console.log("Canvas created for PDF:", canvas);
          downloadPdf(canvas, id);

          componentNode.style.overflow = originalOverflow;
          componentNode.style.width = "";

          console.log("PDF download completed successfully!");
        })
        .catch((error) => {
          console.error("Error capturing component for PDF:", error);
        });
    } else {
      console.error(`Component with ID '${name}' not found for PDF!`);
    }
  };

  const downloadImage = (blob: string, fileName: string) => {
    console.log(`Attempting to download image: ${fileName}`);

    const fakeLink = window.document.createElement("a");
    fakeLink.download = fileName;
    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();

    console.log(`Image download triggered for: ${fileName}`);
  };

  const pictureComponent = (name: string, fileFormat: string) => {
    console.log(`Attempting to capture component with ID: ${name}`);

    // Find the component node
    const componentNode = document.getElementById(name);

    if (componentNode) {
      console.log("Component found:", componentNode);

      // Get the full width and height, including the scrollable content
      const originalWidth = componentNode.scrollWidth;
      const originalHeight = componentNode.scrollHeight;

      console.log(`Original dimensions: ${originalWidth}x${originalHeight}`);

      // Temporarily adjust the component's width to ensure all scrollable content is visible
      const originalOverflow = componentNode.style.overflow;
      componentNode.style.overflow = "visible";
      componentNode.style.width = `${originalWidth}px`;

      html2canvas(componentNode, {
        scrollX: 0,
        scrollY: 0,
        width: originalWidth, // Set to the full width of the scrollable content
        height: originalHeight, // Set to the full height of the scrollable content
        useCORS: true, // Ensure external resources like images are loaded
        allowTaint: true,
        scale: 1,
        logging: false,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => {
          // Skip elements that might cause color parsing issues
          const style = getComputedStyle(element);
          return (
            style.color?.includes("lab(") ||
            style.backgroundColor?.includes("lab(")
          );
        },
      })
        .then((canvas) => {
          console.log("Canvas created successfully:", canvas);
          const imgData = canvas.toDataURL(`image/${fileFormat}`, 1.0);
          console.log("Image data created, attempting download...");

          // Download the captured image
          downloadImage(imgData, `${id}.${fileFormat}`);

          // Restore the original overflow and width
          componentNode.style.overflow = originalOverflow;
          componentNode.style.width = "";

          console.log("Download completed successfully!");
        })
        .catch((error) => {
          console.error("Error capturing component:", error);
        });
    } else {
      console.error(`Component with ID '${name}' not found!`);
    }
  };

  return {
    captureComponent,
    pictureComponent,
  };
};
