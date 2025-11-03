const generateMeme = async () => {
  const fileInput = document.getElementById("formFile");
  const file = fileInput.files[0];
  const upperText = document.getElementById("upperText").value;
  const lowerText = document.getElementById("lowerText").value;
  const applyGrayscale =
    document.getElementById("grayscaleSwitch")?.checked || false;
  console.log("clicked");

  //make sure they inputted a file
  if (!file) {
    alert("Please select an image first");
    return;
  }

  // validate file type
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validTypes.includes(file.type)) {
    alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
    return;
  }

  //validate that at least one text field is provided
  if (!upperText.trim() && !lowerText.trim()) {
    alert("Please enter at least one text field (upper or lower)");
    return;
  }

  const reader = new FileReader();

  reader.onerror = function (error) {
    console.error("error reading file:", error);
    alert("Failed to read the selected file");
  };

  reader.onload = async function (e) {
    try {
      const base64Image = e.target.result;
      const pureBase64 = base64Image.split(",")[1];
      await uploadMeme(pureBase64, upperText, lowerText, applyGrayscale);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process the image. Please try again.");
    }
  };

  reader.readAsDataURL(file);
};

const uploadMeme = async (pureBase64, upperText, lowerText, applyGrayscale) => {
  const generateButton = document.getElementById("generateMemeButton");
  const memeImageElement = document.getElementById("memeImage");

  try {
    //show loading state when generating
    generateButton.disabled = true;
    generateButton.textContent = "Generating...";

    const response = await fetch("/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: pureBase64,
        upperText: upperText,
        lowerText: lowerText,
      }),
    });

    //check response status
    if (!response.ok) {
      let errorMessage = "Failed to generate meme";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        if (errorData.details) {
          console.error("Error details:", errorData.details);
        }
      } catch (e) {
        errorMessage = `Server error: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.memeImageUrl) {
      throw new Error("Invalid response: missing meme image URL");
    }

    const memeImageUrl = data.memeImageUrl;

    memeImageElement.src = memeImageUrl;
    memeImageElement.classList.remove("d-none");

    // use css grayscale filter if checkbox is checked
    if (applyGrayscale) {
      memeImageElement.style.filter = "grayscale(100%)";
    } else {
      memeImageElement.style.filter = "none";
    }
  } catch (error) {
    console.error("Error generating meme:", error);

    //hide any previous meme
    memeImageElement.classList.add("d-none");
  } finally {
    // emable button and restore text
    generateButton.disabled = false;
    generateButton.textContent = "Generate Meme";
  }
};

const generateMemeButton = document.getElementById("generateMemeButton");
generateMemeButton.addEventListener("click", generateMeme);
