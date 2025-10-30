// ✅ Delete Review
document.querySelectorAll(".delete-review-form").forEach(form => {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const url = form.action;
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fe424d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(url, {
          method: "POST",
          credentials: "same-origin",
        });
        if (res.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Your review has been removed.",
            icon: "success",
            confirmButtonColor: "#fe424d",
          }).then(()=> window.location.reload());
        } else {
          Swal.fire({
            title: "Error!",
            text: "Could not delete review.",
            icon: "error",
            confirmButtonColor: "#fe424d",
          });
        }
      }
    });
  });
});
