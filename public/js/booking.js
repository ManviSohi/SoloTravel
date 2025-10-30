// ✅ Booking form handler
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(bookingForm.action, {
        method: "POST",
        credentials: "same-origin"
      });
      if (response.ok) {
        Swal.fire({
          title: "Booking Confirmed!",
          text: "Your stay has been successfully booked.",
          icon: "success",
          confirmButtonColor: "#fe424d",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while booking.",
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
