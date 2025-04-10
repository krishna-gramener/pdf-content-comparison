# PDF Text Comparison Tool

A powerful web application that allows users to compare text content between two PDF documents. The tool uses Google's Gemini AI for OCR (Optical Character Recognition) to extract text from PDFs and determine if the content from one document is present in another.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Setup and Installation](#setup-and-installation)
- [Usage Guide](#usage-guide)
- [How It Works](#how-it-works)
- [API Integration](#api-integration)
- [Developer Information](#developer-information)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [License](#license)

## Overview

The PDF Text Comparison Tool is designed to help users quickly determine if text content from one PDF document exists within another. This is particularly useful for verifying if extracted content has been properly sourced from an original document, checking for plagiarism, or validating document translations.

The application leverages Google's Gemini AI OCR capabilities to accurately extract text from PDF documents, including those containing Arabic text, and provides a user-friendly interface for comparing the extracted content.

## Features

- **Dual PDF Upload**: Upload and view two PDF documents side by side
- **Advanced OCR**: Uses Google's Gemini 1.5 Flash model for accurate text extraction from PDFs
- **Arabic Text Support**: Specially optimized for Arabic text extraction and comparison
- **Real-time PDF Preview**: View uploaded PDFs directly in the browser
- **Detailed Comparison Results**: Clear visual indicators of whether text is present or absent
- **Extracted Text Display**: View the extracted text from both PDFs
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error messages and validation

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API access
- Access to Straive LLM Foundry platform
- Valid authentication token for API access

## Setup and Installation

### Local Setup

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/yourusername/pdf-comparison-tool.git
   cd pdf-comparison-tool
   ```

2. Open the project in your code editor.

3. Ensure you have access to the Straive LLM Foundry platform and can obtain an authentication token.

4. Open the application in a web browser by double-clicking on `index.html` or using a local server.

### Configuration

The application automatically handles authentication with the Straive LLM Foundry platform. No additional configuration is required for basic usage.

## Usage Guide

1. **Login**: The application will automatically redirect you to the Straive LLM Foundry login page if you're not already authenticated.

2. **Upload PDFs**:
   - In the "First PDF" section, click "Upload Extracted Content PDF" to select the PDF containing the text you want to search for.
   - In the "Second PDF" section, click "Upload Source PDF" to select the PDF you want to search within.

3. **Compare Documents**:
   - Once both PDFs are uploaded, the "Compare PDFs" button will become active.
   - Click the button to start the comparison process.
   - A loading indicator will appear while the system processes the documents.

4. **View Results**:
   - The comparison results will be displayed with a clear indicator of whether the text is present or absent.
   - The extracted text from both PDFs will be shown below the results for verification.
   - If the text from the first PDF is found in the second PDF, a green "Text is Present" message will appear.
   - If the text is not found, a red "Text is Absent" message will be displayed.

5. **Review Extracted Text**:
   - Scroll through the extracted text panels to manually verify the results if needed.

## How It Works

1. **PDF Upload**: The user uploads two PDF documents through the web interface.

2. **Text Extraction**: 
   - The application converts each PDF to base64 format.
   - It sends the encoded PDFs to the Gemini API with instructions to extract Arabic text.
   - Gemini's advanced OCR capabilities process the documents and return the extracted text.

3. **Text Comparison**:
   - The application compares the extracted text from both PDFs.
   - It determines if the text from the first PDF is present in the second PDF.

4. **Result Display**:
   - The comparison results are displayed with visual indicators.
   - The extracted text from both PDFs is shown for verification.

## API Integration

The application integrates with Google's Gemini 1.5 Flash model through the Straive LLM Foundry platform. The API is used for OCR text extraction from PDF documents.

### API Endpoints

- **Gemini API**: `https://llmfoundry.straive.com/gemini/v1beta/models/gemini-1.5-flash-latest:generateContent`

### Authentication

The application handles authentication automatically by:
1. Checking for an existing token
2. Redirecting to the login page if no token is found
3. Using the token for subsequent API calls

## Developer Information

### Project Structure

- `index.html`: Main application interface
- `script.js`: JavaScript code for application logic
- `README.md`: Documentation

### Key Functions

- `init()`: Initializes the application and handles authentication
- `handlePdf1Change()` & `handlePdf2Change()`: Manage PDF file uploads
- `renderPdf()`: Displays PDF files in the browser
- `extractTextFromPdf()`: Coordinates the text extraction process
- `callGeminiApi()`: Communicates with the Gemini API for text extraction
- `compareText()`: Performs the text comparison
- `displayResults()`: Shows the comparison results

### Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.2
- **Icons**: Bootstrap Icons 1.11.1
- **PDF Rendering**: Native browser PDF rendering
- **API Communication**: Fetch API
- **Text Extraction**: Google Gemini 1.5 Flash model

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Ensure you have a valid account on the Straive LLM Foundry platform
   - Try logging in again if your session has expired

2. **PDF Upload Issues**:
   - Verify that your files are valid PDFs
   - Check that the file size is not too large (recommend under 10MB)

3. **Text Extraction Failures**:
   - Some PDFs with complex formatting or scanned as images may have reduced extraction accuracy
   - PDFs with security restrictions may not be processable

4. **Comparison Inaccuracies**:
   - The comparison is based on string inclusion, which may not detect partial or paraphrased content
   - Different formatting, spacing, or special characters may affect comparison results

### Error Messages

The application displays specific error messages to help troubleshoot issues:
- Invalid file type errors
- API communication errors
- Text extraction failures

## Security Considerations

- The application processes PDFs in the browser and sends them to the Gemini API
- Authentication is handled through the Straive LLM Foundry platform
- No PDF content is stored permanently on servers after processing
- It's recommended not to upload PDFs containing sensitive or confidential information

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

 2025 PDF Text Comparison Tool | Developed by Gramener (a Straive Company)