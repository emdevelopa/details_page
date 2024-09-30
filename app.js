const cloudName = "djwldmjmy"; // Replace with your Cloudinary cloud name
const uploadPreset = "movi999";
const apiUrl = 'https://649ac56abf7c145d023971ee.mockapi.io/api/V1/users2'; // Mock API URL
 const successMessage = document.getElementById("success-message");
 const errorMessage = document.getElementById("error-message");
 const loadingMessage = document.getElementById("loading-message"); 

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the values of the inputs
    const fullName = document.getElementById("fullName").value;
    const ssn = document.getElementById("ssn").value;
    const schoolName = document.getElementById("schoolName").value;
    const graduationYear = document.getElementById("graduationYear").value;

    const frontId = document.getElementById("frontId").files[0];
    const backId = document.getElementById("backId").files[0];

    // Reset the messages
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    // Show loading message
    loadingMessage.style.display = "block";

    // Upload frontId and backId to Cloudinary
    const frontImageUrl = frontId ? await uploadToCloudinary(frontId) : null;
    const backImageUrl = backId ? await uploadToCloudinary(backId) : null;

    // Log the form data including the Cloudinary URLs
    console.log("Full Name:", fullName);
    console.log("Social Security Number:", ssn);
    console.log("High School Name:", schoolName);
    console.log("Year of Graduation:", graduationYear);
    console.log("Front ID URL:", frontImageUrl);
    console.log("Back ID URL:", backImageUrl);

    const formData = {
      name: fullName,
      SSN: ssn,
      HSN: schoolName,
      G_Date: graduationYear,
      ID_Front: frontImageUrl,
      ID_Back: backImageUrl,
    };
    submitToApi(formData);
    // You can now send the form data (including image URLs) to your server or handle it as needed
  });

  // Function to handle Cloudinary upload
  async function uploadToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url; // Return the Cloudinary URL of the uploaded image
    } catch (error) {
      console.error("Error uploading to Cloudinary", error);
      return null;
    }
  }

async function submitToApi(data) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      successMessage.textContent = "Submission successful!";
      successMessage.style.display = "block";
    } else {
      throw new Error(result.message || "Submission failed.");
    }
  } catch (error) {
    errorMessage.textContent = `Error: ${
      error.message || "Failed to submit data."
    }`;
    errorMessage.style.display = "block";
  } finally {
    // Hide loading message after submission is done
    loadingMessage.style.display = "none";
  }
}
});
