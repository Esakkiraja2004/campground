document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.needs-validation');
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        // Get the price field
        const priceField = form.querySelector('#price');
        const priceValue = priceField.value;
        
        // Custom validation for price
        if (isNaN(priceValue) || priceValue.trim() === '') {
          priceField.setCustomValidity('Price must be a number');
        } else {
          priceField.setCustomValidity('');
        }
  
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
  
        form.classList.add('was-validated');
      }, false);
    });
  });
  
  