// ✅ Review submission handler
const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(reviewForm);
      const urlEncoded = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        urlEncoded.append(key, value);
      }

      const response = await fetch(reviewForm.action, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: urlEncoded.toString()
      });

      if (response.ok) {
        Swal.fire({
          title: "Review Added!",
          text: "Thanks for sharing your experience.",
          icon: "success",
          confirmButtonColor: "#fe424d",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while adding your review.",
          icon: "error",
          confirmButtonColor: "#fe424d",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Network Error",
        text: "Please check your connection.",
        icon: "error",
        confirmButtonColor: "#fe424d",
      });
    }
  });
}
