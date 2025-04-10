// Gemini API key - Replace with your actual API key
// Note: In production, this should be stored securely
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const GEMINI_API_URL =
  "https://llmfoundry.straive.com/gemini/v1beta/models/gemini-1.5-flash-latest:generateContent";

// DOM Elements
const pdf1Input = document.getElementById("pdf1");
const pdf2Input = document.getElementById("pdf2");
const compareBtn = document.getElementById("compare-btn");
const pdf1Container = document.getElementById("pdf1-container");
const pdf2Container = document.getElementById("pdf2-container");
const loadingOverlay = document.getElementById("loading-overlay");
const loadingText = document.getElementById("loading-text");
const resultsSection = document.getElementById("results-section");
const resultCard = document.getElementById("result-card");
const resultIcon = document.getElementById("result-icon");
const resultText = document.getElementById("result-text");
const resultExplanation = document.getElementById("result-explanation");
const pdf1TextElement = document.getElementById("pdf1-text");
const pdf2TextElement = document.getElementById("pdf2-text");
const errorAlert = document.getElementById("error-alert");
const errorMessage = document.getElementById("error-message");

// State variables
let pdf1File = null;
let pdf2File = null;
let pdf1Text = "";
let pdf2Text = "";
let token='';

// Event listeners
pdf1Input.addEventListener("change", handlePdf1Change);
pdf2Input.addEventListener("change", handlePdf2Change);
compareBtn.addEventListener("click", handleCompare);

// Initialize the application
init();

/**
 * Initialize the application
 */
async function init() {
  token = await fetch("https://llmfoundry.straive.com/token", {
    credentials: "include",
  }).then((r) => r.json());

  console.log("Token:", token);
  token=token.token;
  if (!token) {
    document.getElementById("main-container").classList.add("d-none");
    const url =
      "https://llmfoundry.straive.com/login?" +
      new URLSearchParams({ next: location.href });
    render(
      html`<a class="btn btn-primary" href="${url}">Log into LLM Foundry</a></p>`,
      document.querySelector("#login")
    );
  }
  // Check if both PDFs are selected to enable the compare button
  checkEnableCompareButton();
}

/**
 * Handle PDF 1 file selection
 */
function handlePdf1Change(event) {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    pdf1File = file;
    renderPdf(file, pdf1Container, 1);
    checkEnableCompareButton();
  } else {
    showError("Please select a valid PDF file for the first document.");
    pdf1Input.value = "";
    pdf1File = null;
    checkEnableCompareButton();
  }
}

/**
 * Handle PDF 2 file selection
 */
function handlePdf2Change(event) {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    pdf2File = file;
    renderPdf(file, pdf2Container, 2);
    checkEnableCompareButton();
  } else {
    showError("Please select a valid PDF file for the second document.");
    pdf2Input.value = "";
    pdf2File = null;
    checkEnableCompareButton();
  }
}

/**
 * Check if both PDFs are selected to enable the compare button
 */
function checkEnableCompareButton() {
  compareBtn.disabled = !(pdf1File && pdf2File);
}

/**
 * Render PDF in the container using iframe
 */
async function renderPdf(file, container, pdfNumber) {
  try {
    // Clear the container
    container.innerHTML = "";

    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);

    // Create an iframe to display the PDF
    const iframe = document.createElement("iframe");
    iframe.src = fileUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    
    // Append the iframe to the container
    container.appendChild(iframe);
    
    // Clean up the URL when the iframe loads to prevent memory leaks
    iframe.onload = () => {
      // Keep the URL valid while the iframe is in use
      // URL.revokeObjectURL will be called when a new file is loaded
    };
  } catch (error) {
    console.error(`Error rendering PDF ${pdfNumber}:`, error);
    showError(`Error rendering PDF ${pdfNumber}: ${error.message}`);
  }
}

/**
 * Handle the compare button click
 */
async function handleCompare() {
  try {
    // Show loading overlay
    showLoading("Processing PDFs...");

    // Hide any previous error
    hideError();

    // Extract text from both PDFs
    loadingText.textContent = "Extracting text from PDFs...";
    const [extractedText1, extractedText2] = await Promise.all([
      extractTextFromPdf(pdf1File),
      extractTextFromPdf(pdf2File),
    ]);

    // Store the extracted text
    pdf1Text = extractedText1;
    pdf2Text = extractedText2;

    // Display the extracted text
    pdf1TextElement.textContent = pdf1Text;
    pdf2TextElement.textContent = pdf2Text;

    // Compare the text
    loadingText.textContent = "Comparing text...";
    const comparisonResult = compareText(pdf1Text, pdf2Text);

    // Display the results
    displayResults(comparisonResult);

    // Hide loading overlay
    hideLoading();

    // Show results section
    resultsSection.classList.remove("d-none");

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error comparing PDFs:", error);
    showError(`Error comparing PDFs: ${error.message}`);
    hideLoading();
  }
}

/**
 * Extract text from PDF using Gemini API
 */
async function extractTextFromPdf(pdfFile) {
  try {
    // First, convert the PDF to base64
    const base64Pdf = await fileToBase64(pdfFile);

    // Call Gemini API to extract text
    const response = await callGeminiApi(base64Pdf);

    return response.text;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

/**
 * Convert file to base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Call Gemini API to extract text from PDF
 */
async function callGeminiApi(base64Pdf) {
  try {

    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Extract all text from this PDF. The text is in Arabic. Return only the extracted text without any additional comments.",
            },
            {
              inline_data: {
                mime_type: "application/pdf",
                data: base64Pdf,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}:pdfCompare`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API error: ${errorData.error.message || "Unknown error"}`
      );
    }

    const data = await response.json();

    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;

    return { text };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

/**
 * Compare text between two PDFs
 */
function compareText(text1, text2) {
  // Simple comparison to check if text1 is present in text2
  const isPresent = text2.includes(text1);

  return {
    isPresent,
    text1,
    text2,
  };
}

/**
 * Display comparison results
 */
function displayResults(result) {
  if (result.isPresent) {
    // Text is present
    resultCard.classList.add("present");
    resultCard.classList.remove("absent");
    resultIcon.innerHTML =
      '<i class="bi bi-check-circle-fill text-success"></i>';
    resultText.textContent = "Text is Present";
    resultExplanation.textContent =
      "The text from the first PDF is found in the second PDF.";
  } else {
    // Text is absent
    resultCard.classList.add("absent");
    resultCard.classList.remove("present");
    resultIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i>';
    resultText.textContent = "Text is Absent";
    resultExplanation.textContent =
      "The text from the first PDF is not found in the second PDF.";
  }
}

function showLoading(message) {
  loadingText.textContent = message;
  loadingOverlay.classList.remove("d-none");
}

function hideLoading() {
  loadingOverlay.classList.add("d-none");
}

function showError(message) {
  errorMessage.textContent = message;
  errorAlert.classList.remove("d-none");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
  errorAlert.classList.add("d-none");
}
