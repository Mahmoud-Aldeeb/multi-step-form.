$(document).ready(function () {
  // Store form data
  const formData = {
    plan: "advanced",
    billing: "monthly",
    addons: ["online", "storage"],
  };

  // Initialize first step
  updateStepIndicator(1);

  // Handle next step button
  $(".next-step").click(function () {
    const nextStep = $(this).data("next");
    const currentStep = $(this).closest(".step-content").data("step");

    // Validate only for step 1
    if (currentStep === 1) {
      let isValid = true;

      // Reset all validations first
      $(".form-control").removeClass("is-invalid");
      $(".error-message").addClass("d-none");

      // Validate name
      if ($("#name").val().trim() === "") {
        $("#name").addClass("is-invalid");
        $("#name")
          .next(".error-message")
          .text("This field is required")
          .removeClass("d-none");
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailValue = $("#email").val().trim();
      if (emailValue === "") {
        $("#email").addClass("is-invalid");
        $("#email")
          .next(".error-message")
          .text("This field is required")
          .removeClass("d-none");
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        $("#email").addClass("is-invalid");
        $("#email")
          .next(".error-message")
          .text("Please enter a valid email")
          .removeClass("d-none");
        isValid = false;
      }

      // Validate phone
      const phoneRegex = /^\+?[0-9\s\-]+$/;
      const phoneValue = $("#phone").val().trim();
      if (phoneValue === "") {
        $("#phone").addClass("is-invalid");
        $("#phone")
          .next(".error-message")
          .text("This field is required")
          .removeClass("d-none");
        isValid = false;
      } else if (!phoneRegex.test(phoneValue)) {
        $("#phone").addClass("is-invalid");
        $("#phone")
          .next(".error-message")
          .text("Please enter a valid phone number")
          .removeClass("d-none");
        isValid = false;
      }

      if (!isValid) {
        // Scroll to first error
        $("html, body").animate(
          {
            scrollTop: $(".is-invalid").first().offset().top - 100,
          },
          500
        );
        return false;
      }
    }

    goToStep(nextStep);
  });

  // Handle previous step button
  $(".prev-step").click(function () {
    const prevStep = $(this).data("prev");
    goToStep(prevStep);
  });

  // Handle step navigation from sidebar
  $(".step-item").click(function () {
    const step = $(this).data("step");
    goToStep(step);
  });

  // Toggle between monthly and yearly billing
  $("#billingToggle").change(function () {
    const isYearly = $(this).is(":checked");
    formData.billing = isYearly ? "yearly" : "monthly";

    // Update plan prices
    const priceElements = $(".plan-price");
    const freeElements = $(".plan-free");
    const toggleLabels = $(".toggle-label");

    if (isYearly) {
      priceElements.each(function () {
        const yearlyPrice = $(this).data("yearly");
        $(this).text(yearlyPrice);
      });
      freeElements.removeClass("d-none");
      toggleLabels.removeClass("active");
      toggleLabels.eq(1).addClass("active");

      // Update addon prices
      $(".addon-price").each(function () {
        $(this).text($(this).data("yearly"));
      });
    } else {
      priceElements.each(function () {
        const monthlyPrice = $(this).data("monthly");
        $(this).text(monthlyPrice);
      });
      freeElements.addClass("d-none");
      toggleLabels.removeClass("active");
      toggleLabels.eq(0).addClass("active");

      // Update addon prices
      $(".addon-price").each(function () {
        $(this).text($(this).data("monthly"));
      });
    }

    updateSummary();
  });

  // Select plan cards
  $(".plan-card").click(function () {
    $(".plan-card").removeClass("selected");
    $(this).addClass("selected");
    formData.plan = $(this).data("plan");
    updateSummary();
  });

  // Select addons
  $(".addon-card").click(function () {
    $(this).toggleClass("selected");
    const addon = $(this).data("addon");
    const checkbox = $(this).find(".form-check-input");
    checkbox.prop("checked", !checkbox.prop("checked"));

    if ($(this).hasClass("selected")) {
      if (!formData.addons.includes(addon)) {
        formData.addons.push(addon);
      }
    } else {
      formData.addons = formData.addons.filter((item) => item !== addon);
    }

    updateSummary();
  });

  // Change plan from summary
  $("#changePlan").click(function () {
    goToStep(2);
  });

  // Function to navigate to specific step
  function goToStep(step) {
    $(".step-content").removeClass("active");
    $(`.step-content[data-step="${step}"]`).addClass("active");
    updateStepIndicator(step);

    if (step === 4) {
      updateSummary();
    }
  }

  // Update step indicator in sidebar
  function updateStepIndicator(activeStep) {
    $(".step-circle").removeClass("active");
    $(`.step-item[data-step="${activeStep}"] .step-circle`).addClass("active");
  }

  // Update summary information
  function updateSummary() {
    // Update plan name and price
    const selectedPlan = $(`.plan-card[data-plan="${formData.plan}"]`);
    const planName = selectedPlan.find(".plan-name").text();
    const planPrice = selectedPlan.find(".plan-price").text();

    $(".summary-plan").text(
      `${planName} (${formData.billing === "monthly" ? "Monthly" : "Yearly"})`
    );
    $(".summary-card .fw-bold").text(planPrice);

    // Update addons in summary
    const addonsContainer = $(".summary-card");
    addonsContainer.find(".summary-addon").remove();

    let total = parseFloat(planPrice.replace(/[^0-9.]/g, ""));

    if (formData.addons.includes("online")) {
      const price = formData.billing === "monthly" ? "+$1/mo" : "+$10/yr";
      addonsContainer.append(`
                  <div class="summary-addon d-flex justify-content-between">
                      <div>Online service</div>
                      <div>${price}</div>
                  </div>
              `);
      total += formData.billing === "monthly" ? 1 : 10;
    }

    if (formData.addons.includes("storage")) {
      const price = formData.billing === "monthly" ? "+$2/mo" : "+$20/yr";
      addonsContainer.append(`
                  <div class="summary-addon d-flex justify-content-between">
                      <div>Larger storage</div>
                      <div>${price}</div>
                  </div>
              `);
      total += formData.billing === "monthly" ? 2 : 20;
    }

    if (formData.addons.includes("profile")) {
      const price = formData.billing === "monthly" ? "+$2/mo" : "+$20/yr";
      addonsContainer.append(`
                  <div class="summary-addon d-flex justify-content-between">
                      <div>Customizable Profile</div>
                      <div>${price}</div>
                  </div>
              `);
      total += formData.billing === "monthly" ? 2 : 20;
    }

    // Update total
    const totalText =
      formData.billing === "monthly" ? `+$${total}/mo` : `+$${total}/yr`;
    $(".total-amount").text(totalText);
    $(".summary-total div:first-child").text(
      `Total (per ${formData.billing === "monthly" ? "month" : "year"})`
    );
  }
});
