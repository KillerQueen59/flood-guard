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
    const componentNode = document.getElementById(name);

    if (componentNode) {
      const originalWidth = componentNode.scrollWidth;
      const originalHeight = componentNode.scrollHeight;

      const originalOverflow = componentNode.style.overflow;
      componentNode.style.overflow = "visible";
      componentNode.style.width = `${originalWidth}px`;

      html2canvas(componentNode, {
        scrollX: 0,
        scrollY: 0,
        width: originalWidth,
        height: originalHeight,
        useCORS: true,
      })
        .then((canvas) => {
          downloadPdf(canvas, id);

          componentNode.style.overflow = originalOverflow;
          componentNode.style.width = "";
        })
        .catch((error) => {
          console.log("Error capturing component:", error);
        });
    }
  };

  const downloadImage = (blob: string, fileName: string) => {
    const fakeLink = window.document.createElement("a");
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
  };

  const pictureComponent = (name: string, fileFormat: string) => {
    // Find the component node
    const componentNode = document.getElementById(name);

    if (componentNode) {
      // Get the full width and height, including the scrollable content
      const originalWidth = componentNode.scrollWidth;
      const originalHeight = componentNode.scrollHeight;

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
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL(`image/${fileFormat}`, 1.0);

          // Download the captured image
          downloadImage(imgData, `${id}.${fileFormat}`);

          // Restore the original overflow and width
          componentNode.style.overflow = originalOverflow;
          componentNode.style.width = "";
        })
        .catch((error) => {
          console.log("Error capturing component:", error);
        });
    }
  };

  return {
    captureComponent,
    pictureComponent,
  };
};
