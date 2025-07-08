export function onClickCapture(viewerRef, id) {
  if (!viewerRef.current) return;

  try {
    // Get the canvas element from the container
    const canvas = viewerRef.current.querySelector("canvas");

    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    // Create a new canvas with proper background
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    const ctx = newCanvas.getContext("2d");

    // Draw background
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw original canvas content on top
    ctx.drawImage(canvas, 0, 0);

    // Convert the new canvas to data URL
    const dataUrl = newCanvas.toDataURL("image/png");

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${id ? `${id}-` : ""}molecular-structure.png`;
    link.click();
  } catch (error) {
    console.error("Error taking screenshot:", error);
  }
}
