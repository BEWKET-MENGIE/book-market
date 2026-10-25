
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email).trim()
  );
}

export function validateRequired(value) {
  return String(value ?? "").trim().length > 0;
}

export function validatePhone(phone) {
  const normalized = String(phone).replace(/[\s()-]/g, "");
  return /^\+?[0-9]{7,15}$/.test(normalized);
}

export function validateCheckout(form) {
  const errors = {};

  if (!validateRequired(form.fullName)) {
    errors.fullName = "Please enter your full name.";
  }

  if (!validateEmail(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!validatePhone(form.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!validateRequired(form.address)) {
    errors.address = "Please enter your delivery address.";
  }

  if (!validateRequired(form.city)) {
    errors.city = "Please enter your city.";
  }

  return errors;
}
