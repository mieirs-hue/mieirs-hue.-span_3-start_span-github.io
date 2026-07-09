(() => {
  const forms = document.querySelectorAll('.js-formspree-form');

  const setStatus = (element, type, message) => {
    if (!element) {
      return;
    }

    element.classList.remove('is-success', 'is-error', 'is-pending');
    if (type) {
      element.classList.add(type);
    }
    element.textContent = message;
  };

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        setStatus(status, 'is-error', 'Please complete the required fields before submitting.');
        return;
      }

      const action = form.getAttribute('action') || '';
      if (
        action.includes('YOUR_FORM_ID') ||
        (action.includes('formbold.com/s/') === false && action.includes('formspree.io/f/') === false)
      ) {
        setStatus(status, 'is-error', 'Add a valid form endpoint URL in the form action before submitting.');
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);

      setStatus(status, 'is-pending', 'Sending request...');
      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        if (response.ok) {
          form.reset();
          setStatus(status, 'is-success', 'Request sent successfully. We will contact you within one business day.');
          return;
        }

        let message = 'Something went wrong while sending your request. Please try again.';
        try {
          const data = await response.json();
          if (data?.errors?.length) {
            message = data.errors.map((item) => item.message).join(' ');
          }
        } catch {
          // Keep default message when response body is not JSON.
        }

        setStatus(status, 'is-error', message);
      } catch {
        setStatus(status, 'is-error', 'Network issue detected. Check your connection and try again.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });
})();